// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ERC721.sol";
import "./Ownable.sol";

contract MiNFT is ERC721, Ownable {
    struct Date {
        uint8 month; // 1-12
        uint16 year; // 2024, 2025, etc.
    }
    uint256 private _tokenIdCounter;
    string public srcCourse;
    string public dstCourse;
    Date private validity;

    constructor(
        string memory _srcCourse,
        string memory _destCourse,
        address owner
    ) ERC721("MiNFT", "MNFT") Ownable(msg.sender) {
        srcCourse = _srcCourse;
        dstCourse = _destCourse;
        _transferOwnership(owner);
    }

    function mintNFT(address to) public onlyOwner {
        _tokenIdCounter++;
        _safeMint(to, _tokenIdCounter);
    }

    function setValidityPeriod(uint8 _month, uint16 _year) public {
        require(_month >= 1 && _month <= 12, "invalid month");
        require(_year >= 1900 && _year <= 2100, "invalid year");

        validity = Date(_month, _year);
    }

    function getDate() public view returns (uint8, uint16) {
        return (validity.month, validity.year);
    }
}
