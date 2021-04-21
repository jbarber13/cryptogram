import Web3 from 'web3'
import {
  web3Loaded,
  web3AccountLoaded,
  cryptogramLoaded,
  allImagesLoaded,
  allUsersLoaded,
  uploadingImage
} from './actions'
import CryptoGram from '../abis/CryptoGram.json'


export const loadWeb3 = async (dispatch) => {

  if (typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum)
    dispatch(web3Loaded(web3))
    window.ethereum.enable(); //REQUIRED FOR INITIAL MetaMask connection

    return web3
  } else {
    window.alert('Please install MetaMask')
    window.location.assign("https://metamask.io/")
  }
}

export const loadAccount = async (web3, dispatch) => {
  const accounts = await web3.eth.getAccounts()
  const account = await accounts[0]
  if (typeof account !== 'undefined') {
    dispatch(web3AccountLoaded(account))
    return account
  } else {
    window.alert('Please login with MetaMask, if you just logged in, refresh the page')
    return null
  }
}

export const loadCryptogram = async (web3, networkId, dispatch) => {
  try {
    const cryptogram = new web3.eth.Contract(CryptoGram.abi, CryptoGram.networks[networkId].address)
    dispatch(cryptogramLoaded(cryptogram))
    return cryptogram
  } catch (error) {
    console.log('Contract not deployed to the current network. Please select another network with Metamask.')
    return null
  }
}

export const loadImages = async (cryptogram, dispatch) => {
  const imageStream = await cryptogram.getPastEvents('ImageAdded', { fromBlock: 0, toBlock: 'latest' })//entire chain history
  const allImages = imageStream.map((event) => event.returnValues)
  //console.log("loadAllImages", allImages)
  dispatch(allImagesLoaded(allImages))
}
export const loadUsers = async (cryptogram, dispatch) => {
  const userStream = await cryptogram.getPastEvents('UserAdded', { fromBlock: 0, toBlock: 'latest' })//entire chain history
  const allUsers = userStream.map((event) => event.returnValues)
  //console.log("loadAllImages", allUsers)
  dispatch(allUsersLoaded(allUsers))
}

export const addImageToContract = async (dispatch, account, cryptogram, result, description) => {
  //dispatch(uploadingImage)

  cryptogram.methods.uploadImage(result[0].hash, description).send({ from: account })
        .on('transactionHash', (hash) => {
          dispatch(uploadingImage())
          console.log("Upload transaction hash: ", hash)
        })
        .on('error',(error) => {
          console.error(error)
          window.alert(`There was an error while uploading an image to the blockchain`)
        })


}