const { assert } = require('chai');
const { default: Web3 } = require('web3');

const CryptoGram = artifacts.require("CryptoGram");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('CryptoGram', ([deployer, author, tipper, otherUser]) => {
  let cryptogram

  before(async () => {
    cryptogram = await CryptoGram.deployed()
  })

  describe('deployment', async () => {
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
    let result, imageCount
    let desc = 'description'
    let hash = 'A991A5B251866474D04E8A1EC783BF28'
    before(async () => {
      result = await cryptogram.uploadImage(hash, desc, { from: author })
      imageCount = await cryptogram.imageCount()
    })
    describe('uploading image hashes', async () => {
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

    describe('tipping images', async () => {
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
      })
      describe('Failure', async () => {
        it('prevents an invalid image ID from being tipped', async () => {
          await cryptogram.tipImageOwner(99999, { from: tipper, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected
        })
      })
    })//tipping Images

    describe('deleting images', async () => {
      let hash1 = "imageHash1"
      let hash2 = "imageHash2"
      let hash3 = "imageHash3"
      let oldImages, newImages
      let id
      deletedImageDesc = "image to be deleted"
      before(async () => {
        await cryptogram.uploadImage(hash1, desc, { from: author })
        await cryptogram.uploadImage(hash2, desc, { from: author })
        await cryptogram.uploadImage(hash3, deletedImageDesc, { from: author })

        oldImages = cryptogram.images

        id = imageCount

        result = await cryptogram.deleteImage(id, { from: author})

        newImages = cryptogram.images

      })
      describe('Success', async () => {
        it('deletes an image', async () => {
          
        })
        
      })
      describe('Failure', async () => {
        it('images can only be deleted by the account that uploaded them', async () => {
          await cryptogram.deleteImage(id, {from: otherUser}).should.be.rejected
        })
        it('prevents an invalid image ID from being deleted', async () => {
          await cryptogram.deleteImage(99999, { from: author}).should.be.rejected
        })
      })
    })//tipping Images
  })

  



})