import Web3 from 'web3'
import React from 'react';

import moment from 'moment'



import {
  web3Loaded,
  web3AccountLoaded,
  cryptogramLoaded,
  userLoaded,
  fileCaptured,
  postLoaded,
  deletedPostsLoaded,
  commentLoaded,
  clearForm,
  contractUpdating,
  userAccountLoaded,
  userSelected
} from './actions'
import CryptoGram from '../abis/CryptoGram.json'
import Identicon from 'identicon.js';



//TODO: need to clear state when loading contract to avoid old data being dumped into new posts when made back to back
export const loadEverything = async (dispatch) => {
  const web3 = await _loadWeb3(dispatch)
  const networkId = await web3.eth.net.getId()
  const account = await _loadAccount(web3, dispatch)
  const cryptogram = await _loadCryptogram(web3, networkId, dispatch)
  if (!cryptogram) {
    window.alert('Exchange smart contract not detected on the current network. Please switch your MetaMask network to Rinkeby and then refresh the page.')
    return
  }
  await _loadPosts(cryptogram, dispatch)
  await _loadComments(cryptogram, dispatch)
  const allUsers = await _loadUsers(cryptogram, dispatch)
  await _loadUser(account, allUsers, dispatch, cryptogram)
  await _loadDeletedPosts(cryptogram, dispatch)

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
  const postStream = await cryptogram.getPastEvents('PostAdded', { fromBlock: 0, toBlock: 'latest' })
  const posts = postStream.map((event) => event.returnValues)

  //console.log("_loadPosts called ")


  const loadPost = async id => {
    //console.log("loadPost called")

    dispatch(postLoaded(await cryptogram.methods.posts(id).call()))
  }
  posts.map(post => loadPost(post.id))

  return posts
}
const _loadDeletedPosts = async (cryptogram, dispatch) => {
  const postStream = await cryptogram.getPastEvents('PostDeleted', { fromBlock: 0, toBlock: 'latest' })
  const posts = postStream.map((event) => event.returnValues)
  dispatch(deletedPostsLoaded(posts))
}

const _loadComments = async (cryptogram, dispatch) => {
  const commentStream = await cryptogram.getPastEvents('CommentAdded', { fromBlock: 0, toBlock: 'latest' })
  const comments = commentStream.map((event) => event.returnValues)

  const loadComment = async id => {
    dispatch(commentLoaded(await cryptogram.methods.comments(id).call()))
  }
  comments.map(comment => loadComment(comment.id))
}

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
  const loadUserAccount = async userAccount => {
    let user = await cryptogram.methods.users(userAccount).call()

    //check if user account has been deleted
    if (user.timeStamp !== "0") {
      dispatch(userAccountLoaded(user))
    }
  }
  allUsers.map(user => {
    if (user.userAccount === account) {
      loadUserAccount(user.userAccount)

    }
  })
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




export const makeUser = async (dispatch, cryptogram, account, userName, result, bio, location, contact, occupation) => {
  let imageHash = "No Image Present"
  let _bio = ""
  let _location = ""
  let _occupation = ""
  if (result === undefined) {
    console.log("No Image Present")
  } else {
    imageHash = result[0].hash
    console.log("IPFS Result: ", result)
    console.log("Image Hash: ", imageHash)
  }

  //check if optional fields were populated
  if (bio.toString() === "[object Object]") {
    console.log("No status Detected")
  } else {
    _bio = bio
  }
  if (location.toString() === "[object Object]") {
    console.log("No location Detected")
  } else {
    _location = location
  }
  if (occupation.toString() === "[object Object]") {
    console.log("No occupation Detected")
  } else {
    _occupation = occupation
  }
  cryptogram.methods.addUser(userName, imageHash, _bio, _location, _occupation).send({ from: account })
    .on('transactionHash', (hash) => {
      console.log("Upload transaction hash: ", hash)
      dispatch(clearForm())
      dispatch(contractUpdating("makePost"))
    })
}

export const deleteUser = async (dispatch, cryptogram, account) => {

  cryptogram.methods.deleteUser().send({ from: account })
    .on('transactionHash', (hash) => {
      console.log("Transaction hash: ", hash)
      dispatch(contractUpdating("makePost"))
    })



}

export const deletePost = async (dispatch, cryptogram, account, postID) => {
  cryptogram.methods.deletePost(postID).send({ from: account })
    .on('transactionHash', (hash) => {
      console.log("Transaction hash: ", hash)
      dispatch(contractUpdating("makePost"))
    })
}

