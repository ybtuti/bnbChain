// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@binance-oracle/binance-oracle-starter/contracts/mock/VRFConsumerBase.sol";
import "@binance-oracle/binance-oracle-starter/contracts/interfaces/VRFCoordinatorInterface.sol";

contract RPS is VRFConsumerBase {

    enum StatusEnum {
        WON,
        LOST,
        TIE,
        PENDING
    }

    struct ChallengeStatus{
        bool exists;
        uint256 bet;
        address player;
        StatusEnum status;
        uint8 playerChoice;
        uint8 hostChoice;

    }

    uint constant minBet = 0.001 ether;
    uint256 constant maxBet = 0.1 ether;
    uint constant numWords = 1;
    address public owner;

    mapping(address => uint256) public s_currentGame;
    mapping(uint256 => ChallengeStatus) public s_challenges;

    VRFCoordinatorInterface COORDINATOR;

    uint64 subscriptionId;

    bytes32 keyHash;

    uint32 callbackLimit;

    uint16 requestConfirmations;

    event ChallengeOpened(
        uint256 indexed challengeId,
        address indexed player,
        StatusEnum status,
        uint8 playerChoice,
        uint8 hostChoice
    );

    event ChallengeClosed(
        uint256 indexed challengeId,
        address indexed player,
        StatusEnum status,
        uint8 playerChoice,
        uint8 hostChoice
    );

    event Recieved(address sender, uint256 value);



    constructor(
         uint64 subscriptionId,
        bytes32 _keyhash,
        address _coordinator,
        uint32 _callbackGasLimit,
        uint16 requestConfirmations        
    ) VRFConsumerBase(_coordinator){
        // constructor
       owner = msg.sender;
       COORDINATOR = VRFCoordinatorInterface(_coordinator);
       subscriptionId = subscriptionId;
       keyHash = _keyhash;
       callbackGasLimit = _callbackGasLimit;
       requestConfirmations = requestConfirmations;

    }
    function getCurrentChallengeStatus(address _player) external view returns (
        StatusEnum status,
        uint256 challengeId,
        address player,
        uint8 playerChoice,
        uint8 hostChoice
    ) {
        uint256 challengeId = s_currentGame[_player];
        require (s_challenges[challengeId].exists, "Challenge not found");
        ChallengeStatus memory challenge = s_challenges[challengeId];

        return (
            challenge.status,
            challengeId,
            challenge.player,
            challenge.playerChoice,
            challenge.hostChoice
        );
    }

    function play(uint8 _playerChoice) external payable {
        require(_choice >0 && _choice < 4, "Choose between 1 amd 3");
        require(msg.value >= minBet && msg.value <= maxBet, "Bet must be between 0.001 and 0.1 BNB");
        require(msg.value * 2 <= address(this).balance, "Not enough funds in the contract");
        uint256 challengeId = openChallenge(msg.sender, _choice, msg.value);
        s_currentGame[msg.sender] = challengeId;
    }

    function openChallenge(
        address _player,
        uint8 _choice,
        uint256 _bet
    ) internal returns (uint256 challengeId) {
        challengeId = CONSUMER.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        s_challenges[challengeId] = ChallengeStatus({
            exists: true,
            bet: bet,
            player: _player,
            status: StatusEnum.PENDING,
            playerChoice: _choice,
            hostChoice: 0
        });
        emit ChallengeOpened(challengeId, player, StatusEnum.PENDING, _choice, 0);
        return challengeId;
    }

    function determineWinner(uint8 value1, uint8 value2) internal pure returns (StatusEnum) {
        if (value1 == value2) {
            return StatusEnum.TIE;
        } else if (
            (value1 == 1 && value2 == 3) ||
            (value1 == 2 && value2 == 1) ||
            (value1 == 3 && value2 == 2)                
        ){
            return StatusEnum.WON;
           } 
            return StatusEnum.LOST;
            }

    function fulfillRandomness(uint256 challengeId, uint256 _randomwords) internal override {
        ChallengeStatus storage challenge = s_challenges[challengeId];
        require(challenge.exists, "Challenge not found");

        uint hostChoice = uint8((_randomwords[0] % 3) + 1);

        StatusEnum status = determineWinner(challenge.playerChoice, hostChoice);

        challenge.hostchoice = hostChoice;
        challenge.status = status;

        if (status == StatusEnum.WON) {
            payable(challenge.player).transfer(challenge.bet * 2);
        } else if (status == StatusEnum.TIE) {
               payable(challenge.player).transfer(challenge.bet);
           }
        emit ChallengeClosed(
            challengeId,
            challenge.player,
            status,
            challenge.playerChoice,
            hostChoice
        );
    }

    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {
        emit Recieved(msg.sender, msg.value);
    }
}