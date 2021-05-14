import Web3 from 'web3'
import {
  web3Loaded,
  web3AccountLoaded,
  cryptogramLoaded,
  allPostsLoaded,
  allUsersLoaded,
  contractUpdating,
  contractUpdated,
  allCommentsLoaded,
  postLoaded,
  doneLoadingPosts
} from './actions'
import {allPostSelector} from './selectors'
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

//whats happening is that the posts are loaded based on the initial emitted event from when they are created, which does not include any updated data such as the tipAmount
export const updatePosts = async (cryptogram, dispatch) => {
  const postCount = await cryptogram.methods.postCount().call()
  for (var i = 1; i <= postCount; i++){
    dispatch(postLoaded(await cryptogram.methods.posts(i).call()))
    if(i >= postCount){
      //dispatch all posts loaded if done
      dispatch(doneLoadingPosts())
    }
    //update each post, as the tip amount here does not match the one in state since that one came from the OG event from when the post was created
  }

  
  
}


export const loadPosts = async (cryptogram, dispatch) => {
  const postStream = await cryptogram.getPastEvents('PostAdded', { fromBlock: 0, toBlock: 'latest' })
  //console.log("postStream: ", postStream.id)
  const allPosts = postStream.map((event) => (event.returnValues))
  //console.log("allPosts", allPosts)
  dispatch(allPostsLoaded(allPosts))
}

export const loadComments = async (cryptogram, dispatch) => {
  const commentStream = await cryptogram.getPastEvents('CommentAdded', {fromBlock: 0, toBlock: 'latest'})
  const allComments = commentStream.map((event) => event.returnValues)
  dispatch(allCommentsLoaded(allComments))
}

export const loadUsers = async (cryptogram, dispatch) => {
  const userStream = await cryptogram.getPastEvents('UserAdded', { fromBlock: 0, toBlock: 'latest' })//entire chain history
  const allUsers = userStream.map((event) => event.returnValues)
  //console.log("loadAllImages", allUsers)
  dispatch(allUsersLoaded(allUsers))
}


export const makePost = async (dispatch, cryptogram, account,  result, description, title, link) => {
  let hash = "No Image Present"
  let desc = ""
  let postLink = ""
  if(result === undefined){
    console.log("No Image Present")
  }else{
    hash = result[0].hash
    console.log("IPFS Result: ", result)
    console.log("Image Hash: ", hash)
  }
  
  //check if description or link are included
  if(description.toString() === "[object Object]"){
    console.log("No Description Detected")
  }else{
    desc = description
  }
  if(link.toString() === "[object Object]"){
    console.log("No Link Detected")
  }else{
    postLink = link
  }
  
   cryptogram.methods.makePost(hash, desc, title, postLink).send({ from: account })
  .on('transactionHash', (hash) => {
    console.log("Upload transaction hash: ", hash)
    dispatch(contractUpdating("makePost"))
  }) 
}
export const tipPost = async (dispatch, account, cryptogram, id, tipAmount,) => {
  

  console.log("tipPost stuff")
  console.log("tipPost id", id)
  console.log("tipPost tipAmount", tipAmount)
  
  


  
  cryptogram.methods.tipPost(id).send({ from: account, value: tipAmount })
    .on('transactionHash', (hash) => {
      console.log("tipPost Transaction Hash: ", hash)
      dispatch(contractUpdating("tipPost"))
    })
   
  
  
  
  
}

export const makeComment = async (dispatch, account, cryptogram, postID, comment) => {
  
   cryptogram.methods.comment(postID, comment,).send({from: account})
  .on('transactionHash', (hash) => {
    console.log("Comment transaction hash: ", hash)
    dispatch(contractUpdating("comment"))
  })  
}

const _clearState = () => {

}
//listen for events emitted from contract and update component in real time
export const subscribeToEvents = async (cryptogram, dispatch) => {
  
  cryptogram.events.PostAdded({}, (error, event) => {
    dispatch(contractUpdated(event.returnValues)) 
    console.log("PostAdded Event Heard", event.returnValues)
  })
  cryptogram.events.CommentAdded({}, (error, event) => {
    dispatch(contractUpdated(event.returnValues)) 
    console.log("CommentAdded Event Heard", event.returnValues)
  })
  cryptogram.events.PostTipped({}, (error, event) => {
    dispatch(contractUpdated(event.returnValues)) 
    console.log("PostTipped Event Heard", event.returnValues)
  })
}
