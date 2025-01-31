// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleStorage {
    uint256 private a;

    constructor() {
        a = 10;
    }

    function set(uint256 _a) public {
        a = _a;
    }

    function get() public view returns (uint256) {
        return a;
    }
}
