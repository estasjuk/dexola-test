require('dotenv').config();
const { ethers } = require('ethers');

const { abi } = require("../artifacts/contracts/SaleToken.sol/SaleToken.json");

const INFURA_LINK = process.env.INFURA_LINK;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(INFURA_LINK);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const SolarGreenContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

const mintTokens = async (address, amount) => {
    let txMint;
    try {
            txMint = await SolarGreenContract.mint(address, amount);
            const txMintHash = txMint.hash
            console.log('Mint transaction sent:', txMintHash);
            await txMint.wait(5);
            console.log('tokens minted successfully');
            return txMintHash;
    } catch (error) {
        console.error('Error minting', error);
    }
};

module.exports = {
    mintTokens,
}