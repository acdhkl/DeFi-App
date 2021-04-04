pragma solidity >=0.5.0;

import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm {
    address public owner;
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
        owner = msg.sender;
    }
    
    //Stake Tokens (deposit)
    function stakeTokens(uint _amount) public {
        require(_amount >0, 'amount must be positive');
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


    // Issue 1 DAPP token for every DAI deposited, for each investor
    function issueTokens() public{
        require(msg.sender == owner, 'caller must be the owner');

        //Issue tokens to all stakers
        for(uint i =0; i< stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if (balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }

    //Unstaking Tokens (withdraw)
    function unstakeTokens() public {
        //get staking balance
        uint balance = stakingBalance[msg.sender];

        //require that balance is positive
        require(balance > 0, 'staking balance must be pos.');

        // transfer mDai tokens out of contract to the caller
        daiToken.transfer(msg.sender, balance);

        //reset staking balance
        stakingBalance[msg.sender] = 0;

        //update staking status
        isStaking[msg.sender] = false;
    }



}