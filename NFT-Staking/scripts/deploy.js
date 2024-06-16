const { ethers } = require("hardhat");

async function main() {
  const contract = ethers.getContractFactory("NFTStaking");

  const rewardsTokenAddress = "..";
  const nftCollectionAddress = "..";

  const deployedContract = await contract.deploy(
    nftCollectionAddress,
    rewardsTokenAddress
  );

  console.log(`Contract deployed to address: ${deployedContract.address}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
