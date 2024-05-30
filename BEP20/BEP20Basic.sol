// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BEP20Basic is IERC20 {
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;

    mapping (address => uint256) balances;

    mapping (address => mapping (address => uint256)) allowances;

    uint256 _totalSupply = 100000000 * 10**18; //100mln

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;

    }
    function totalSupply() public view override returns (uint256) {
        return totalSupply;
    }

    function balanceOf(address tokenOwner)public view override returns(uint256){
        return balances[tokenOwner];
    }
    function transfer(address reciever, uint256 numTokens) public override returns (bool){
        require(numtokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender] - numTokens;
        balances[reciever] = balances[reciever] + numTokens;
        emit Transfer(msg.sender,reciever, numtokens);
        return true;
    }
    function approve(address delegate, uint256 numTokens) public override returns (bool){
        allowances[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowances(address owner, address delegate) public view override returns (uint){
        return allowances[owner][delegate];
    }
}