const { assert } = require('chai');
const { default: Web3 } = require('web3');

const CryptoGram = artifacts.require("CryptoGram");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('CryptoGram', ([deployer, author, tipper, otherUser, deletedUser]) => {
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
    let result, imageCount, userCount, postCount, desc, hash, title, link, createPostResult
    hash = "CreatePost Image Hash"
    desc = "CreatePost Image Description"
    title = "makePost Title"
    link = "makePost link"

    before(async () => {
      const firstPost = await cryptogram.makePost(hash, desc, title, link, true, { from: author })
      imageCount = await cryptogram.imageCount()
      postCount = await cryptogram.postCount()
    })

    describe('Create Posts', async () => {
      describe('Success', async () => {
        it('creates a post with the required attributes', async () => {



        })
        //compare result to createPostResult.imageID
        it('image for the post is correct', async () => {

        })
        it('emits a PostAdded event', async () => {


        })

      })
      describe('Failure', async () => {
        it('prevents a post with an invalid image ID from being created', async () => {

        })
        it('prevents a post without a title', async () => {
        })
        it('prevents a post without a link', async () => {
        })
        it('prevents a post from being created with an image that has been deleted', async () => {

        })
      })
    })//create Posts

    describe('Delete Posts', async () => {

      before(async () => {

      })
      describe('Success', async () => {
        it('deletes user account name from mapping and decrements user count', async () => {


        })
        it('emits a UserDeleted event', async () => {

        })

      })
      describe('Failure', async () => {

      })
    })//Delete Post 

    describe('Tipping Images', async () => {
      let oldAuthorBalance

      before(async () => {
        imageCount = await cryptogram.imageCount()
        oldAuthorBalance = await web3.eth.getBalance(author)
        oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
        result = await cryptogram.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })
      })
      describe('Success', async () => {
        it('tips author and emits event with correct data', async () => {
          let tipAmount
          tipAmount = web3.utils.toWei('1', 'Ether')
          const log = result.logs[0]
          log.event.should.eq('ImageTipped')
          const event = log.args
          assert.equal(event.id.toNumber(), imageCount.toNumber(), 'ID is correct')
          assert.equal(event.hash, hash, 'Hash is correct')
          assert.equal(event.description, desc, 'description is correct')
          assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
          assert.equal(event.author, author, 'author is correct')


        })
        it('updates author balance', async () => {
          let newAuthorBalance = await web3.eth.getBalance(author)
          newAuthorBalance = new web3.utils.BN(newAuthorBalance)

          let tipAmount
          tipAmount = web3.utils.toWei('1', 'Ether')
          tipAmount = new web3.utils.BN(tipAmount)

          const expectedBalance = oldAuthorBalance.add(tipAmount)

          assert.equal(newAuthorBalance.toString(), expectedBalance.toString())
          assert.notEqual(newAuthorBalance, oldAuthorBalance)
        })
        
      })
      describe('Failure', async () => {
        it('prevents an invalid image ID from being tipped', async () => {
          await cryptogram.tipImageOwner(99999, { from: tipper, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected
        })
      })
    })//tipping Images    

    describe('Adding Users', async () => {
      //addUser(string memory _userName, string memory _status, string memory _location, string memory _phone, string memory _email, string memory _occupation)
      let userName, status, location, phone, email, occupation
      userName = "otherUser"
      status = "first user added"
      location = "Earth"
      phone = "5555555555"
      email = "realEmail@email.email"
      occupation = "lucrative posistion at GNB"
      before(async () => {
        result = await cryptogram.addUser(userName, status, location, phone, email, occupation, { from: otherUser })
        userCount = await cryptogram.userCount()
      })
      describe('Success', async () => {
        it('adds user account name to mapping', async () => {
          assert.equal(userCount, 1)
          const testUser = await cryptogram.users(otherUser)
          assert.equal(testUser.userAccount.toString(), otherUser.toString(), 'User Account is correct')
          assert.equal(testUser.userName, userName, 'userName is correct')
          assert.equal(testUser.status, status, 'status is correct')
          assert.equal(testUser.location, location, 'location is correct')
          assert.equal(testUser.phone, phone, 'phone is correct')
          assert.equal(testUser.email, email, 'email is correct')
          assert.equal(testUser.occupation, occupation, 'occupation is correct')
          testUser.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
        it('emits a UserAdded event', async () => {
          const log = result.logs[0]
          log.event.should.eq('UserAdded')
          const event = log.args
          assert.equal(event.userAccount.toString(), otherUser.toString(), 'User Account is correct')
          assert.equal(event.userName, userName, 'userName is correct')
          assert.equal(event.status, status, 'status is correct')
          assert.equal(event.location, location, 'location is correct')
          assert.equal(event.phone, phone, 'phone is correct')
          assert.equal(event.email, email, 'email is correct')
          assert.equal(event.occupation, occupation, 'occupation is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })

      })
      describe('Failure', async () => {
        it('prevents an invalid address from being added to the mapping', async () => {
          await cryptogram.addUser(userName, status, location, phone, email, occupation, { from: 0x0 }).should.be.rejected
        })
        //require all feilds to have data
        it('prevents a user with an invalid username from being added to the mapping', async () => {
          await cryptogram.addUser('', status, location, phone, email, occupation, { from: 0x0 }).should.be.rejected
        })
        it('prevents a user with an invalid status from being added to the mapping', async () => {
          await cryptogram.addUser(userName, '', location, phone, email, occupation, { from: 0x0 }).should.be.rejected
        })
        it('prevents a user with an invalid location from being added to the mapping', async () => {
          await cryptogram.addUser(userName, status, '', phone, email, occupation, { from: 0x0 }).should.be.rejected
        })
        it('prevents a user with an invalid phone from being added to the mapping', async () => {
          await cryptogram.addUser(userName, status, location, '', email, occupation, { from: 0x0 }).should.be.rejected
        })
        it('prevents a user with an invalid email from being added to the mapping', async () => {
          await cryptogram.addUser(userName, status, location, phone, '', occupation, { from: 0x0 }).should.be.rejected
        })
        it('prevents a user with an invalid occupation from being added to the mapping', async () => {
          await cryptogram.addUser(userName, status, location, phone, email, '', { from: 0x0 }).should.be.rejected
        })
      })
    })//Add User

    describe('Deleting Users', async () => {
      //addUser(string memory _userName, string memory _status, string memory _location, string memory _phone, string memory _email, string memory _occupation)
      userName = "user to delete"
      status = "status to delete"
      location = "location to delete"
      phone = "phone to delete"
      email = "email to delete"
      occupation = "occupation to delete"
      before(async () => {
        result = await cryptogram.addUser(userName, status, location, phone, email, occupation, { from: deletedUser })
        userCount = await cryptogram.userCount()
      })
      describe('Success', async () => {
        it('deletes user account name from mapping and decrements user count', async () => {
          assert.equal(userCount, 2)

          result = await cryptogram.deleteUser({ from: deletedUser })
          userCount = await cryptogram.userCount()
          assert.equal(userCount, 1)

          const DL = await cryptogram.users(deletedUser)

          assert.equal(DL.userAccount.toString(), (0x0), 'User Account is correct')
          assert.equal(DL.userName, '', 'userName is correct')
          assert.equal(DL.status, '', 'status is correct')
          assert.equal(DL.location, '', 'location is correct')
          assert.equal(DL.phone, '', 'phone is correct')
          assert.equal(DL.email, '', 'email is correct')
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

      before(async () => {

      })
      describe('Success', async () => {
        it('deletes user account name from mapping and decrements user count', async () => {


        })
        it('emits a UserDeleted event', async () => {

        })

      })
      describe('Failure', async () => {

      })
    })//Comments






    describe('Setter Functions', async () => {
      let user, newValue
      before(async () => {
        user = await cryptogram.users(otherUser)
      })
      describe('setUserName', async () => {
        before(async () => {
          newValue = "updated userName"
          user = await cryptogram.setUserName(newValue, { from: otherUser })
        })
        describe('Success', async () => {
          it('updates the userName value', async () => {
            const updatedUser = await cryptogram.users(otherUser)
            assert.equal(updatedUser.userName, newValue, 'userName is correct')
          })
          it('emits a UserUpdated event', async () => {
            const log = user.logs[0]
            log.event.should.eq('UserUpdated')
            const event = log.args
            assert.equal(event.userAccount.toString(), otherUser.toString(), 'User Account is correct')
            assert.equal(event.valueChanged.toString(), "userName", 'Value Changed is correct')
            assert.equal(event.newValue.toString(), newValue, 'New Value is correct')
            event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
          })

        })
        describe('Failure', async () => {
          it('prevents an invalid address from being deleted from to the mapping', async () => {
            it('prevents an invalid address from executing the function', async () => {
              await cryptogram.setUserName(newValue, { from: 0x0 }).should.be.rejected
            })
          })
        })
      })//setUserName
      describe('setLocation', async () => {
        before(async () => {
          newValue = "updated Location"
          user = await cryptogram.setLocation(newValue, { from: otherUser })
        })
        describe('Success', async () => {
          it('updates the location value', async () => {
            const updatedUser = await cryptogram.users(otherUser)
            assert.equal(updatedUser.location, newValue, 'location is correct')
          })
          it('emits a UserUpdated event', async () => {
            const log = user.logs[0]
            log.event.should.eq('UserUpdated')
            const event = log.args
            assert.equal(event.userAccount.toString(), otherUser.toString(), 'User Account is correct')
            assert.equal(event.valueChanged.toString(), "location", 'Value Changed is correct')
            assert.equal(event.newValue.toString(), newValue, 'New Value is correct')
            event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
          })

        })
        describe('Failure', async () => {
          it('prevents an invalid address from being deleted from to the mapping', async () => {
            it('prevents an invalid address from executing the function', async () => {
              await cryptogram.setLocation(newValue, { from: 0x0 }).should.be.rejected
            })
          })
        })
      })//setLocation
      describe('setPhone', async () => {
        before(async () => {
          newValue = "updated Phone"
          user = await cryptogram.setPhone(newValue, { from: otherUser })
        })
        describe('Success', async () => {
          it('updates the setPhone value', async () => {
            const updatedUser = await cryptogram.users(otherUser)
            assert.equal(updatedUser.phone, newValue, 'phone is correct')
          })
          it('emits a UserUpdated event', async () => {
            const log = user.logs[0]
            log.event.should.eq('UserUpdated')
            const event = log.args
            assert.equal(event.userAccount.toString(), otherUser.toString(), 'User Account is correct')
            assert.equal(event.valueChanged.toString(), "phone", 'Value Changed is correct')
            assert.equal(event.newValue.toString(), newValue, 'New Value is correct')
            event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
          })

        })
        describe('Failure', async () => {
          it('prevents an invalid address from being deleted from to the mapping', async () => {
            it('prevents an invalid address from executing the function', async () => {
              await cryptogram.setPhone(newValue, { from: 0x0 }).should.be.rejected
            })
          })
        })
      })//setPhone
      describe('setEmail', async () => {
        before(async () => {
          newValue = "updated Email"
          user = await cryptogram.setEmail(newValue, { from: otherUser })
        })
        describe('Success', async () => {
          it('updates the email value', async () => {
            const updatedUser = await cryptogram.users(otherUser)
            assert.equal(updatedUser.email, newValue, 'email is correct')
          })
          it('emits a UserUpdated event', async () => {
            const log = user.logs[0]
            log.event.should.eq('UserUpdated')
            const event = log.args
            assert.equal(event.userAccount.toString(), otherUser.toString(), 'User Account is correct')
            assert.equal(event.valueChanged.toString(), "email", 'Value Changed is correct')
            assert.equal(event.newValue.toString(), newValue, 'New Value is correct')
            event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
          })

        })
        describe('Failure', async () => {
          it('prevents an invalid address from being deleted from to the mapping', async () => {
            it('prevents an invalid address from executing the function', async () => {
              await cryptogram.setEmail(newValue, { from: 0x0 }).should.be.rejected
            })
          })
        })
      })//setEmail
      describe('setOccupation', async () => {
        before(async () => {
          newValue = "updated Occupation"
          user = await cryptogram.setOccupation(newValue, { from: otherUser })
        })
        describe('Success', async () => {
          it('updates the email value', async () => {
            const updatedUser = await cryptogram.users(otherUser)
            assert.equal(updatedUser.occupation, newValue, 'Occupation is correct')
          })
          it('emits a UserUpdated event', async () => {
            const log = user.logs[0]
            log.event.should.eq('UserUpdated')
            const event = log.args
            assert.equal(event.userAccount.toString(), otherUser.toString(), 'User Account is correct')
            assert.equal(event.valueChanged.toString(), "occupation", 'Value Changed is correct')
            assert.equal(event.newValue.toString(), newValue, 'New Value is correct')
            event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
          })

        })
        describe('Failure', async () => {
          it('prevents an invalid address from being deleted from to the mapping', async () => {
            it('prevents an invalid address from executing the function', async () => {
              await cryptogram.setOccupation(newValue, { from: 0x0 }).should.be.rejected
            })
          })
        })
      })//setOccupation           
    })/**********SETTERS BLOCK***********/







  })//CONTRACT FUNCTIONS



})





