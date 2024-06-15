require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    bsctestnet: {
      url: "https://bsc-testnet-rpc.publicnode.com",
      chainId: 97,
      accounts: [PRIVATE_KEY],
      gasPrice: 30000000000,
    },
    etherscan: {
      apiKey: ETHERSCAN_API_KEY,
    },
  },
};
