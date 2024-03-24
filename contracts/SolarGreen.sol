// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SolarGreen is ERC20, ERC20Burnable, Ownable {
    mapping (address => bool) private isBlacklisted;
    event AddressBlacklisted(address indexed addr, bool isBlacklisted);

    constructor(address initialOwner)
        ERC20("SolarGreen", "SGR")
        Ownable(initialOwner)
    {
        _mint(msg.sender, 100000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function addToBlackList(address user) public onlyOwner {
        require(!isBlacklisted[user], "user is already in blacklist");
        isBlacklisted[user] = true;
        emit AddressBlacklisted(user, true);
    }
    
    function removeFromBlacklist(address user) public onlyOwner {
        require(isBlacklisted[user], "user is already removed from blacklist");
        isBlacklisted[user] = false;
        emit AddressBlacklisted(user, true);
    }
}