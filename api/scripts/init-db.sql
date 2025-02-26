-- Set timestamp format for PostgreSQL
SET datestyle = 'ISO, DMY';


-- Create university table
CREATE TABLE IF NOT EXISTS university (
    uniCode VARCHAR(4) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(30) NOT NULL,
    hash VARCHAR(66) NOT NULL
);

-- Create teacher table
CREATE TABLE IF NOT EXISTS teacher (
    teacherId VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastAccess TIMESTAMP,
    hash VARCHAR(66) NOT NULL
);

-- Create degree table
CREATE TABLE IF NOT EXISTS degree (
    uniCode VARCHAR(4) NOT NULL,
    degreeId VARCHAR(30) NOT NULL,
    name VARCHAR(50) NOT NULL,
    teacherId VARCHAR(10) NOT NULL,
    PRIMARY KEY (uniCode, degreeId),
    FOREIGN KEY (uniCode) REFERENCES university (uniCode) ON DELETE CASCADE,
    FOREIGN KEY (teacherId) REFERENCES teacher (teacherId) ON DELETE SET NULL
);

-- Create student table
CREATE TABLE IF NOT EXISTS student (
    studentId VARCHAR(4) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    dni VARCHAR(9) NOT NULL,
    lastAccess TIMESTAMP,
    transcriptHash VARCHAR(30) NOT NULL,
    hash VARCHAR(66) NOT NULL
);

-- Create course table
CREATE TABLE IF NOT EXISTS course (
    uniCode VARCHAR(4) NOT NULL,
    degreeId VARCHAR(30) NOT NULL,
    courseId VARCHAR(30) NOT NULL,
    name VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    credits INTEGER NOT NULL,
    period VARCHAR(30) NOT NULL,
    teacherId VARCHAR(10) NOT NULL,
    PRIMARY KEY (uniCode, degreeId, courseId),
    FOREIGN KEY (uniCode, degreeId) REFERENCES degree (uniCode, degreeId) ON DELETE CASCADE,
    FOREIGN KEY (teacherId) REFERENCES teacher (teacherId) ON DELETE SET NULL
);

-- Create validation table
CREATE TABLE IF NOT EXISTS validation (
    uniCodeSrc VARCHAR(4) NOT NULL,
    degreeIdSrc VARCHAR(30) NOT NULL,
    courseIdSrc VARCHAR(30) NOT NULL,
    uniCodeDst VARCHAR(4) NOT NULL,
    degreeIdDst VARCHAR(30) NOT NULL,
    courseIdDst VARCHAR(30) NOT NULL,
    token VARCHAR(64) NOT NULL,
    period VARCHAR(30) NOT NULL,
    PRIMARY KEY (uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst),
    FOREIGN KEY (uniCodeSrc, degreeIdSrc, courseIdSrc) REFERENCES course (uniCode, degreeId, courseId) ON DELETE CASCADE,
    FOREIGN KEY (uniCodeDst, degreeIdDst, courseIdDst) REFERENCES course (uniCode, degreeId, courseId) ON DELETE CASCADE
);

-- Create transcript table
CREATE TABLE IF NOT EXISTS transcript (
    uniCode VARCHAR(4) NOT NULL,
    degreeId VARCHAR(30) NOT NULL,
    courseId VARCHAR(30) NOT NULL,
    studentId VARCHAR(4) NOT NULL,
    academicYear VARCHAR(30) NOT NULL,
    provisional INTEGER NOT NULL,
    mark INTEGER,
    lastAccess TIMESTAMP,
    teacherId VARCHAR(10),
    PRIMARY KEY (uniCode, degreeId, courseId, studentId, academicYear),
    FOREIGN KEY (uniCode, degreeId, courseId) REFERENCES course (uniCode, degreeId, courseId) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES student (studentId) ON DELETE CASCADE,
    FOREIGN KEY (teacherId) REFERENCES teacher (teacherId) ON DELETE SET NULL
);

-- Create studies table
CREATE TABLE IF NOT EXISTS studies (
    studentId VARCHAR(4) NOT NULL,
    uniCode VARCHAR(4) NOT NULL,
    degreeId VARCHAR(30) NOT NULL,
    PRIMARY KEY (studentId, uniCode, degreeId),
    FOREIGN KEY (studentId) REFERENCES student (studentId) ON DELETE CASCADE,
    FOREIGN KEY (uniCode, degreeId) REFERENCES degree (uniCode, degreeId) ON DELETE CASCADE
);

-- Insert university if not exists
INSERT INTO university (uniCode, name, location, hash)
SELECT 'U001', 'Complutense', 'Spain', 'hash12345'
WHERE NOT EXISTS (SELECT 1 FROM university WHERE uniCode = 'U001');

-- Insert teacher if not exists
INSERT INTO teacher (teacherId, name, lastAccess, hash)
SELECT 'T001', 'John Doe', TO_TIMESTAMP('01/01/2025 12:00:00', 'DD/MM/YYYY HH24:MI:SS'), 'hash67890'
WHERE NOT EXISTS (SELECT 1 FROM teacher WHERE teacherId = 'T001');

-- Insert degree if not exists
INSERT INTO degree (uniCode, degreeId, name, teacherId)
SELECT 'U001', 'CS101', 'Computer Science', 'T001'
WHERE NOT EXISTS (SELECT 1 FROM degree WHERE uniCode = 'U001' AND degreeId = 'CS101');

-- Insert student if not exists
INSERT INTO student (studentId, name, dob, dni, lastAccess, transcriptHash, hash)
SELECT 'S001', 'Jane Smith', TO_DATE('15/03/2000', 'DD/MM/YYYY'), "0123456J", NULL, 'transhash123', 'hashabc'
WHERE NOT EXISTS (SELECT 1 FROM student WHERE studentId = 'S001');

-- Insert course if not exists
INSERT INTO course (uniCode, degreeId, courseId, name, content, credits, period, teacherId)
SELECT 'U001', 'CS101', 'BP1', 'Basics of programming', 'Content', 6, '1st Semester', 'T001'
WHERE NOT EXISTS (SELECT 1 FROM course WHERE uniCode = 'U001' AND degreeId = 'CS101' AND courseId = 'BP1');

-- Insert studies if not exists
INSERT INTO studies (studentId, uniCode, degreeId)
SELECT 'S001', 'U001', 'CS101'
WHERE NOT EXISTS (SELECT 1 FROM studies WHERE studentId = 'S001' AND uniCode = 'U001' AND degreeId = 'CS101');
