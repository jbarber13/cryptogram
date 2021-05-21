import Web3 from 'web3'
import {
  web3Loaded,
  web3AccountLoaded,
  cryptogramLoaded,
  userLoaded,
  fileCaptured,
  postLoaded,
  commentLoaded,
  clearForm,
  userAlreadyExists,
  userAccountLoaded
} from './actions'
import CryptoGram from '../abis/CryptoGram.json'


//TODO: need to clear state when loading contract to avoid old data being dumped into new posts when made back to back
export const loadEverything = async (dispatch) => {

  const web3 = await _loadWeb3(dispatch)
  const networkId = await web3.eth.net.getId()
  const account = await _loadAccount(web3, dispatch)
  const cryptogram = await _loadCryptogram(web3, networkId, dispatch)
  if (!cryptogram) {
    window.alert('Exchange smart contract not detected on the current network. Please select another network with Metamask.')
    return
  }

  const allPosts = await _loadPosts(cryptogram, dispatch)
  const allComments = await _loadComments(cryptogram, dispatch)
  const allUsers = await _loadUsers(cryptogram, dispatch)

  _loadUser(account, allUsers, dispatch, cryptogram)
  //console.log("loadEverything called", allPosts)

}

const _loadWeb3 = async (dispatch) => {

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

const _loadAccount = async (web3, dispatch) => {
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

const _loadCryptogram = async (web3, networkId, dispatch) => {
  try {
    const cryptogram = new web3.eth.Contract(CryptoGram.abi, CryptoGram.networks[networkId].address)
    dispatch(cryptogramLoaded(cryptogram))
    return cryptogram
  } catch (error) {
    console.log('Contract not deployed to the current network. Please select another network with Metamask.')
    return null
  }
}
//for some reason, it is executing the loop body twice the second time it is called, putting post count in state when cryptogram loads.... 
//next TODO: try a new kind of loop maybe..
//if that doesn't work, maybe try to load all posts from event stream, then loop through state array to update each one (using .map()) with the most recent info viay .call()
const _loadPosts = async (cryptogram, dispatch) => {
  const postStream = await cryptogram.getPastEvents('PostAdded', {fromBlock: 0, toBlock: 'latest'})
  const posts = postStream.map((event) => event.returnValues)
  const postCount = await cryptogram.methods.postCount().call()
  
  //console.log("_loadPosts called ")


  const loadPost = async id => {
    //console.log("loadPost called")

    dispatch(postLoaded(await cryptogram.methods.posts(id).call()))
  }
  posts.map(post => loadPost(post.id))

  return posts
} 

const _loadComments = async (cryptogram, dispatch) => {
  const commentStream = await cryptogram.getPastEvents('CommentAdded', {fromBlock: 0, toBlock: 'latest'})
  const comments = commentStream.map((event) => event.returnValues)

  const loadComment = async id => {
    dispatch(commentLoaded(await cryptogram.methods.comments(id).call()))
  }
  comments.map(comment => loadComment(comment.id))
}

/**
 const _loadPosts = async (cryptogram, dispatch, postCount) => {
  dispatch(aboutToLoadPosts())
  //console.log("loadPosts")
  for (var i = 1; i <= postCount; i++) {
    console.log("i in _loadPosts loop: ", i)
    dispatch(postLoaded(await cryptogram.methods.posts(i).call()))
    if (i >= postCount) {
      //once done loading, it will dump the data into an array so it can be mapped
      dispatch(doneLoadingPosts())
      return
    }
  }
}
const _loadComments = async (cryptogram, dispatch) => {
  const commentCount = await cryptogram.methods.commentCount().call()
  for (var i = 1; i <= commentCount; i++) {
    dispatch(commentLoaded(await cryptogram.methods.comments(i).call()))
    if (i >= commentCount) {
      //once done loading, it will dump the data into an array so it can be mapped
      dispatch(doneLoadingComments())
    }
  }
}
 */

const _loadUsers = async (cryptogram, dispatch) => {
  const userStream = await cryptogram.getPastEvents('UserAdded', { fromBlock: 0, toBlock: 'latest' })//entire chain history
  const users = userStream.map((event) => event.returnValues)
  
  const loadUser = async userAccount => {
    dispatch(userLoaded(await cryptogram.methods.users(userAccount).call()))
  }
  users.map(user => loadUser(user.userAccount))
  return users
}



//if the user account has been made already, loads the user info into state
const _loadUser = async (account, allUsers, dispatch, cryptogram) => {
  allUsers.map(user => {
    if(user.userAccount == account){
      dispatch(userAccountLoaded(user))
    }
  })  
}

export const updateUser = (dispatch, cryptogram, account, type, value) => {
  console.log("account: ", account)
  console.log("type: ", type)
  console.log("value: ", value)

  cryptogram.methods.updateUser(type, value.toString()).send({ from: account })
    .on('transactionHash', (hash) => {
      console.log("Upload transaction hash: ", hash)
      //dispatch(contractUpdating("makePost"))
    })

}



export const captureFile = (event, dispatch) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      //this.setState({ buffer: Buffer(reader.result) })
      console.log('file', Buffer(reader.result))
      dispatch(fileCaptured(Buffer(reader.result)))
    }
}

