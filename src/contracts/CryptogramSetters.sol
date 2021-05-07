// SPDX-License-Identifier: LICENSE
pragma solidity >=0.5.0;

//pragma experimental ABIEncoderV2;

//use ganache-cli --allowUnlimitedContractSize  --gasLimit 0xFFFFFFFFFFFF

contract CryptogramSetters {
    string public name =
        "CryptogramSetters - setter methods for Cryptogram";
    



    

    event UserUpdated(
        address userAccount,
        string valueChanged,
        string newValue,
        uint256 timeStamp
    );

    

    /******************FUNCTIONS*************************/

    //Fallback: reverts if Ether is sent to this contract unintentionally
    function() external {
        revert();
    }

    /***************Setter Functions********************/
    function setUserName(string memory _userName) public {
        
    }

    function setLocation(string memory _location) public {
        
    }

    function setPhone(string memory _phone) public {
        
    }

    function setEmail(string memory _email) public {
        
    }

    function setOccupation(string memory _occupation) public {
        
    }
}
