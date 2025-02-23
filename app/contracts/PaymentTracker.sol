// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PaymentTracker {
    struct Payment {
        uint256 id;
        address payer;
        uint256 amount;
        string details;
        uint256 timestamp;
    }

    mapping(uint256 => Payment) private payments;
    uint256 private nextPaymentId;
    address public owner;

    event PaymentAdded(uint256 indexed id, address indexed payer, uint256 amount, string details, uint256 timestamp);

    constructor() {
        owner = msg.sender;
        nextPaymentId = 1;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function addPayment(string memory details) public payable {
        require(msg.value > 0, "Payment amount must be greater than zero");
        
        payments[nextPaymentId] = Payment(nextPaymentId, msg.sender, msg.value, details, block.timestamp);
        emit PaymentAdded(nextPaymentId, msg.sender, msg.value, details, block.timestamp);
        nextPaymentId++;
    }

    function getPayment(uint256 id) public view returns (Payment memory) {
        require(id > 0 && id < nextPaymentId, "Invalid payment ID");
        return payments[id];
    }

    function getTotalPayments() public view returns (uint256) {
        return nextPaymentId - 1;
    }

    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "No funds available to withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
