const hre = require("hardhat");

async function main() {
    const subscriptionId = 315;
    const keyHash = "0x6d4676b7e03852ca8ec60696d67dd4a07e309c410269083b2616f6946df62fb7"
    const vrfCoordinator = "0xa2d23627bC0314f4Cbd08Ff54EcB89bb45685053"
    const callbackGasLimit = 1000000;
    const requestConfirmations = 3;

    const rps = await hre.ethers.getContractFactory("RPS",[subscriptionId, keyHash, vrfCoordinator, callbackGasLimit, requestConfirmations]);
    console.log("Deploying RPS...");

    await rps.waitForDeployment();
  
    console.log(`Deployed to, ${rps.target}`);
  
       
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  