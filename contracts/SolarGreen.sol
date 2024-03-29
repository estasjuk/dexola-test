// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SolarGreen is ERC20, ERC20Burnable, Ownable {
    mapping (address => bool) private isBlacklisted;
    event AddressBlacklisted(address indexed addr, bool isBlacklisted);

    constructor(address shop)
        ERC20("SolarGreen", "SGR")
        Ownable(shop)
    {
        _mint(msg.sender, 100000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(amount > 0, "amount must be positive");
        _mint(to, amount);
    }

    function addToBlacklist(address user) public onlyOwner {
        require(isBlacklisted[user] != true, "user is already in blacklist");
        require(user != address(0), "can't BL 0 address");
        isBlacklisted[user] = true;
        emit AddressBlacklisted(user, true);
    }
    
    function removeFromBlacklist(address user) public onlyOwner {
        require(isBlacklisted[user] != false, "user is already removed from blacklist");
        require(user != address(0), "can't remove from BL 0 address");
        isBlacklisted[user] = false;
        emit AddressBlacklisted(user, false);
    }

    function isUserBlacklisted(address user) public view returns (bool) {
        return isBlacklisted[user];
    }
}