const { ethers } = require("hardhat");

async function main() {

  // Get the contract owner
    const contractOwner = await ethers.getSigners();
    console.log(`Deploying contract from: ${contractOwner[0].address}`);
    const SolarGreenFactory = await ethers.getContractFactory('SolarGreen');
    
  // Deploy the contract
    console.log('Deploying contract SolarGreen...');
    const solarGreen = await SolarGreenFactory.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    await solarGreen.waitForDeployment();
    console.log("SolarGreen deployed to", solarGreen.target)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
});