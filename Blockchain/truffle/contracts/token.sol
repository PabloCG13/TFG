// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ERC721.sol";
import "./Ownable.sol";

contract MiNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("MiNFT", "MNFT") Ownable(msg.sender) {}

    function mintNFT(address to) public onlyOwner {
        _safeMint(to, _tokenIdCounter);
        _tokenIdCounter++;
    }
}
