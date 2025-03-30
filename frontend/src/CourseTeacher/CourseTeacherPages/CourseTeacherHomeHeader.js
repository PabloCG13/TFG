import React, { useState, useEffect } from 'react';
import perfil from '../../Logo/perfil.png';
import { Link } from 'react-router-dom';

const CourseTeacherHomeHeader = ({ teacherId }) => {
  const [validations, setValidations] = useState([]);
  const [selectedValidation, setSelectedValidation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [srcCourse, setSrcCourse] = useState("");
  const [dstCourse, setDstCourse] = useState("");

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
    fetch(`http://localhost:5000/api/courses/teacher/${teacherId}`)
      .then((response) => response.json())
      .then((data) => {
        const course = data;
        if (course.syllabus_pdf && course.syllabus_pdf.data) {
          course.syllabus_pdf = arrayBufferToBase64(course.syllabus_pdf.data);
        }
        setSrcCourse(course);
      })
      .catch((error) => console.error("Error fetching course info:", error));
  }, [teacherId]);

  const fetchValidations = () => {
    fetch(`http://localhost:5000/api/courses/teacher/${teacherId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch courses. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data.courseid) {
          throw new Error("courseid is missing in API response");
        }
        return fetch(`http://localhost:5000/api/validations/provisional/requests/${data.unicode}/${data.degreeid}/${data.courseid}`);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch students. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(validData => {
        setValidations(validData);
      })
      .catch(error => console.error("Error:", error));
  };

  useEffect(() => {
    if (!teacherId) return;
    fetchValidations();
    const interval = setInterval(fetchValidations, 30000);
    return () => clearInterval(interval);
  }, [teacherId]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedValidation(null);
  };

  const handleBackCourse = () => {
    const currentTimestamp = new Date().toISOString();
    fetch(`http://localhost:5000/api/teachers/${teacherId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastAccess: currentTimestamp }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to update lastAccess. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => console.log("Successfully updated lastAccess:", data))
      .catch(error => console.error("Error updating lastAccess:", error));
  };

  const handleDstCourse = (validation) => {
    setSelectedValidation(validation);
    const uniCode = validation.unicodedst;
    const degreeId = validation.degreeiddst;
    const courseId = validation.courseiddst;

    fetch(`http://localhost:5000/api/courses/${uniCode}/${degreeId}/${courseId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch destination course. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.syllabus_pdf && data.syllabus_pdf.data) {
          data.syllabus_pdf = arrayBufferToBase64(data.syllabus_pdf.data);
        }
        setDstCourse(data);
      })
      .catch(error => console.error("Error accessing dstCourse:", error));
  };

  const handlePetition = (answer, valid) => {
    fetch(`http://localhost:5000/api/validations/${valid.unicodesrc}/${valid.degreeidsrc}/${valid.courseidsrc}/${valid.unicodedst}/${valid.degreeiddst}/${valid.courseiddst}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provisional: answer }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to update provisional. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        fetchValidations();
      })
      .catch(error => console.error("Error updating provisional:", error));
    closeModal();
  };

  return (
    <div> 
      <header style={headerStyle}>
        <div style={containerStyle}>
          <a href="/" style={buttonStyle}>
            <img src={perfil} alt="Perfil" style={imageStyle} />
          </a>

          <div style={titleStyle}>
            <h1>Course Teacher Home Page</h1>
          </div>

          <Link
            to={`/`} 
            style={backButtonStyle} 
            onClick={(e) => {
              e.preventDefault();
              handleBackCourse();
              setTimeout(() => {
                window.location.href = "/";
              }, 500);
            }}
            onMouseOver={(e) => Object.assign(e.target.style, hoverStyle)} 
            onMouseOut={(e) => Object.assign(e.target.style, backButtonStyle)} 
          >
            Log Out
          </Link>

          <div style={notificationStyle} className="notifications">
            <button 
              style={starButtonStyle} 
              aria-label="Notifications"
              onClick={openModal}
            >
              <span className="star">★</span>
              {validations.length > 0 && (
                <span style={notificationBadgeStyle}>{validations.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {isModalOpen && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2>Notifications</h2>
            {validations.length > 0 ? (
              <ul style={notificationListStyle}>
                {validations.map((validation, index) => (
                  <li key={index} style={notificationItemStyle}>
                    There is a new validation request for the course <strong>{validation.courseidsrc}</strong>  
                    <button 
                      style={viewDetailsButtonStyle} 
                      onClick={() => handleDstCourse(validation)}
                    >
                      View More
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No new notifications</p>
            )}
            <button onClick={closeModal} style={closeButtonStyle}>Close</button>
          </div>
        </div>
      )}

      {selectedValidation && (
        <div style={modalOverlayStyle} onClick={() => setSelectedValidation(null)}>
          <div style={validationModalStyle} onClick={(e) => e.stopPropagation()}>
            <h2>Validation Details</h2>
            
            <div style={comparisonTablesContainer}>
              <div style={comparisonTableWrapper}>
                <h3 style={comparisonTableTitle}>My Course</h3>
                <table border="1" style={universityTableStyle}>
                  <thead>
                    <tr>
                      <th style={universityTableHeaderStyle}>Attribute</th>
                      <th style={universityTableHeaderStyle}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={universityTableCellStyle}>University</td>
                      <td style={universityTableCellStyle}>{srcCourse.unicode}</td>
                    </tr>
                    <tr>
                      <td style={universityTableCellStyle}>Degree</td>
                      <td style={universityTableCellStyle}>{srcCourse.degreeid}</td>
                    </tr>
                    <tr>
                      <td style={universityTableCellStyle}>Course ID</td>
                      <td style={universityTableCellStyle}>{srcCourse.courseid}</td>
                    </tr>
                    <tr>
                      <td style={universityTableCellStyle}>Period</td>
                      <td style={universityTableCellStyle}>{srcCourse.period}</td>
                    </tr>
                    <tr>
                      <td style={universityTableCellStyle}>Credits</td>
                      <td style={universityTableCellStyle}>{srcCourse.credits}</td>
                    </tr>
                  </tbody>
                </table>
                
                <h4 style={syllabusTitleStyle}>Syllabus:</h4>
                {srcCourse.syllabus_pdf ? (
                  <embed
                    src={`data:application/pdf;base64,${srcCourse.syllabus_pdf}`}
                    style={pdfEmbedStyle}
                    type="application/pdf"
                  />
                ) : (
                  <p>No Syllabus attached</p>
                )}
              </div>

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
                      <td style={universityTableCellStyle}>University</td>
                      <td style={universityTableCellStyle}>{dstCourse.unicode}</td>
                    </tr>
                    <tr>
                      <td style={universityTableCellStyle}>Degree</td>
                      <td style={universityTableCellStyle}>{dstCourse.degreeid}</td>
                    </tr>
                    <tr>
                      <td style={universityTableCellStyle}>Course ID</td>
                      <td style={universityTableCellStyle}>{dstCourse.courseid}</td>
                    </tr>
                    <tr>
                      <td style={universityTableCellStyle}>Period</td>
                      <td style={universityTableCellStyle}>{dstCourse.period}</td>
                    </tr>
                    <tr>
                      <td style={universityTableCellStyle}>Credits</td>
                      <td style={universityTableCellStyle}>{dstCourse.credits}</td>
                    </tr>
                  </tbody>
                </table>
                
                <h4 style={syllabusTitleStyle}>Syllabus:</h4>
                {dstCourse.syllabus_pdf ? (
                  <embed
                    src={`data:application/pdf;base64,${dstCourse.syllabus_pdf}`}
                    style={pdfEmbedStyle}
                    type="application/pdf"
                  />
                ) : (
                  <p>No Syllabus attached</p>
                )}
              </div>
            </div>

            <div style={buttonContainerStyle}>
              <button onClick={() => handlePetition(3, selectedValidation)} style={acceptButtonStyle}>
                Accept
              </button>
              <button onClick={() => handlePetition(4, selectedValidation)} style={rejectButtonStyle}>
                Reject
              </button>
            </div>

            <button onClick={() => setSelectedValidation(null)} style={closeButtonStyle}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const headerStyle = {
  background: '#282c34',
  color: 'white',
  padding: '10px',
  textAlign: 'center',
};

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: '1200px',
  margin: '0 auto',
};

const buttonStyle = {
  textDecoration: 'none',
};

const imageStyle = {
  width: '80px',
  height: '80px',
};

const titleStyle = {
  flex: 1,
  textAlign: 'center',
};

const notificationStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const starButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  fontSize: '30px',
  cursor: 'pointer',
  position: 'relative',
};

const notificationBadgeStyle = {
  position: 'absolute',
  top: '-5px',
  right: '-5px',
  background: 'red',
  color: 'white',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  fontSize: '12px',
  textAlign: 'center',
  fontWeight: 'bold',
  lineHeight: '18px',
};

const backButtonStyle = {
  textDecoration: 'none',
  backgroundColor: '#ff4c4c',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.3s',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
  width: '80%',
  maxWidth: '700px',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const validationModalStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
  width: '90%',
  maxWidth: '1200px',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const closeButtonStyle = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '10px',
  marginTop: '20px',
  cursor: 'pointer',
};

const hoverStyle = {
  backgroundColor: "#0056b3",
};

const notificationListStyle = {
  listStyle: 'none',
  padding: 0,
};

const notificationItemStyle = {
  margin: '10px 0',
  padding: '10px',
  backgroundColor: '#f8f9fa',
  borderRadius: '5px',
};

const viewDetailsButtonStyle = {
  marginLeft: '10px',
  padding: '5px 10px',
  fontSize: '12px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
};

const comparisonTablesContainer = {
  display: 'flex',
  gap: '20px',
  width: '100%',
  marginBottom: '20px',
};

const comparisonTableWrapper = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
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

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
};

const acceptButtonStyle = {
  backgroundColor: 'green',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  cursor: 'pointer',
};

const rejectButtonStyle = {
  backgroundColor: 'red',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  cursor: 'pointer',
};

export default CourseTeacherHomeHeader;