// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SuperSlot {
    address public owner;
    uint256 public prizePool;
    uint256 public constant BET_AMOUNT = 0.001 ether;
    string[10] public slots = ["DOGE", "SHIBA", "PEPE", "WIF", "BONK", "FLOKI", "BRETT", "MOG", "BOME", "MEW"];

    struct SpinResult {
        string[4] symbols;
        uint256 winAmount;
        bool isWin;
    }

    event Spin(address indexed player, string[4] result, uint256 winAmount, bool isWin);

    constructor() {
        owner = msg.sender;
    }

    function spin() public payable returns (SpinResult memory) {
        require(msg.value == BET_AMOUNT, "Incorrect bet amount");

        uint256 ownerCut = (msg.value * 10) / 100;
        uint256 prizeCut = msg.value - ownerCut;

        prizePool += prizeCut;
        payable(owner).transfer(ownerCut);

        string[4] memory result;
        uint256[4] memory indices;
        for(uint i = 0; i < 4; i++) {
            indices[i] = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, i))) % 10;
            result[i] = slots[indices[i]];
        }

        uint256 winAmount = 0;
        bool isWin = false;
        if(keccak256(abi.encodePacked(result[0])) == keccak256(abi.encodePacked(result[1])) &&
           keccak256(abi.encodePacked(result[1])) == keccak256(abi.encodePacked(result[2]))) {
            winAmount = (prizePool * 80) / 100;
            prizePool -= winAmount;
            payable(msg.sender).transfer(winAmount);
            isWin = true;
        }

        emit Spin(msg.sender, result, winAmount, isWin);

        return SpinResult(result, winAmount, isWin);
    }

    function getPrizePool() public view returns (uint256) {
        return prizePool;
    }

    function getSlots() public view returns (string[10] memory) {
        return slots;
    }
}