export const makeUser = async (dispatch, cryptogram, account, userName, result, status, location, contact, occupation) => {
  let imageHash = "No Image Present"
  let _status = ""
  let _location = ""
  let _contact = ""
  let _occupation = ""
  if (result === undefined) {
    console.log("No Image Present")
  } else {
    imageHash = result[0].hash
    console.log("IPFS Result: ", result)
    console.log("Image Hash: ", imageHash)
  }

  //check if optional fields were populated
  if (status.toString() === "[object Object]") {
    console.log("No status Detected")
  } else {
    _status = status
  }
  if (location.toString() === "[object Object]") {
    console.log("No location Detected")
  } else {
    _location = location
  }
  if (contact.toString() === "[object Object]") {
    console.log("No contact Detected")
  } else {
    _contact = contact
  }
  if (occupation.toString() === "[object Object]") {
    console.log("No occupation Detected")
  } else {
    _occupation = occupation
  }
  cryptogram.methods.addUser(userName, imageHash, _status, _location, _contact, _occupation).send({ from: account })
    .on('transactionHash', (hash) => {
      console.log("Upload transaction hash: ", hash)
      dispatch(clearForm())
      //dispatch(contractUpdating("makePost"))
    })

}


export const makePost = async (dispatch, cryptogram, account, result, description, title, link) => {
  let hash = "No Image Present"
  let desc = ""
  let postLink = ""
  if (result === undefined) {
    console.log("No Image Present")
  } else {
    hash = result[0].hash
    console.log("IPFS Result: ", result)
    console.log("Image Hash: ", hash)
  }

  //check if optional fields were populated
  if (description.toString() === "[object Object]") {
    console.log("No Description Detected")
  } else {
    desc = description
  }
  if (link.toString() === "[object Object]") {
    console.log("No Link Detected")
  } else {
    postLink = link
  }

  cryptogram.methods.makePost(hash, desc, title, postLink).send({ from: account })
    .on('transactionHash', (hash) => {
      console.log("Upload transaction hash: ", hash)
      dispatch(clearForm())
      //dispatch(contractUpdating("makePost"))
    })
}
export const tipPost = async (dispatch, account, cryptogram, id, tipAmount,) => {
  console.log("tipPost called")

  cryptogram.methods.tipPost(id).send({ from: account, value: tipAmount })
    .on('transactionHash', (hash) => {
      console.log("tipPost Transaction Hash: ", hash)
      //dispatch(contractUpdating("tipPost"))
    })
}

export const makeComment = async (dispatch, account, cryptogram, postID, comment) => {

  cryptogram.methods.comment(postID, comment,).send({ from: account })
    .on('transactionHash', (hash) => {
      console.log("Comment transaction hash: ", hash)
      //dispatch(contractUpdating("comment"))
    })
}

export const tipComment = async (dispatch, account, cryptogram, id, tipAmount,) => {

  cryptogram.methods.tipComment(id).send({ from: account, value: tipAmount })
    .on('transactionHash', (hash) => {
      console.log("tipComment Transaction Hash: ", hash)
      //dispatch(contractUpdating("tipComment"))
    })
}


//listen for events emitted from contract and update component in real time
export const subscribeToEvents = async (cryptogram, dispatch) => {
  //console.log("subscribeToEvents called")

  let eventHeard = 0

  cryptogram.events.PostAdded({}, (error, event) => {
    loadEverything(dispatch)
    console.log("PostAdded Event Heard", event.returnValues)
    if(error){console.error(error)}
  })
  cryptogram.events.CommentAdded({}, (error, event) => {
    loadEverything(dispatch)
    console.log("CommentAdded Event Heard", event.returnValues)
    if(error){console.error(error)}
  })
  cryptogram.events.PostTipped({fromBlock: 'latest', toBlock: 'latest'}, (error, event) => {
    loadEverything(dispatch)
    console.log("eventHeard called count: ", eventHeard)
    eventHeard++
    //loadEverything(dispatch)
    console.log("PostTipped Event Heard", event.returnValues)
    if(error){console.error(error)}
  })
  cryptogram.events.CommentTipped({}, (error, event) => {
    loadEverything(dispatch)
    console.log("CommentTipped Event Heard", event.returnValues)
    if(error){console.error(error)}
  })
  cryptogram.events.UserUpdated({}, (error, event) => {
    loadEverything(dispatch)
    console.log("UserUpdated Event Heard", event.returnValues)
    if(error){console.error(error)}
  })
  
}
