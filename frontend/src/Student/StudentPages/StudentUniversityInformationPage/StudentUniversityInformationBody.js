import React, { useState, useEffect } from "react";

const StudentUniversityInformationBody = ({ studentId }) => {
  const [universities, setUniversities] = useState([]);
  const [degreesByUniversity, setDegreesByUniversity] = useState({});
  const [studentTranscript, setStudentTranscript] = useState({});
  const [degreeDetailsByUniversity, setDegreeDetailsByUniversity] = useState(
    {}
  );

  useEffect(() => {
    if (!studentId) return;

    fetch(`http://localhost:5000/api/studies/${studentId}`)
      .then((response) => {
        if (!response.ok)
          throw new Error(
            `Failed to fetch studies. Status: ${response.status}`
          );
        return response.json();
      })
      .then((studiesData) => {
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
        return Promise.all(
          Object.keys(universityDegreeMap).map(async (uniCode) => {
            const uniResponse = await fetch(
              `http://localhost:5000/api/universities/${uniCode}`
            );
            if (!uniResponse.ok)
              throw new Error(`Failed to fetch university ${uniCode}`);

            console.log("Uni Response: ", uniResponse);
            return uniResponse.json();
          })
        );
      })
      .then((universitiesData) => {
        setUniversities(universitiesData);
      })
      .catch((error) => console.error("Error:", error));
  }, [studentId]);

  useEffect(() => {
    //Call to get all the courses in which the student is enrolled
    fetch(`http://localhost:5000/api/transcripts/${studentId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch validations. Status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        if (!data.length) {
          throw new Error("No validations found.");
        }
        setStudentTranscript(data);
      })
      .catch((error) =>
        console.error("Error fetching student's courses:", error)
      );
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
            const degreeResponse = await fetch(
              `http://localhost:5000/api/degrees/${uniCode}/${degreeId}`
            );
            if (!degreeResponse.ok)
              throw new Error(
                `Failed to fetch degree ${degreeId} at ${uniCode}`
              );
            const degreeData = await degreeResponse.json();

            console.log("Degree data: ", degreeData);
            // Fetch teacher details
            const teacherResponse = await fetch(
              `http://localhost:5000/api/teachers/${degreeData.teacherid}`
            );
            if (!teacherResponse.ok)
              throw new Error(
                `Failed to fetch teacher ${degreeData.teacherid}`
              );
            const teacherData = await teacherResponse.json();

            console.log("Teacher data: ", teacherData);

            const courseResponse = await fetch(
              `http://localhost:5000/api/courses/degree/teachers/${uniCode}/${degreeId}`
            );

            if (!courseResponse.ok)
              throw new Error(
                `Failed to fetch courses for ${uniCode}/${degreeId}`
              );
            const courseData = await courseResponse.json();

            console.log("Teacher data: ", courseData);

            // Store degree with teacher name
            degreeDetailsMap[uniCode].push({
              degreeId: degreeId,
              name: degreeData.name,
              teacherName: teacherData.name,
              teacherId: teacherData.teacherid,
              courseTeachers: courseData,
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
  }, [degreesByUniversity]);

  // Function to check if the student has enrol on the course
  const isCourseTaken = (course) => {
    console.log("Course parameter:", course);
    console.log("Student's transcript:", studentTranscript);
    if (!Array.isArray(studentTranscript)) return false;
    return studentTranscript.some(
      (transcript) =>
        (transcript.unicode === course.unicode &&
          transcript.degreeid === course.degreeid &&
          transcript.courseid === course.courseid) ||
        (transcript.unicodesrc === course.unicode &&
          transcript.degreeidsrc === course.degreeid &&
          transcript.courseidsrc === course.courseid)
    );
  };

  return (
    <div style={containerStyle}>
      <div style={mainContentStyle}>
        <div style={tableContainer}>
          <h2 style={tableTitle}>Student's Universities and Degrees</h2>

          {universities.map((uni) => (
            <div
              key={uni.unicode}
              style={{
                marginBottom: "20px",
                border: "1px solid black",
                padding: "10px",
              }}
            >
              <h3>{uni.name}</h3>
              <p>
                <strong>ID:</strong> {uni.unicode}
              </p>
              <p>
                <strong>Location:</strong> {uni.location}
              </p>

              <h4>Degrees</h4>
              <ul>
                {degreeDetailsByUniversity[uni.unicode]?.map((degree) => (
                  <li key={degree.degreeid}>
                    <strong>
                      {degree.name} ({degree.degreeId})
                    </strong>{" "}
                    <br />- Coordinator: {degree.teacherName} (
                    {degree.teacherId})<br />
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={thStyle}>Teacher ID</th>
                          <th style={thStyle}>Name</th>
                          <th style={thStyle}>Course Name</th>
                          <th style={thStyle}>Period</th>
                          <th style={thStyle}>Credits</th>
                          <th style={thStyle}>Taken</th>
                        </tr>
                      </thead>
                      <tbody>
                        {degree.courseTeachers.map((teacher, i) => (
                          <tr key={i}>
                            <td style={tdStyle}>{teacher.teacherid}</td>
                            <td style={tdStyle}>{teacher.teachername}</td>
                            <td style={tdStyle}>
                              {teacher.name}{" "}
                              <strong>({teacher.courseid})</strong>
                            </td>
                            <td style={tdStyle}>{teacher.period}</td>
                            <td style={tdStyle}>{teacher.credits}</td>
                            <td style={tdStyle}>
                              {isCourseTaken(teacher) ? "✅" : "❌"}
                            </td>
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
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  display: "flex",
  height: "100vh",
  backgroundColor: "#f4f4f4",
};

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

export default StudentUniversityInformationBody;
