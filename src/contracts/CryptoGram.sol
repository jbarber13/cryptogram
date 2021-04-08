// SPDX-License-Identifier: LICENSE
pragma solidity >=0.5.0;


contract CryptoGram {
  string public name = "CryptoGram - decentralized image sharing social media platform";
  string public contractDescription = "version 2 of the original DSM - decentralized social media, now allows for deleting images, and registering accounts tied to your wallet address";

  
  uint public imageCount = 0;
  uint public userCount = 0;
  mapping(uint => Image) public images;
  mapping(address => User) public users;

  struct Image {
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
    uint256 timeStamp;
  }

  struct User {
    address userAddress;
    string userName;
    string country;
    string state;
    string phone;
    uint256 timeCreated;
  }

  event UserAdded ( 
    address userAddress,
    string userName,
    string country,
    string state,
    string phone,
    uint256 timeCreated
  );

  event ImageCreated(
    uint id,
    string hash, 
    string description, 
    uint tipAmount, 
    address payable author,
    uint256 timeStamp
  );

  event ImageDeleted(
    uint id,
    address author,
    uint256 timeStamp
  );


  event ImageTipped(
    uint id,
    string hash, 
    string description, 
    uint tipAmount, 
    address payable author
  );

  //Fallback: reverts if Ether is sent to this contract unintentionally 
	function() external {
		revert();
	}

  //tip posts
  function tipImageOwner(uint _id) public payable{
    //require valid ID
    require(_id > 0 && _id <= imageCount);

    //get image
    Image memory _image = images[_id];

    //get image author
    address payable _author = _image.author;

    //send to author
    address(_author).transfer(msg.value);

    //update tip amount and put back into mapping
    _image.tipAmount = _image.tipAmount + msg.value;
    images[_id] = _image;

    //emit event
    emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
  }

  //add new image hash
  function uploadImage(string memory _hash, string memory _desc) public{    
    //require a hash to be included    
    require(bytes(_hash).length > 0);
    
    //require a description to be included
    require(bytes(_desc).length > 0);

    //require uploader address to exist
    require(msg.sender != address(0x0));
    
    //increment image ID
    imageCount++;

    //add image hash to contract
    images[imageCount] = Image(imageCount, _hash, _desc, 0, msg.sender, now);

    //emit event
    emit ImageCreated(imageCount, _hash, _desc, 0, msg.sender, now);
  }

  function deleteImage(uint _id) public {
    //require valid ID
    require(_id > 0 && _id <= imageCount);

    //get image
    Image memory _image = images[_id];

    //get image author
    address payable _author = _image.author;

    //check if image author matches message sender - only delete your own images
    require(msg.sender == _author);

    delete(images[_id]);
    emit ImageDeleted(_id, _author, now);
  }

  
}