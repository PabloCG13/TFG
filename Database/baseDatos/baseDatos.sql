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
    name VARCHAR2(50) NOT NULL,
    location VARCHAR2(30) NOT NULL,
    hash VARCHAR2(40) NOT NULL
);

CREATE TABLE teacher
(
    teacherId VARCHAR2(10) PRIMARY KEY,
    name VARCHAR2(50) NOT NULL,
    lastAccess DATE,
    hash VARCHAR2(40) NOT NULL
);

CREATE TABLE degree
(
    uniCode VARCHAR2(4) NOT NULL,
    degreeId VARCHAR2(30) NOT NULL,
    name VARCHAR2(50) NOT NULL,
    teacherId VARCHAR2(10) NOT NULL,
    PRIMARY KEY (uniCode, degreeId),
    FOREIGN KEY (uniCode) REFERENCES university (uniCode),
    FOREIGN KEY (teacherId) REFERENCES teacher (teacherId)
);

CREATE TABLE student
(
    studentId VARCHAR2(4) PRIMARY KEY,
    name VARCHAR2(50) NOT NULL,
    dob DATE NOT NULL,
    lastAccess DATE,
    transcriptHash VARCHAR2(30) NOT NULL,
    hash VARCHAR2(40) NOT NULL
);

CREATE TABLE course
(
    uniCode VARCHAR2(4) NOT NULL,
    degreeId VARCHAR2(30) NOT NULL,
    courseId VARCHAR2(30) NOT NULL,
    name VARCHAR2(50) NOT NULL,
    content VARCHAR2(100) NOT NULL,
    credits INTEGER NOT NULL,
    period VARCHAR2(30) NOT NULL,
    teacherId VARCHAR2(10) NOT NULL,
    PRIMARY KEY (uniCode, degreeId, courseId),
    FOREIGN KEY (uniCode,degreeId) REFERENCES degree (uniCode, degreeId),
    FOREIGN KEY (teacherId) REFERENCES teacher (teacherId)
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
    FOREIGN KEY (uniCodeSrc, degreeIdSrc, courseIdSrc) REFERENCES course (uniCode, degreeId, courseId),
    FOREIGN KEY (uniCodeDst, degreeIdDst, courseIdDst) REFERENCES course (uniCode, degreeId, courseId)
);

CREATE TABLE transcript
(
    uniCode VARCHAR2(4) NOT NULL,
    degreeId VARCHAR2(30) NOT NULL,
    courseId VARCHAR2(30) NOT NULL,
    studentId VARCHAR2(4) NOT NULL,
    academicYear VARCHAR2(30) NOT NULL,
    provisional INTEGER NOT NULL,
    mark INTEGER,
    lastAccess DATE,
    teacherId VARCHAR2(10),
    PRIMARY KEY (uniCode, degreeId, courseId, studentId, academicYear),
    FOREIGN KEY (uniCode, degreeId, courseId) REFERENCES course (uniCode, degreeId, courseId),
    FOREIGN KEY (studentId) REFERENCES student (studentId),
    FOREIGN KEY (teacherId) REFERENCES teacher (teacherId)
);

CREATE TABLE studies
(
    studentId VARCHAR2(4) NOT NULL,
    uniCode VARCHAR2(4) NOT NULL,
    degreeId VARCHAR2(30) NOT NULL,
    PRIMARY KEY (studentId, uniCode, degreeId),
    FOREIGN KEY (studentId) REFERENCES student (studentId),
    FOREIGN KEY (uniCode, degreeId) REFERENCES degree (uniCode, degreeId)
);

INSERT INTO university
    (uniCode, name, location, hash)
VALUES
    ('U001', 'Complutense', 'Spain', 'hash12345');

INSERT INTO teacher
    (teacherId, name, lastAccess, hash)
VALUES
    ('T001', 'John Doe', TO_DATE('01/01/2025 12:00:00', 'DD/MM/YYYY HH24:MI:SS'), 'hash67890');

INSERT INTO degree
    (uniCode, degreeId, name, teacherId)
VALUES
    ('U001', 'CS101', 'Computer Science', 'T001');

INSERT INTO student
    (studentId, name, dob, lastAccess, transcriptHash, hash)
VALUES
    ('S001', 'Jane Smith', TO_DATE('15/03/2000', 'DD/MM/YYYY'), NULL, 'transhash123', 'hashabc');

INSERT INTO course
    (uniCode, degreeId, courseId, name, content, credits, period, teacherId)
VALUES
    ('U001', 'CS101', 'BP1', 'Basics of programming', 'Content', 6, '1st Semester', 'T001');

INSERT INTO studies
    (studentId, uniCode, degreeId)
VALUES
    ('S001', 'U001', 'CS101');
