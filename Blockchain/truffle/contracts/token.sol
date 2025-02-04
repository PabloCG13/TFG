// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ERC721.sol";
import "./Ownable.sol";

contract MiNFT is ERC721, Ownable {
    struct Date {
        uint8 month; // 1-12
        uint16 year; // 2024, 2025, etc.
    }

    struct Validation {
        string srcCourse;
        string dstCourse;
        Date period;
    }

    uint256 private _tokenIdCounter;

    mapping(uint => Validation) private validities;

    constructor(address owner) ERC721("MiNFT", "MNFT") Ownable(msg.sender) {
        _tokenIdCounter = 0;
        _transferOwnership(owner);
    }

    function mintNFT(
        address to,
        string memory _srcCourse,
        string memory _dstCourse
    ) public onlyOwner returns (uint) {
        _tokenIdCounter++;
        _safeMint(to, _tokenIdCounter);
        validities[_tokenIdCounter].srcCourse = _srcCourse;
        validities[_tokenIdCounter].dstCourse = _dstCourse;
        return _tokenIdCounter;
    }

    function setValidityPeriod(uint id, uint8 _month, uint16 _year) public {
        require(_month >= 1 && _month <= 12, "invalid month");
        require(_year >= 1900 && _year <= 2100, "invalid year");
        require(
            _getApproved(id) == msg.sender,
            "This coordinator does not have that validation"
        );

        validities[id].period = Date(_month, _year);
    }

    function getDate(uint id) public view returns (uint8, uint16) {
        return (validities[id].period.month, validities[id].period.year);
    }

    function transferValidity(
        uint id,
        address origin,
        address destination
    ) public {
        _safeTransfer(origin, destination, id);
    }
}
