import React, { Component } from 'react';
import { connect } from 'react-redux'

import Collapsible from 'react-collapsible';

import Identicon from 'identicon.js';
import moment from 'moment'
import Main from './Main'

import { Switch, Route, Link } from 'react-router-dom';
import { commentTextChanged } from '../store/actions'
import {
  
  allPostSelector,
  userSelectedSelector,
  cryptogramSelector,
  web3Selector,
  accountSelector,
  allCommentsSelector,
  commentTextSelector
} from '../store/selectors'
import { tipComment, makeComment, deletePost } from '../store/interactions'
import Loading from './Loading'



//test IPFS hash: QmTB1GwdrgfFfPSpKpeYFuS2JidiqnLZv2uaKDzU2tkaYw
//portrait logo: QmUhWdN2ZMoNjxtTywNWJPVqn9TRYgxnNyUhiDa8nAzWtg

const showFeed = (props) => {
  const { dispatch, account, cryptogram, web3, allPosts, user, allComments, commentText } = props

  function getImageURL(post) {
    let hash
    hash = post.imageHash
    return `https://ipfs.infura.io/ipfs/${hash}`
  }

  //only shows link if there is one
  function showLink(post) {
    let output = ""
    if (post.link != "") {
      output = <a className="text-link" href={post.link.toString()} target="#_blank">Attached Link</a>
    }
    return (
      output
    );
  }
  function renderComments(post) {
    return (
      <div>
        <div>
          {allComments.map((comment) => {
            //only show comments for the correct post
            if (comment.postID == post.id) {
              return (
                <p className="p-2" key={comment.id}>
                  <img
                    className='mr-2'
                    width='30'
                    height='30'
                    alt="#"
                    src={`data:image/png;base64,${new Identicon(comment.author, 30).toString()}`}
                  /><small className="text-muted">{comment.formattedTimeStamp} TIPS: {web3.utils.fromWei(comment.tipAmount.toString(), 'Ether')} ETH</small>
                  <br />
                  {comment.comment}
                  <button
                    className="btn btn-link btn-sm float-right pt-0"
                    name={comment.id}
                    onClick={(event) => {
                      let tipAmount = web3.utils.toWei('0.1', 'Ether')
                      tipComment(dispatch, account, cryptogram, event.target.name, tipAmount)
                    }}
                  >
                    TIP 0.1 ETH
                    </button>
                </p>
              )
            }
          })}
        </div>
        <Collapsible className="cursor-pointer" trigger="Add a comment" triggerWhenOpen="Collapse">
          {composeComment(post)}
        </Collapsible>
      </div>
    )
  }
  function composeComment(post) {
    return (
      <div>
        <form onSubmit={(event) => {
          event.preventDefault()
          addComment(post)
        }} >

          <div className="form-group mr-sm-2">
            <textarea
              rows="4"
              cols="50"
              onChange={(e) => dispatch(commentTextChanged(e.target.value))}
              className="form-control"
              placeholder="Whats on your mind...?"
            >
            </textarea>
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg">Submit Comment</button>

        </form>
      </div>
    )
  }



  const addComment = (post) => {
    makeComment(dispatch, account, cryptogram, post.id, commentText)
  }






  return (
    <div className="container-fluid">
      {
        allPosts.map((post, key) => {
          if (post != undefined && post.id != 0x0) { //confirm post has not been deleted
            if (post.author === user.userAccount) { //only show posts from selected user
              return (
                <div className="ImageFeedImage">
                  <div className="card mb-4 " key={key} >
                    <div className="card-header">
                      <h1 className="text-muted">{post.title.toString()}</h1>
                      <img
                        className='mr-2 rounded-circle'
                        width='30'
                        height='30'
                        alt="#"
                        src={`https://ipfs.infura.io/ipfs/${user.imageHash}`}
                      />
                      <small className="text-muted">{user.userName}</small>
                      <small className="text-muted"><br />Posted on: {moment.unix(post.timeStamp).format('M/D/Y')} at: {moment.unix(post.timeStamp).format('h:mm:ss a')}</small>
                    
                    </div>
                    <ul id="imageList" className="list-group list-group-flush ">
                      <li className="list-group-item bg-secondary">
                        <p class="text-center"><img className="uploadedImage" src={getImageURL(post)} alt="" /></p>
                        <p className="text-light border-info card-body">{post.status}</p>
                        {showLink(post)}
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted ">
                          TIPS: {web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
                                  </small>


                      </li>

                      <div className="text-dark text-left">
                        <Collapsible className="cursor-pointer text-center p-1" trigger="Expand Comment Section" triggerWhenOpen="Collapse Comments">
                          <br></br>
                          {renderComments(post)}
                        </Collapsible>
                      </div>
                    </ul>
                  </div>
                </div>
              )
            }
          }
        })
      }
    </div>
  )
}





class UserPostFeed extends Component {
  render() {
    return (
      <div className="p-4" id="imageFeed">
        {
          showFeed(this.props)          
        }
        <footer>
            <div class="text-center p-3 pb-5">
                <small className="text-muted">
                    This app was created by Jake Barber for testing and proof-of-concept purposes only, more information can be found on my <a className="text-light" href="https://www.jake-barber.com" target="_blank">website</a>.
                </small>
            </div>
        </footer>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: userSelectedSelector(state),
    allPosts: allPostSelector(state),
    web3: web3Selector(state),
    account: accountSelector(state),
    cryptogram: cryptogramSelector(state),
    allComments: allCommentsSelector(state),
    commentText: commentTextSelector(state)
  }
}

export default connect(mapStateToProps)(UserPostFeed)