export const deleteComment = async (dispatch, cryptogram, account, commentID) => {
  cryptogram.methods.deleteComment(commentID).send({ from: account })
    .on('transactionHash', (hash) => {
      console.log("Transaction hash: ", hash)
      dispatch(contractUpdating("makePost"))
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
      dispatch(contractUpdating("makePost"))
    })
}
export const tipPost = async (dispatch, account, cryptogram, id, tipAmount,) => {
  console.log("tipPost called")

  cryptogram.methods.tipPost(id).send({ from: account, value: tipAmount })
    .on('transactionHash', (hash) => {
      console.log("tipPost Transaction Hash: ", hash)
      dispatch(contractUpdating("tipPost"))
    })
}

export const makeComment = async (dispatch, account, cryptogram, postID, comment) => {

  cryptogram.methods.comment(postID, comment,).send({ from: account })
    .on('transactionHash', (hash) => {
      console.log("Comment transaction hash: ", hash)
      dispatch(contractUpdating("comment"))
    })
}

export const tipComment = async (dispatch, account, cryptogram, id, tipAmount,) => {

  cryptogram.methods.tipComment(id).send({ from: account, value: tipAmount })
    .on('transactionHash', (hash) => {
      console.log("tipComment Transaction Hash: ", hash)
      dispatch(contractUpdating("tipComment"))
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
//get the full user object and dispatch to state so UserPage can render it correctly
const dispatchUser = (dispatch, author, allUsers) => {
  console.log("dispatchUser", allUsers)
  allUsers.map((u) => {
    if (u.userAccount === author) {
      dispatch(userSelected(u))
    }
  })
}
export const getPostHeader = (dispatch, props, post, allUsers, allUserIDs) => {
  let user, userFound
  if (allUserIDs.includes(post.author)) {
    getUser(post.author)
  }
  function getUser(userAccount) {
    allUsers.map((u) => {
      if (u.userAccount === userAccount) {
        user = u
        userFound = true
      }
    })
  }
  if (userFound) {
    return (
      <div className="post-header card-header text-center">
        <h2 className="text-muted">{post.title.toString()}</h2>
        <img
          className='mr-2 rounded-circle'
          width='30'
          height='30'
          alt="#"
          src={`https://ipfs.infura.io/ipfs/${user.imageHash}`}
        />
        <small className="text-muted">{user.userName}</small>
        <small className="text-muted"><br />Posted on: {moment.unix(post.timeStamp).format('M/D/Y')} at: {moment.unix(post.timeStamp).format('h:mm:ss a')}</small>
        <form
          className="text-small"
          onSubmit={(event) => {
            event.preventDefault()
            dispatchUser(dispatch, post.author, allUsers)
            props.history.push('./UserPage')
          }}
        >
          <button type="submit" className="btn btn-link">View Profile</button>
        </form>
      </div>
    )
  }

  return (
    <div className="card-header text-center">
      <h1 className="text-muted">{post.title.toString()}</h1>

      <img
        className='mr-2'
        width='30'
        height='30'
        alt="#"
        src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
      />
      <small className="text-muted">{post.author}</small>
      <small className="text-muted"><br />Posted on: {moment.unix(post.timeStamp).format('M/D/Y')} at: {moment.unix(post.timeStamp).format('h:mm:ss a')}</small>
    </div>
  )
}

export const getCommentHeader = (comment, web3, allUsers, allUserIDs) => {
  let user, userFound
  if (allUserIDs.includes(comment.author)) {
    getUser(comment.author)
  }
  function getUser(userAccount) {
    allUsers.map((u) => {
      if (u.userAccount === userAccount) {
        user = u
        userFound = true
      }
    })
  }
  if (userFound) {
    return (
      <div className="card-header">
        <img
          className='mr-2 rounded-circle'
          width='30'
          height='30'
          alt="#"
          src={`https://ipfs.infura.io/ipfs/${user.imageHash}`}
        />
        <small className="text-muted">{user.userName}&nbsp;{comment.formattedTimeStamp} TIPS: {web3.utils.fromWei(comment.tipAmount.toString(), 'Ether')} ETH</small>
        <br />
      </div>
    )
  }


  return (
    <div className="card-header">
      <a
        href={`https://rinkeby.etherscan.io/address/${comment.author}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className='mr-2'
          data-toggle="tooltip"
          data-placement="bottom"
          title={`Account Address: ${comment.author}`}
          width='30'
          height='30'
          alt="#"
          src={`data:image/png;base64,${new Identicon(comment.author, 30).toString()}`}
        />
      </a>
      <small className="text-muted">{comment.formattedTimeStamp} TIPS: {web3.utils.fromWei(comment.tipAmount.toString(), 'Ether')} ETH</small>
      <br />
    </div>
  )
}



/********************SET STUFF**********************/
export const setUserName = async (dispatch, cryptogram, account, value) => {
  cryptogram.methods.setUserName(value).send({ from: account })
    .on('transactionHash', (hash) => {
      console.log("Transaction hash: ", hash)
      dispatch(contractUpdating("setUserName"))
      dispatch(clearForm())

    })
}
export const setImageHash = async (dispatch, cryptogram, account, value) => {
  let hash = value[0].hash
  cryptogram.methods.setImageHash(hash).send({ from: account })
    .on('transactionHash', (hash) => {
      console.log("Transaction hash: ", hash)
      dispatch(contractUpdating("setImageHash"))
      dispatch(clearForm())

    })

}
export const setBio = async (dispatch, cryptogram, account, value) => {
  cryptogram.methods.setBio(value).send({ from: account })
    .on('transactionHash', (hash) => {
      console.log("Transaction hash: ", hash)
      dispatch(contractUpdating("setBio"))
      dispatch(clearForm())

    })
}
export const setLocation = async (dispatch, cryptogram, account, value) => {
  cryptogram.methods.setLocation(value).send({ from: account })
    .on('transactionHash', (hash) => {
      console.log("Transaction hash: ", hash)
      dispatch(contractUpdating("setLocation"))
      dispatch(clearForm())

    })
}
export const setOccupation = async (dispatch, cryptogram, account, value) => {
  cryptogram.methods.setOccupation(value).send({ from: account })
    .on('transactionHash', (hash) => {
      console.log("Transaction hash: ", hash)
      dispatch(contractUpdating("setOccupation"))
      dispatch(clearForm())

    })
}

/********************subscribeToEvents**********************/


//listen for events emitted from contract and update component in real time
export const subscribeToEvents = async (cryptogram, dispatch) => {
  let eventHeard = false

  cryptogram.events.UserAdded({}, (error, event) => {
    if (!eventHeard) {
      loadEverything(dispatch)
    }
    eventHeard = true
    console.log("UserAdded Event Heard", event.returnValues)
    if (error) { console.error(error) }
  })

  cryptogram.events.UserDeleted({}, (error, event) => {
    if (!eventHeard) {
      loadEverything(dispatch)
    }
    eventHeard = true
    console.log("UserDeleted Event Heard", event.returnValues)
    if (error) { console.error(error) }
  })

  cryptogram.events.UserUpdated({}, (error, event) => {
    if (!eventHeard) {
      loadEverything(dispatch)
    }
    eventHeard = true
    console.log("UserUpdated Event Heard", event.returnValues)
    if (error) { console.error(error) }
  })
  /**
   function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
   sleep(3000)
        .then(() => {
          if(!eventHeard){
            loadEverything(dispatch) 
          }         
        })
        .then(() => {
          eventHeard = true
        })
   */
  cryptogram.events.PostTipped({}, (error, event) => {
    if (!eventHeard) {
      loadEverything(dispatch)
    }
    eventHeard = true
    console.log("PostTipped Event Heard", event)
    if (error) { console.error(error) }
  })
  cryptogram.events.PostAdded({}, (error, event) => {
    if (!eventHeard) {
      loadEverything(dispatch)
    }
    eventHeard = true
    console.log("PostAdded Event Heard", event.returnValues)
    if (error) { console.error(error) }
  })

  cryptogram.events.PostDeleted({}, (error, event) => {
    if (!eventHeard) {
      loadEverything(dispatch)
    }
    eventHeard = true
    //loadEverything(dispatch)
    console.log("PostDeleted Event Heard", event.returnValues)
    if (error) { console.error(error) }
  })

  cryptogram.events.CommentAdded({}, (error, event) => {
    if (!eventHeard) {
      loadEverything(dispatch)
    }
    eventHeard = true
    console.log("CommentAdded Event Heard", event.returnValues)
    if (error) { console.error(error) }
  })

  cryptogram.events.CommentTipped({}, (error, event) => {
    if (!eventHeard) {
      loadEverything(dispatch)
    }
    eventHeard = true
    console.log("CommentTipped Event Heard", event.returnValues)
    if (error) { console.error(error) }
  })

  cryptogram.events.CommentDeleted({}, (error, event) => {
    if (!eventHeard) {
      loadEverything(dispatch)
    }
    eventHeard = true
    console.log("CommentDeleted Event Heard", event.returnValues)
    if (error) { console.error(error) }
  })


}
