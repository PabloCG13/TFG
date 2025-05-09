import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const CoordinatorTeacherValidationListBody = ({ teacherId }) => {
  const [teacher, setTeacher] = useState([]);
  const [oldPasswd, setOldPasswd] = useState("");
  const [newPasswd, setNewPasswd] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const { participantAddress } = location.state || {};

  // Validation states
  const [validations, setValidations] = useState([]);
  const [filteredValidations, setFilteredValidations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [validityPeriod, setValidityPeriod] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [uniqueUnicodes, setUniqueUnicodes] = useState([]);
  const [universities, setUniversities] = useState({});
  const [degrees, setDegrees] = useState("");
  const [selectedValidation, setSelectedValidation] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Fetch teacher info
  useEffect(() => {
    if (!teacherId) return;
    fetch(`http://localhost:5000/api/teachers/${teacherId}`)
      .then((response) => response.json())
      .then((data) => setTeacher(data))
      .catch((error) => console.error("Error fetching teacher info:", error));
    fetch(`http://localhost:5000/api/degrees/${teacherId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data:", data);
        setDegrees(data);
      })
      .catch((error) => console.error("Error fetching degree info:", error));
  }, [teacherId]);

  // Fetch all validations
  useEffect(() => {
    console.log("UniCode", degrees.unicode);
    console.log("DegreeId", degrees.degreeid);
    const uniCode = degrees.unicode;
    const degreeId = degrees.degreeid;
    fetch(`http://localhost:5000/api/validations/${uniCode}/${degreeId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch validations. Status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        setValidations(data);
        setFilteredValidations(data);
        const uniqueUnicodesSet = new Set(data.map((v) => v.unicodedst));
        setUniqueUnicodes([...uniqueUnicodesSet]);
      })
      .catch((error) => console.error("Error fetching validations:", error));
  }, [degrees, refreshKey]);

  // Fetch university details for each unique university code
  useEffect(() => {
    uniqueUnicodes.forEach((unicodedst) => {
      fetch(`http://localhost:5000/api/universities/${unicodedst}`)
        .then((response) => response.json())
        .then((uniData) => {
          setUniversities((prev) => ({ ...prev, [unicodedst]: uniData }));
        })
        .catch((error) => console.error("Error fetching university:", error));
    });
  }, [uniqueUnicodes]);

  // Filter validations
  useEffect(() => {
    let results = validations;
    if (searchTerm) {
      results = results.filter((valid) =>
        valid.courseidsrc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (validityPeriod) {
      results = results.filter(
        (valid) => parseInt(valid.period) >= parseInt(validityPeriod)
      );
    }
    if (universityName) {
      results = results.filter((valid) => {
        const university = universities[valid.unicodedst];
        return (
          university &&
          university.name.toLowerCase().includes(universityName.toLowerCase())
        );
      });
    }
    setFilteredValidations(results);
  }, [searchTerm, validityPeriod, universityName, validations, universities]);

  // Function to change the password
  const changePasswordCall = async () => {
    try {
      const response = await fetch("http://localhost:4000/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: participantAddress,
          user: teacherId,
          passwd: oldPasswd,
          role: 3,
          type: 2,
        }),
      });

      const data = await response.json();
      if (data.success && data.result === true) {
        const response = await fetch(
          "http://localhost:4000/changeParticipant",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              address: participantAddress,
              user: teacherId,
              passwd: newPasswd,
            }),
          }
        );
        const participantData = await response.json();
        const teacherHash = participantData.hash;

        if (teacherHash !== "Error") {
          const dbResponse = await fetch(
            `http://localhost:5000/api/teachers/${teacherId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ hash: teacherHash }),
            }
          );

          const dbData = await dbResponse.json();
          console.log(dbData);
        } else {
          setMessage("Invalid credentials. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error making API request:", error);
      setMessage("Server error. Please try again later.");
    }
  };

  // Function to confirm validation after selecting month and year
  const extendValidation = async () => {
    if (!selectedMonth || !selectedYear) {
      alert("Please select a month and year before confirming.");
      return;
    }
    const valP = `${selectedMonth}-${selectedYear}`;

    console.log("validation: ", selectedValidation);

    // Blockchain call
    try {
      const response = await fetch("http://localhost:4000/updateValidation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: participantAddress,
          tokenId: selectedValidation.token,
          _month: selectedMonth,
          _year: selectedYear,
        }),
      });
      const data = await response.json();
      if (!data.success)
        throw new Error(
          `Failed to update Validation Status: ${response.status}`
        );
    } catch (error) {
      console.error("Error making API request:", error);
      setMessage("Server error. Please try again later.");
      return;
    }

    // Make the PUT request to update validation
    fetch(
      `http://localhost:5000/api/validations/${selectedValidation.unicodesrc}/${selectedValidation.degreeidsrc}/${selectedValidation.courseidsrc}/${selectedValidation.unicodedst}/${selectedValidation.degreeiddst}/${selectedValidation.courseiddst}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period: valP }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setRefreshKey((prev) => prev + 1);
        console.log("Successfully updated provisional:", data);
        closeModal();
      })
      .catch((error) => console.error("Error updating provisional:", error));

    console.log(
      `Confirmed validation for Month: ${selectedMonth}, Year: ${selectedYear}`
    );
  };

  // Open modal to set Month and Year before confirming validation
  const openModal = (valid) => {
    setSelectedValidation(valid);
    setSelectedMonth("");
    setSelectedYear("");
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar with teacher profile */}
      <div style={sidebarStyle}>
        <div style={profileContainer}>
          <div style={profileImage}></div>
          <h2 style={profileTitle}>PROFILE</h2>
          <h2 style={profileTitle}>ID = {teacher.teacherid}</h2>
          <h2 style={profileTitle}>NAME = {teacher.name}</h2>
          <input
            type="password"
            placeholder="Old password"
            style={inputStyle}
            value={oldPasswd}
            onChange={(e) => setOldPasswd(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password"
            style={inputStyle}
            value={newPasswd}
            onChange={(e) => setNewPasswd(e.target.value)}
          />
          <button onClick={changePasswordCall} style={buttonStyle}>
            Modify password
          </button>
        </div>
      </div>

      {/* Table with validations */}
      <div style={mainContentStyle}>
        <div style={tableContainer}>
          <h2 style={tableTitle}>Validations</h2>
          <div style={filterContainer}>
            <input
              type="text"
              placeholder="Search by Course ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={() => setShowFilters(!showFilters)}>
              Search Options
            </button>
          </div>
          {showFilters && (
            <div style={filterContainer}>
              <input
                type="number"
                placeholder="Validity Period (Year)"
                value={validityPeriod}
                onChange={(e) => setValidityPeriod(e.target.value)}
              />
              <select
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
              >
                <option value="">Select University</option>
                {Object.values(universities).map((university) => (
                  <option key={university.unicode} value={university.name}>
                    {university.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Origin Course</th>
                <th style={thStyle}>Destination Course</th>
                <th style={thStyle}>Validity Period</th>
                <th style={thStyle}>Destination University Name</th>
                <th style={thStyle}>Provisional</th>
              </tr>
            </thead>
            <tbody>
              {filteredValidations.map((valid) => (
                <tr key={valid.unicodedst}>
                  <td style={tdStyle}>
                    {valid.unicodesrc}, {valid.degreeidsrc}, {valid.courseidsrc}
                  </td>
                  <td style={tdStyle}>
                    {valid.unicodedst}, {valid.degreeiddst}, {valid.courseiddst}
                  </td>
                  <td style={tdStyle}>{valid.period}</td>
                  <td style={tdStyle}>
                    {universities[valid.unicodedst]?.name || "Loading..."}
                  </td>
                  <td>
                    <span style={lockIconStyle}>
                      {valid.provisional === 1 ? "🔒" : "🔓"}
                    </span>
                  </td>

                  {valid.provisional === 1 &&
                    degrees.degreeid === valid.degreeidsrc &&
                    degrees.unicode === valid.unicodesrc && (
                      <>
                        <td>
                          <button
                            style={buttonStyle}
                            onClick={() => openModal(valid)}
                          >
                            Extend
                          </button>
                        </td>
                      </>
                    )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for selecting Month and Year */}
      {isModalOpen && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2>Select Month and Year</h2>
            <label>Month:</label>
            <input
              type="number"
              min="1"
              max="12"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            <label>Year:</label>
            <input
              type="number"
              min="2000"
              max="2100"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            />
            <button style={buttonStyle} onClick={extendValidation}>
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const mainContentStyle = {
  flex: 1,
  marginLeft: "0px",
};

const tableContainer = {
  background: "#fff",
  padding: "20px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
};

const tableTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "center",
};

const thStyle = {
  padding: "10px",
  backgroundColor: "#f4f4f4",
  fontWeight: "bold",
  borderBottom: "2px solid #ccc",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
  textAlign: "center",
};

const filterContainer = {
  display: "flex",
  gap: "10px",
  marginBottom: "10px",
};

const containerStyle = {
  display: "flex",
  height: "100vh",
  backgroundColor: "#f4f4f4",
};

const sidebarStyle = {
  width: "300px",
  backgroundColor: "#2c3e50",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
};

const profileContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
};

const profileImage = {
  width: "200px",
  height: "200px",
  borderRadius: "50%",
  background: "#888",
  marginBottom: "10px",
};

const profileTitle = {
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "5px",
  border: "1px solid #bdc3c7",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "10px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};

const lockIconStyle = {
  width: "20px",
  height: "20px",
  verticalAlign: "middle", // Para alinear el ícono con el checkbox
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  width: "400px",
};

export default CoordinatorTeacherValidationListBody;
