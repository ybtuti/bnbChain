const { expect } = require("chai");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");

function enclodeLeaf(address, spots) {
  //Same as 'abi.encode' in solidity
  return ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "uint256"], //The datatypes for Aruments to encode
    [address, spots] //actual values
  );
}
describe("Merkle Trees", function () {
  it("Should be able to verify if the address is in the whitelist or not", async function () {
    const testAddresses = await ethers.getSigners();

    const List = [
      enclodeLeaf(testAddresses[0].address, 2),
      enclodeLeaf(testAddresses[1].address, 2),
      enclodeLeaf(testAddresses[2].address, 2),
      enclodeLeaf(testAddresses[3].address, 2),
      enclodeLeaf(testAddresses[5].address, 2),
    ];
    const merkleTree = new MerkleTree(List, keccak256, {
      hashLeaves: true,
      sortPairs: true,
      sortLeaves: true,
    });

    const root = merkleTree.getHexRoot();

    const airdrop = await ethers.getContractFactory("Airdrop");

    const Airdrop = await airdrop.deploy(root);
    await Airdrop.waitForDeployment();

    for (let i = 0; i < 6; i++) {
      const leaf = keccak256(List[i]);
      const proof = merkleTree.getHexProof(leaf);

      const connectedAirdrop = await Airdrop.connect(testAddresses[i]);
      const verified = await connectedAirdrop.checkWhitelist(proof, 2); // corrected here

      expect(verified).to.equal(false);
    }

    const verifiedInvalid = await Airdrop.checkWhitelist([], 2);
    expect(verifiedInvalid).to.equal(false); // corrected here
  });
});
