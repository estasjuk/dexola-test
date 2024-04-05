const { expect } = require("chai");
const { ethers } = require("hardhat");
const tokenJSON = require("../artifacts/contracts/SolarGreen.sol/SolarGreen.json")

describe("SaleToken", function () {
    let owner, blacklister1, blacklister2, buyer1, buyer2, saleToken, solarGreen;

    
    const ZERO_ADDRESS = ethers.ZeroAddress;
    beforeEach(async function() {
        [owner, blacklister1, blacklister2, buyer1, buyer2] = await ethers.getSigners();
        const SaleToken = await ethers.getContractFactory("SaleToken", owner);
        saleToken = await SaleToken.deploy();
        await saleToken.waitForDeployment();
        solarGreen = new ethers.Contract(await saleToken.token(), tokenJSON.abi, owner);
    })

    it("should be a correct address and token", async function () {
        expect(saleToken.target).to.be.properAddress;
        expect(saleToken.target).to.be.not.equal(ZERO_ADDRESS);
        expect(await saleToken.token()).to.be.properAddress;
    })

    it("should be a correct sale start", async function () {
        const block = await ethers.provider.getBlock();
        const timeStart = block.timestamp;
        expect(await saleToken.saleStart()).to.equal(timeStart);
        expect(saleToken.target).to.be.not.equal(0);
    })

    it("should be a correct initial sale end", async function () {
        const block = await ethers.provider.getBlock();
        const fiveWeeks = 5 * 7 * 24 * 60 * 60;
        const timeEnd = block.timestamp + fiveWeeks;
        expect(await saleToken.saleEnd()).to.equal(timeEnd);
        expect(saleToken.target).to.be.not.equal(0);
        expect(saleToken.target).to.be.not.equal(block.timestamp);
    })

    it("should have 50000000 tokens for sale", async function () {
        const balance = await saleToken.tokensBalanceForSale();
        expect(balance).to.eq(50000000000000000000000000n);
        expect(balance).to.be.not.equal(0);
        expect(balance).to.be.not.equal(-155522);
        expect(balance).to.be.not.equal(30000000000000000000000000n);
    })

    it("should allow owner to change end of sale", async function () {
        const endTime = saleToken.saleEnd();
        await saleToken.changeSaleEnd(1715199999);
        expect(await saleToken.saleEnd()).to.eq(1715199999);
        expect(endTime).to.be.not.equal(0);
        expect(endTime).to.be.not.equal(1715220245);
        expect(endTime).to.be.not.equal(1715100000);
        expect(endTime).to.emit(saleToken, 'SaleEndChanged').withArgs(1715199999)
    })

    it("should not allow not-owner to change end of sale", async function () {
        await expect(
            saleToken.connect(blacklister1).changeSaleEnd(1715199999)).to.be.reverted;
        await expect(
            saleToken.connect(buyer1).changeSaleEnd(1715199999)).to.be.reverted;
    })

    it("should not allow to change end of sale during the inactive period", async function () {
        const block = await ethers.provider.getBlock();
        const timestamp = block.timestamp;
        await saleToken.changeSaleEnd(timestamp);
        await expect(
            saleToken.changeSaleEnd(1715199999)).to.be.reverted;
    })

    it("should be a correct user token balance", async function () {
        expect(await saleToken.getUserTokenBalance(buyer1.address)).to.equal(0);
        expect(saleToken.target).to.be.not.equal(5000);
    })

    it("should not allow to get token balance of user with 0 address", async function () {
        await expect(
            saleToken.getUserTokenBalance(ZERO_ADDRESS))
        .to.be.revertedWith("can't get balance for 0 address");
    })

    it("should allow to buy tokens", async function() {
        const tokenAmount = 50000;
        const txData = {
            value: tokenAmount,
            to: saleToken.target
        };

        const tx = await buyer1.sendTransaction(txData);
        await tx.wait();
        expect(await solarGreen.balanceOf(buyer1.address)).to.eq(tokenAmount);

        await expect(() => tx).
            to.changeEtherBalance(saleToken, tokenAmount)

        await expect(tx)
            .to.emit(saleToken, "Bought")
            .withArgs(tokenAmount, buyer1.address)
    });

    it("should not allow to buy more than token limit", async function() {
        const tokenAmount = 60000;
        const txData = {
            value: tokenAmount,
            to: saleToken.target
        };
        
        await expect(
            buyer1.sendTransaction(txData)
        ).to.be.revertedWith("token sale limit");
    });

    it("should not allow to buy 0 tokens", async function() {
        const tokenAmount = 0;
        const txData = {
            value: tokenAmount,
            to: saleToken.target
        };
        
        await expect(
            buyer1.sendTransaction(txData)
        ).to.be.revertedWith("impossible to buy 0 tokens");
    });
});