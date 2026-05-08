// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title LoyaltyToken
 * @dev ERC20 token for loyalty points
 */
contract LoyaltyToken is ERC20, Ownable, Pausable {
    // Mapping for locked tokens (vesting)
    mapping(address => uint256) public lockedBalance;
    mapping(address => uint256) public unlockTime;

    // Minting rate
    uint256 public mintingRate = 10; // 1 point per 0.1 USD

    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensRedeemed(address indexed from, uint256 amount);
    event TokensLocked(address indexed user, uint256 amount, uint256 unlockTime);
    event TokensUnlocked(address indexed user, uint256 amount);

    constructor() ERC20("Cachaca Cutelaria Loyalty", "CCLT") {
        // Initial supply: 1 million tokens
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    /**
     * @dev Mint loyalty tokens
     */
    function mintLoyaltyTokens(address to, uint256 amount)
        public
        onlyOwner
        returns (bool)
    {
        _mint(to, amount);
        emit TokensMinted(to, amount);
        return true;
    }

    /**
     * @dev Redeem loyalty tokens
     */
    function redeemTokens(uint256 amount) public returns (bool) {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
        emit TokensRedeemed(msg.sender, amount);
        return true;
    }

    /**
     * @dev Lock tokens (vesting)
     */
    function lockTokens(address user, uint256 amount, uint256 lockDuration)
        public
        onlyOwner
    {
        require(balanceOf(user) >= amount, "Insufficient balance");

        lockedBalance[user] += amount;
        unlockTime[user] = block.timestamp + lockDuration;

        emit TokensLocked(user, amount, unlockTime[user]);
    }

    /**
     * @dev Unlock tokens
     */
    function unlockTokens() public {
        require(lockedBalance[msg.sender] > 0, "No locked tokens");
        require(block.timestamp >= unlockTime[msg.sender], "Tokens still locked");

        uint256 amount = lockedBalance[msg.sender];
        lockedBalance[msg.sender] = 0;

        emit TokensUnlocked(msg.sender, amount);
    }

    /**
     * @dev Get available balance (excluding locked tokens)
     */
    function getAvailableBalance(address user) public view returns (uint256) {
        return balanceOf(user) - lockedBalance[user];
    }

    /**
     * @dev Calculate points from purchase amount
     */
    function calculatePoints(uint256 usdAmount) public view returns (uint256) {
        return (usdAmount * mintingRate) / 100;
    }

    /**
     * @dev Pause token transfers
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token transfers
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Override transfer to check pause
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);

        // Check locked balance
        if (from != address(0)) {
            require(
                getAvailableBalance(from) >= amount,
                "Cannot transfer locked tokens"
            );
        }
    }

    /**
     * @dev Set minting rate
     */
    function setMintingRate(uint256 newRate) public onlyOwner {
        mintingRate = newRate;
    }

    /**
     * @dev Burn tokens
     */
    function burn(uint256 amount) public returns (bool) {
        _burn(msg.sender, amount);
        return true;
    }

    /**
     * @dev Burn tokens from address
     */
    function burnFrom(address account, uint256 amount) public returns (bool) {
        uint256 currentAllowance = allowance(account, msg.sender);
        require(
            currentAllowance >= amount,
            "ERC20: burn amount exceeds allowance"
        );
        _approve(account, msg.sender, currentAllowance - amount);
        _burn(account, amount);
        return true;
    }
}
