const { assert } = require('chai');
const { default: Web3 } = require('web3');

const DSM = artifacts.require("DSM");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('DSM', ([deployer, author, tipper]) => {
  let dsm

  before(async () => {
    dsm = await DSM.deployed()
  })

  describe('deployment', async () => {
    it('is deployed', async () => {
      const address = await dsm.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has the correct name', async () => {
      const name = await dsm.name()
      assert.equal(name, 'Decentralized Social Media')
    })
  })

  describe('Contract Functions', async () => {
    let result, imageCount
    let desc = 'description'
    let hash = 'A991A5B251866474D04E8A1EC783BF28'
    before(async () => {
      result = await dsm.uploadImage(hash, desc, { from: author })
      imageCount = await dsm.imageCount()
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
          const image = await dsm.images(imageCount)
          assert.equal(image.id.toNumber(), imageCount.toNumber(), 'ID is correct')
          assert.equal(image.hash, hash, 'Hash is correct')
          assert.equal(image.description, desc, 'description is correct')
          assert.equal(image.tipAmount, '0', 'tip amount is correct')
          assert.equal(image.author, author, 'author is correct')
        })
      })
      describe('Failure', async () => {
        it('prevents a blank hash from being uploaded', async () => {
          await dsm.uploadImage('', desc, { from: author }).should.be.rejected
        })
        it('prevents upload without a description', async () => {
          await dsm.uploadImage(hash, '', { from: author }).should.be.rejected
        })
      })
    })   

    describe('tipping images', async () => {
      let oldAuthorBalance
      
      before(async () => {
        oldAuthorBalance = await web3.eth.getBalance(author)
        oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
        result = await dsm.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })
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
          await dsm.tipImageOwner(99999, { from: tipper, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected
        })
      })
    })
  })

  



})