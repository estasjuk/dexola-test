// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./ISolarGreen.sol";

contract SolarGreen is ISolarGreen, ERC20Burnable, AccessControl {
    mapping (address => bool) private isBlacklisted;
    mapping (address => bool) private hasBlacklisterRole;
    bytes32 public constant BLACKLISTER_ROLE = keccak256("BLACKLISTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    event AddressBlacklisted(address indexed addr, bool isBlacklisted);
    event BlacklistChanged(address indexed addr, bool hasBlacklisterRole);

    constructor(address owner)
        ERC20("SolarGreen", "SGR")
    {   
        _grantRole(ADMIN_ROLE, owner);
        _grantRole(BLACKLISTER_ROLE, owner);
        hasBlacklisterRole[owner] = true;
        _mint(owner, 100000000 * 10 ** decimals());
        emit BlacklistChanged(owner, true);
    }

    function mint(address to, uint256 amount) public onlyRole(ADMIN_ROLE) {
        require(amount > 0, "amount must be positive");
        _mint(to, amount);
    }

    function grantBlacklisterRole(address account) public onlyRole(ADMIN_ROLE) {
        require(account != address(0), "can't grant role for 0 address");
        require(hasBlacklisterRole[account] != true, "account has already gotten blacklister role");
        _grantRole(BLACKLISTER_ROLE, account);
        hasBlacklisterRole[account] = true;
        emit BlacklistChanged(account, true);
    }

    function revokeBlacklisterRole(address account) public onlyRole(ADMIN_ROLE) {
        require(account != address(0), "can't revoke role for 0 address");
        require(hasBlacklisterRole[account] != false, "account has already removed from blacklisters");
        _revokeRole(BLACKLISTER_ROLE, account);
        hasBlacklisterRole[account] = false;
        emit BlacklistChanged(account, false);
    }

    function addToBlacklist(address user) public onlyRole(BLACKLISTER_ROLE) {
        require(isBlacklisted[user] != true, "user is already in blacklist");
        require(user != address(0), "can't BL 0 address");
        isBlacklisted[user] = true;
        emit AddressBlacklisted(user, true);
    }
    
    function removeFromBlacklist(address user) public onlyRole(BLACKLISTER_ROLE) {
        require(isBlacklisted[user] != false, "user is already removed from blacklist");
        require(user != address(0), "can't remove from BL 0 address");
        isBlacklisted[user] = false;
        emit AddressBlacklisted(user, false);
    }

    function isUserBlacklisted(address user) external view returns (bool) {
        return isBlacklisted[user];
    }

    function isUserBlacklister(address user) external view returns (bool) {
        return hasBlacklisterRole[user];
    }
}