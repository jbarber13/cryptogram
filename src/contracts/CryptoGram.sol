// SPDX-License-Identifier: LICENSE
pragma solidity >=0.5.0;

//pragma experimental ABIEncoderV2;

//use ganache-cli --allowUnlimitedContractSize  --gasLimit 0xFFFFFFFFFFFF

contract CryptoGram {
    string public name =
        "CryptoGram - decentralized image sharing social media platform";
    string public contractDescription =
        "version 2 of the original DSM - decentralized social media, many new features, and accounts are tied to the user's wallet address";

    uint256 public userCount = 0;
    uint256 public postCount = 0;
    uint256 public commentCount = 0;
    mapping(address => User) public users;
    mapping(uint256 => Post) public posts;
    mapping(uint256 => Comment) public comments;

    //keep track of deleted objects
    mapping(uint256 => bool) public deletedPosts;
    mapping(uint256 => bool) public deletedComments;

    struct Post {
        uint256 id;
        string imageHash;
        string title;
        address payable author;
        uint256 tipAmount;
        string link;
        string status;
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

    event PostTipped(
        uint256 id,
        string title,
        address author,
        uint256 tipAmount,
        uint256 timeStamp
    );

    event PostAdded(
        uint256 id,
        string imageHash,
        string title,
        address author,
        string link,
        string status,
        uint256 timeStamp
    );

    event PostDeleted(uint256 id, string title, address author, uint256 timeStamp);

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
    event CommentDeleted(uint256 id, address author, uint256 timeStamp);

    /******************FUNCTIONS*************************/

    //Fallback: reverts if Ether is sent to this contract unintentionally
    function() external {
        revert();
    }

    function tipPost(uint256 _id) public payable {

        //require valid ID
        require(_id > 0 && _id <= postCount);
        require(!deletedPosts[_id]);

        //get post
        Post memory _post = posts[_id];
        //get author
        address payable _author = _post.author;

        //send tip to author
        address(_author).transfer(msg.value);

        //update tip amount and mapping
        _post.tipAmount = _post.tipAmount + msg.value;
        posts[_id] = _post;

        emit PostTipped(
            _id,
            _post.title,
            _author,
            _post.tipAmount, 
            now
        );

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

        //emit event
        emit UserDeleted(msg.sender, now);
    }

    //hash should be 0 if no image is present
    function makePost(
        string memory _hash,
        string memory _desc,
        string memory _title,
        string memory _link
    ) public {
        require(bytes(_title).length > 0);
        require(bytes(_link).length > 0);
        require(msg.sender != address(0x0));

        postCount++;

        posts[postCount] = Post(
            postCount,
            _hash,
            _title,
            msg.sender,
            0,
            _link,
            _desc,
            now
        );
        emit PostAdded(
            postCount,
            _hash,
            _title,
            msg.sender,
            _link,
            _desc,
            now
        );
    }

    function deletePost(uint256 _postID) public {
        //require user address to exist
        require(msg.sender != address(0x0));

        //require valid post ID
        require(_postID > 0 && _postID <= postCount);
        require(!deletedPosts[_postID]);

        //get post, title, and author
        Post memory _post = posts[_postID];
        address _author = _post.author;
        string memory _title = _post.title;
        //check if image author matches message sender - only delete your own comments
        require(msg.sender == _author);

        deletedPosts[_postID] = true;
        delete (posts[_postID]);

        //emit event
        emit PostDeleted(_postID, _title, _author, now);

    }

    function comment(uint256 _postID, string memory _comment) public {
        require(bytes(_comment).length > 0);
        require(_postID > 0 && _postID <= postCount);
        require(!deletedPosts[_postID]);

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
        //require valid ID
        require(_commentID > 0 && _commentID <= commentCount);
        require(!deletedComments[_commentID]);

        //get comment
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
        emit CommentTipped(
            commentCount,
            _postID,
            _commentString,
            msg.sender,
            0,
            now
        );
    }

    function deleteComment(uint256 _commentID) public {
        //require valid ID
        require(_commentID > 0 && _commentID <= commentCount);
        require(!deletedComments[_commentID]);

        Comment memory _comment = comments[_commentID];

        address _author = _comment.author;

        //check if image author matches message sender - only delete your own comments
        require(msg.sender == _author);

        delete (comments[_commentID]);
        deletedComments[_commentID] = true;

        //emit event
        emit CommentDeleted(_commentID, _author, now);
    }

    function updateUser(string memory _type, string memory _value) public {
        //require user address to exist
        require(msg.sender != address(0x0));

        //get user
        User memory _user = users[msg.sender];

        //user can only modify their own account
        require(_user.userAccount == msg.sender);

        //compare type to appropriate user attribute
        if (keccak256(bytes(_type)) == keccak256(bytes("userName"))) {
            //update value and put back into mapping
            _user.userName = _value;
            users[msg.sender] = _user;
        } else if (keccak256(bytes(_type)) == keccak256(bytes("location"))) {
            _user.location = _value;
            users[msg.sender] = _user;
        } else if (keccak256(bytes(_type)) == keccak256(bytes("phone"))) {
            _user.phone = _value;
            users[msg.sender] = _user;
        } else if (keccak256(bytes(_type)) == keccak256(bytes("email"))) {
            _user.email = _value;
            users[msg.sender] = _user;
        } else if (keccak256(bytes(_type)) == keccak256(bytes("occupation"))) {
            _user.occupation = _value;
            users[msg.sender] = _user;
        } else {
            revert();
        }
        emit UserUpdated(msg.sender, _type, _value, now);
    }
}
