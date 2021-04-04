pragma solidity >=0.5.0;

import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public isStaking;
    mapping(address => bool) public hasStaked;

    //runs once, when smart contract gets deployed to network
    //store reference to Dapp/Dai tokens that have been deployed to network
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        //grab address of the tokens that are deployed, and put in project
        dappToken = _dappToken;
        daiToken = _daiToken;
    }
    
    //Stake Tokens (deposit)
    function stakeTokens(uint _amount) public {

        // Transfer Mock Dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array *only* if they haven't staked already
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }
    //Unstaking Tokens (withdraw)

    //Issue Tokens (interest)
}