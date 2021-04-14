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
    let result, imageCount, userCount
    let desc = 'description'
    let hash = 'A991A5B251866474D04E8A1EC783BF28'
    before(async () => {
      result = await cryptogram.uploadImage(hash, desc, { from: author })
      imageCount = await cryptogram.imageCount()
    })
    describe('Uploading Image Hashes', async () => {
      describe('Success', async () => {
        it('adds image hashes to the contract correctly', async () => {
          assert.equal(imageCount, 1)
          const event = result.logs[0].args
          assert.equal(event.id.toNumber(), imageCount.toNumber(), 'ID is correct')
          assert.equal(event.hash, hash, 'Hash is correct')
          assert.equal(event.description, desc, 'description is correct')
          assert.equal(event.tipAmount, '0', 'tip amount is correct')
          assert.equal(event.author, author, 'author is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
        it('lists image hashes', async () => {
          const image = await cryptogram.images(imageCount)
          assert.equal(image.id.toNumber(), imageCount.toNumber(), 'ID is correct')
          assert.equal(image.hash, hash, 'Hash is correct')
          assert.equal(image.description, desc, 'description is correct')
          assert.equal(image.tipAmount, '0', 'tip amount is correct')
          assert.equal(image.author, author, 'author is correct')
        })
        it('emits an ImageCreated event', async () => {
          const log = result.logs[0]
          log.event.should.eq('ImageCreated')
          const event = log.args
          event.id.toNumber().should.equal(imageCount.toNumber(), 'ID is correct')
          event.hash.toString().should.equal(hash, 'hash is correct')
          event.description.toString().should.equal(desc, 'description address is correct')
          event.tipAmount.toString().should.equal('0', 'tipAmount is correct')
          assert.equal(event.author, author, 'author is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
      })
      describe('Failure', async () => {
        it('prevents a blank hash from being uploaded', async () => {
          await cryptogram.uploadImage('', desc, { from: author }).should.be.rejected
        })
        it('prevents upload without a description', async () => {
          await cryptogram.uploadImage(hash, '', { from: author }).should.be.rejected
        })
      })
    })

    describe('Tipping Images', async () => {
      let oldAuthorBalance

      before(async () => {
        oldAuthorBalance = await web3.eth.getBalance(author)
        oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
        result = await cryptogram.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })
      })
      describe('Success', async () => {
        it('tips author', async () => {
          const event = result.logs[0].args
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
        it('emits an ImageTipped event', async () => {
          let tipAmount
          tipAmount = web3.utils.toWei('1', 'Ether')
          const log = result.logs[0]
          log.event.should.eq('ImageTipped')
          const event = log.args
          event.id.toNumber().should.equal(imageCount.toNumber(), 'ID is correct')
          event.hash.toString().should.equal(hash, 'hash is correct')
          event.description.toString().should.equal(desc, 'description address is correct')
          event.tipAmount.toString().should.equal(tipAmount.toString(), 'tipAmount is correct')
          assert.equal(event.author, author, 'author is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
      })
      describe('Failure', async () => {
        it('prevents an invalid image ID from being tipped', async () => {
          await cryptogram.tipImageOwner(99999, { from: tipper, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected
        })
      })
    })//tipping Images

    describe('Deleting Images', async () => {
      let hash1 = "imageHash1"
      let hash2 = "imageHash2"
      let hash3 = "imageHash3"
      let lastImage
      let imageCount
      before(async () => {
        result = await cryptogram.uploadImage(hash1, desc, { from: author })
        result = await cryptogram.uploadImage(hash2, desc, { from: author })
        result = await cryptogram.uploadImage(hash3, desc, { from: author })
        imageCount = await cryptogram.imageCount()


      })
      describe('Success', async () => {
        it('deletes an image - sets all values of that struct to 0 or null', async () => {
          lastImage = await cryptogram.images(imageCount)
          assert.equal(lastImage.hash, hash3, 'Hash is correct before the delete')

          //DELETE and reset lastImage data - count stays the same, so last image points to deleted image, values should be set to 0 or null
          result = await cryptogram.deleteImage(imageCount, { from: author })
          lastImage = await cryptogram.images(imageCount)

          assert.equal(lastImage.id.toNumber(), 0, 'ID is correct')
          assert.equal(lastImage.hash, '', 'Hash is correct')
          assert.equal(lastImage.description, '', 'description is correct')
          assert.equal(lastImage.tipAmount.toString(), '0', 'tip amount is correct')
          assert.equal(lastImage.author, (0x0), 'author is correct')
        })

        it('emits an ImageDeleted event', async () => {
          const log = result.logs[0]
          log.event.should.eq('ImageDeleted')
          const event = log.args
          event.id.toNumber().should.equal(imageCount.toNumber(), 'ID is correct')
          assert.equal(event.author, author, 'author is correct')
          event.timeStamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })

      })
      describe('Failure', async () => {
        it('images can only be deleted by the account that uploaded them', async () => {
          await cryptogram.deleteImage(imageCount, { from: otherUser }).should.be.rejected
        })
        it('prevents an invalid image ID from being deleted', async () => {
          await cryptogram.deleteImage(99999, { from: author }).should.be.rejected
        })
      })
    })//deleting Images

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
    describe('Setter Functions', async () => {
      let user, newValue
      before(async () => {
        user = await cryptogram.users(otherUser)
      })
      describe('setUserName', async () => {
        before(async () => {
          newValue = "updated userName"
          user = await cryptogram.setUserName(newValue, {from: otherUser})
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
          user = await cryptogram.setLocation(newValue, {from: otherUser})
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
          user = await cryptogram.setPhone(newValue, {from: otherUser})
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
          user = await cryptogram.setEmail(newValue, {from: otherUser})
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
          user = await cryptogram.setOccupation(newValue, {from: otherUser})
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

  })





})