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
  const { participantAddress } = location.state || {}; // Extract participantAddress
  // State to control modal visibility
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Fetch studies
  useEffect(() => {
    fetch(`http://localhost:5000/api/studies/${studentId}`)
      .then((response) => response.json())
      .then((data) => {
        setStudies(data);


        // Extract unique uniCodes
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


  // Fetch available courses for each (uniCode, degreeId)
  useEffect(() => {
    if (studies.length === 0) return;


    studies.forEach(({ unicode, degreeid }) => {
      fetch(`http://localhost:5000/api/courses/remaining/${unicode}/${degreeid}/${studentId}`)
        .then((response) => response.json())
        .then((data) => {
          setCourses((prevCourses) => ({
            ...prevCourses,
            [`${unicode}-${degreeid}`]: data,
          }));
        })
        .catch((error) => console.error(`Error fetching courses for ${unicode}, ${degreeid}:`, error));
    });
  }, [studies]);

  useEffect(()=>{
    if(selectedCourse && selectedDstCourse){
      setIsModalOpen(true);
    }
  }, [selectedCourse,selectedDstCourse]);
  
  
    // Function to close modal
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedCourse(null);
      setSelectedDstCourse(null);
      setModalMessage("");
    };


  // Handle course row selection
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };


  // Handle university row selection
  const handleUniversityClick = (uni) => {
    setSelectedUniversity(uni);
    setSelectedDegree(null);
    setCoursesInDegree([]);


    fetch(`http://localhost:5000/api/universities/${uni.unicode}/degrees`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Degree:", data);
        setDegreesInUni(data);
      })
      .catch((error) => console.error(`Error fetching degrees for ${uni.unicode}`, error));
  };


  // Handle degree selection
  const handleDegreeClick = (degree) => {
    setSelectedDegree(degree);
    console.log("Degree:",degree);

    fetch(`http://localhost:5000/api/courses/degree/${degree.unicode}/${degree.degreeid}`)
      .then((response) => response.json())
      .then((data) => {
        setCoursesInDegree(data);
      })
      .catch((error) => console.error(`Error fetching courses for ${degree.unicode}, ${degree.degreeid}`, error));
  };


  // Handle back button for course details
  const handleBackCourse = () => {
    setSelectedCourse(null);
  };

  // Handle back button for course details
  const handleDstCourseClick = (course) => {
    setSelectedDstCourse(course);
    console.log("Course:", course);
    // fetch(`http://localhost:5000/api/courses/${course.unicode}/${course.degreeid}/${course.courseid}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setCoursesInDegree(data);
    //   })
    //   .catch((error) => console.error(`Error fetching courses for ${degree.unicode}, ${degree.degreeid}`, error));
  };

  const handleBackDstCourse = () => {
    setSelectedDstCourse(null);
  };

  // Handle back button for university details
  const handleBackUniversity = () => {
    setSelectedUniversity(null);
    setDegreesInUni([]);
    setSelectedDegree(null);
    setCoursesInDegree([]);
  };


  // Handle back button for degree details
  const handleBackDegree = () => {
    setSelectedDegree(null);
    setSelectedDstCourse(null);
    setCoursesInDegree([]);
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
          token: "q", // Replace when we have a better idea
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
        }),
      });


      if (!dbResponseValidates.ok) {
        throw new Error(`Failed to add validation entry to DB. Status: ${dbResponseValidates.status}`);
      }


      return true; // If both fetch calls succeed, return true
    } catch (error) {
      console.error("Error adding validation:", error);
      return false; // If any error occurs, return false
    }
  };


  const handlePetition = async (srcCourse, dstCourse) => {
    console.log("srcCourse", srcCourse);
    console.log("dstCourse", dstCourse);
    
    const result = await addPetition(srcCourse, dstCourse);
    if (result) {
      setModalMessage("✅ Petition successfully added!"); // Show success message
    } else {
      setModalMessage("❌ Error: Petition could not be added."); //  Show error message
    }
  };



  return (
    <div style={containerStyle}>
      {/* Left Section - Courses */}
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Degree Courses</h2>


        {/* Course Details (if selected) */}
        {selectedCourse && (
          <div style={detailsContainerStyle}>
            <h3>Course Details</h3>
            <p><strong>Course ID:</strong> {selectedCourse.courseid}</p>
            <p><strong>Course Name:</strong> {selectedCourse.name}</p>
            <p><strong>Credits:</strong> {selectedCourse.credits}</p>
            <p><strong>Period:</strong> {selectedCourse.period}</p>
            <button style={backButtonStyle} onClick={handleBackCourse}>Back</button>
          </div>
        )}


        {/* Course Table */}
        {studies.map(({ unicode, degreeid }) => (
          <div key={`${unicode}-${degreeid}`}>
            <h3>University: {unicode} Degree: {degreeid}</h3>
            <table border="1">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Period</th>
                </tr>
              </thead>
              <tbody>
                {courses[`${unicode}-${degreeid}`] && courses[`${unicode}-${degreeid}`].length > 0 ? (
                  courses[`${unicode}-${degreeid}`].map((course) => (
                    <tr
                      key={course.courseid}
                      onClick={() => handleCourseClick(course)}
                      style={selectedCourse && selectedCourse.courseid === course.courseid ? highlightedRowStyle : {}}
                    >
                      <td>{course.courseid}</td>
                      <td>{course.name}</td>
                      <td>{course.credits}</td>
                      <td>{course.period}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No courses available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>


      {/* Right Section - Universities */}
      <div style={sectionStyle}>
        <h2 style={titleStyle}>University List</h2>
          {/* Course Details (if selected) */}
          {selectedDstCourse && (
          <div style={detailsContainerStyle}>
            <h3>Course Details</h3>
            <p><strong>Course ID:</strong> {selectedDstCourse.courseid}</p>
            <p><strong>Course Name:</strong> {selectedDstCourse.name}</p>
            <p><strong>Credits:</strong> {selectedDstCourse.credits}</p>
            <p><strong>Period:</strong> {selectedDstCourse.period}</p>
            <button style={backButtonStyle} onClick={handleBackDstCourse}>Back</button>
          </div>
        )}

        {/* Degree List (if a university is selected) */}
        {selectedUniversity && !selectedDegree && (
          <div style={detailsContainerStyle}>
            <h3>Degrees Offered at {selectedUniversity.name}</h3>
            <table border="1">
              <thead>
                <tr>
                  
                  <th>Degree ID</th>
                  <th>Degree Name</th>
                  <th>Degree Coordinator</th>
                </tr>
              </thead>
              <tbody>
                {degreesInUni.map((degree) => (
                  <tr key={degree.degreeid} onClick={() => handleDegreeClick(degree)}>
                    <td>{degree.unicode},{degree.degreeid}</td>
                    <td>{degree.name}</td>
                    <td>{degree.teacherid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={backButtonStyle} onClick={handleBackUniversity}>Back</button>
          </div>
        )}


        {/* Courses in Selected Degree */}
        {selectedDegree && (
          <div style={detailsContainerStyle}>
            <h3>Courses in {selectedDegree.name}</h3>
            <table border="1">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Credits</th>
                  <th>Period</th>
                </tr>
              </thead>
              <tbody>
                {coursesInDegree.map((course) => (
                  <tr key={course.courseid} onClick={() => handleDstCourseClick(course)}>
                    <td>{course.courseid}</td>
                    <td>{course.name}</td>
                    <th>{course.credits}</th>
                    <th>{course.period}</th>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={backButtonStyle} onClick={handleBackDegree}>Back</button>
          </div>
        )}


        {/* University Table */}
        <table border="1">
          <thead>
            <tr>
              <th>University Code</th>
              <th>Name</th>
              <th>University Location</th>
            </tr>
          </thead>
          <tbody>
            {excludedUniversities.map((uni) => (
              <tr key={uni.unicode} onClick={() => handleUniversityClick(uni)} style={highlightedRowStyle}>
                <td>{uni.unicode}</td>
                <td>{uni.name}</td>
                <td>{uni.location}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2>Selected Courses</h2>
            <div style={tableContainerStyle}>
              {/* Left Table */}
              <table border="1" style={tableStyle}>
                <thead>
                  <tr><th colSpan="5">My Course</th></tr>
                  <tr><th>Course ID</th><th>Name</th><th>Credits</th><th>Period</th><th>Syllabus</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedCourse.courseid}</td>
                    <td>{selectedCourse.name}</td>
                    <td>{selectedCourse.credits}</td>
                    <td>{selectedCourse.period}</td>
                    <td>
		  {selectedCourse.syllabus_pdf ? (
		    <embed
		      src={`data:application/pdf;base64,${selectedCourse.syllabus_pdf}`}
		      width="600"
		      height="400"
		      type="application/pdf"
		    />
		  ) : (
		    "No Syllabus attached"
		  )}
		</td>
                  </tr>
                </tbody>
              </table>


              {/* Right Table */}
              <table border="1" style={tableStyle}>
                <thead>
                  <tr><th colSpan="5">Destination Course</th></tr>
                  <tr><th>Course ID</th><th>Name</th><th>Credits</th><th>Period</th><th>Syllabus</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedDstCourse.courseid}</td>
                    <td>{selectedDstCourse.name}</td>
                    <td>{selectedDstCourse.credits}</td>
                    <td>{selectedDstCourse.period}</td>
                    <td>
		  {selectedDstCourse.syllabus_pdf ? (
		    <embed
		      src={`data:application/pdf;base64,${selectedDstCourse.syllabus_pdf}`}
		      width="600"
		      height="400"
		      type="application/pdf"
		    />
		  ) : (
		    "No Syllabus attached"
		  )}
		</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {modalMessage && <p style={messageStyle}>{modalMessage}</p>}
            <button onClick={() => handlePetition(selectedCourse, selectedDstCourse)} style={acceptButtonStyle}>
                Accept
              </button>
            <button onClick={closeModal} style={closeButtonStyle}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};


// Styles
const containerStyle = {
  display: 'flex',
  height: '100vh',
  backgroundColor: '#f4f4f4',
};


const sectionStyle = {
  flex: 1,
  background: '#fff',
  padding: '20px',
  margin: '10px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
};


const titleStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '10px',
};


const highlightedRowStyle = {
  backgroundColor: "#007bff",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
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
  padding: "10px",
  backgroundColor: "#e8e8e8",
  marginBottom: "10px",
};


const backButtonStyle = {
  padding: "5px 10px",
  fontSize: "14px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  cursor: "pointer",
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

const closeButtonStyle = {
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  padding: '10px',
  marginTop: '20px',
  cursor: 'pointer',
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

const hoverStyle = {
  backgroundColor: "#0056b3",
};

const tableContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  marginBottom: '20px',
  widht: '100%',
  gap: '20px',
};

const tableStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  flex: '1',
  minWidth: '280px',
  maxWidth: '45%',
};


export default StudentValidationListAskForValidationBody;






