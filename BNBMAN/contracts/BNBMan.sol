// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/extensions/ERC721Storage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract NFTHuman is ERC721Storage {
    using Strings for uint256;
    uint256 private _tokenIds;
    address private owner;

    mapping(uint256 => uint256) public tokenIdAges;

    constructor () ERC721("BNBMan", "BNBMAN") {
        owner = msg.sender;
    }

    function generateCharacter(uint256 tokenId) public view returns (string memory) {
        bytes memory svg = abi.encodePacked(
            
        )
    }

}