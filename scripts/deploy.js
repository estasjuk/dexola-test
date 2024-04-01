const { ethers } = require("hardhat");

async function main() {

  // Get the contract owner
    const contractOwner = await ethers.getSigners();
    console.log(`Deploying contract from: ${contractOwner[0].address}`);
    const SaleToken = await ethers.getContractFactory('SaleToken');
    
  // Deploy the contract
    console.log('Deploying contract SaleToken...');
    const saleToken = await SaleToken.deploy();
    await saleToken.waitForDeployment();
    console.log("SaleToken deployed to", saleToken.target)
    console.log("SolarGreen deployed to", await saleToken.token());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
});