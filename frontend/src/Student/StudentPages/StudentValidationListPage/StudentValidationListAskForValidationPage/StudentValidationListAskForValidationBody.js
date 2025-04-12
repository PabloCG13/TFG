import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StudentValidationListAskForValidationBody = ({ studentId }) => {
  const [studies, setStudies] = useState([]);
  const [excludedUniversities, setExcludedUniversities] = useState([]);
  const [courses, setCourses] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDstCourse, setSelectedDstCourse] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [degreesInUni, setDegreesInUni] = useState([]);
  const [coursesInDegree, setCoursesInDegree] = useState([]);
  const location = useLocation();
  const { participantAddress } = location.state || {};
  const [modalMessage, setModalMessage] = useState("");
  const [showTable, setShowTable] = useState(true);
  const [showUniversityTable, setShowUniversityTable] = useState(true);
  const [showSelectedDegreeTable, setShowSelectedDegreeTable] = useState(false);
  const [showSelectedCoursesTable, setShowSelectedCoursesTable] = useState(false);
  const [showLeftComparison, setShowLeftComparison] = useState(false);
  const [showRightComparison, setShowRightComparison] = useState(false);

  // Reset message when component mounts or studentId changes
  useEffect(() => {
    setModalMessage("");
  }, [studentId]);

  // Fetch studies
  useEffect(() => {
    fetch(`http://localhost:5000/api/studies/${studentId}`)
      .then((response) => response.json())
      .then((data) => {
        setStudies(data);

        const uniqueUniCodes = [...new Set(data.map(study => study.unicode))];

        if (uniqueUniCodes.length > 0) {
          fetch(`http://localhost:5000/api/universities/exclude`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uniCodes: uniqueUniCodes })
          })
            .then(response => response.json())
            .then(universities => setExcludedUniversities(universities))
            .catch(error => console.error("Error fetching excluded universities:", error));
        }
      })
      .catch(error => console.error("Error fetching student's studies:", error));
  }, [studentId]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  useEffect(() => {
    if (studies.length === 0) return;

    studies.forEach(({ unicode, degreeid }) => {
      fetch(`http://localhost:5000/api/courses/remaining/${unicode}/${degreeid}/${studentId}`)
        .then((response) => response.json())
        .then((data) => {
          const processedCourses = data.map((course) => {
            if (course.syllabus_pdf && course.syllabus_pdf.data) {
              return {
                ...course,
                syllabus_pdf: arrayBufferToBase64(course.syllabus_pdf.data),
              };
            }
            return course;
          });

          setCourses((prevCourses) => ({
            ...prevCourses,
            [`${unicode}-${degreeid}`]: processedCourses,
          }));
        })
        .catch((error) => console.error(`Error fetching courses for ${unicode}, ${degreeid}:`, error));
    });
  }, [studies]);

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setShowTable(false);
    setShowLeftComparison(true);
    setModalMessage(""); // Reset message when selecting a new course
  };

  const handleUniversityClick = (uni) => {
    setSelectedUniversity(uni);
    setSelectedDegree(null);
    setCoursesInDegree([]);
    setShowUniversityTable(false);
    setShowSelectedDegreeTable(true);

    fetch(`http://localhost:5000/api/universities/${uni.unicode}/degrees`)
      .then((response) => response.json())
      .then((data) => {
        setDegreesInUni(data);
      })
      .catch((error) => console.error(`Error fetching degrees for ${uni.unicode}`, error));
  };

  const handleDegreeClick = (degree) => {
    setSelectedDegree(degree);
    setShowSelectedDegreeTable(false);
    setShowSelectedCoursesTable(true);

    fetch(`http://localhost:5000/api/courses/degree/${degree.unicode}/${degree.degreeid}`)
      .then((response) => response.json())
      .then((data) => {
        const processedCourses = data.map((course) => {
          if (course.syllabus_pdf && course.syllabus_pdf.data) {
            return {
              ...course,
              syllabus_pdf: arrayBufferToBase64(course.syllabus_pdf.data),
            };
          }
          return course;
        });
        setCoursesInDegree(processedCourses);
      })
      .catch((error) => console.error(`Error fetching courses for ${degree.unicode}, ${degree.degreeid}`, error));
  };

  const handleSelectOtherCourse = () => {
    setShowLeftComparison(false);
    setShowTable(true);
    setSelectedCourse(null);
    setModalMessage(""); // Reset message when selecting other course
  };

  const handleDstCourseClick = (course) => {
    setSelectedDstCourse(course);
    setShowSelectedCoursesTable(false);
    setShowRightComparison(true);
    setModalMessage(""); // Reset message when selecting a new destination course
  };

  const handleSelectOtherDestinationCourse = () => {
    setShowRightComparison(false);
    setShowSelectedCoursesTable(true);
    setSelectedDstCourse(null);
    setModalMessage(""); // Reset message when selecting other destination course
  };

  const handleBackUniversity = () => {
    setSelectedUniversity(null);
    setDegreesInUni([]);
    setSelectedDegree(null);
    setCoursesInDegree([]);
    setShowUniversityTable(true);
    setShowSelectedDegreeTable(false);
  };

  const handleBackDegree = () => {
    setSelectedDegree(null);
    setSelectedDstCourse(null);
    setCoursesInDegree([]);
    setShowSelectedCoursesTable(false);
    setShowSelectedDegreeTable(true);
  };

  const addPetition = async (srcCourse, dstCourse) => {
    try {
      const dbResponseValidation = await fetch(`http://localhost:5000/api/validations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniCodeSrc: srcCourse.unicode,
          degreeIdSrc: srcCourse.degreeid,
          courseIdSrc: srcCourse.courseid,
          uniCodeDst: dstCourse.unicode,
          degreeIdDst: dstCourse.degreeid,
          courseIdDst: dstCourse.courseid,
          token: "q",
          provisional: 0,
        }),
      });

      if (!dbResponseValidation.ok) {
        throw new Error(`Failed to add validation entry to DB. Status: ${dbResponseValidation.status}`);
      }

      const dbResponseValidates = await fetch(`http://localhost:5000/api/validates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniCodeSrc: srcCourse.unicode,
          degreeIdSrc: srcCourse.degreeid,
          courseIdSrc: srcCourse.courseid,
          uniCodeDst: dstCourse.unicode,
          degreeIdDst: dstCourse.degreeid,
          courseIdDst: dstCourse.courseid,
          studentId: studentId,
          provisional: 0
        }),
      });

      if (!dbResponseValidates.ok) {
        throw new Error(`Failed to add validation entry to DB. Status: ${dbResponseValidates.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error adding validation:", error);
      return false;
    }
  };

  const handlePetition = async () => {
    const result = await addPetition(selectedCourse, selectedDstCourse);
    if (result) {
      setModalMessage("✅ Petition successfully added!");
    } else {
      setModalMessage("❌ Error: Petition could not be added.");
    }
  };

  return (
    <div style={containerStyle}>
      {/* Main content with fixed height and scroll */}
      <div style={mainContentStyle}>
        {/* Left Section - Courses */}
        <div style={leftSectionStyle}>
          <h2 style={titleStyle}>Degree Courses</h2>

          {showTable && (
            studies.map(({ unicode, degreeid }) => (
              <div key={`${unicode}-${degreeid}`}>
                <h3>University: {unicode} Degree: {degreeid}</h3>
                <table border="1" style={universityTableStyle}>
                  <thead>
                    <tr>
                      <th style={universityTableHeaderStyle}>Course ID</th>
                      <th style={universityTableHeaderStyle}>Course Name</th>
                      <th style={universityTableHeaderStyle}>Credits</th>
                      <th style={universityTableHeaderStyle}>Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses[`${unicode}-${degreeid}`]?.map((course) => (
                      <tr
                        key={course.courseid}
                        onClick={() => handleCourseClick(course)}
                        style={selectedCourse?.courseid === course.courseid ? highlightedRowStyle : {}}
                      >
                        <td style={universityTableCellStyle}>{course.courseid}</td>
                        <td style={universityTableCellStyle}>{course.name}</td>
                        <td style={universityTableCellStyle}>{course.credits}</td>
                        <td style={universityTableCellStyle}>{course.period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}

          {showLeftComparison && (
            <div style={comparisonTableWrapper}>
              <h3 style={comparisonTableTitle}>Selected Course</h3>
              <table border="1" style={universityTableStyle}>
                <thead>
                  <tr>
                    <th style={universityTableHeaderStyle}>Attribute</th>
                    <th style={universityTableHeaderStyle}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={universityTableCellStyle}>Course ID</td>
                    <td style={universityTableCellStyle}>{selectedCourse.courseid}</td>
                  </tr>
                  <tr>
                    <td style={universityTableCellStyle}>Name</td>
                    <td style={universityTableCellStyle}>{selectedCourse.name}</td>
                  </tr>
                  <tr>
                    <td style={universityTableCellStyle}>Credits</td>
                    <td style={universityTableCellStyle}>{selectedCourse.credits}</td>
                  </tr>
                  <tr>
                    <td style={universityTableCellStyle}>Period</td>
                    <td style={universityTableCellStyle}>{selectedCourse.period}</td>
                  </tr>
                </tbody>
              </table>
              
              <h4 style={syllabusTitleStyle}>Syllabus:</h4>
              {selectedCourse.syllabus_pdf ? (
                <embed
                  src={`data:application/pdf;base64,${selectedCourse.syllabus_pdf}`}
                  style={pdfEmbedStyle}
                  type="application/pdf"
                />
              ) : (
                <p>No Syllabus attached</p>
              )}
              
              <button 
                onClick={handleSelectOtherCourse}
                style={selectOtherButtonStyle}
              >
                Select Other Course
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={dividerStyle}></div>

        {/* Right Section - Universities */}
        <div style={rightSectionStyle}>
          <h2 style={titleStyle}>University List</h2>

          {showUniversityTable && (
            <table border="1" style={universityTableStyle}>
              <thead>
                <tr>
                  <th style={universityTableHeaderStyle}>University Code</th>
                  <th style={universityTableHeaderStyle}>Name</th>
                  <th style={universityTableHeaderStyle}>University Location</th>
                </tr>
              </thead>
              <tbody>
                {excludedUniversities.map((uni) => (
                  <tr 
                    key={uni.unicode} 
                    onClick={() => handleUniversityClick(uni)} 
                    style={highlightedRowStyle}
                  >
                    <td style={universityTableCellStyle}>{uni.unicode}</td>
                    <td style={universityTableCellStyle}>{uni.name}</td>
                    <td style={universityTableCellStyle}>{uni.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {showSelectedDegreeTable && (
            <div style={detailsContainerStyle}>
              <h3>Degrees Offered at {selectedUniversity.name}</h3>
              <table border="1" style={universityTableStyle}>
                <thead>
                  <tr>
                    <th style={universityTableHeaderStyle}>Degree ID</th>
                    <th style={universityTableHeaderStyle}>Degree Name</th>
                    <th style={universityTableHeaderStyle}>Degree Coordinator</th>
                  </tr>
                </thead>
                <tbody>
                  {degreesInUni.map((degree) => (
                    <tr key={degree.degreeid} onClick={() => handleDegreeClick(degree)}>
                      <td style={universityTableCellStyle}>{degree.unicode},{degree.degreeid}</td>
                      <td style={universityTableCellStyle}>{degree.name}</td>
                      <td style={universityTableCellStyle}>{degree.teacherid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button style={backButtonStyle} onClick={handleBackUniversity}>Back</button>
            </div>
          )}

          {showSelectedCoursesTable && (
            <div style={detailsContainerStyle}>
              <h3>Courses in {selectedDegree.name}</h3>
              <table border="1" style={universityTableStyle}>
                <thead>
                  <tr>
                    <th style={universityTableHeaderStyle}>Course ID</th>
                    <th style={universityTableHeaderStyle}>Course Name</th>
                    <th style={universityTableHeaderStyle}>Credits</th>
                    <th style={universityTableHeaderStyle}>Period</th>
                  </tr>
                </thead>
                <tbody>
                  {coursesInDegree.map((course) => (
                    <tr key={course.courseid} onClick={() => handleDstCourseClick(course)}>
                      <td style={universityTableCellStyle}>{course.courseid}</td>
                      <td style={universityTableCellStyle}>{course.name}</td>
                      <td style={universityTableCellStyle}>{course.credits}</td>
                      <td style={universityTableCellStyle}>{course.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button style={backButtonStyle} onClick={handleBackDegree}>Back</button>
            </div>
          )}

          {showRightComparison && (
            <div style={comparisonTableWrapper}>
              <h3 style={comparisonTableTitle}>Destination Course</h3>
              <table border="1" style={universityTableStyle}>
                <thead>
                  <tr>
                    <th style={universityTableHeaderStyle}>Attribute</th>
                    <th style={universityTableHeaderStyle}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={universityTableCellStyle}>Course ID</td>
                    <td style={universityTableCellStyle}>{selectedDstCourse.courseid}</td>
                  </tr>
                  <tr>
                    <td style={universityTableCellStyle}>Name</td>
                    <td style={universityTableCellStyle}>{selectedDstCourse.name}</td>
                  </tr>
                  <tr>
                    <td style={universityTableCellStyle}>Credits</td>
                    <td style={universityTableCellStyle}>{selectedDstCourse.credits}</td>
                  </tr>
                  <tr>
                    <td style={universityTableCellStyle}>Period</td>
                    <td style={universityTableCellStyle}>{selectedDstCourse.period}</td>
                  </tr>
                </tbody>
              </table>
              
              <h4 style={syllabusTitleStyle}>Syllabus:</h4>
              {selectedDstCourse.syllabus_pdf ? (
                <embed
                  src={`data:application/pdf;base64,${selectedDstCourse.syllabus_pdf}`}
                  style={pdfEmbedStyle}
                  type="application/pdf"
                />
              ) : (
                <p>No Syllabus attached</p>
              )}
              
              <button 
                onClick={handleSelectOtherDestinationCourse}
                style={selectOtherButtonStyle}
              >
                Select Other Destination Course
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Accept Button Container at the bottom */}
      <div style={fixedFooterStyle}>
        {(selectedCourse && selectedDstCourse) && (
          <div style={acceptButtonContainerStyle}>
            {modalMessage && <p style={messageStyle}>{modalMessage}</p>}
            <button 
              onClick={handlePetition} 
              style={acceptButtonStyle}
            >
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles (remain the same as in your original code)
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#f4f4f4',
  overflow: 'hidden',
  position: 'relative',
};

const mainContentStyle = {
  display: 'flex',
  flex: 1,
  overflow: 'auto',
  paddingBottom: '80px', // Space for the fixed footer
};

const fixedFooterStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  padding: '10px',
  boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
  zIndex: 100,
};

const leftSectionStyle = {
  flex: 1,
  background: '#fff',
  padding: '20px',
  overflowY: 'auto',
};

const rightSectionStyle = {
  flex: 1,
  background: '#fff',
  padding: '20px',
  overflowY: 'auto',
};

const dividerStyle = {
  width: '1px',
  backgroundColor: '#ddd',
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const messageStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#155724',
  backgroundColor: '#d4edda',
  padding: '10px',
  borderRadius: '5px',
  marginTop: '10px',
  textAlign: 'center',
};

const detailsContainerStyle = {
  textAlign: "center",
  padding: "20px",
  backgroundColor: "#e8e8e8",
  marginBottom: "10px",
  display: 'flex',
  flexDirection: 'column',
  alignItems:'center',
  gap: '20px',
};

const backButtonStyle = {
  padding: "5px 10px",
  fontSize: "14px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const comparisonTableWrapper = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  padding: '15px',
  backgroundColor: '#f8f9fa',
  borderRadius: '5px',
  marginBottom: '20px',
};

const comparisonTableTitle = {
  color: '#007bff',
  marginBottom: '10px',
  textAlign: 'center',
};

const universityTableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  margin: '10px 0',
  fontSize: '14px',
};

const universityTableHeaderStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px',
  textAlign: 'left',
  fontWeight: 'bold',
};

const universityTableCellStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
  backgroundColor: 'white', 
  color: 'black', 
};

const highlightedRowStyle = {
  backgroundColor: "white", 
  color: "black", 
  fontWeight: "normal", 
  cursor: "pointer",
};

const syllabusTitleStyle = {
  marginTop: '0',
  color: '#007bff',
};

const pdfEmbedStyle = {
  width: '100%',
  height: '400px',
  marginTop: '10px',
  border: '1px solid #ddd',
};

const selectOtherButtonStyle = {
  padding: "8px 16px",
  fontSize: "14px",
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "15px",
  alignSelf: 'center'
};

const acceptButtonContainerStyle = {
  textAlign: 'center',
};

const acceptButtonStyle = {
  backgroundColor: 'green',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  margin: '10px auto', 
  display: 'block'
};

export default StudentValidationListAskForValidationBody;