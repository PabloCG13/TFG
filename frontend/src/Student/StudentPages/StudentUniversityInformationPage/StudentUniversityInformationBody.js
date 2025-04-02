import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StudentUniversityInformationBody = ({ studentId }) => {
    const [universities, setUniversities] = useState([]);
    const [degreesByUniversity, setDegreesByUniversity] = useState({});
    const [studentTranscript, setStudentTranscript] = useState({});
    const [degreeDetailsByUniversity, setDegreeDetailsByUniversity] = useState({});
    const [courseDetailsByDegree, setCourseDetailsByDegree] = useState({});
    const location = useLocation();

    useEffect(() => {
        if (!studentId) return;

        fetch(`http://localhost:5000/api/studies/${studentId}`)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to fetch studies. Status: ${response.status}`);
                return response.json();
            })
            .then(studiesData => {
                if (!Array.isArray(studiesData) || studiesData.length === 0) {
                    throw new Error("No universities found for this student.");
                }
		        console.log("Studies data: ", studiesData);
                // Organize degrees by university
                const universityDegreeMap = {};
                studiesData.forEach(({ unicode, degreeid }) => {
                    if (!universityDegreeMap[unicode]) universityDegreeMap[unicode] = [];
                    universityDegreeMap[unicode].push(degreeid);
                });

                setDegreesByUniversity(universityDegreeMap);

                // Fetch universities
                return Promise.all(Object.keys(universityDegreeMap).map(async (uniCode) => {
                    const uniResponse = await fetch(`http://localhost:5000/api/universities/${uniCode}`);
                    if (!uniResponse.ok) throw new Error(`Failed to fetch university ${uniCode}`);
                    
		console.log("Uni Response: ", uniResponse);
                    return uniResponse.json();
                }));
            })
            .then(universitiesData => {
                setUniversities(universitiesData);
            })
            .catch(error => console.error("Error:", error));
    }, [studentId]);

    useEffect(() => {
    //Call to get all the courses in which the student is enrolled
    fetch(`http://localhost:5000/api/transcripts/${studentId}`)
      .then((response) =>{
        if (!response.ok) {
          throw new Error(`Failed to fetch validations. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) =>{ 
        if (!data.length) {
          throw new Error("No validations found.");
        }
        setStudentTranscript(data);
      })
      .catch((error) => console.error("Error fetching student's courses:", error));
  }, [studentId]);

    // Fetch degrees and teacher names once universities and degrees are known
    useEffect(() => {
        if (Object.keys(degreesByUniversity).length === 0) return;

        const fetchDegrees = async () => {
            const degreeDetailsMap = {};

            for (const [uniCode, degreeIds] of Object.entries(degreesByUniversity)) {
                degreeDetailsMap[uniCode] = [];

                for (const degreeId of degreeIds) {
                    try {
                        // Fetch degree details using uniCode + degreeId
                        const degreeResponse = await fetch(`http://localhost:5000/api/degrees/${uniCode}/${degreeId}`);
                        if (!degreeResponse.ok) throw new Error(`Failed to fetch degree ${degreeId} at ${uniCode}`);
                        const degreeData = await degreeResponse.json();
			
			            console.log("Degree data: ", degreeData);
                        // Fetch teacher details
                        const teacherResponse = await fetch(`http://localhost:5000/api/teachers/${degreeData.teacherid}`);
                        if (!teacherResponse.ok) throw new Error(`Failed to fetch teacher ${degreeData.teacherid}`);
                        const teacherData = await teacherResponse.json();
			
			            console.log("Teacher data: ", teacherData);

                        const courseResponse = await fetch(`http://localhost:5000/api/courses/degree/teachers/${uniCode}/${degreeId}`);
                        
                        if (!courseResponse.ok) throw new Error(`Failed to fetch courses for ${uniCode}/${degreeId}`);
                        const courseData = await courseResponse.json();
			
			            console.log("Teacher data: ", courseData);
                        //const courseTeachers = [... new Set(courseData.map(t => t.name))]
                        // Store degree with teacher name
                        degreeDetailsMap[uniCode].push({
                            degreeId: degreeId,
                            name: degreeData.name,
                            teacherName: teacherData.name,
                            courseTeachers: courseData
                        });
                    } catch (error) {
                        console.error("Error fetching degree/teacher:", error);
                    }
                }
            }

		console.log("Degree details map: ", degreeDetailsMap);
            setDegreeDetailsByUniversity(degreeDetailsMap);
        };

        fetchDegrees();
    }, [degreesByUniversity]); // Only run when degree list is first set

const isCourseTaken = (course) => {
	console.log("Course parameter:", course);
	console.log("Student's transcript:", studentTranscript);
	return (studentTranscript.some(transcript => (transcript.unicode === course.unicode && transcript.degreeid === course.degreeid && transcript.courseid === course.courseid) || (transcript.unicodesrc === course.unicode && transcript.degreeidsrc === course.degreeid && transcript.courseidsrc === course.courseid)));
};
		



    return (
        <div>
            <h2>Student's Universities and Degrees</h2>
           
            {universities.map((uni) => (
                <div key={uni.unicode} style={{ marginBottom: "20px", border: "1px solid black", padding: "10px" }}>
                    <h3>{uni.name}</h3>
                    <p><strong>ID:</strong> {uni.unicode}</p>
                    <p><strong>Location:</strong> {uni.location}</p>

                    <h4>Degrees</h4>
                    <ul>
                        {degreeDetailsByUniversity[uni.unicode]?.map(degree => (
                            <li key={degree.degreeid}>

                                <strong>{degree.name}</strong> <br />
                                - Coordinator: {degree.teacherName}  <br />
                                <table style={{ borderCollapse: "collapse", width: "100%", marginTop: "10px" }}>
                                <thead>
                                    <tr>
                                    <th style={tableHeaderStyle}>Teacher ID</th>
                                    <th style={tableHeaderStyle}>Name</th>
                                    <th style={tableHeaderStyle}>Course Name</th>
                                    <th style={tableHeaderStyle}>Period</th>
                                    <th style={tableHeaderStyle}>Credits</th>
                                    <th style={tableHeaderStyle}>Taken</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {degree.courseTeachers.map((teacher, i) => (
                                    <tr key={i}>
                                        <td style={tableCellStyle}>{teacher.teacherid}</td>
                                        <td style={tableCellStyle}>{teacher.teachername}</td>
                                        <td style={tableCellStyle}>{teacher.name} <strong>({teacher.courseid})</strong></td>
                                        <td style={tableCellStyle}>{teacher.period}</td>
                                        <td style={tableCellStyle}>{teacher.credits}</td>
                                        <td style={tableCellStyle}>{isCourseTaken(teacher) ? "✅" : "❌"}</td>
                          
                                    </tr>
                                    ))}
                                </tbody>
                                </table>

                            </li>
                        )) || <p>No degrees found.</p>}
                    </ul>
                </div>
            ))}
        </div>
    );
};

//Styles
const tableHeaderStyle = {
    border: "1px solid black",
    padding: "8px",
    backgroundColor: "#f0f0f0",
    textAlign: "left"
  };
  
  
  const tableCellStyle = {
    border: "1px solid black",
    padding: "8px"
  };
  

export default StudentUniversityInformationBody;
