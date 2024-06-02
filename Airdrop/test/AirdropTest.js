const { expect } = require("chai");
const keccak256 = require("keccak256");
const { merkleTree } = require("merkletreejs");

function enclodeLeaf(address, spots) {
  //Same as 'abi.encode' in solidity
  return ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "uint256"], //The datatypes for Aruments to encode
    [address, spots] //actual values
  );
}
