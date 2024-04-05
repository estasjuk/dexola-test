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
    });

    it("should be a correct address", async function () {
        expect(solarGreen.target).to.be.properAddress;
        expect(solarGreen.target).to.be.not.equal(ZERO_ADDRESS);
    });

    it("should have a BLACKLISTER_ROLE for owner", async function () {
        expect(await solarGreen.hasRole(await solarGreen.BLACKLISTER_ROLE(), owner.address)).to.be.true
    });

    it("should have a ADMIN_ROLE for owner", async function () {
        expect(await solarGreen.hasRole(await solarGreen.ADMIN_ROLE(), owner.address)).to.be.true
    });

    it("should have 100000000 tokens", async function () {
        const balance = await solarGreen.balanceOf(owner.address);
        expect(balance).to.eq(100000000000000000000000000n);
        expect(balance).to.be.not.equal(0);
        expect(balance).to.be.not.equal(155522);
        expect(balance).to.be.not.equal(30000000000000000000000000n);
    });

    it("should mint 5000 tokens", async function () {
        const tx = await solarGreen.mint(owner.address, 5000);
        const balance = await solarGreen.balanceOf(owner);
        expect(balance).to.eq(100000000000000000000005000n);
        expect(balance).to.be.not.equal(0);
        expect(balance).to.be.not.equal(155522);
        expect(balance).to.be.not.equal(30000000000000000000000000n);
    });

    it("should only allow mint positive number of tokens ", async function () {
        await expect(
            solarGreen.mint(owner.address, 0)
        ).to.be.revertedWith("amount must be positive");
    });

    it("should allow admin to grant and revoke BLACKLISTER_ROLE", async function () {
        await solarGreen.grantBlacklisterRole(blacklister1.address);
        expect(await solarGreen.hasRole(solarGreen.BLACKLISTER_ROLE(), blacklister1)).to.be.true;
        expect().to.emit(solarGreen, 'ListOfBlacklistersChanged').withArgs(blacklister1.address, true);

        await solarGreen.grantBlacklisterRole(blacklister2.address);
        expect(await solarGreen.hasRole(solarGreen.BLACKLISTER_ROLE(), blacklister1)).to.be.true;
        expect().to.emit(solarGreen, 'ListOfBlacklistersChanged').withArgs(blacklister2.address, true)
    
        await solarGreen.revokeBlacklisterRole(blacklister1.address);
        expect(await solarGreen.hasRole(solarGreen.BLACKLISTER_ROLE(), blacklister1)).to.be.false;
        expect().to.emit(solarGreen, 'ListOfBlacklistersChanged').withArgs(blacklister1.address, false)

        await solarGreen.revokeBlacklisterRole(blacklister2.address);
        expect(await solarGreen.hasRole(solarGreen.BLACKLISTER_ROLE(), blacklister1)).to.be.false;
        expect().to.emit(solarGreen, 'ListOfBlacklistersChanged').withArgs(blacklister2.address, false)
    });

    it("should allow blacklisters to add and remove users into the blacklist", async function () {
        await solarGreen.grantBlacklisterRole(blacklister1.address);
        await solarGreen.connect(blacklister1).addToBlacklist(buyer1.address);
        expect(await solarGreen.isUserBlacklisted(buyer1.address)).to.be.true;
        expect().to.emit(solarGreen, 'ListOfBlacklistedUsersChanged').withArgs(buyer1.address, true);

        await solarGreen.grantBlacklisterRole(blacklister2.address);
        await solarGreen.connect(blacklister2).addToBlacklist(buyer2.address);
        expect(await solarGreen.isUserBlacklisted(buyer2.address)).to.be.true;
        expect().to.emit(solarGreen, 'ListOfBlacklistedUsersChanged').withArgs(buyer2.address, true);

        await solarGreen.connect(blacklister1).removeFromBlacklist(buyer1.address);
        expect(await solarGreen.isUserBlacklisted(buyer1.address)).to.be.false;
        expect().to.emit(solarGreen, 'ListOfBlacklistedUsersChanged').withArgs(buyer1.address, false);

        await solarGreen.connect(blacklister2).removeFromBlacklist(buyer2.address);
        expect(await solarGreen.isUserBlacklisted(buyer2.address)).to.be.false;
        expect().to.emit(solarGreen, 'ListOfBlacklistedUsersChanged').withArgs(buyer2.address, false);
    });

    it("should not allow to grant and revoke BLACKLISTER_ROLE zero address ", async function () {
        await expect(
            solarGreen.grantBlacklisterRole(ZERO_ADDRESS)
        ).to.be.revertedWith("can't grant role for 0 address");
    })

    it("should not allow to grant BLACKLISTER_ROLE if address is already granted", async function () {
        await solarGreen.grantBlacklisterRole(blacklister1.address)
        await expect(
            solarGreen.grantBlacklisterRole(blacklister1.address)
        ).to.be.revertedWith("account has already gotten blacklister role");
    })

    it("should not allow to revoke BLACKLISTER_ROLE if address is already removed from blacklisters", async function () {
        await expect(
            solarGreen.revokeBlacklisterRole(blacklister1.address)
        ).to.be.revertedWith("account has already removed from blacklisters");
    })

    it('should not allow not-admins to grant BLACKLISTER_role', async function() {
        await expect(
            solarGreen.connect(blacklister1).grantBlacklisterRole(blacklister2.address)
        ).to.be.reverted;
    });

    it('should not allow not-admins to revoke BLACKLISTER_role', async function() {
        await expect(
            solarGreen.connect(blacklister1).revokeBlacklisterRole(blacklister2)
        ).to.be.reverted;
    });

    it('should not allow not-blacklisters to add and remove users to blacklisted', async function() {
        await expect(
            solarGreen.connect(buyer1).addToBlacklist(buyer2.address)
        ).to.be.reverted;
    });

    it('should not allow not-blacklisters to add and remove users to blacklisted', async function() {
        await expect(
            solarGreen.connect(buyer1).removeFromBlacklist(buyer2.address)
        ).to.be.reverted;
    });

    it('should not allow blacklisters to mint tokens', async function() {
        await solarGreen.connect(owner).grantBlacklisterRole(blacklister1.address);
        await expect(
            solarGreen.connect(blacklister1).mint(owner.address, 5000)
        ).to.be.reverted;
    });

    it('should not allow blacklisters to burn tokens', async function() {
        await solarGreen.connect(owner).grantBlacklisterRole(blacklister1.address);
        await expect(
            solarGreen.connect(blacklister1).burnFrom(owner.address, 5000)
        ).to.be.reverted;
    });

    it ('should check is user blacklisted', async function() {
        await solarGreen.addToBlacklist(buyer1.address);
            expect(await solarGreen.isUserBlacklisted(buyer1.address)).to.be.true;

        await solarGreen.removeFromBlacklist(buyer1.address);
            expect(await solarGreen.isUserBlacklisted(buyer1.address)).to.be.false;
    });

    it ('should check is accounbt blacklister', async function() {
        await solarGreen.grantBlacklisterRole(blacklister1.address);
            expect(await solarGreen.isUserBlacklister(blacklister1.address)).to.be.true;

        await solarGreen.revokeBlacklisterRole(blacklister1.address);
            expect(await solarGreen.isUserBlacklister(blacklister1.address)).to.be.false;
    });
});