const { ethers } = require("hardhat");

async function main() {
  const contract = await ethers.getContractFactory("BNBMan");

  const deployedContract = await contract.deploy();

  console.log(`Contract deployed to address: ${deployedContract.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
