pragma solidity >=0.5.0;

import "./DaiToken.sol";
import "./DappToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    //runs once, when smart contract gets deployed to network
    //store reference to Dapp/Dai tokens that have been deployed to network
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        //grab address of the tokens that are deployed, and put in project
        dappToken = _dappToken;
        daiToken = _daiToken;
    }
}
