const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SolarGreen", function () {
    let owner, blacklister1, blacklister2, buyer1, buyer2, solarGreen;
    const ZERO_ADDRESS = ethers.ZeroAddress;
    beforeEach(async function() {
        [owner, blacklister1, blacklister2, buyer1, buyer2] = await ethers.getSigners();
        const SolarGreen = await ethers.getContractFactory("SolarGreen", owner);
        solarGreen = await SolarGreen.deploy(owner);
        await solarGreen.waitForDeployment();
    })

    it("should be a correct address", async function () {
        expect(solarGreen.target).to.be.properAddress;
        expect(solarGreen.target).to.be.not.equal(ZERO_ADDRESS);
    })

    it("should have a BLACKLISTER_ROLE for owner", async function () {
        expect(await solarGreen.hasRole(ADMIN_ROLE, owner.address)).to.equal.true
    })

    it("should have 100000000 tokens", async function () {
        const balance = await solarGreen.balanceOf(owner);
        expect(balance).to.eq(100000000000000000000000000n);
        expect(solarGreen.target).to.be.not.equal(0);
        expect(solarGreen.target).to.be.not.equal(155522);
        expect(solarGreen.target).to.be.not.equal(30000000000000000000000000n);
    })

    it("should mint 5000 tokens", async function () {
        const tx = await solarGreen.mint(owner, 5000);
        const balance = await solarGreen.balanceOf(owner);
        expect(balance).to.eq(100000000000000000000005000n);
        expect(solarGreen.target).to.be.not.equal(0);
        expect(solarGreen.target).to.be.not.equal(155522);
        expect(solarGreen.target).to.be.not.equal(30000000000000000000000000n);
    })

    it("should only allow mint positive number of tokens ", async function () {
        await expect(
            solarGreen.mint(owner, 0)
        ).to.be.revertedWith("amount must be positive");
    })

    it("should allow admins to grant and revoke BLACKLISTER_ROLE", async function () {
        await solarGreen.grantBlacklisterRole(blacklister1);
        expect(await solarGreen.hasRole(solarGreen.BLACKLISTER_ROLE(), blacklister1)).to.be.true;

        await solarGreen.grantBlacklisterRole(blacklister2);
        expect(await solarGreen.hasRole(solarGreen.BLACKLISTER_ROLE(), blacklister1)).to.be.true;
    
        // Revoke the role
        await solarGreen.revokeBlacklisterRole(blacklister1);
        expect(await solarGreen.hasRole(solarGreen.BLACKLISTER_ROLE(), blacklister1)).to.be.false;

        await solarGreen.revokeBlacklisterRole(blacklister2);
        expect(await solarGreen.hasRole(solarGreen.BLACKLISTER_ROLE(), blacklister1)).to.be.false;
    });


    it("should not allow to grant and revoke BLACKLISTER_ROLE zero address ", async function () {
        await expect(
            solarGreen.grantBlacklisterRole(ZERO_ADDRESS)
        ).to.be.revertedWith("can't grant role for 0 address");
    })

    it("should not allow to grant BLACKLISTER_ROLE if address is already granted", async function () {
        await solarGreen.grantBlacklisterRole(blacklister1)
        await expect(
            solarGreen.grantBlacklisterRole(blacklister1)
        ).to.be.revertedWith("account has already gotten blacklister role");
    })

    it("should not allow to revoke BLACKLISTER_ROLE if address is already removed from blacklisters", async function () {
        await expect(
            solarGreen.revokeBlacklisterRole(blacklister1)
        ).to.be.revertedWith("account has already removed from blacklisters");
    })
})
