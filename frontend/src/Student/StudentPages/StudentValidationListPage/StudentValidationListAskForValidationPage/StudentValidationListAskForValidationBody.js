import React , { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StudentValidationListAskForValidationBody = ({ studentId }) => {
  const [studies, setStudies] = useState([]);
  const [excludedUniversities, setExcludedUniversities] = useState([]);
  const [courses, setCourses] = useState({});
  const location = useLocation();
  const { participantAddress } = location.state || {}; // Extract participantAddress
  
  
  
  // Fetch studies
  useEffect(() => {
    fetch(`http://localhost:5000/api/studies/${studentId}`)
      .then((response) => response.json())
      .then((data) => {
        setStudies(data);
  
  
        // Extract unique uniCodes
        const uniqueUniCodes = [...new Set(data.map(study => study.unicode))];
  
  
        if (uniqueUniCodes.length > 0) {
          // Convert array to comma-separated string
          const uniCodesString = uniqueUniCodes.join(",");
          console.log("csv",uniCodesString);
  
          // Call the universities API to exclude these uniCodes
          fetch(`http://localhost:5000/api/universities/exclude`,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({uniCodes: uniqueUniCodes})
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
    console.log("studies", studies);

    studies.forEach(({ unicode, degreeid }) => {
      
      fetch(`http://localhost:5000/api/courses/remaining/${unicode}/${degreeid}/${studentId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Rem Data", data);
          setCourses((prevCourses) => ({
            ...prevCourses,
            [`${unicode}-${degreeid}`]: data,
          }));
        })
        .catch((error) => console.error(`Error fetching courses for ${unicode}, ${degreeid}:`, error));
    });
  }, [studies]);



  return (
    <div style={containerStyle}>
      {/* Left Section - Courses */}
      <div style={sectionStyle}>
        <h2 style={titleStyle}>Degree Courses</h2>
        <ul style={listStyle}>
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
                  <tr key={course.courseid}>
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

        </ul>
      </div>

      {/* Right Section - Universities */}
      <div style={sectionStyle}>
        <h2 style={titleStyle}>University List</h2>
        <ul style={listStyle}>
        <table style={listStyle}>
        <thead>
          <tr>
            <th>University Code</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {excludedUniversities.map((uni) => (
            <tr key={uni.unicode}>
              <td>{uni.unicode}</td>
              <td>{uni.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

        </ul>
      </div>
    </div>
  );
};

// 🎨 Inline Styles
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

const listStyle = {
  listStyleType: 'none',
  padding: 0,
};

const listItemStyle = {
  padding: '10px',
  borderBottom: '1px solid #ddd',
};

const highlightedItemStyle = {
  ...listItemStyle,
  border: '2px solid red',
};

export default StudentValidationListAskForValidationBody;
