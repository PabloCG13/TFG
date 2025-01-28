
DROP TABLE studies;
DROP TABLE transcript;
DROP TABLE validation;
DROP TABLE course;

DROP TABLE student;
DROP TABLE degree;
DROP TABLE teacher;
DROP TABLE university;

-- @block
CREATE TABLE university
(
    uniCode VARCHAR(4) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(30) NOT NULL,
    hash VARCHAR(40) NOT NULL
);

-- @block
INSERT INTO university
    (uniCode, name, location, hash)
VALUES
    ('UCM', 'Universisad Complutense de Madrid', 'Spain', 'hash12345'),
    ('UPM', 'Universidad Politecnica de Madrid', 'Spain', 'hash12345'),
    ('BKR', 'University of Berkerley', 'USA', 'hash12345');


-- @block
SELECT * FROM university;

-- @block
CREATE TABLE teacher
(
    teacherId VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastAccess DATE,
    hash VARCHAR(40) NOT NULL
);

-- @block
CREATE TABLE degree
(
    uniCode VARCHAR(4) NOT NULL,
    degreeId VARCHAR(30) NOT NULL,
    name VARCHAR(50) NOT NULL,
    teacherId VARCHAR(10) NOT NULL,
    PRIMARY KEY (uniCode, degreeId),
    FOREIGN KEY (uniCode) REFERENCES university (uniCode),
    FOREIGN KEY (teacherId) REFERENCES teacher (teacherId)
);

-- @block
CREATE TABLE student
(
    studentId VARCHAR(4) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    lastAccess DATE,
    transcriptHash VARCHAR(40) NOT NULL,
    hash VARCHAR(40) NOT NULL
);

-- @block
CREATE TABLE course
(
    uniCode VARCHAR(4) NOT NULL,
    degreeId VARCHAR(30) NOT NULL,
    courseId VARCHAR(30) NOT NULL,
    name VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    credits INTEGER NOT NULL,
    period VARCHAR(30) NOT NULL,
    teacherId VARCHAR(10) NOT NULL,
    PRIMARY KEY (uniCode, degreeId, courseId),
    FOREIGN KEY (uniCode,degreeId) REFERENCES degree (uniCode, degreeId),
    FOREIGN KEY (teacherId) REFERENCES teacher (teacherId)
);

-- @block
CREATE TABLE validation
(
    uniCodeSrc VARCHAR(4) NOT NULL,
    degreeIdSrc VARCHAR(30) NOT NULL,
    courseIdSrc VARCHAR(30) NOT NULL,
    uniCodeDst VARCHAR(4) NOT NULL,
    degreeIdDst VARCHAR(30) NOT NULL,
    courseIdDst VARCHAR(30) NOT NULL,
    token VARCHAR(64) NOT NULL,
    period VARCHAR(30) NOT NULL,
    PRIMARY KEY (uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst),
    FOREIGN KEY (uniCodeSrc, degreeIdSrc, courseIdSrc) REFERENCES course (uniCode, degreeId, courseId),
    FOREIGN KEY (uniCodeDst, degreeIdDst, courseIdDst) REFERENCES course (uniCode, degreeId, courseId)
);

-- @block
CREATE TABLE transcript
(
    uniCode VARCHAR(4) NOT NULL,
    degreeId VARCHAR(30) NOT NULL,
    courseId VARCHAR(30) NOT NULL,
    studentId VARCHAR(4) NOT NULL,
    academicYear VARCHAR(30) NOT NULL,
    provisional INTEGER NOT NULL,
    mark INTEGER,
    lastAccess DATE,
    teacherId VARCHAR(10),
    PRIMARY KEY (uniCode, degreeId, courseId, studentId, academicYear),
    FOREIGN KEY (uniCode, degreeId, courseId) REFERENCES course (uniCode, degreeId, courseId),
    FOREIGN KEY (studentId) REFERENCES student (studentId),
    FOREIGN KEY (teacherId) REFERENCES teacher (teacherId)
);

-- @block
CREATE TABLE studies
(
    studentId VARCHAR(4) NOT NULL,
    uniCode VARCHAR(4) NOT NULL,
    degreeId VARCHAR(30) NOT NULL,
    PRIMARY KEY (studentId, uniCode, degreeId),
    FOREIGN KEY (studentId) REFERENCES student (studentId),
    FOREIGN KEY (uniCode, degreeId) REFERENCES degree (uniCode, degreeId)
);


-- @block
INSERT INTO teacher
    (teacherId, name, lastAccess, hash)
VALUES
    ('T001', 'John Doe', STR_TO_DATE('01/01/2025 12:00:00', '%d/%m/%Y %H:%i:%s'), 'hash67890'),
    ('T002', 'Jane Doe', STR_TO_DATE('01/01/2025 12:00:00', '%d/%m/%Y %H:%i:%s'), 'hash67890');

INSERT INTO degree
    (uniCode, degreeId, name, teacherId)
VALUES
    ('UCM', 'CS101', 'Computer Science', 'T001'),
    ('UPM', 'CS101', 'Computer Science', 'T002')
    ;

INSERT INTO student
    (studentId, name, dob, lastAccess, transcriptHash, hash)
VALUES
    ('S001', 'Jane Smith', STR_TO_DATE('15/03/2000', '%d/%m/%Y'), NULL, 'transhash123', 'hashabc'),
    ('S002', 'Luis Lopez', STR_TO_DATE('20/07/2002', '%d/%m/%Y'), NULL, 'transhash123', 'hashabc');

INSERT INTO course
    (uniCode, degreeId, courseId, name, content, credits, period, teacherId)
VALUES
    ('UCM', 'CS101', 'FP1', 'Fundamentals of programming', 'Content', 6, '1st Semester', 'T001'),
    ('UPM', 'CS101', 'BP1', 'Basics of programming', 'Content', 6, '1st Semester', 'T002');

INSERT INTO studies
    (studentId, uniCode, degreeId)
VALUES
    ('S001', 'UCM', 'CS101'),
    ('S002', 'UPM', 'CS101');



-- @block
SELECT * FROM course;  
  
-- @block
SELECT * FROM degree;

-- @block
SELECT * FROM student