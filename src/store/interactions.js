import Web3 from 'web3'
import {
  web3Loaded,
  web3AccountLoaded,
  cryptogramLoaded,
  allPostsLoaded,
  allImagesLoaded,
  allUsersLoaded,
  contractUpdating,
  contractUpdated
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




export const loadPosts = async (cryptogram, dispatch) => {
  const postStream = await cryptogram.getPastEvents('PostAdded', { fromBlock: 0, toBlock: 'latest' })
  //console.log("postStream: ", postStream.id)
  const allPosts = postStream.map((event) => event.returnValues)
  //console.log("loadAllImages", allImages)
  dispatch(allPostsLoaded(allPosts))
}

export const loadImages = async (cryptogram, dispatch) => {
  const imageStream = await cryptogram.getPastEvents('ImageAdded', { fromBlock: 0, toBlock: 'latest' })
  const allImages = imageStream.map((event) => event.returnValues)
  dispatch(allImagesLoaded(allImages))
}



export const loadUsers = async (cryptogram, dispatch) => {
  const userStream = await cryptogram.getPastEvents('UserAdded', { fromBlock: 0, toBlock: 'latest' })//entire chain history
  const allUsers = userStream.map((event) => event.returnValues)
  //console.log("loadAllImages", allUsers)
  dispatch(allUsersLoaded(allUsers))
}


export const makePost = async (dispatch, cryptogram, account,  result, description, title, link) => {
  let hash = '0'
  let includesImage = true
  if(result === undefined){
    includesImage = false
    console.log("No Image Present")
  }else{
    hash = result[0].hash
    console.log("IPFS Result: ", result)
    console.log("Image Hash: ", hash)
  }

  
  cryptogram.methods.makePost(hash, description, title, link, includesImage).send({ from: account })
  .on('transactionHash', (hash) => {
    console.log("Upload transaction hash: ", hash)
    dispatch(contractUpdating("makePost"))
  }) 

}

export const tipImage = async (dispatch, account, cryptogram, id, tipAmount,) => {
  cryptogram.methods.tipImageOwner(id).send({ from: account, value: tipAmount })
    .on('transactionHash', (hash) => {
      console.log("tipImageOwner completed", hash)
      dispatch(contractUpdating("tipImage"))
    })
}




//listen for events emitted from contract and update component in real time
export const subscribeToEvents = async (cryptogram, dispatch) => {
  
  cryptogram.events.PostAdded({}, (error, event) => {
    dispatch(contractUpdated(event.returnValues)) 
    console.log("PostAdded Event Heard", event.returnValues)
  })
}
