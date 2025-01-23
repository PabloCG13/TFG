alter session
set nls_date_format
='DD/MM/YYYY HH24:MI:SS';
SET SERVEROUTPUT ON;
SET LINESIZE 500;
SET PAGESIZE 500;

DROP TABLE studies;
DROP TABLE transcript;
DROP TABLE validation;
DROP TABLE course;

DROP TABLE student;
DROP TABLE degree;
DROP TABLE teacher;
DROP TABLE university;


CREATE TABLE university
(
    uniCode VARCHAR2(4) PRIMARY KEY,
    name VARCHAR2(30) NOT NULL,
    location VARCHAR2(30) NOT NULL,
    hash VARCHAR2(30) NOT NULL
);

CREATE TABLE teacher
(
    teacherID VARCHAR2(10) PRIMARY KEY,
    name VARCHAR2(30) NOT NULL,
    lastAccess DATE,
    hash VARCHAR2(30) NOT NULL
);

CREATE TABLE degree
(
    uniCode VARCHAR2(4) NOT NULL,
    degreeId VARCHAR2(30) NOT NULL,
    name VARCHAR2(30) NOT NULL,
    teacherID VARCHAR2(10) NOT NULL,
    PRIMARY KEY (uniCode, degreeId),
    FOREIGN KEY (uniCode) REFERENCES university (uniCode),
    FOREIGN KEY (teacherID) REFERENCES teacher (teacherID)
);

CREATE TABLE student
(
    studentID VARCHAR2(4) PRIMARY KEY,
    name VARCHAR2(30) NOT NULL,
    dob DATE NOT NULL,
    lastAccess DATE,
    transcriptHash VARCHAR2(30) NOT NULL,
    hash VARCHAR2(30) NOT NULL
);

CREATE TABLE course
(
    uniCode VARCHAR2(4) NOT NULL,
    degreeId VARCHAR2(30) NOT NULL,
    courseId VARCHAR2(30) NOT NULL,
    name VARCHAR2(30) NOT NULL,
    content VARCHAR2(100) NOT NULL,
    credits INTEGER NOT NULL,
    period VARCHAR2(30) NOT NULL,
    teacherID VARCHAR2(10) NOT NULL,
    PRIMARY KEY (uniCode, degreeId, courseId),
    FOREIGN KEY (uniCode,degreeId) REFERENCES degree (uniCode, degreeId),
    FOREIGN KEY (teacherID) REFERENCES teacher (teacherID)
);

CREATE TABLE validation
(
    uniCodeSrc VARCHAR2(4) NOT NULL,
    degreeIdSrc VARCHAR2(30) NOT NULL,
    courseIdSrc VARCHAR2(30) NOT NULL,
    uniCodeDst VARCHAR2(4) NOT NULL,
    degreeIdDst VARCHAR2(30) NOT NULL,
    courseIdDst VARCHAR2(30) NOT NULL,
    token VARCHAR2(64) NOT NULL,
    period VARCHAR2(30) NOT NULL,
    PRIMARY KEY (uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst),
    FOREIGN KEY (uniCodeSrc, degreeIdSrc, courseIdSrc) REFERENCES course (uniCode, degreeId,courseId),
    FOREIGN KEY (uniCodeDst, degreeIdDst, courseIdDst) REFERENCES course (uniCode, degreeId,courseId)
);

CREATE TABLE transcript
(
    uniCode VARCHAR2(4) NOT NULL,
    degreeId VARCHAR2(30) NOT NULL,
    courseId VARCHAR2(30) NOT NULL,
    studentID VARCHAR2(4) NOT NULL,
    academicYear VARCHAR2(30) NOT NULL,
    provisional INTEGER NOT NULL,
    mark INTEGER NOT NULL,
    lastAccess DATE,
    teacherID VARCHAR2(10),
    PRIMARY KEY (uniCode, degreeId, courseId, studentID, academicYear),
    FOREIGN KEY (uniCode, degreeId, courseId) REFERENCES course (uniCode, degreeId,courseId),
    FOREIGN KEY (studentID) REFERENCES student (studentID),
    FOREIGN KEY (teacherID) REFERENCES teacher (teacherID)
);

CREATE TABLE studies
(
    studentID VARCHAR2(4) NOT NULL,
    uniCode VARCHAR2(4) NOT NULL,
    degreeId VARCHAR2(30) NOT NULL,
    PRIMARY KEY (studentID, uniCode, degreeId),
    FOREIGN KEY (studentID) REFERENCES student (studentID),
    FOREIGN KEY (uniCode, degreeId) REFERENCES degree (uniCode, degreeId)
);

