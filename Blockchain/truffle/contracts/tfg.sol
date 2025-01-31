// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract tfg {
    struct Expediente {
        address[] profesores;
        mapping(address => bool) profesorExiste;
        string hash;
    }

    mapping(address => string) public personToHash;
    mapping(address => string) public universityToHash;
    mapping(address => Expediente) public studentToRecord;
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
            bytes(personToHash[participant]).length != 0,
            "Participant does not exist"
        );
        _;
    }

    modifier participantNotExists(address participant) {
        require(
            bytes(personToHash[participant]).length == 0,
            "Participant does not exist"
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
        string memory hash,
        address participant
    ) public universityExists(msg.sender) participantNotExists(participant) {
        personToHash[participant] = hash;
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

    function consultParticipant(
        string memory user,
        string memory passwd
    ) public view participantExists(msg.sender) returns (bool) {
        bytes32 generatedHash = sha256(abi.encodePacked(user, passwd));
        return
            keccak256(abi.encodePacked(personToHash[msg.sender])) ==
            generatedHash;

        /*keccak256(abi.encodePacked(personToHash[msg.sender])) ==
            keccak256(abi.encodePacked(user, passwd, "random_salt_value"));*/
    }

    function addProfesor(address student, address profesor) public onlyOwner {
        require(
            !studentToRecord[student].profesorExiste[profesor],
            "Profesor ya existe"
        );
        studentToRecord[student].profesores.push(profesor);
        studentToRecord[student].profesorExiste[profesor] = true;
    }

    function getProfessors(
        address student
    ) public view returns (address[] memory) {
        return studentToRecord[student].profesores;
    }

    function update(
        string memory hash,
        address participant
    ) public onlyOwner participantExists(participant) {
        personToHash[participant] = hash;
    }

    function removeParticipant(address participant) public onlyOwner {
        delete personToHash[participant];
    }
}
