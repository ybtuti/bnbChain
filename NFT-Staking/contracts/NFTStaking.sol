// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTStaking is Ownable {
    IERC20 public immutable rewardsToken;
    IERC721 public immutable nftCollection;
    uint256 private rewardsPerHour = 100000;
    mapping (address => Staker) public stakers;

    struct Staker {
        uint256[] stakedTokenIds;
        uint256 lastUpdatedTime;
        uint256 unclaimedRewards;
    }

    constructor(IERC721 _nftCollection, IERC20 _rewardsToken) Ownable(msg.sender){
        nftCollection = _nftCollection;
        rewardsToken = _rewardsToken;
    }

    function stake (uint256[] calldata _tokenIds) external {
        Staker storage staker = stakers[msg.sender];
        require(_tokenIds.length > 0, "You must stake at least one token");

        for(uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];
            require(nftCollection.ownerOf(tokenId) == msg.sender, "You must own the token to stake it");
            nftCollection.transferFrom(msg.sender, address(this), tokenId);
            staker.stakedTokenIds.push(tokenId);
        }
        updateRewards(msg.sender);
    }

    function withdraw (uint256[] calldata _tokenIds) external {
        Staker storage staker = stakers[msg.sender];
        require(staker.stakedTokenIds.length > 0, "You don't have any staked tokens");
        updatedRewards(msg.sender);

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];
            require(isStaked(msg.sender, tokenId), "You can't withdraw a token that isn't staked");

            uint256 index = getTokenIndex(msg.sender, tokenId);
            uint256 lastIndex = staker.stakedTokenIds.length - 1;

            if(index = lastIndex) {
                staker.stakedTokenIds[index] = staker.stakedTokenIds[lastIndex];

            }
            staker.stakedTokenIds.pop();
            nftCollection.transferFrom(address(this), msg.sender, tokenId);
        }
    }

    function claimRewards() external {
        Staker storage staker = stakers[msg.sender];
        uint256 rewards = calculateRewards(msg.sender) + staker.unclaimedRewards;
        staker.lastUpdatedTime = block.timestamp;
        staker.unclaimedRewards = 0;
        rewardsToken.transfer(msg.sender, rewards);
    }
}