import React, { Component } from 'react';
import { connect } from 'react-redux'

import Collapsible from 'react-collapsible';

import moment from 'moment'

import { commentTextChanged, postTipAmountChanged } from '../store/actions'
import {
  allUsersSelector,
  allUserIDSelector,
  allPostSelector,
  userSelectedSelector,
  cryptogramSelector,
  web3Selector,
  accountSelector,
  allCommentsSelector,
  commentTextSelector,
  postTipAmountSelector
} from '../store/selectors'
import { tipComment, makeComment, tipPost, getCommentHeader } from '../store/interactions'



//test IPFS hash: QmTB1GwdrgfFfPSpKpeYFuS2JidiqnLZv2uaKDzU2tkaYw
//portrait logo: QmUhWdN2ZMoNjxtTywNWJPVqn9TRYgxnNyUhiDa8nAzWtg

const showFeed = (props) => {
  const { dispatch, account, cryptogram, web3, allPosts, user, allUsers, allUserIDs, allComments, commentText, postTipAmount } = props

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
                <div className="card m-2 mb-4">

                  <p className="p-2" key={comment.id}>
                    {getCommentHeader(comment, web3, allUsers, allUserIDs)}
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
                </div>
              )
            }
          })}
        </div>
        <div className="m-2">
          <Collapsible className="cursor-pointer" trigger="Add a comment" triggerWhenOpen="Collapse">
            {composeComment(post)}
          </Collapsible>
        </div>
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


  const setTipAmount = (post) => {
    return (
      <div
        className="float-right text-right pt-0 text-primary"
        data-toggle="tooltip"
        data-placement="right"
        title="Send a tip if you feel this post deserves it! Posts with the most tips are shown first."
      >
        <Collapsible className="cursor-pointer" trigger="Tip This Post" triggerWhenOpen="Collapse">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              let tipAmount = web3.utils.toWei(postTipAmount, 'Ether')
              tipPost(dispatch, account, cryptogram, post.id, tipAmount)
            }} >
            <div className="form-group mr-sm-2">
              <input
                type="number"
                step="0.0001"
                onChange={(e) => dispatch(postTipAmountChanged(e.target.value))}
                className="form-control"
                placeholder="Amount to tip in ETH"
              >
              </input>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-sml">Submit Tip</button>
          </form>
        </Collapsible>
      </div>
    )
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
                        {setTipAmount(post)}

                      </li>

                      <div className="text-dark text-left">
                        <Collapsible className="cursor-pointer text-left p-1" trigger="Expand Comment Section" triggerWhenOpen="Collapse Comments">
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
      <div className="p-5" id="imageFeed">
        {
          showFeed(this.props)
        }
        <footer>
          <div class="text-center p-3 pb-5">
            <small className="text-muted">
            This app is a work in progress created by Jake Barber for testing and proof-of-concept purposes only, more information can be found on my <a className="text-light" href="https://www.jake-barber.com" target="_blank" rel="noopener noreferrer">website</a>.
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
    allUsers: allUsersSelector(state),
    allUserIDs: allUserIDSelector(state),
    allPosts: allPostSelector(state),
    web3: web3Selector(state),
    account: accountSelector(state),
    cryptogram: cryptogramSelector(state),
    allComments: allCommentsSelector(state),
    commentText: commentTextSelector(state),
    postTipAmount: postTipAmountSelector(state)
  }
}

export default connect(mapStateToProps)(UserPostFeed)