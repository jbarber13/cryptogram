const { assert } = require('chai');
const { default: Web3 } = require('web3');

const CryptoGram = artifacts.require("CryptoGram");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('CryptoGram', ([deployer, author, tipper, otherUser]) => {
  let cryptogram
  let imageCount

  before(async () => {
    cryptogram = await CryptoGram.deployed()
    imageCount = await cryptogram.imageCount()
  })

  
 
  describe('deleting images', async () => {
    let hash1 = "imageHash1"
    let hash2 = "imageHash2"
    let hash3 = "imageHash3"
    let oldImages, newImages
    let id
    let deletedImageDesc = "image to be deleted"

    let desc = "generic image description"
    
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
        //console.log(oldImages)
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
  })//deleting Images
  



})