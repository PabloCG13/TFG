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
    teacherId VARCHAR(4) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastAccess TIMESTAMP,
    hash VARCHAR(66) NOT NULL
);

-- Create degree table
CREATE TABLE IF NOT EXISTS degree (
    uniCode VARCHAR(4) NOT NULL,
    degreeId VARCHAR(30) NOT NULL,
    name VARCHAR(50) NOT NULL,
    teacherId VARCHAR(4) NOT NULL,
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
    transcriptHash VARCHAR(66) NOT NULL,
    hash VARCHAR(66) NOT NULL
);

-- Create course table
CREATE TABLE IF NOT EXISTS course (
    uniCode VARCHAR(4) NOT NULL,
    degreeId VARCHAR(30) NOT NULL,
    courseId VARCHAR(30) NOT NULL,
    name VARCHAR(50) NOT NULL,
    credits INTEGER NOT NULL,
    period VARCHAR(30) NOT NULL,
    teacherId VARCHAR(4) NOT NULL,
    syllabus_pdf BYTEA,
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
    period VARCHAR(30) ,
    provisional INTEGER NOT NULL,
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
    erasmus INTEGER NOT NULL,
    mark INTEGER,
    lastAccess TIMESTAMP,
    teacherId VARCHAR(4),
    uniCodeSrc VARCHAR(4),
    degreeIdSrc VARCHAR(30),
    courseIdSrc VARCHAR(30),
    PRIMARY KEY (uniCode, degreeId, courseId, studentId, academicYear),
    FOREIGN KEY (uniCode, degreeId, courseId) REFERENCES course (uniCode, degreeId, courseId) ON DELETE CASCADE,
    FOREIGN KEY (uniCodeSrc, degreeIdSrc, courseIdSrc) REFERENCES course (uniCode, degreeId, courseId) ON DELETE CASCADE,
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
--Create addresses table
CREATE TABLE IF NOT EXISTS address (
    addressId VARCHAR(42) PRIMARY KEY,
    participantId VARCHAR(4)
);

-- Create validates table
CREATE TABLE IF NOT EXISTS validates (
    uniCodeSrc VARCHAR(4) NOT NULL,
    degreeIdSrc VARCHAR(30) NOT NULL,
    courseIdSrc VARCHAR(30) NOT NULL,
    uniCodeDst VARCHAR(4) NOT NULL,
    degreeIdDst VARCHAR(30) NOT NULL,
    courseIdDst VARCHAR(30) NOT NULL,
    studentId VARCHAR(30) NOT NULL,
    provisional INTEGER NOT NULL,
    PRIMARY KEY (uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst, studentId),
    FOREIGN KEY (uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst) REFERENCES validation (uniCodeSrc, degreeIdSrc, courseIdSrc, uniCodeDst, degreeIdDst, courseIdDst) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES student (studentId) ON DELETE CASCADE
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
SELECT 'S001', 'Jane Smith', TO_DATE('15/03/2000', 'DD/MM/YYYY'), '12345678A', NULL, 'transhash123', 'hashabc'
WHERE NOT EXISTS (SELECT 1 FROM student WHERE studentId = 'S001');

-- Insert course if not exists
INSERT INTO course (uniCode, degreeId, courseId, name, credits, period, teacherId)
SELECT 'U001', 'CS101', 'BP1', 'Basics of programming', 6, '1st Semester', 'T001'
WHERE NOT EXISTS (SELECT 1 FROM course WHERE uniCode = 'U001' AND degreeId = 'CS101' AND courseId = 'BP1');

-- Insert studies if not exists
INSERT INTO studies (studentId, uniCode, degreeId)
SELECT 'S001', 'U001', 'CS101'
WHERE NOT EXISTS (SELECT 1 FROM studies WHERE studentId = 'S001' AND uniCode = 'U001' AND degreeId = 'CS101');


INSERT INTO address (participantId, addressId) VALUES
('susr', '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'),
(NULL, '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'),
(NULL, '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b'),
(NULL, '0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d'),
(NULL, '0xd03ea8624C8C5987235048901fB614fDcA89b117'),
(NULL, '0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC'),
(NULL, '0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9'),
(NULL, '0x28a8746e75304c0780E011BEd21C72cD78cd535E'),
(NULL, '0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E'),
(NULL, '0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e'),
(NULL, '0x610Bb1573d1046FCb8A70Bbbd395754cD57C2b60'),
(NULL, '0x855FA758c77D68a04990E992aA4dcdeF899F654A'),
(NULL, '0xfA2435Eacf10Ca62ae6787ba2fB044f8733Ee843'),
(NULL, '0x64E078A8Aa15A41B85890265648e965De686bAE6'),
(NULL, '0x2F560290FEF1B3Ada194b6aA9c40aa71f8e95598'),
(NULL, '0xf408f04F9b7691f7174FA2bb73ad6d45fD5d3CBe'),
(NULL, '0x66FC63C2572bF3ADD0Fe5d44b97c2E614E35e9a3'),
(NULL, '0xF0D5BC18421fa04D0a2A2ef540ba5A9f04014BE3'),
(NULL, '0x325A621DeA613BCFb5B1A69a7aCED0ea4AfBD73A'),
(NULL, '0x3fD652C93dFA333979ad762Cf581Df89BaBa6795'),
(NULL, '0x73EB6d82CFB20bA669e9c178b718d770C49BB52f'),
(NULL, '0x9D8E5fAc117b15DaCED7C326Ae009dFE857621f1'),
(NULL, '0x982a8CbE734cb8c29A6a7E02a3B0e4512148F6F9'),
(NULL, '0xCDC1E53Bdc74bBf5b5F715D6327Dca5785e228B4'),
(NULL, '0xf5d1EAF516eF3b0582609622A221656872B82F78'),
(NULL, '0xf8eA26C3800D074a11bf814dB9a0735886C90197'),
(NULL, '0x2647116f9304abb9F0B7aC29aBC0D9aD540506C8'),
(NULL, '0x80a32A0E5cA81b5a236168C21532B32e3cBC95e2'),
(NULL, '0x47f55A2ACe3b84B0F03717224DBB7D0Df4351658'),
(NULL, '0xC817898296b27589230B891f144dd71A892b0C18'),
(NULL, '0x0D38e653eC28bdea5A2296fD5940aaB2D0B8875c'),
(NULL, '0x1B569e8f1246907518Ff3386D523dcF373e769B6'),
(NULL, '0xCBB025e7933FADfc7C830AE520Fb2FD6D28c1065'),
(NULL, '0xdDEEA4839bBeD92BDAD8Ec79AE4f4Bc2Be1A3974'),
(NULL, '0xBC2cf859f671B78BA42EBB65Deb31Cc7fEc07019'),
(NULL, '0xF75588126126DdF76bDc8aBA91a08f31d2567Ca5'),
(NULL, '0x369109C74ea7159E77e180f969f7D48c2bf19b4C'),
(NULL, '0xA2A628f4eEE25F5b02B0688Ad9c1290e2e9A3D9e'),
(NULL, '0x693D718cCfadE6F4A1379051D6ab998146F3173F'),
(NULL, '0x845A0F9441081779110FEE40E6d5d8b90cE676eF'),
(NULL, '0xC7739909e08A9a0F303A010d46658Bdb4d5a6786'),
(NULL, '0x99cce66d3A39C2c2b83AfCefF04c5EC56E9B2A58'),
(NULL, '0x4b930E7b3E491e37EaB48eCC8a667c59e307ef20'),
(NULL, '0x02233B22860f810E32fB0751f368fE4ef21A1C05'),
(NULL, '0x89c1D413758F8339Ade263E6e6bC072F1d429f32'),
(NULL, '0x61bBB5135b43F03C96570616d6d3f607b7103111'),
(NULL, '0x8C4cE7a10A4e38EE96feD47C628Be1FfA57Ab96e'),
(NULL, '0x25c1230C7EFC00cFd2fcAA3a44f30948853824bc'),
(NULL, '0x709F7Ae06Fe93be48FbB90FFDDd69e2746FA8506'),
(NULL, '0xc0514C03D097fCbB77a74B4DA5b594bA473b6CE1'),
(NULL, '0x103b31135D99417A22684ED93cbbCD4ccD208046'),
(NULL, '0xf8856d473639e40f60db8979F5752A9c15903Bb2'),
(NULL, '0x753897706061FDE347465055FcAc4bd040745624'),
(NULL, '0x7cd15A5d345558A203655e40B1afb14F936C73f7'),
(NULL, '0x7d8Ae65273B9D1E6B239b36aF9AdEA0414D189B7'),
(NULL, '0x05a561F51a2D8A092B11e20C72b5dF15A9D82278'),
(NULL, '0x80030beCa8292f416E7906535668475c75d9c47E'),
(NULL, '0xeDA51422804340e3Dc0DD9b6D441125b5C7Cf3FF'),
(NULL, '0xE21812faA737FF0eEec268f509ACb306BC735feC'),
(NULL, '0x4d85247717Cf8621D7894F36De35E8B6B6d384BC'),
(NULL, '0x19b2d46091Dd332F0753dAbf0CF8304cf61eD1c5'),
(NULL, '0x42c7c045729a84f8e65239308cA8279D6fb21c89'),
(NULL, '0xEeD15Bb091bf3F615400f6F8160aC423EaF6a413'),
(NULL, '0x0F6F0ecfAB78f8E54B130E3b3EBd88B3613c97D1'),
(NULL, '0x33A053885A8232eD78D688B43a405587ba446e5E'),
(NULL, '0x4397655dDd031043Eb0859AD7A90c3c889E12A4d'),
(NULL, '0x6E57514B1997029500C13007A59fb6da1CeAc7C4'),
(NULL, '0x85c38d25744f02619047B76195EcF835554F70Bc'),
(NULL, '0x69901C8c4263A0368c19D3Cd9dC51B09BeC4C4b1'),
(NULL, '0x256DD44a34478AceC9A7da479DBcf0C3C599AD55'),
(NULL, '0x61f41c87113e04B32eB8FbaA4946b1ef98479756'),
(NULL, '0xA8BA9dEa29234Be7504fAE477d2f6B1fd1078D46'),
(NULL, '0x831c50Ac59c3794185fABAe289D3a5bA8B09403C'),
(NULL, '0xc8f2d6111bc7207c25eB4f944cb29F0E851a8541'),
(NULL, '0xBcA6ebD43DCB10851F398b4CB8FbAdE3133b2c45'),
(NULL, '0x856C1365488375d21875f80d6045C956E47Ed5eC'),
(NULL, '0x356780865cD279e4D2dC6d99B32eDA8FD8E8A39c'),
(NULL, '0x1baEC60a021C5e26a1071776A1549C45C79951d5'),
(NULL, '0x8155EB275eA6Ebd0d572a44087C948b02d794013'),
(NULL, '0x6a8bBdB024861739B0DCD1700c8b8F603f1cf7c6'),
(NULL, '0xB890C74caA6C052Db376837E67F0476589991922'),
(NULL, '0xd5B6d6b730b1C1be10b82a0A1c89f1Db24f752C3'),
(NULL, '0x2A828ADcc1a3647DBA43eD05375a4d0B00eEA789'),
(NULL, '0x624a97293d8cea5ca78D538aC6599e4051a19174'),
(NULL, '0xE7a3eBbA0647Fb07D0b21927305aA95284316993'),
(NULL, '0xd74485a6600d8dE95d84d5E1747480c528Df1f9a'),
(NULL, '0x3B1Cb706E5fff494Da8873aD9C1A30aa802f4522'),
(NULL, '0xfBDB66Ae3FA6F1B37A02c82751117FC3Aad4572b'),
(NULL, '0x4F92c13CACF198eB25698709e3d225E6A2E22Dd8'),
(NULL, '0x18282Ec61C35bef47698C3E65314C9A0ff617b3c'),
(NULL, '0xAfa5e9d58e245b7F3efECC9e706B06D52Cd28Da1'),
(NULL, '0xd32115D6e4a4DFdf0807544723D514E3F293D3B6'),
(NULL, '0x56Fa56dc28081f6353737061e2278631B2659598'),
(NULL, '0x3Fae75Cce89a972FA1b6d87Bb080fb2c6060F0B3'),
(NULL, '0xa9F913312b7ec75f755c4f3EdB6e2BBd3526b918'),
(NULL, '0x1f627b7Fb483E5B8d59aa191FEc94D01753c7d24'),
(NULL, '0xb45dE3796b206793E8aD3509202Da91D35E9A6d9'),
(NULL, '0x17332DD7f9BD584E2E83f4cFfdCA0a448B3B903a'),
(NULL, '0x9d7822d5bB9f7b9b655669550095d2F14AFaC469'),
(NULL, '0x4C0408DB276Ef793333BAF5B226d8b180c3D0A89');
