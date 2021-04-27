// SPDX-License-Identifier: LICENSE
pragma solidity >=0.5.0;

//pragma experimental ABIEncoderV2;

//use ganache-cli --allowUnlimitedContractSize  --gasLimit 0xFFFFFFFFFFFF

contract CryptoGram {
    string public name =
        "CryptoGram - decentralized image sharing social media platform";
    string public contractDescription =
        "version 2 of the original DSM - decentralized social media, many new features, and accounts are tied to the user's wallet address";

    uint256 public imageCount = 0;
    uint256 public userCount = 0;
    uint256 public postCount = 0;
    uint256 public commentCount = 0;
    mapping(uint256 => Image) public images;
    mapping(address => User) public users;
    mapping(uint256 => Post) public posts;
    mapping(uint256 => Comment) public comments;

    mapping(uint256 => bool) public deletedImages;
    mapping(address => bool) public deletedUsers;
    mapping(uint256 => bool) public deletedPosts;
    mapping(uint256 => bool) public deletedComments;

    struct Post {
        uint256 id;
        uint256 imageID;
        string title;
        address author;
        string link;
        uint256 timeStamp;
    }

    struct Comment {
        uint256 id;
        uint256 postID;
        string comment;
        address payable author;
        uint256 tipAmount;
        uint256 timeStamp;
    }

    struct Image {
        uint256 id;
        string hash;
        string description;
        uint256 tipAmount;
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
    /******************EVENTS*************************/
    event UserAdded(
        address userAccount, //wallet address
        string userName,
        string status,
        string location,
        string phone,
        string email,
        string occupation,
        uint256 timeStamp
    );
    event UserDeleted(address userAccount, uint256 timeStamp);

    event UserUpdated(
        address userAccount,
        string valueChanged,
        string newValue,
        uint256 timeStamp
    );

    event ImageAdded(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        address payable author,
        uint256 timeStamp
    );

    event ImageDeleted(uint256 id, address author, uint256 timeStamp);

    event ImageTipped(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        address payable author,
        uint256 timeStamp
    );

    event PostAdded(
        uint256 id,
        uint256 imageID,
        string title,
        address author,
        string link,
        uint256 timeStamp
    );

    event PostDeleted(uint256 id, uint256 timeStamp);

    event CommentAdded(
        uint256 id,
        uint256 postID,
        string comment,
        address author,
        uint256 timeStamp
    );
    event CommentTipped(
        uint256 id,
        uint256 postID,
        string comment,
        address author,
        uint256 tipAmount,
        uint256 timeStamp
    );
    event CommentDeleted(
        uint256 id,
        address author,
        uint256 timeStamp
    );

    /******************FUNCTIONS*************************/

    //Fallback: reverts if Ether is sent to this contract unintentionally
    function() external {
        revert();
    }

    function tipImageOwner(uint256 _id) public payable {
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
        emit ImageTipped(
            _id,
            _image.hash,
            _image.description,
            _image.tipAmount,
            _author,
            now
        );
    }

    function uploadImage(string memory _hash, string memory _desc) public {
        //require a hash to be included
        require(bytes(_hash).length > 0);

        //require a description to be included
        require(bytes(_desc).length > 0);

        //require uploader address to exist
        require(msg.sender != address(0x0));

        //increment image ID
        imageCount++;

        //add image hash to mapping
        images[imageCount] = Image(
            imageCount,
            _hash,
            _desc,
            0,
            msg.sender,
            now
        );

        //emit event
        emit ImageAdded(imageCount, _hash, _desc, 0, msg.sender, now);
    }

    function deleteImage(uint256 _id) public {
        //require valid ID
        require(_id > 0 && _id <= imageCount);

        //get image
        Image memory _image = images[_id];

        //get image author
        address _author = _image.author;

        //check if image author matches message sender - only delete your own images
        require(msg.sender == _author);

        //delete image from mapping and emit event
        delete (images[_id]);
        deletedImages[_id] = true;
        emit ImageDeleted(_id, _author, now);
    }

    function addUser(
        string memory _userName,
        string memory _status,
        string memory _location,
        string memory _phone,
        string memory _email,
        string memory _occupation
    ) public {
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
        users[msg.sender] = User(
            msg.sender,
            _userName,
            _status,
            _location,
            _phone,
            _email,
            _occupation,
            now
        );

        //emit event
        emit UserAdded(
            msg.sender,
            _userName,
            _status,
            _location,
            _phone,
            _email,
            _occupation,
            now
        );
    }

    function deleteUser() public {
        //require user address to exist
        require(msg.sender != address(0x0));

        //decrement user count - keep a total of active users on the contract
        userCount--;

        //delete from mapping
        delete (users[msg.sender]);
        deletedUsers[msg.sender] = true;

        //emit event
        emit UserDeleted(msg.sender, now);
    }

    function makePost(
        uint256 _imageID,
        string memory _title,
        string memory _link
    ) public {
        //require user address to exist
        require(msg.sender != address(0x0));

        postCount++;

        posts[postCount] = Post(
            postCount,
            _imageID,
            _title,
            msg.sender,
            _link,
            now
        );

        emit PostAdded(postCount, _imageID, _title, msg.sender, _link, now);
    }

    function deletePost(uint256 _postID) public {
        //require user address to exist
        require(msg.sender != address(0x0));

        Post memory _post = posts[_postID];
        address _author = _post.author;
        //check if image author matches message sender - only delete your own comments
        require(msg.sender == _author);

        delete (posts[_postID]);
        deletedPosts[_postID] = true;

        //emit event
        emit PostDeleted(_postID, now);
    }

    function comment(uint256 _postID, string memory _comment) public {
        //require

        commentCount++;
        comments[commentCount] = Comment(
            commentCount,
            _postID,
            _comment,
            msg.sender,
            0,
            now
        );

        //emit event
        emit CommentAdded(commentCount, _postID, _comment, msg.sender, now);
    }

    function tipComment(uint256 _commentID) public payable {
        //get image
        Comment memory _comment = comments[_commentID];

        //get comment data
        address payable _author = _comment.author;
        uint256 _postID = _comment.postID;
        string memory _commentString = _comment.comment;

        //send to author
        address(_author).transfer(msg.value);

        //update tip amount and put back into mapping
        _comment.tipAmount = _comment.tipAmount + msg.value;
        comments[_commentID] = _comment;

        //emit event
        emit CommentTipped(commentCount, _postID, _commentString, msg.sender, 0, now);
    }

    function deleteComment(uint256 _commentID) public {
        //require valid ID
        require(_commentID > 0 && _commentID <= commentCount);

        Comment memory _comment = comments[_commentID];

        address _author = _comment.author;

        //check if image author matches message sender - only delete your own comments
        require(msg.sender == _author);

        delete (comments[_commentID]);
        deletedComments[_commentID] = true;

        //emit event
        emit CommentDeleted(_commentID, _author, now);
    }

    /***************Setter Functions********************/
    function setUserName(string memory _userName) public {
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

    function setLocation(string memory _location) public {
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

    function setPhone(string memory _phone) public {
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

    function setEmail(string memory _email) public {
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

    function setOccupation(string memory _occupation) public {
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
