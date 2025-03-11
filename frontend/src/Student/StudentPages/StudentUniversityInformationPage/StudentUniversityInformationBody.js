import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StudentUniversityInformationBody = ({ studentId }) => {
    const [universities, setUniversities] = useState([]);
    const [degreesByUniversity, setDegreesByUniversity] = useState({});
    const [degreeDetailsByUniversity, setDegreeDetailsByUniversity] = useState({});
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
                        // Store degree with teacher name
                        degreeDetailsMap[uniCode].push({
                            degreeId: degreeId,
                            name: degreeData.name,
                            teacherName: teacherData.name
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
                                {degree.name} - Coordinator: {degree.teacherName}
                            </li>
                        )) || <p>No degrees found.</p>}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default StudentUniversityInformationBody;
