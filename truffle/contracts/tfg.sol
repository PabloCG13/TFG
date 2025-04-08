// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./token.sol";
contract tfg {
    struct Transcript {
        address[] teachers;
        mapping(address => bool) teacherExists;
        string hash;
    }

    struct Person {
        string hash;
        uint role; // 0:does not exists, 1:student, 2:course coordinator, 3:degree coordinator
    }

    MiNFT public validations;
    mapping(address => Person) public personToHash;
    mapping(address => string) public universityToHash;
    mapping(address => Transcript) public studentToRecord;
    address private _owner;
    int public isInitialized = 0;

    constructor() {
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Not the contract owner");
        _;
    }

    modifier participantExists(address participant) {
        require(
            personToHash[participant].role != 0,
            "Participant does not exist"
        );
        _;
    }

    modifier participantNotExists(address participant) {
        require(
            personToHash[participant].role == 0,
            "Participant does not exist"
        );
        _;
    }

    modifier participantIsStudent(address participant) {
        require(
            personToHash[participant].role == 1,
            "Participant is not a student"
        );
        _;
    }
    /*
    modifier participantIsCourseCoord(address participant) {
        require(
            personToHash[participant].role == 2,
            "Participant is not a course Coordinator"
        );
        _;
    }
*/
    modifier participantIsDegreeCoord(address participant) {
        require(
            personToHash[participant].role == 3,
            "Participant is not a degree Coordinator"
        );
        _;
    }

    modifier participantIsTeacher(address participant) {
        require(
            personToHash[participant].role == 2 ||
                personToHash[participant].role == 3,
            "Participant is not a teacher"
        );
        _;
    }

    modifier universityExists(address participant) {
        require(
            bytes(universityToHash[participant]).length != 0,
            "University does not exist"
        );
        _;
    }

    modifier universityNotExists(address participant) {
        require(
            bytes(universityToHash[participant]).length == 0,
            "University already exists"
        );
        _;
    }

    modifier doesTeacherHaveAccess(address student, address teacher) {
        require(
            studentToRecord[student].teacherExists[teacher] == true,
            "Coordinator can not modify this transcript"
        );
        _;
    }

    event ParticipantAdded(string message);
    event ValidationAdded(uint tokenId);

    function addUniversity(
        string memory hash,
        address participant
    ) public onlyOwner universityNotExists(participant) {
        universityToHash[participant] = hash;
        emit ParticipantAdded(
            "Se ha anadido una nueva universidad correctamente"
        );
    }

    function addParticipant(
        string memory _hash,
        address participant,
        uint _role
    ) public universityExists(msg.sender) participantNotExists(participant) {
        personToHash[participant].hash = _hash;
        personToHash[participant].role = _role;
        emit ParticipantAdded(
            "Se ha anadido un nuevo participante correctamente"
        );
    }

    function getParticipantHash(address participant) public view participantExists(participant) returns(string memory){
        return personToHash[participant].hash;
    }

    function changeParticipant(
        string memory _hash
    ) public participantExists(msg.sender) {
        personToHash[msg.sender].hash = _hash;
    }

    function calculateSHA256(
        string memory user,
        string memory passwd
    ) public pure returns (bytes32) {
        return sha256(abi.encodePacked(user, passwd));
    }

    /*   function stringToBytes32(string memory s) public pure returns (bytes32) {
        require(bytes(s).length == 66, "Invalid input length"); // "0x" + 64 hex chars

        bytes memory b = bytes(s);
        bytes32 result;

        for (uint i = 0; i < 32; i++) {
            result |=
                bytes32(
                    uint256(hexCharToByte(b[2 + i * 2])) *
                        16 +
                        uint256(hexCharToByte(b[3 + i * 2]))
                ) >>
                (i * 8);
        }
        return result;
    }

    function hexCharToByte(bytes1 c) private pure returns (uint8) {
        if (c >= "0" && c <= "9") {
            return uint8(c) - 48;
        } else if (c >= "a" && c <= "f") {
            return uint8(c) - 87;
        } else if (c >= "A" && c <= "F") {
            return uint8(c) - 55;
        } else {
            revert("Invalid hex character");
        }
    }
*/
    function bytes32ToString(
        bytes32 _bytes32
    ) public pure returns (string memory) {
        bytes memory s = new bytes(64);
        bytes memory hexChars = "0123456789abcdef";

        for (uint i = 0; i < 32; i++) {
            s[i * 2] = hexChars[uint8(_bytes32[i]) >> 4]; // High nibble
            s[i * 2 + 1] = hexChars[uint8(_bytes32[i]) & 0x0f]; // Low nibble
        }

        return string(abi.encodePacked("0x", s));
    }

    /*  function test() public view returns (bytes32) {
        return stringToBytes32(personToHash[msg.sender].hash);
    }
*/
    function compareStrings(
        string memory a,
        string memory b
    ) private pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
    function consultParticipant(
        string memory user,
        string memory passwd,
        uint role
    ) public view participantExists(msg.sender) returns (bool) {
        bytes32 generatedHash = sha256(abi.encodePacked(user, passwd));
        string memory storedHash = bytes32ToString(generatedHash);

        return compareStrings(storedHash, personToHash[msg.sender].hash) && role == personToHash[msg.sender].role;
    }

    function consultUniversity(
        string memory user,
        string memory passwd
    ) public view universityExists(msg.sender) returns (bool) {
        bytes32 generatedHash = sha256(abi.encodePacked(user, passwd));
        string memory storedHash = bytes32ToString(generatedHash);

        return compareStrings(storedHash, universityToHash[msg.sender]); // Convertir string a bytes32

        /* return
            keccak256(abi.encodePacked(universityToHash[msg.sender])) ==
            generatedHash;

        keccak256(abi.encodePacked(personToHash[msg.sender])) ==
            keccak256(abi.encodePacked(user, passwd, "random_salt_value"));*/
    }

    function addTeacherToTranscript(
        address student,
        address profesor
    ) public universityExists(msg.sender) participantIsTeacher(profesor) {
        require(
            !studentToRecord[student].teacherExists[profesor],
            "Teacher already added"
        );
        studentToRecord[student].teachers.push(profesor);
        studentToRecord[student].teacherExists[profesor] = true;
    }

    function getAllowedTeachers(
        address student
    ) public view returns (address[] memory) {
        return studentToRecord[student].teachers;
    }

    function updateMark(
        string memory hash,
        address participant
    )
        public
        participantIsTeacher(msg.sender)
        participantIsStudent(participant)
        doesTeacherHaveAccess(participant, msg.sender)
    {
        studentToRecord[participant].hash = hash;
    }

    function updateTranscript(
        string memory hash,
        address participant
    ) public universityExists(msg.sender) participantIsStudent(participant) {
        studentToRecord[participant].hash = hash;
    }

    function getTranscriptHash(address participant) public view participantIsStudent(participant) returns(string memory){
        return studentToRecord[participant].hash;
    }

    function isTranscriptHashEqual(string memory newHash) public view participantIsStudent(msg.sender) returns(bool){
        return compareStrings(newHash, studentToRecord[msg.sender].hash);
    }

    function removeParticipant(
        address participant
    ) public onlyOwner participantExists(participant) {
        delete personToHash[participant];
    }

    function createValidation() public onlyOwner {
        require(isInitialized == 0, "Already Initialized");
    
        validations = new MiNFT(msg.sender);
        isInitialized = 1;
    }

    function setValidation(address tk) public onlyOwner {
        validations = MiNFT(tk);
    }

    function addValidation(
        address degreeCoord,
        string memory srcCourse,
        string memory dstCourse,
        uint8 month,
        uint16 year
    ) public onlyOwner participantIsDegreeCoord(degreeCoord) returns (uint) {
        uint id = validations.mintNFT(
            msg.sender,
            degreeCoord,
            srcCourse,
            dstCourse
        );

        validations.setValidityPeriod(degreeCoord, id, month, year);
        emit ValidationAdded(id);
        return id;
    }

    function updateValidation(
        uint id,
        uint8 month,
        uint16 year
    ) public participantIsDegreeCoord(msg.sender) {
        validations.setValidityPeriod(msg.sender, id, month, year);
    }

    function transferValidation(
        uint id,
        address origin,
        address destination
    )
        public
        universityExists(msg.sender)
        participantIsDegreeCoord(origin)
        participantIsDegreeCoord(destination)
    {
        validations.transferValidity(id, origin, destination);
    }
}
