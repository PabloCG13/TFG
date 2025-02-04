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
    // como saber que address le corresponde a cada persona: hacer otro mapa que tenga como clave el hash y como valor el address?
    mapping(address => string) public universityToHash;
    mapping(address => Transcript) public studentToRecord;
    address private _owner;

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

    modifier participantIsCourseCoord(address participant) {
        require(
            personToHash[participant].role == 2,
            "Participant is not a course Coordinator"
        );
        _;
    }

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

    event ParticipantAdded(string message);

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

    function calculateSHA256(
        string memory user,
        string memory passwd
    ) public pure returns (bytes32) {
        return sha256(abi.encodePacked(user, passwd));
    }

    function hexStringToBytes32(string memory s) public pure returns (bytes32) {
        require(
            bytes(s).length == 66,
            "Hex string must be 66 chars (0x + 64 hex chars)"
        );

        bytes memory b = bytes(s);
        bytes32 result;

        assembly {
            result := mload(add(b, 32))
        }

        return result;
    }

    function test() public view returns (bytes32) {
        return hexStringToBytes32(universityToHash[msg.sender]);
    }

    function consultParticipant(
        string memory user,
        string memory passwd
    ) public view participantExists(msg.sender) returns (bool) {
        bytes32 generatedHash = sha256(abi.encodePacked(user, passwd));
        bytes32 storedHash = hexStringToBytes32(personToHash[msg.sender].hash);

        return storedHash == generatedHash;
    }

    function consultUniversity(
        string memory user,
        string memory passwd
    ) public view universityExists(msg.sender) returns (bool) {
        bytes32 generatedHash = sha256(abi.encodePacked(user, passwd));
        bytes32 storedHash = hexStringToBytes32(universityToHash[msg.sender]); // Convertir string a bytes32

        return storedHash == generatedHash;
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
    {
        personToHash[participant].hash = hash;
    }

    function updateTranscript(
        string memory hash,
        address participant
    ) public universityExists(msg.sender) participantIsStudent(participant) {
        personToHash[participant].hash = hash;
    }

    function removeParticipant(
        address participant
    ) public onlyOwner participantExists(participant) {
        delete personToHash[participant];
    }

    function createValidation() public onlyOwner {
        validations = new MiNFT(msg.sender);
    }

    function addValidation(
        address degreeCoord,
        string memory srcCourse,
        string memory dstCourse,
        uint8 month,
        uint16 year
    ) public onlyOwner participantIsDegreeCoord(degreeCoord) returns (uint) {
        uint id = validations.mintNFT(degreeCoord, srcCourse, dstCourse);
        validations.setValidityPeriod(id, month, year);
        return id;
    }

    function updateValidation(
        uint id,
        uint8 month,
        uint16 year
    ) public participantIsDegreeCoord(msg.sender) {
        validations.setValidityPeriod(id, month, year);
    }

    function transferValidations(
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
