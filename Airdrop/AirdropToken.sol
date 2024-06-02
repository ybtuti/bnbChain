// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IfakeToken {
    function transfer (address _to, uint256 _amount) external;

    function transferFrom(address _from, address _to, uint256 _amount) external;

}

contract AirdropToken {
    function airdropWithTransfer(IfakeToken _token, address[] memory _addressArray, uint[] memory _amountArray) public{
        for(uint i = 0; i < _addressArray.length; i++){
            _token.transfer(_addressArray[i], _amountArray[i]);
        }
    }
}