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
    address userAccount; //wallet address
    string userName;
    string status;
    string location;
    string phone;
    string email;
    string occupation;
    uint256 timeStamp;
  }

  event UserAdded ( 
    address userAccount, //wallet address
    string userName,
    string status,
    string location,
    string phone,
    string email, 
    string occupation,
    uint256 timeStamp
  );
  event UserDeleted (
    address userAccount,
    uint256 timeStamp
  );

  event UserUpdated(
    address userAccount, 
    string valueChanged,
    string newValue,
    uint256 timeStamp
  );

  event ImageAdded(
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
    address payable author,
    uint256 timeStamp
  );

  

  //Fallback: reverts if Ether is sent to this contract unintentionally 
	function() external {
		revert();
	}

  
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
    emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author, now);
  }

  
  function uploadImage(string memory _hash, string memory _desc) public{    
    //require a hash to be included    
    require(bytes(_hash).length > 0);
    
    //require a description to be included
    require(bytes(_desc).length > 0);

    //require uploader address to exist
    require(msg.sender != address(0x0));
    
    //increment image ID
    imageCount++;

    //add image hash to mapping
    images[imageCount] = Image(imageCount, _hash, _desc, 0, msg.sender, now);

    //emit event
    emit ImageAdded(imageCount, _hash, _desc, 0, msg.sender, now);
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

    //delete image from mapping and emit event
    delete(images[_id]);
    emit ImageDeleted(_id, _author, now);
  }

  function addUser(string memory _userName, string memory _status, string memory _location, string memory _phone, string memory _email, string memory _occupation) public {
    //require user address to exist
    require(msg.sender != address(0x0));

    //require all fields to be populated
    require(bytes(_userName).length > 0);    
    require(bytes(_status).length > 0);
    require(bytes(_location).length > 0);
    require(bytes(_email).length > 0);
    require(bytes(_occupation).length > 0);
   

    //increment count of users
    userCount++;

    //add user to mapping
    users[msg.sender] = User(msg.sender, _userName, _status, _location,  _phone, _email, _occupation, now);

    //emit event
    emit UserAdded(msg.sender, _userName, _status, _location,  _phone, _email,  _occupation, now);
  }

  function deleteUser() public {
    //require user address to exist
    require(msg.sender != address(0x0));

    //decrement user count - keep a total of active users on the contract
    userCount--;

    //delete from mapping
    delete(users[msg.sender]);

    //emit event
    emit UserDeleted(msg.sender, now);
  }

/***************Setter Functions********************/
  function setUserName(string memory _userName) public{
    //require user address to exist
    require(msg.sender != address(0x0));

    //get user
    User memory _user = users[msg.sender];

    //update value and put back into mapping
    _user.userName = _userName;
    users[msg.sender] = _user;

    //emit event
    emit UserUpdated(msg.sender, "userName", _userName, now);
  }

  function setLocation(string memory _location) public{
    //require user address to exist
    require(msg.sender != address(0x0));

    //get user
    User memory _user = users[msg.sender];

    //update value and put back into mapping
    _user.location = _location;
    users[msg.sender] = _user;

    //emit event
    emit UserUpdated(msg.sender, "location", _location, now);
  }
  
  function setPhone(string memory _phone) public{
    //require user address to exist
    require(msg.sender != address(0x0));

    //get user
    User memory _user = users[msg.sender];

    //update value and put back into mapping
    _user.phone = _phone;
    users[msg.sender] = _user;

    //emit event
    emit UserUpdated(msg.sender, "phone", _phone, now);
  }

  function setEmail(string memory _email) public{
    //require user address to exist
    require(msg.sender != address(0x0));

    //get user
    User memory _user = users[msg.sender];

    //update value and put back into mapping
    _user.email = _email;
    users[msg.sender] = _user;

    //emit event
    emit UserUpdated(msg.sender, "email", _email, now);
  }

  function setOccupation(string memory _occupation) public{
    //require user address to exist
    require(msg.sender != address(0x0));

    //get user
    User memory _user = users[msg.sender];

    //update value and put back into mapping
    _user.occupation = _occupation;
    users[msg.sender] = _user;

    //emit event
    emit UserUpdated(msg.sender, "occupation", _occupation, now);
  }
  

  
}