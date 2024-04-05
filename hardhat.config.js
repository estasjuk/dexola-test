require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { ALCHEMY_API_KEY, SEPOLIA_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.20",
  etherscan: {
    apiKey: `${ETHERSCAN_API_KEY}`,
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
    }
  }
};