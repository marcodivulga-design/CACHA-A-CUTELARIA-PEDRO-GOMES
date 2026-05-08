// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CryptoPayment
 * @dev Payment contract for cryptocurrency transactions
 */
contract CryptoPayment is Ownable, ReentrancyGuard {
    // Supported tokens
    mapping(address => bool) public supportedTokens;

    // Payment records
    struct Payment {
        string orderId;
        address payer;
        address token;
        uint256 amount;
        uint256 timestamp;
        PaymentStatus status;
    }

    enum PaymentStatus {
        PENDING,
        COMPLETED,
        FAILED,
        REFUNDED
    }

    // Mapping from payment ID to payment details
    mapping(bytes32 => Payment) public payments;

    // Mapping from order ID to payment ID
    mapping(string => bytes32) public orderToPayment;

    // Accumulated balance
    mapping(address => uint256) public tokenBalance;

    // Events
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event PaymentCreated(
        bytes32 indexed paymentId,
        string orderId,
        address indexed payer,
        address token,
        uint256 amount
    );
    event PaymentCompleted(bytes32 indexed paymentId);
    event PaymentRefunded(bytes32 indexed paymentId);
    event WithdrawalRequested(address indexed token, uint256 amount);

    constructor() {}

    /**
     * @dev Add supported token
     */
    function addSupportedToken(address token) public onlyOwner {
        require(token != address(0), "Invalid token address");
        supportedTokens[token] = true;
        emit TokenAdded(token);
    }

    /**
     * @dev Remove supported token
     */
    function removeSupportedToken(address token) public onlyOwner {
        supportedTokens[token] = false;
        emit TokenRemoved(token);
    }

    /**
     * @dev Process crypto payment
     */
    function processPayment(
        string memory orderId,
        address token,
        uint256 amount
    ) public nonReentrant returns (bytes32) {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Amount must be greater than 0");

        // Transfer tokens from payer to contract
        IERC20 tokenContract = IERC20(token);
        require(
            tokenContract.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        // Create payment record
        bytes32 paymentId = keccak256(
            abi.encodePacked(orderId, msg.sender, block.timestamp)
        );

        Payment memory payment = Payment({
            orderId: orderId,
            payer: msg.sender,
            token: token,
            amount: amount,
            timestamp: block.timestamp,
            status: PaymentStatus.COMPLETED
        });

        payments[paymentId] = payment;
        orderToPayment[orderId] = paymentId;
        tokenBalance[token] += amount;

        emit PaymentCreated(paymentId, orderId, msg.sender, token, amount);
        emit PaymentCompleted(paymentId);

        return paymentId;
    }

    /**
     * @dev Refund payment
     */
    function refundPayment(bytes32 paymentId) public onlyOwner nonReentrant {
        Payment storage payment = payments[paymentId];
        require(
            payment.status == PaymentStatus.COMPLETED,
            "Payment not completed"
        );

        // Transfer tokens back to payer
        IERC20 tokenContract = IERC20(payment.token);
        require(
            tokenContract.transfer(payment.payer, payment.amount),
            "Refund failed"
        );

        payment.status = PaymentStatus.REFUNDED;
        tokenBalance[payment.token] -= payment.amount;

        emit PaymentRefunded(paymentId);
    }

    /**
     * @dev Get payment details
     */
    function getPayment(bytes32 paymentId)
        public
        view
        returns (Payment memory)
    {
        return payments[paymentId];
    }

    /**
     * @dev Get payment by order ID
     */
    function getPaymentByOrderId(string memory orderId)
        public
        view
        returns (Payment memory)
    {
        bytes32 paymentId = orderToPayment[orderId];
        return payments[paymentId];
    }

    /**
     * @dev Withdraw accumulated balance
     */
    function withdraw(address token, uint256 amount) public onlyOwner {
        require(tokenBalance[token] >= amount, "Insufficient balance");

        IERC20 tokenContract = IERC20(token);
        require(tokenContract.transfer(msg.sender, amount), "Withdrawal failed");

        tokenBalance[token] -= amount;
        emit WithdrawalRequested(token, amount);
    }

    /**
     * @dev Get token balance
     */
    function getTokenBalance(address token) public view returns (uint256) {
        return tokenBalance[token];
    }

    /**
     * @dev Receive ETH
     */
    receive() external payable {}
}
