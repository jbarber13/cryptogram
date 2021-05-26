const { assert } = require('chai');
const { default: Web3 } = require('web3');

const CryptoGram = artifacts.require("CryptoGram");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('CryptoGram', ([deployer, author, tipper, otherUser, deletedUser, commentor, imposter]) => {
  let cryptogram

  before(async () => {
    cryptogram = await CryptoGram.deployed()
  })

  describe('Deployment', async () => {
    it('is deployed', async () => {
      const address = await cryptogram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has the correct name', async () => {
      const name = await cryptogram.name()
      assert.equal(name, 'CryptoGram - decentralized image sharing social media platform')
    })
  })

  describe('Contract Functions', async () => {
    let result, postCount, desc, hash, title, link, makePostResult
    hash = "makePost Image Hash"
    desc = "makePost Image Description"
    title = "makePost Title"
    link = "makePost link"

    before(async () => {
      makePostResult = await cryptogram.makePost(hash, desc, title, link, { from: author })
      postCount = await cryptogram.postCount()
    })

    describe('Create Posts', async () => {
      describe('Success - with Image', async () => {
        it('creates a post with the required attributes', async () => {
          assert.equal(postCount, 1)
          const post = await cryptogram.posts(postCount)
          assert.equal(post.id.toNumber(), postCount.toNumber(), 'ID is correct')
          assert.equal(post.imageHash, hash, 'imageHash is correct')
          assert.equal(post.title, title, 'title is correct')
          assert.equal(post.author, author, 'author is correct')
          assert.equal(post.link, link, 'link is correct')
          assert.equal(post.status, desc, 'status is correct')
          post.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })

        it('emits a PostAdded event', async () => {
          const log = makePostResult.logs[0]//PostAdded - happens after the image added event, in the logs at [0]
          log.event.should.eq('PostAdded')
          const event = log.args
          assert.equal(event.id.toNumber(), postCount.toNumber(), 'ID is correct')
          assert.equal(event.imageHash, hash, 'imageHash is correct')
          assert.equal(event.title, title, 'title is correct')
          assert.equal(event.author, author, 'author is correct')
          assert.equal(event.link, link, 'link is correct')
          assert.equal(event.status, desc, 'status is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
      })//with image
      describe('Failure', async () => {
        it('prevents a post without a title', async () => {
          await cryptogram.makePost(hash, desc, '', link, { from: author }).should.be.rejected
        })
      })
    })//create Posts

    describe('Tipping Posts', async () => {
      let oldAuthorBalance

      before(async () => {
        oldAuthorBalance = await web3.eth.getBalance(author)
        oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
        result = await cryptogram.tipPost(postCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })
      })
      describe('Success', async () => {
        it('tips author and emits event with correct data', async () => {
          let tipAmount
          tipAmount = web3.utils.toWei('1', 'Ether')
          const log = result.logs[0]
          log.event.should.eq('PostTipped')
          const event = log.args
          assert.equal(event.id.toNumber(), postCount.toNumber(), 'ID is correct')
          assert.equal(event.title, title, 'Title is correct')
          assert.equal(event.author, author, 'author is correct')
          assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')

        })
        it('updates author balance', async () => {
          let newAuthorBalance = await web3.eth.getBalance(author)
          newAuthorBalance = new web3.utils.BN(newAuthorBalance)

          let tipAmount
          tipAmount = web3.utils.toWei('1', 'Ether')
          let tippedPost = await cryptogram.posts(postCount)
          //console.log(tippedPost.tipAmount.toString())
          assert.equal(tippedPost.tipAmount, tipAmount)


          tipAmount = new web3.utils.BN(tipAmount)
          const expectedBalance = oldAuthorBalance.add(tipAmount)

          assert.equal(newAuthorBalance.toString(), expectedBalance.toString())
          assert.notEqual(newAuthorBalance, oldAuthorBalance)
        })

      })
      describe('Failure', async () => {
        it('prevents an invalid post ID from being tipped', async () => {
          await cryptogram.tipPost(99999, { from: tipper, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected
        })
      })
    })//tipping Images    

    describe('Adding Users', async () => {
      //addUser(string memory _userName, string memory _status, string memory _location, string memory _phone, string memory _email, string memory _occupation)
      let userName, status, location, phone, email, occupation
      userName = "otherUser"
      imageHash = "profile picture hash"
      bio = "first user added"
      location = "Earth"
      contact = "contact info"
      occupation = "lucrative posistion at GNB"
      before(async () => {
        result = await cryptogram.addUser(userName, imageHash, bio, location, occupation, { from: otherUser })
      })
      describe('Success', async () => {
        it('adds user account name to mapping', async () => {
          const testUser = await cryptogram.users(otherUser)
          assert.equal(testUser.userAccount.toString(), otherUser.toString(), 'User Account is correct')
          assert.equal(testUser.userName, userName, 'userName is correct')
          assert.equal(testUser.imageHash, imageHash, 'imageHash is correct')
          assert.equal(testUser.bio, bio, 'bio is correct')
          assert.equal(testUser.location, location, 'location is correct')
          assert.equal(testUser.occupation, occupation, 'occupation is correct')
          testUser.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
        it('emits a UserAdded event', async () => {
          const log = result.logs[0]
          log.event.should.eq('UserAdded')
          const event = log.args
          assert.equal(event.userAccount.toString(), otherUser.toString(), 'User Account is correct')
          assert.equal(event.userName, userName, 'userName is correct')
          assert.equal(event.imageHash, imageHash, 'imageHash is correct')
          assert.equal(event.bio, bio, 'bio is correct')
          assert.equal(event.location, location, 'location is correct')
          assert.equal(event.occupation, occupation, 'occupation is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })

      })
      describe('Failure', async () => {
        it('prevents an invalid address from being added to the mapping', async () => {
          await cryptogram.addUser(userName, status, location, phone, email, occupation, { from: 0x0 }).should.be.rejected
        })
        //require all feilds to have data
        it('prevents a user without a username from being added to the mapping', async () => {
          await cryptogram.addUser('', status, location, phone, email, occupation, { from: imposter }).should.be.rejected
        })
      })
    })//Add User

    describe('Deleting Users', async () => {
      //addUser(string memory _userName, string memory _status, string memory _location, string memory _phone, string memory _email, string memory _occupation)
      userName = "user to delete"
      imageHash = "imageHash to delete"
      bio = "bio to delete"
      location = "location to delete"
      contact = "contact to delete"
      email = "email to delete"
      occupation = "occupation to delete"
      before(async () => {
        result = await cryptogram.addUser(userName, imageHash, bio, location, occupation, { from: deletedUser })
      })
      describe('Success', async () => {
        it('deletes user account name from mapping and decrements user count', async () => {

          result = await cryptogram.deleteUser({ from: deletedUser })

          const DL = await cryptogram.users(deletedUser)

          assert.equal(DL.userAccount.toString(), (0x0), 'User Account is correct')
          assert.equal(DL.userName, '', 'userName is correct')
          assert.equal(DL.imageHash, '', 'imageHash is correct')
          assert.equal(DL.bio, '', 'bio is correct')
          assert.equal(DL.location, '', 'location is correct')
          assert.equal(DL.occupation, '', 'occupation is correct')
          DL.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')

        })
        it('emits a UserDeleted event', async () => {
          const log = result.logs[0]
          log.event.should.eq('UserDeleted')
          const event = log.args
          assert.equal(event.userAccount.toString(), deletedUser.toString(), 'User Account is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })

      })
      describe('Failure', async () => {
        it('prevents an invalid address from being deleted from to the mapping', async () => {
          await cryptogram.deleteUser({ from: 0x0 }).should.be.rejected
        })
      })
    })//Delete User

    describe('Comment Functionality', async () => {
      hash = "CommentPost Image Hash"
      desc = "CommentPost Image Description"
      title = "CommentPost Title"
      link = "CommentPost link"
      let tipAmount
      tipAmount = web3.utils.toWei('1', 'Ether')
      tipAmount = new web3.utils.BN(tipAmount)
      let comment = "Making a comment"
      let comment2 = "Making a second comment"
      let comment3 = "Making a third comment"
      let comment4 = "Making a fourth comment"
      let firstCommentResult,
        secondCommentResult,
        thirdCommentResult,
        fourthCommentResult,
        tipCommentResult,
        deleteCommentResult,
        commentCount,
        firstPostID
      before(async () => {
        makePostResult = await cryptogram.makePost(hash, desc, title, link, { from: author })
        postCount = await cryptogram.postCount()
        firstPostID = postCount.toNumber()

        //2 comments on first post
        firstCommentResult = await cryptogram.comment(postCount, comment, { from: commentor })
        secondCommentResult = await cryptogram.comment(postCount, comment2, { from: commentor })

        //new post
        makePostResult = await cryptogram.makePost(hash, desc, title, link, { from: author })
        postCount = await cryptogram.postCount()

        //2 comments on second post
        thirdCommentResult = await cryptogram.comment(postCount, comment3, { from: commentor })
        fourthCommentResult = await cryptogram.comment(postCount, comment4, { from: commentor })

        //get comment count
        commentCount = await cryptogram.commentCount()
      })
      describe('Success', async () => {
        it('creates comments for the correct post', async () => {
          let c
          var i
          for (i = 1; i <= commentCount; i++) {
            c = await cryptogram.comments(i)
            if (c.id == 1) {
              assert.equal(c.comment, comment, 'comment 1 is correct')
              assert.equal(c.postID.toNumber(), firstPostID, 'Comment 1 postID is correct')
            } else if (c.id == 2) {
              assert.equal(c.comment, comment2, 'comment 2 is correct')
              assert.equal(c.postID.toNumber(), firstPostID, 'Comment 2 postID is correct')
            }
            else if (c.id == 3) {
              assert.equal(c.comment, comment3, 'comment 3 is correct')
              assert.equal(c.postID.toNumber(), postCount, 'Comment 3 postID is correct')
            }
            else if (c.id == 4) {
              assert.equal(c.comment, comment4, 'comment 4 is correct')
              assert.equal(c.postID.toNumber(), postCount, 'Comment 4 postID is correct')
            }
          }
          it('emits CommentAdded event correctly', async () => {
            let log, event
            log = firstCommentResult.logs[0]
            log.event.should.eq('CommentAdded')
            event = log.args
            assert.equal(event.id.toNumber(), 1, 'ID is correct')
            assert.equal(event.postID.toNumber(), firstPostID, 'Post ID is correct')
            assert.equal(event.comment, comment, 'comment is correct')
            assert.equal(event.author, commentor, 'author is correct')
            event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')

            log = secondCommentResult.logs[0]
            log.event.should.eq('CommentAdded')
            event = log.args
            assert.equal(event.id.toNumber(), 2, 'ID is correct')
            assert.equal(event.postID.toNumber(), firstPostID, 'Post ID is correct')
            assert.equal(event.comment, comment2, 'comment is correct')
            assert.equal(event.author, commentor, 'author is correct')
            event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')

            log = thirdCommentResult.logs[0]
            log.event.should.eq('CommentAdded')
            event = log.args
            assert.equal(event.id.toNumber(), 3, 'ID is correct')
            assert.equal(event.postID.toNumber(), firstPostID, 'Post ID is correct')
            assert.equal(event.comment, comment3, 'comment is correct')
            assert.equal(event.author, commentor, 'author is correct')
            event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')

            log = fourthCommentResult.logs[0]
            log.event.should.eq('CommentAdded')
            event = log.args
            assert.equal(event.id.toNumber(), 4, 'ID is correct')
            assert.equal(event.postID.toNumber(), firstPostID, 'Post ID is correct')
            assert.equal(event.comment, comment4, 'comment is correct')
            assert.equal(event.author, commentor, 'author is correct')
            event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
          })//CommentAdded emit
        })//create comment
        it('tipping comments updates balances correctly', async () => {
          let oldAuthorBalance

          commentCount = await cryptogram.commentCount()
          oldAuthorBalance = await web3.eth.getBalance(commentor)
          oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
          tipCommentResult = await cryptogram.tipComment(commentCount, { from: tipper, value: tipAmount })

          let newAuthorBalance = await web3.eth.getBalance(commentor)
          newAuthorBalance = new web3.utils.BN(newAuthorBalance)

          const expectedBalance = oldAuthorBalance.add(tipAmount)

          assert.equal(newAuthorBalance.toString(), expectedBalance.toString(), 'balances are correct')
          assert.notEqual(newAuthorBalance, oldAuthorBalance, 'balances are not incorrect')
          let tippedComment = await cryptogram.comments(commentCount)
          assert.equal(tippedComment.tipAmount, '1000000000000000000', 'updated tipAmount value is correct')

          it('emits CommentTipped event', async () => {
            const log = tipCommentResult.logs[0]
            log.event.should.eq('CommentTipped')
            const event = log.args
            assert.equal(event.id.toNumber(), commentCount.toNumber(), 'ID is correct')
            assert.equal(event.postID.toNumber(), postCount.toNumber(), 'post ID is correct')
            assert.equal(event.comment, comment4, 'Comment is correct')
            assert.equal(event.author, commentor, 'author is correct')
            assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
            event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
          })//tip comment emit
        })//tip comment
        it('deletes comments correctly', async () => {
          deleteCommentResult = await cryptogram.deleteComment(commentCount, { from: commentor })
          let c = await cryptogram.comments(commentCount)
          assert.equal(c.id.toNumber(), 0, 'ID is correct after the delete')
          assert.equal(c.postID.toNumber(), 0, 'postID is correct after the delete')
          assert.equal(c.comment.toString(), '', 'comment is correct after the delete')
          assert.equal(c.author, (0x0), 'Author is correct after the delete')
          assert.equal(c.tipAmount.toNumber(), 0, 'tipAmount is correct after the delete')
          assert.equal(c.timeStamp.toNumber(), 0, 'timeStamp is correct after the delete')
          c = await cryptogram.deletedComments(commentCount)
          assert.equal(c, true, 'commentID is in the deleted comments mapping')


          it('emits CommentDeleted event', async () => {
            const log = deleteCommentResult.logs[0]
            log.event.should.eq('CommentDeleted')
            const event = logs.args
            assert.equal(event.id.toNumber(), commentCount, 'ID is correct')
            assert.equal(event.author, commentor, 'Author is correct')
            event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
          })//delete emit
        })//delete
      })
      describe('Failure', async () => {
        it('prevents an empty comment from being posted', async () => {
          await cryptogram.comment('', { from: deployer }).should.be.rejected
        })
        it('prevents a comment being made on a post with an invalid ID', async () => {
          await cryptogram.comment(9999, { from: deployer }).should.be.rejected
        })
        it('prevents a a comment with an invalid ID from being tipped', async () => {
          await cryptogram.tipComment(9999, { from: tipper, value: 1 }).should.be.rejected
        })
      })
    })//Comments


    describe('Delete Posts', async () => {
      hash = "deletePost Image Hash"
      desc = "deletePost Image Description"
      title = "deletePost Title"
      link = "deletePost Link"
      let lastPost, deletePostResult
      before(async () => {
        //make a new post with a new image to delete
        createPostResult = await cryptogram.makePost(hash, desc, title, link, { from: author })
        postCount = await cryptogram.postCount()

        //delete post and update control postCount
        deletePostResult = await cryptogram.deletePost(postCount, { from: author })
        lastPost = await cryptogram.posts(postCount)
      })
      describe('Success', async () => {
        it('deletes post from mapping', async () => {
          assert.equal(lastPost.id.toNumber(), 0, 'ID is correct after the delete')
          assert.equal(lastPost.imageHash, '', 'ImageHash is correct after the delete')
          assert.equal(lastPost.title, '', 'Title is correct after the delete')
          assert.equal(lastPost.author, (0x0), 'Author is correct after the delete')
          assert.equal(lastPost.tipAmount.toNumber(), 0, 'tipAmount is correct after the delete')
          assert.equal(lastPost.status, '', 'Status is correct after the delete')
          assert.equal(lastPost.link, '', 'Link is correct after the delete')
        })
        it('sets postID in deletedPosts mapping to true', async () => {
          const deletedPostMapping = await cryptogram.deletedPosts(postCount)
          assert.equal(deletedPostMapping, true, 'deletedPostMapping is correct after the delete')
        })
        it('emits a PostDeleted event', async () => {
          const log = deletePostResult.logs[0]//PostAdded - happens after the image added event, in the logs at [0]
          log.event.should.eq('PostDeleted')
          const event = log.args
          assert.equal(event.id.toNumber(), postCount.toNumber(), 'ID is correct')
          assert.equal(event.title, title, 'Title is correct')
          assert.equal(event.author, author, 'author is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })

      })
      describe('Failure', async () => {
        it('prevents a post from being deleted by a user that did not make the post', async () => {
          await cryptogram.deletePost(1, { from: deployer }).should.be.rejected
        })
        it('prevents a post from being deleted by blank address', async () => {
          await cryptogram.deletePost(1, { from: 0x0 }).should.be.rejected
        })
        it('prevents a post with an invalid ID from being deleted', async () => {
          await cryptogram.deletePost(9999, { from: author }).should.be.rejected
        })
      })
    })//Delete Post  

    describe('Setter Functions', async () => {
      let user, newUserName, newHash, newBio, newLocation, newOccupation
      before(async () => {
        user = await cryptogram.users(otherUser)
      })
      describe('Setting the userName', async () => {
        before(async () => {
          newUserName = "updated userName"
          user = await cryptogram.setUserName(newUserName, { from: otherUser })
        })
        it('emits a UserUpdated event', async () => {
          const log = user.logs[0]
          log.event.should.eq('UserUpdated')
          const event = log.args
          assert.equal(event.userAccount.toString(), otherUser.toString(), 'User Account is correct')
          assert.equal(event.valueChanged.toString(), "userName", 'Value Changed is correct')
          assert.equal(event.newValue.toString(), newUserName, 'New Value is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
      })
      describe('Setting the imageHash', async () => {
        before(async () => {
          newHash = "updated image hash"
          user = await cryptogram.setImageHash(newHash, { from: otherUser })
        })
        it('emits a UserUpdated event', async () => {
          const log = user.logs[0]
          log.event.should.eq('UserUpdated')
          const event = log.args
          assert.equal(event.userAccount.toString(), otherUser.toString(), 'User Account is correct')
          assert.equal(event.valueChanged.toString(), "imageHash", 'Value Changed is correct')
          assert.equal(event.newValue.toString(), newHash, 'New Value is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
      })//imageHash
      describe('Setting the bio', async () => {
        before(async () => {
          newBio = "updated bio"
          user = await cryptogram.setBio(newBio, { from: otherUser })
        })
        it('emits a UserUpdated event', async () => {
          const log = user.logs[0]
          log.event.should.eq('UserUpdated')
          const event = log.args
          assert.equal(event.userAccount.toString(), otherUser.toString(), 'User Account is correct')
          assert.equal(event.valueChanged.toString(), "bio", 'Value Changed is correct')
          assert.equal(event.newValue.toString(), newBio, 'New Value is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
      })//bio
      describe('Setting the location', async () => {
        before(async () => {
          newLocation = "updated location"
          user = await cryptogram.setLocation(newLocation, { from: otherUser })

        })
        it('emits a UserUpdated event', async () => {
          const log = user.logs[0]
          log.event.should.eq('UserUpdated')
          const event = log.args
          assert.equal(event.userAccount.toString(), otherUser.toString(), 'User Account is correct')
          assert.equal(event.valueChanged.toString(), "location", 'Value Changed is correct')
          assert.equal(event.newValue.toString(), newLocation, 'New Value is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
      })//location
      describe('Setting the occupation', async () => {
        before(async () => {

          newOccupation = "updated occupation"
          user = await cryptogram.setOccupation(newOccupation, { from: otherUser })
        })
        it('emits a UserUpdated event', async () => {
          const log = user.logs[0]
          log.event.should.eq('UserUpdated')
          const event = log.args
          assert.equal(event.userAccount.toString(), otherUser.toString(), 'User Account is correct')
          assert.equal(event.valueChanged.toString(), "occupation", 'Value Changed is correct')
          assert.equal(event.newValue.toString(), newOccupation, 'New Value is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
      })//occupation
      describe('Verrifing the new values', async () => {
        before(async () => {
          user = await cryptogram.users(otherUser)
        })
        it('ending values of otherUser is correct', async () => {
          assert.equal(user.userAccount.toString(), otherUser.toString(), 'User Account is correct')
          assert.equal(user.userName.toString(), newUserName, "userName is correct")
          assert.equal(user.imageHash.toString(), newHash, "imageHash is correct")
          assert.equal(user.bio.toString(), newBio, "bio is correct")
          assert.equal(user.location.toString(), newLocation, "location is correct")
          assert.equal(user.occupation.toString(), newOccupation, "occupation is correct")
        })
      })//endValues
      describe('Failure', async () => {
        it('prevents a post from being updated by a user that does not have a user account already', async () => {
          await cryptogram.setUserName("failureValue", { from: imposter }).should.be.rejected
          await cryptogram.setImageHash("failureValue", { from: imposter }).should.be.rejected
          await cryptogram.setBio("failureValue", { from: imposter }).should.be.rejected
          await cryptogram.setLocation("failureValue", { from: imposter }).should.be.rejected
          await cryptogram.setOccupation("failureValue", { from: imposter }).should.be.rejected 
        })
        it('prevents a user from being updated by blank address', async () => {
          await cryptogram.setUserName("failureValue", { from: 0x0 }).should.be.rejected
          await cryptogram.setImageHash("failureValue", { from: 0x0 }).should.be.rejected
          await cryptogram.setBio("failureValue", { from: 0x0 }).should.be.rejected
          await cryptogram.setLocation("failureValue", { from: 0x0 }).should.be.rejected
          await cryptogram.setOccupation("failureValue", { from: 0x0 }).should.be.rejected
        })        
      })//failure
    })//Setter Functions
  })//CONTRACT FUNCTIONS
})//CONTRACT





