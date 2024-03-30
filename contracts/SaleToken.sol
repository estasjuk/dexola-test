// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.20;

import "./SolarGreen.sol";

contract TokenSale{
    ISolarGreen public token;
    address payable public owner;
    uint256 public saleStart;
    uint256 public saleEnd;
    uint256 public tokensBalanceForSale;
    bool public isUserBlacklisted;
    
    mapping (address => uint256) public userTokenBalances;

    event Bought(uint _amount, address indexed _buyer);

    constructor() {
        token = ISolarGreen(new SolarGreen(address(this)));
        owner = payable(msg.sender);
        saleStart = block.timestamp;
        saleEnd = saleStart + 5 weeks;
        tokensBalanceForSale = token.balanceOf(address(this)) / 2;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not an owner");
        _;
    }

    modifier onlyActive {
        require(block.timestamp >= saleStart, "sale must be active.");
        require(block.timestamp <= saleEnd, "sale must be active.");
        _;
    }

    function getUserTokenBalance(address user) public view returns (uint256){
        return userTokenBalances[user];
    }

    function changeSaleEnd (uint _newSaleEnd) public onlyOwner {
        saleEnd = _newSaleEnd;
    }

    receive() external payable onlyActive {
        uint256 tokensForSale = msg.value / 100; // 1 token = 100 wei
        isUserBlacklisted = token.isUserBlacklisted(msg.sender);
        require(isUserBlacklisted = false, "user is blacklisted");
        require(msg.sender != address(0), "zero address");
        require(msg.sender.balance >= msg.value, "not enough funds");
        require(tokensForSale > 0, "impossible to buy 0 tokens");
        require((getUserTokenBalance(msg.sender) + tokensForSale) <= 50000, "token sale limit" ); //checking the purchase limit of 50,000 tokens per one wallet
        require(tokensForSale <= tokensBalanceForSale, "not enough tokens");

        userTokenBalances[msg.sender] += tokensForSale;
        
        token.transfer(msg.sender, tokensForSale);
        tokensBalanceForSale -= tokensForSale;
        emit Bought(tokensForSale, msg.sender);
    }
}