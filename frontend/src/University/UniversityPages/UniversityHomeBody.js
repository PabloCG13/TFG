import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const UniversityHomeBody = ({ uniCode }) => {
  const [activeTab, setActiveTab] = useState("STUDENTS");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [teacherRoles, setTeacherRoles] = useState([
    "Course Coordinator",
    "Degree Coordinator",
  ]);

  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showDegreeForm, setShowDegreeForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newEntry, setNewEntry] = useState("");

  const [newStudent, setNewStudent] = useState({
    studentid: "",
    degreeid: "",
    name: "",
    surname: "",
    dni: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [newTeacher, setNewTeacher] = useState({
    teacherid: "",
    name: "",
    surname: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [newDegree, setNewDegree] = useState({
    degreeid: "",
    name: "",
    teacherid: "",
  });
  const [newCourse, setNewCourse] = useState({
    degreeid: "",
    courseid: "",
    name: "",
    credits: "",
    period: "",
    teacherid: "",
    syllabus: null,
  });

  const [message, setMessage] = useState("");
  const location = useLocation();
  const { universityAddress } = location.state || {};

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedDegreeId, setSelectedDegreeId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedTeacherRole, setSelectedTeacherRole] = useState("");

  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [teacher1, setTeacher1] = useState("");
  const [teacher2, setTeacher2] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshKey2, setRefreshKey2] = useState(0);

  const [erasmus, setErasmus] = useState(false);

  useEffect(() => {
    if (!uniCode) return;

    fetch(`http://localhost:5000/api/universities/${uniCode}/students`)
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students:", error));

    fetch(`http://localhost:5000/api/universities/${uniCode}/courses`)
      .then((response) => response.json())
      .then((data) => {
        // Convert syllabus PDF to base64 if it's binary
        const updatedCourses = data.map((course) => {
          if (course.syllabus_pdf && course.syllabus_pdf.data) {
            const binaryData = new Uint8Array(course.syllabus_pdf.data);
            const base64String = btoa(
              binaryData.reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
            return { ...course, syllabus_pdf: base64String };
          }
          return course;
        });
        setCourses(updatedCourses);
      })
      .catch((error) => console.error("Error fetching courses:", error));
    console.log("Course:", courses);
    fetch(`http://localhost:5000/api/universities/${uniCode}/degrees`)
      .then((response) => response.json())
      .then((data) => setDegrees(data))
      .catch((error) => console.error("Error fetching degrees:", error));
  }, [uniCode]);

  useEffect(() => {
    if (!uniCode) return;
    fetch(`http://localhost:5000/api/universities/${uniCode}/teachers`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Teachers", data);
        setTeachers(data);
      })
      .catch((error) => console.error("Error fetching teachers:", error));
  }, [uniCode, refreshKey]);

  useEffect(() => {
    if (!uniCode) return;

    fetch(`http://localhost:5000/api/studies/uni/${uniCode}`)
      .then((response) => response.json())
      .then((studiesData) => {
        setStudents((prevStudents) => {
          const updatedStudents = prevStudents.map((student) => {
            const matchingStudy = studiesData.find(
              (study) => study.studentid === student.studentid
            );

            return matchingStudy
              ? { ...student, degreeid: matchingStudy.degreeid }
              : student;
          });

          return updatedStudents;
        });
      })
      .catch((error) => console.error("Error fetching studies:", error));
  }, [uniCode, refreshKey2]);

  let body;
  let user;
  let password;
  let role;
  let namedb;
  let newItem;
  const handleAddParticipantToBlockchain = async () => {
    try {
      const addressResponse = await fetch(
        `http://localhost:5000/api/addresses/any-participant/null-participant`
      );

      const addressData = await addressResponse.json();
      console.log("Addressdata: ", addressData);
      if (!addressResponse.ok || !addressData.addressid) {
        setMessage("Failed to retrieve a free blockchain address.");
        console.error("Address fetch error:", addressData);
        return [null, null];
      }

      const participantAddress = addressData.addressid; // Retrieved from API
      console.log("Retrieved participant Address:", participantAddress);

      const response = await fetch("http://localhost:4000/addParticipant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: participantAddress,
          uni: universityAddress,
          user: user,
          passwd: password,
          role: role,
        }),
      });

      const data = await response.json();

      if (data.success && data.hash !== "Error") {
        setMessage(
          `User added successfully to the Blockchain! Hash: ${data.hash}`
        );
        console.log("User added successfully. Hash:", data.hash);
        return [participantAddress, data.hash];
      } else {
        if (data.hash === "Error") {
          setMessage(`Failed to add user: ${data.hash}`);
          console.error("Failed to add user:", data.hash);
        } else {
          setMessage(`Failed to add user: ${data.error}`);
          console.error("Failed to add user:", data.error);
        }
        return [null, null];
      }
    } catch (error) {
      setMessage("API request failed.");
      console.error("Error:", error);
      return [null, null];
    }
  };

  const updateAddressesTable = async (participantAddress) => {
    try {
      console.log("User:", user);
      console.log("address:", participantAddress);
      const updateResponse = await fetch(
        `http://localhost:5000/api/addresses/${participantAddress}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participantId: user,
            addressId: participantAddress,
          }),
        }
      );

      if (updateResponse.ok) {
        console.log(
          `Address ${participantAddress} successfully updated with user: ${user}`
        );
      } else {
        console.error(`Failed to update address: ${participantAddress}`);
      }
    } catch (error) {
      console.error("Failed to update address in the DB:", error);
    }
  };

  const addStudent = async (student) => {
    if (
      !student.studentid ||
      !student.degreeid ||
      !student.name ||
      !student.surname ||
      !student.dni ||
      !student.dob ||
      student.password !== student.confirmPassword
    ) {
      alert("Please enter a valid ID and make sure passwords match");
      return false;
    }

    user = student.studentid;
    password = student.password;
    role = 1;
    namedb = `${student.name}, ${student.surname}`;

    body = JSON.stringify({
      studentId: user,
      name: namedb,
      dob: student.dob,
      dni: student.dni,
    });

    try {
      // Check if the teacher already exists
      const studentExistsResponse = await fetch(
        `http://localhost:5000/api/students/${user}`
      );

      if (studentExistsResponse.ok) {
        // If the API returns a 200 response, the teacher **already exists**, return error
        console.error(`Student with ID ${user} already exists!`);
        setMessage(`Student with ID ${user} already exists.`);
        return false;
      } else if (studentExistsResponse.status !== 404) {
        // If the API returns an unexpected error other than 400, log the issue and stop
        console.error(
          `Unexpected error when checking student: ${studentExistsResponse.status}`
        );
        return false;
      }

      // If the response status is 400, the teacher **does NOT exist**, continue with the process
      console.log("Student ID is available, proceeding with creation...");

      const [participantAddress, hashP] =
        await handleAddParticipantToBlockchain();
      if (!participantAddress || !hashP) return false;
      //Add a first transcript with the data of the student to be consistent
      const transcriptResponse = await fetch(
        "http://localhost:4000/modifyTranscript",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: JSON.parse(body),
            addressStudent: participantAddress,
            address: universityAddress,
            type: 2,
          }),
        }
      );

      const transcriptData = await transcriptResponse.json();
      const transcriptHash = transcriptData.hash;

      if (transcriptResponse.ok) {
        // Register into the students and studies tables
        console.log("Transcript modified successfully:", transcriptHash);
        const dbResponseTranscript = await fetch(
          `http://localhost:5000/api/students`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...JSON.parse(body),
              hash: hashP,
              transcriptHash: transcriptHash,
            }),
          }
        );
        newItem = await dbResponseTranscript.json();

        const dbResponseStudies = await fetch(
          `http://localhost:5000/api/studies`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentId: newStudent.studentid,
              uniCode: uniCode,
              degreeId: newStudent.degreeid,
            }),
          }
        );
        const test = await dbResponseStudies.json();
        console.log(test);
        await updateAddressesTable(participantAddress);
        setRefreshKey2((prev) => prev + 1);
        return true;
      } else {
        console.error("Failed to modify transcript:", transcriptData.error);
        return false;
      }
    } catch (error) {
      setMessage("API request failed.");
      console.error("Error:", error);
      return false;
    }
  };

  const addTeacher = async (teacher) => {
    if (
      !teacher.teacherid ||
      !teacher.name ||
      !teacher.surname ||
      teacher.password !== teacher.confirmPassword ||
      !teacher.role
    ) {
      alert(
        "Please enter a valid ID, make sure passwords match, and select a role"
      );
      return false;
    }

    user = teacher.teacherid;
    console.log("Teacher id:", user);
    password = teacher.password;
    role = teacher.role === "Degree Coordinator" ? 3 : 2; // Determine role based on selection
    namedb = `${teacher.name} ${teacher.surname}`;
    body = JSON.stringify({ teacherId: user, name: namedb, uniCode: uniCode });

    try {
      // Check if the teacher already exists
      const teacherExistsResponse = await fetch(
        `http://localhost:5000/api/teachers/${user}`
      );

      if (teacherExistsResponse.ok) {
        // If the API returns a 200 response, the teacher **already exists**, return error
        console.error(`Teacher with ID ${user} already exists!`);
        setMessage(`Teacher with ID ${user} already exists.`);
        return false;
      } else if (teacherExistsResponse.status !== 404) {
        // If the API returns an unexpected error other than 400, log the issue and stop
        console.error(
          `Unexpected error when checking teacher: ${teacherExistsResponse.status}`
        );
        return false;
      }

      // If the response status is 400, the teacher **does NOT exist**, continue with the process
      console.log("Teacher ID is available, proceeding with creation...");

      const [participantAddress, hashP] =
        await handleAddParticipantToBlockchain();
      if (!participantAddress || !hashP) return false;

      // Add the teacher to the database
      const dbResponse = await fetch(`http://localhost:5000/api/teachers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...JSON.parse(body), hash: hashP }),
      });

      if (!dbResponse.ok) {
        console.error(
          `Failed to add teacher to DB. Status: ${dbResponse.status}`
        );
        return false;
      }

      await updateAddressesTable(participantAddress);
      newItem = await dbResponse.json();

      return true;
    } catch (error) {
      console.error("Error in addTeacher:", error);
      return false;
    }
  };

  const addDegree = async (degree) => {
    if (!degree.teacherid || !degree.name || !degree.degreeid) {
      alert("Please enter a valid ID, degree coordinator and name");
      return false;
    }

    const dbResponse = await fetch("http://localhost:5000/api/degrees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uniCode: uniCode,
        degreeId: degree.degreeid,
        name: degree.name,
      }),
    });

    const dbData = await dbResponse.json();
    console.log(dbData);
    if (dbResponse.ok) {
      const dbCoordResponse = await fetch(
        "http://localhost:5000/api/coordinatesdegrees",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uniCode: uniCode,
            degreeId: degree.degreeid,
            teacherId: degree.teacherid,
          }),
        }
      );

      const dbCoordData = await dbCoordResponse.json();
      console.log(dbCoordData);
      if (dbCoordResponse.ok) {
        setMessage(`Degree registered successfully! ID: ${dbData.degreeid}`);
        console.log("Stored Degree:", dbData);
        setRefreshKey((prev) => prev + 1);
        return true;
      } else {
        setMessage(`Failed to create a new entry in the Database error`);
        console.error("Database error:", dbData.error);
        return false;
      }
    } else {
      setMessage(`Failed to create a new entry in the Database error`);
      console.error("Database error:", dbData.error);
      return false;
    }
  };

  // Handle file input for syllabus PDF
  const handleFileChange = (e) => {
    setNewCourse({ ...newCourse, syllabus: e.target.files[0] });
  };

  const addCourse = async (course) => {
    if (
      !course.teacherid ||
      !course.name ||
      !course.degreeid ||
      !course.credits ||
      !course.period
    ) {
      alert("Please enter all required fields.");
      return false;
    }

    const formData = new FormData();
    formData.append("uniCode", uniCode);
    formData.append("degreeId", course.degreeid);
    formData.append("courseId", course.courseid);
    formData.append("name", course.name);
    formData.append("credits", course.credits);
    formData.append("period", course.period);
    formData.append("teacherId", course.teacherid);
    if (course.syllabus) {
      formData.append("syllabus_pdf", course.syllabus);
    }

    console.log("form data: ", formData);
    const dbResponse = await fetch("http://localhost:5000/api/courses", {
      method: "POST",
      body: formData,
    });

    const dbData = await dbResponse.json();
    console.log(dbData);
    if (dbResponse.ok) {
      setMessage(`Course registered successfully! ID: ${dbData.courseId}`);
      setRefreshKey((prev) => prev + 1);
      return true;
    } else {
      setMessage(`Failed to create a new entry in the Database`);
      console.error("Database error:", dbData.error);
      return false;
    }
  };

  const updateState = (type) => {
    switch (type) {
      case "students":
        setStudents([...students, newItem]);
        setShowStudentForm(false);
        setNewStudent({
          studentid: "",
          name: "",
          surname: "",
          dni: "",
          dob: "",
          password: "",
          confirmPassword: "",
        });
        break;
      case "teachers":
        setTeachers([...teachers, newItem]);
        setShowTeacherForm(false);
        setNewTeacher({
          teacherid: "",
          name: "",
          surname: "",
          role: "",
          password: "",
          confirmPassword: "",
        });
        break;
      case "courses":
        setCourses([...courses, newCourse]);
        setShowCourseForm(false);
        setNewCourse({
          degreeid: "",
          courseid: "",
          name: "",
          credits: "",
          period: "",
          teacherid: "",
        });
        break;
      case "degrees":
        setDegrees([...degrees, newDegree]);
        setShowDegreeForm(false);
        setNewDegree({ degreeid: "", name: "", teacherid: "" });
        break;
      default:
        console.warn(`No state update handler for type: ${type}`);
    }
  };

  const handleAddEntry = async (type) => {
    let success;
    if (type === "students") {
      const student = newStudent;
      success = await addStudent(student);
    } else if (type === "teachers") {
      const teacher = newTeacher;
      success = await addTeacher(teacher);
    } else if (type === "degrees") {
      const degree = newDegree;
      success = await addDegree(degree);
    } else if (type === "courses") {
      const course = newCourse;
      success = await addCourse(course);
    } else {
      if (!newEntry) return;
    }

    // Update state after successful addition to the DB
    if (success) {
      updateState(type);
      setNewEntry(""); // Reset input in all cases
    } else {
      console.error("Failed to add entry:", type);
      setMessage(`Failed to add ${type}. Please try again`);
    }
  };

  const handleStudentToCourse = async ({
    degreeId,
    courseId,
    studentId,
    year,
    teacherId,
  }) => {
    if (erasmus) {
      try {
        const dbResponse = await fetch(
          `http://localhost:5000/api/transcripts/validation/${uniCode}/${degreeId}/${courseId}/${studentId}/`
        );

        if (dbResponse.ok) {
          const responseJson = await dbResponse.json();
          console.log("Course assignment response:", responseJson);
        } else {
          throw new Error("Failed to assign course");
        }
        return;
      } catch (error) {
        console.error("Error:", error.message);
        setMessage(error.message);
        return;
      }
    }
    console.log("degreeID desde la funcion:", degreeId);
    console.log("courseID desde la funcion:", courseId);
    console.log("studentID desde la funcion:", studentId);
    console.log("Year desde la funcion:", year);
    console.log("teacherId desde la funcion:", teacherId);
    try {
      const dbResponse = await fetch("http://localhost:5000/api/transcripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniCode: uniCode,
          degreeId: degreeId,
          courseId: courseId,
          studentId: studentId,
          academicYear: year,
          erasmus: 0,
          provisional: 0,
          teacherId: teacherId,
          uniCodeSrc: null,
          degreeIdSrc: null,
          courseIdSrc: null,
        }),
      });

      // Handle the response from the database
      if (dbResponse.ok) {
        const responseJson = await dbResponse.json();
        console.log("Course assignment response:", responseJson);
      } else {
        throw new Error("Failed to assign course");
      }

      // Step 1: Fetch the teacher's blockchain address from the database
      const dbResponseTranscript = await fetch(
        `http://localhost:5000/api/transcripts/${studentId}`
      );

      if (!dbResponseTranscript.ok) {
        throw new Error(
          `Failed to fetch transcript. Status: ${dbResponseTranscript.status}`
        );
      }

      const transcriptHash = await dbResponseTranscript.json();
      console.log("Got this transcript: ", transcriptHash);

      const dbResponseTeacher = await fetch(
        `http://localhost:5000/api/addresses/participant/${teacherId}`
      );

      if (!dbResponseTeacher.ok) {
        throw new Error(
          `Failed to fetch teacher address. Status: ${dbResponseTeacher.status}`
        );
      }

      const dbData = await dbResponseTeacher.json();

      if (!dbData.addressid) {
        setMessage(
          "No blockchain address found for this user. Please contact support."
        );
        console.error("Database error:", dbData);
        return; // Stop execution
      }

      const teacherAddress = dbData.addressid;
      console.log("Fetched Address from DB:", teacherAddress);

      const dbResponseStudent = await fetch(
        `http://localhost:5000/api/addresses/participant/${studentId}`
      );

      if (!dbResponseStudent.ok) {
        throw new Error(
          `Failed to fetch teacher address. Status: ${dbResponseStudent.status}`
        );
      }

      const dbDataSt = await dbResponseStudent.json();

      if (!dbDataSt.addressid) {
        setMessage(
          "No blockchain address found for this user. Please contact support."
        );
        console.error("Database error:", dbDataSt);
        return; // Stop execution
      }

      const studentAddress = dbDataSt.addressid;
      console.log("Fetched Address from DB:", studentAddress);
      // Step 2: Modify transcript on the blockchain
      const transcriptResponse = await fetch(
        "http://localhost:4000/modifyTranscript",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: transcriptHash,
            addressStudent: studentAddress,
            address: universityAddress,
            type: 2,
          }),
        }
      );

      if (!transcriptResponse.ok) {
        throw new Error(
          `Failed to modify transcript. Status: ${transcriptResponse.status}`
        );
      }

      const transcriptData = await transcriptResponse.json();
      const transcriptHashModified = transcriptData.hash;
      console.log("Transcript modified successfully:", transcriptHashModified);

      // Step 3: Update student record in the database
      const updateResponse = await fetch(
        `http://localhost:5000/api/students/${studentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcriptHash: transcriptHashModified }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error(
          `Failed to update student ${studentId}. Status: ${updateResponse.status}`
        );
      }

      const updateData = await updateResponse.json();
      console.log(
        `Student ${studentId} updated successfully with transcriptHash:`,
        updateData
      );

      // Step 4: Add teacher to transcript on the blockchain
      const teacherTranscriptResponse = await fetch(
        "http://localhost:4000/addTeacherToTranscript",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            addressTeacher: teacherAddress,
            addressUniversity: universityAddress,
            addressStudent: studentAddress,
          }),
        }
      );

      if (!teacherTranscriptResponse.ok) {
        throw new Error(
          `Failed to add teacher to transcript. Status: ${teacherTranscriptResponse.status}`
        );
      }

      const teacherTranscriptData = await teacherTranscriptResponse.json();
      console.log(
        "Teacher successfully added to transcript:",
        teacherTranscriptData
      );
    } catch (error) {
      console.error("Error:", error.message);
      setMessage(error.message);
    }
  };

  // Function to handle the "Assign Coure" button click
  const handleAssignCourse = (student) => {
    console.log("Student", student);
    setSelectedStudent({
      studentId: student.studentid,
      studentName: student.name,
      degreeid: student.degreeid,
    });
  };

  const handleTransferValidations = async (teacher1, teacher2) => {
    console.log("teachers", teacher1, teacher2);
    const dbResponseTeacherSrc = await fetch(
      `http://localhost:5000/api/addresses/participant/${teacher1.teacherid}`
    );

    if (!dbResponseTeacherSrc.ok) {
      throw new Error(
        `Failed to fetch teacher address. Status: ${dbResponseTeacherSrc.status}`
      );
    }

    const dbDataSrc = await dbResponseTeacherSrc.json();

    if (!dbDataSrc.addressid) {
      setMessage(
        "No blockchain address found for this user. Please contact support."
      );
      console.error("Database error:", dbDataSrc);
      return; // Stop execution
    }

    const teacherAddressSrc = dbDataSrc.addressid;
    console.log("Fetched Address from DB:", teacherAddressSrc);

    const dbResponseTeacherDst = await fetch(
      `http://localhost:5000/api/addresses/participant/${teacher2.teacherid}`
    );

    if (!dbResponseTeacherDst.ok) {
      throw new Error(
        `Failed to fetch teacher address. Status: ${dbResponseTeacherDst.status}`
      );
    }

    const dbDataDst = await dbResponseTeacherDst.json();

    if (!dbDataDst.addressid) {
      setMessage(
        "No blockchain address found for this user. Please contact support."
      );
      console.error("Database error:", dbDataDst);
      return; // Stop execution
    }

    const teacherAddressDst = dbDataDst.addressid;
    console.log("Fetched Address from DB:", teacherAddressDst);

    const dbResponseTokens = await fetch(
      `http://localhost:5000/api/validations/conf/tok/${teacher1.teacherid}`
    );

    if (!dbResponseTokens.ok) {
      throw new Error(
        `Failed to fetch teacher address. Status: ${dbResponseTokens.status}`
      );
    }

    const dbDataTokens = await dbResponseTokens.json();

    if (!dbDataTokens) {
      setMessage(
        "No blockchain address found for this user. Please contact support."
      );
      console.error("Database error:", dbDataTokens);
      return; // Stop execution
    }

    console.log("DBCALL", dbDataTokens);

    const tokens = dbDataTokens.map((item) => item.token);
    console.log("Fetched tokens from DB:", tokens);

    try {
      const teacherTranscriptResponse = await fetch(
        "http://localhost:4000/transferValidation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            degreeAddr: teacherAddressSrc,
            uniAddress: universityAddress,
            newDegreeAddr: teacherAddressDst,
            id: tokens,
          }),
        }
      );

      if (!teacherTranscriptResponse.ok) {
        throw new Error(
          `Failed to add teacher to transcript. Status: ${teacherTranscriptResponse.status}`
        );
      }

      const teacherTranscriptData = await teacherTranscriptResponse.json();
      console.log(
        "Teacher successfully added to transcript:",
        teacherTranscriptData
      );
      const dbCoordResponse = await fetch(
        "http://localhost:5000/api/coordinatesdegrees",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uniCode: uniCode,
            degreeId: teacher1.degreeid,
            teacherId: teacher2.teacherid,
          }),
        }
      );

      const dbCoordData = await dbCoordResponse.json();
      console.log(dbCoordData);
      if (dbCoordResponse.ok) {
        const dbDeleteResponse = await fetch(
          `http://localhost:5000/api/coordinatesdegrees/${teacher1.teacherid}`,
          {
            method: "DELETE",
          }
        );

        const dbDeleteData = await dbDeleteResponse.json();

        if (dbDeleteResponse.ok) {
          setMessage(
            `Coordinator with ID ${teacher2.teacherid} deleted successfully!`
          );
          console.log("Deleted:", dbDeleteData);
          setMessage(
            `Degree registered successfully! ID: ${dbCoordData.degreeid}`
          );
          console.log("Stored Degree:", dbCoordData);
          handleBlockchain(
            teacher2.teacherid,
            uniCode,
            teacher1.degreeid,
            teacher1.teacherid
          );
          setRefreshKey((prev) => prev + 1);
          return true;
        } else {
          setMessage(
            `Failed to delete coordinator. Reason: ${dbDeleteData.message}`
          );
          console.error("Delete error:", dbDeleteData.message);
          return false;
        }
      } else {
        setMessage(`Failed to create a new entry in the Database error`);
        console.error("Database error:", dbCoordData.error);
        return false;
      }
    } catch (error) {
      console.error("Error:", error.message);
      setMessage(error.message);
    }
  };

  const handleBlockchain = async (
    teacherNew,
    unicodesrc,
    degreeidsrc,
    teacherOld
  ) => {
    // Get the address of the teacher of the DstCourse
    const dbResponse = await fetch(
      `http://localhost:5000/api/addresses/participant/${teacherNew}`
    );
    const dbData = await dbResponse.json();

    if (!dbResponse.ok || !dbData.addressid) {
      setMessage(
        "No blockchain address found for this user. Please contact support."
      );
      console.error("Database error:", dbData);
      return;
    }

    const courseDstAddress = dbData.addressid;
    console.log("Fetched Address from DB:", courseDstAddress);

    const dbResponseOld = await fetch(
      `http://localhost:5000/api/addresses/participant/${teacherOld}`
    );
    const dbDataOld = await dbResponseOld.json();

    if (!dbResponseOld.ok || !dbDataOld.addressid) {
      setMessage(
        "No blockchain address found for this user. Please contact support."
      );
      console.error("Database error:", dbDataOld);
      return;
    }

    const courseOldAddress = dbDataOld.addressid;
    console.log("Fetched Address from DB:", courseOldAddress);

    // Get validation entries
    const dbStudentsResponse = await fetch(
      `http://localhost:5000/api/transcripts/erasmusNotConf/${unicodesrc}/${degreeidsrc}`
    );
    const dbDataStudents = await dbStudentsResponse.json();

    if (!dbStudentsResponse.ok) {
      console.error("Database error:", dbDataStudents);
      return;
    }

    const studentAddresses = [];

    for (const student of dbDataStudents) {
      try {
        const res = await fetch(
          `http://localhost:5000/api/addresses/participant/${student.studentid}`
        );
        const data = await res.json();

        if (res.ok && data.addressid) {
          studentAddresses.push({
            studentid: student.studentid,
            address: data.addressid,
          });

          // Get list of allowed teachers
          const teachersResponse = await fetch(
            "http://localhost:4000/getTeachersAllowed",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                address: data.addressid,
              }),
            }
          );

          if (!teachersResponse.ok) {
            console.error(
              `Failed to fetch teachers for student ${student.studentid}. Status: ${teachersResponse.status}`
            );
            continue;
          }

          const teachersData = await teachersResponse.json();

          if (!Array.isArray(teachersData.result)) {
            console.error(
              `Malformed teachers data for student ${student.studentid}`,
              teachersData
            );
            continue;
          }
          //Check if DegreeCoord is already allowed to modify the transcript of this student
          const teacherAlreadyAllowed =
            teachersData.result.includes(courseDstAddress);
          console.log(
            "teacher addresses for",
            student.studentid,
            "are",
            teachersData.result
          );
          console.log("Is teacher already allowed?", teacherAlreadyAllowed);
          const validationChangeResponse = await fetch(
            "http://localhost:4000/revokeTeacherFromTranscript",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                addressTeacher: courseOldAddress,
                addressUniversity: universityAddress,
                addressStudent: data.addressid,
              }),
            }
          );

          if (!validationChangeResponse.ok) {
            const errorText = await validationChangeResponse.text();
            console.error(
              `Failed to revoke access for teacher for student ${student.studentid} Transcript. Status: ${validationChangeResponse.status}`,
              errorText
            );
          }

          // If not add him
          if (!teacherAlreadyAllowed) {
            try {
              const validationResponse = await fetch(
                "http://localhost:4000/addTeacherToTranscript",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    addressTeacher: courseDstAddress,
                    addressUniversity: universityAddress,
                    addressStudent: data.addressid,
                  }),
                }
              );

              if (!validationResponse.ok) {
                const errorText = await validationResponse.text();
                console.error(
                  `Failed to give access for teacher for student ${student.studentid} Transcript Status: ${validationResponse.status}`,
                  errorText
                );
              } else {
                console.log(
                  `Teachers address successfully added for student ${student.studentid}`
                );
              }
            } catch (error) {
              console.error(
                `Network or server error while adding validation for student ${student.studentid}:`,
                error
              );
            }
          }
        } else {
          console.warn(`No address found for student ${student.studentid}`);
        }
      } catch (err) {
        console.error(
          `Error fetching address for student ${student.studentid}:`,
          err
        );
      }
    }
  };

  return (
    <div style={containerStyle}>
      <main style={mainContentStyle}>
        <nav style={navStyle}>
          {["STUDENTS", "TEACHERS", "COURSES", "DEGREES"].map((tab) => (
            <button
              key={tab}
              style={
                activeTab === tab
                  ? { ...tabStyle, ...activeTabStyle }
                  : tabStyle
              }
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === "STUDENTS" && (
          <>
            <button onClick={() => setShowStudentForm(true)}>
              Add Student
            </button>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ID</th>
                  <th>DOB</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  return (
                    <tr key={student.studentid}>
                      <td>{student.name || "N/A"}</td>
                      <td>{student.studentid}</td>
                      <td>{new Date(student.dob).toLocaleDateString()}</td>

                      <td>
                        <button onClick={() => handleAssignCourse(student)}>
                          {" "}
                          Assign Course{" "}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "TEACHERS" && (
          <>
            <button onClick={() => setShowTeacherForm(true)}>
              Add Teacher
            </button>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ID</th>
                  <th>Degree/Course Title</th>
                  <th>Degree/Course ID</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.teacherid}>
                    <td>{teacher.name || "N/A"}</td>
                    <td>{teacher.teacherid}</td>
                    <td>{teacher.coursename || teacher.degreename}</td>
                    <td>{teacher.courseid || teacher.degreeid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setShowTeacherModal(true)}>
              Transfer Validations
            </button>
          </>
        )}

        {activeTab === "COURSES" && (
          <>
            <button onClick={() => setShowCourseForm(true)}>Add Course</button>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ID</th>
                  <th>DegreeID</th>
                  <th>TeacherID</th>
                  <th>Credits</th>
                  <th>Period</th>
                  <th>Syllabus</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => {
                  return (
                    <tr key={course.courseid}>
                      <td>{course.name}</td>
                      <td>{course.courseid}</td>
                      <td>{course.degreeid}</td>
                      <td>{course.teacherid}</td>
                      <td>{course.credits}</td>
                      <td>{course.period}</td>
                      <td>
                        {course.syllabus_pdf ? (
                          <a
                            href={`data:application/pdf;base64,${course.syllabus_pdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            View Syllabus
                          </a>
                        ) : (
                          "No Syllabus attached"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "DEGREES" && (
          <>
            <button onClick={() => setShowDegreeForm(true)}>Add Degree</button>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ID</th>
                  <th>TeacherID</th>
                </tr>
              </thead>
              <tbody>
                {degrees.map((degree) => {
                  return (
                    <tr key={degree.degreeid}>
                      <td>{degree.name}</td>
                      <td>{degree.degreeid}</td>
                      <td>{degree.teacherid}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {showStudentForm && (
          <div style={modalStyle}>
            <div style={formStyle}>
              <h2>Add Student</h2>
              <input
                type="text"
                placeholder="ID"
                value={newStudent.studentid}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, studentid: e.target.value })
                }
              />
              {/* Dropdown for role selection */}
              <select
                onChange={(e) => {
                  const newDegreeId = e.target.value;
                  setSelectedDegreeId(newDegreeId);
                  console.log("selectedDegreeId updated to:", newDegreeId);
                  setNewStudent({ ...newStudent, degreeid: newDegreeId });
                }}
                style={inputStyle}
              >
                {/* If there is more than one degree, invisible Default Option is "". If not is the degreeid of the only degree on the list. */}
                {degrees.length > 1 ? (
                  <option value="" hidden>
                    Select Degree
                  </option>
                ) : (
                  <option value={selectedDegreeId} hidden>
                    Select Degree
                  </option>
                )}

                {degrees.map((degree) => (
                  <option key={degree.degreeid} value={degree.degreeid}>
                    {degree.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Name"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Surname"
                value={newStudent.surname}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, surname: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="DNI"
                value={newStudent.dni}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, dni: e.target.value })
                }
              />
              <input
                type="date"
                placeholder="DOB"
                value={newStudent.dob}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, dob: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                value={newStudent.password}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, password: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={newStudent.confirmPassword}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <button onClick={() => handleAddEntry("students")}>Submit</button>
              <button onClick={() => setShowStudentForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Section to select the course for the student */}
        {selectedStudent && (
          <div style={modalStyle}>
            <div style={formStyle}>
              <h3 style={formTitleStyle}>
                {" "}
                Select Course for {selectedStudent.studentName}{" "}
              </h3>
              {/* Dropdown for role selection */}
              <select
                onChange={(e) => {
                  const selectedCourseId = e.target.value;
                  const selectedCourse = courses.find(
                    (course) => course.courseid === selectedCourseId
                  );
                  console.log("courses", courses);
                  console.log("Stu", selectedStudent);
                  if (selectedCourse) {
                    setSelectedDegreeId(selectedCourse.degreeid);
                    setSelectedCourseId(selectedCourseId);
                    console.log(
                      "selectedCourseId updated to:",
                      selectedCourseId
                    );
                    setSelectedTeacherId(selectedCourse.teacherid);
                  }
                }}
                style={inputStyle}
              >
                {/* If there is more than one course, invisible Default Option is "". If not is the courseid of the only course on the list. */}
                {courses.length > 1 ? (
                  <option value="" hidden>
                    Select a Course
                  </option>
                ) : (
                  <option value={selectedCourseId} hidden>
                    Select a Course
                  </option>
                )}

                {courses
                  .filter(
                    (course) => course.degreeid === selectedStudent.degreeid
                  )
                  .map((course) => (
                    <option key={course.courseid} value={course.courseid}>
                      {course.name}
                    </option>
                  ))}
              </select>

              {/* Year input field */}
              <div style={formGroupStyle}>
                <label htmlFor="year" style={labelStyle}>
                  {" "}
                  Year:{" "}
                </label>
                <input
                  type="number"
                  id="year"
                  value={newStudent.year || ""}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, year: e.target.value })
                  }
                  style={inputStyle}
                  placeholder="Enter year"
                  required
                />
              </div>

              {/* Erasmus Checkbox */}
              <div style={formGroupStyle}>
                <label htmlFor="erasmus" style={labelStyle}>
                  {" "}
                  Erasmus:{" "}
                </label>
                <input
                  type="checkbox"
                  id="erasmus"
                  checked={erasmus}
                  onChange={(e) => setErasmus(e.target.checked)}
                />
                <span> Erasmus (Checked means Erasmus)</span>
              </div>

              {/* Submit button */}
              <div style={submitButtonContainerStyle}>
                <button
                  onClick={() => {
                    // Extract values from selectedStudentId, selectedDegreeId and selectedTeacherId
                    const degreeId = selectedDegreeId;
                    const courseId = selectedCourseId;
                    const studentId = selectedStudent.studentId;
                    const { year } = newStudent;
                    const teacherId = selectedTeacherId;
                    console.log("degreeID:", degreeId);
                    console.log("courseID:", courseId);
                    console.log("studentID:", studentId);
                    console.log("Year:", year);
                    console.log("teacherId:", teacherId);
                    try {
                      handleStudentToCourse({
                        degreeId: degreeId,
                        courseId: courseId,
                        studentId: studentId,
                        year: year,
                        teacherId: teacherId,
                      });

                      console.log("Course assigned successfully");
                      // Reset form or close modal after submit
                      setSelectedStudent(null);
                      // Reset the selected student
                      setNewStudent({});
                      // Reset checkbox
                      setErasmus(false);
                    } catch (error) {
                      console.error(
                        "Error assigning student to course:",
                        error
                      );
                    }
                  }}
                  style={buttonStyle}
                >
                  {" "}
                  Submit{" "}
                </button>
              </div>

              {/* Cancel button */}
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setErasmus(false); // Reset checkbox
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showTeacherForm && (
          <div style={modalStyle}>
            <div style={formStyle}>
              <h2>Add Teacher</h2>
              <input
                type="text"
                placeholder="ID"
                value={newTeacher.teacherid}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, teacherid: e.target.value })
                }
              />

              {/* Dropdown for role selection */}
              <select
                onChange={(e) => {
                  const newTeacherRole = e.target.value;
                  setSelectedTeacherRole(newTeacherRole);
                  console.log(
                    "selectedTeacherRole updated to:",
                    newTeacherRole
                  );
                  setNewTeacher({ ...newTeacher, role: newTeacherRole });
                }}
                style={inputStyle}
              >
                <option value="" hidden>
                  Select Role
                </option>
                {teacherRoles.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Name"
                value={newTeacher.name}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Surname"
                value={newTeacher.surname}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, surname: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                value={newTeacher.password}
                onChange={(e) =>
                  setNewTeacher({ ...newTeacher, password: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={newTeacher.confirmPassword}
                onChange={(e) =>
                  setNewTeacher({
                    ...newTeacher,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <button onClick={() => handleAddEntry("teachers")}>Submit</button>
              <button onClick={() => setShowTeacherForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {showCourseForm && (
          <div style={modalStyle}>
            <div style={formStyle}>
              <h4>Add Course</h4>
              <input
                type="text"
                placeholder="ID"
                value={newCourse.courseid}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, courseid: e.target.value })
                }
              />

              {/* Dropdown for role selection */}
              <select
                onChange={(e) => {
                  const newDegreeId = e.target.value;
                  setSelectedDegreeId(newDegreeId);
                  console.log("selectedDegreeId updated to:", newDegreeId);
                  setNewCourse({ ...newCourse, degreeid: newDegreeId });
                }}
                style={inputStyle}
              >
                {/* If there is more than one degree, invisible Default Option is "". If not is the degreeid of the only degree on the list. */}
                {degrees.length > 1 ? (
                  <option value="" hidden>
                    Select Degree
                  </option>
                ) : (
                  <option value={selectedDegreeId} hidden>
                    Select Degree
                  </option>
                )}

                {degrees.map((degree) => (
                  <option key={degree.degreeid} value={degree.degreeid}>
                    {degree.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Name"
                value={newCourse.name}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Credits"
                value={newCourse.credits}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, credits: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Period"
                value={newCourse.period}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, period: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Coordinator teacher ID"
                value={newCourse.teacherid}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, teacherid: e.target.value })
                }
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
              <button onClick={() => handleAddEntry("courses")}>Submit</button>
              <button onClick={() => setShowCourseForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {showTeacherModal && (
          <div style={modalStyle}>
            <div style={formStyle}>
              <h3 style={formTitleStyle}>
                Transfer Validations between Teachers
              </h3>

              <label>Current Coordinator:</label>
              <select
                value={teacher1}
                onChange={(e) => setTeacher1(e.target.value)}
                style={inputStyle}
              >
                <option value="" disabled hidden>
                  Select Current Coordinator
                </option>
                {teachers.map((t) => (
                  <option key={t.teacherid} value={t.teacherid}>
                    {t.name}
                  </option>
                ))}
              </select>
              <label style={{ marginTop: "1rem" }}>New Coordinator:</label>
              <select
                value={teacher2}
                onChange={(e) => setTeacher2(e.target.value)}
                style={inputStyle}
              >
                <option value="" disabled hidden>
                  Select New Coordinator
                </option>
                {teachers.map((t) => (
                  <option key={t.teacherid} value={t.teacherid}>
                    {t.name}
                  </option>
                ))}
              </select>

              <div style={{ marginTop: "1rem" }}>
                <button
                  onClick={() => {
                    handleTransferValidations(
                      teachers.find((t) => t.teacherid === teacher1),
                      teachers.find((t) => t.teacherid === teacher2)
                    ).catch((err) => {
                      console.error("Validation transfer failed:", err);
                    });

                    setShowTeacherModal(false);
                  }}
                >
                  Accept
                </button>
                <button
                  onClick={() => setShowTeacherModal(false)}
                  style={{ marginLeft: "1rem" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showDegreeForm && (
          <div style={modalStyle}>
            <div style={formStyle}>
              <h5>Add Degree</h5>
              <input
                type="text"
                placeholder="ID"
                value={newDegree.degreeid}
                onChange={(e) =>
                  setNewDegree({ ...newDegree, degreeid: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Name"
                value={newDegree.name}
                onChange={(e) =>
                  setNewDegree({ ...newDegree, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Coordinator teacher ID"
                value={newDegree.teacherid}
                onChange={(e) =>
                  setNewDegree({ ...newDegree, teacherid: e.target.value })
                }
              />
              <button onClick={() => handleAddEntry("degrees")}>Submit</button>
              <button onClick={() => setShowDegreeForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Styles
const containerStyle = { display: "flex", flexDirection: "column" };
const mainContentStyle = { flex: 1, display: "flex", flexDirection: "column" };
const navStyle = {
  display: "flex",
  justifyContent: "space-around",
  padding: "10px",
  backgroundColor: "#222",
};
const tabStyle = {
  color: "#fff",
  background: "none",
  border: "none",
  padding: "10px",
  cursor: "pointer",
};
const activeTabStyle = { color: "yellow", fontWeight: "bold" };
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
};
const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const formStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "5px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
const inputStyle = {
  padding: "8px",
  border: "1px solid #333",
  borderRadius: "4px",
};
const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "background-color 0.3s ease",
};
const formTitleStyle = { textAlign: "center", marginBottom: "20px" };
const formGroupStyle = { marginBottom: "15px" };
const labelStyle = {
  fontWeight: "bold",
  marginBottom: "5px",
  display: "block",
};
const submitButtonContainerStyle = { textAlign: "center" };

export default UniversityHomeBody;
