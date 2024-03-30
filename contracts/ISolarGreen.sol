// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISolarGreen is IERC20 {
    function mint(address to, uint256 amount) external;
    function addToBlacklist(address user) external;
    function removeFromBlacklist(address user) external;
    function isUserBlacklisted(address user) external view returns (bool);
}