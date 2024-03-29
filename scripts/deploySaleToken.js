const { ethers } = require("hardhat");

async function main() {

  // Get the contract owner
    const contractOwner = await ethers.getSigners();
    console.log(`Deploying contract from: ${contractOwner[0].address}`);
    const SaleTokenFactory = await ethers.getContractFactory('SaleToken');
    
  // Deploy the contract
    console.log('Deploying contract SaleToken...');
    const saleToken = await SaleTokenFactory.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    await saleToken.waitForDeployment();
    console.log("SaleToken deployed to", saleToken.target)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
});