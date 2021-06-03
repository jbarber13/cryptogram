import React, { Component } from 'react'
import { connect } from 'react-redux'
import Collapsible from 'react-collapsible'
import { Link } from 'react-router-dom';

import Identicon from 'identicon.js';
import moment from 'moment'

import { commentTextChanged, userSelected } from '../store/actions'
import {
  allPostSelector,
  allUsersSelector,
  allPosterSelector,
  allUserIDSelector,
  cryptogramSelector,
  web3Selector,
  accountSelector,
  allCommentsSelector,
  commentTextSelector,

} from '../store/selectors'
import { tipPost, tipComment, makeComment, getPostHeader, getCommentHeader } from '../store/interactions'
import Loading from './Loading'



//test IPFS hash: QmTB1GwdrgfFfPSpKpeYFuS2JidiqnLZv2uaKDzU2tkaYw
//portrait logo: QmUhWdN2ZMoNjxtTywNWJPVqn9TRYgxnNyUhiDa8nAzWtg

const showFeed = (props) => {
  const { dispatch, account, cryptogram, web3, allPosts, allUsers, allComments, allPosters, allUserIDs, commentText } = props



  function getImageURL(post) {
    let hash
    hash = post.imageHash
    return `https://ipfs.infura.io/ipfs/${hash}`
  }

  //only shows link if there is one
  function showLink(post) {
    let output = ""
    if (post.link !== "") {
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
            if (comment.postID === post.id) {
              return (
                <div className="card mb-4">


                  <p className="p-2" key={comment.id}>
                    {
                      getCommentHeader(comment, web3, allUsers, allUserIDs)
                    }
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
        <Collapsible className="cursor-pointer" trigger="Add a comment" triggerWhenOpen="Collapse">
          {composeComment(post)}
        </Collapsible>

      </div>
    )
  }
  function composeComment(post) {
    return (
      <div>
        <br></br>
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

  //get the full user object and dispatch to state so UserPage can render it correctly
  const dispatchUser = (author) => {
    allUsers.map((u) => {
      if (u.userAccount === author) {
        dispatch(userSelected(u))
      }
    })
  }
  return (
    <div className="container-fluid">
      {
        allPosts.map((post, key) => {
          if (post.id != 0x0 && post != undefined) {
            return (
              <div
                className="ImageFeedImage"
              >
                <div className="card mb-4" key={key} >
                  <h1 className="text-muted">{post.title.toString()}</h1>
                  {getPostHeader(post, allUsers, allUserIDs)}
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      dispatchUser(post.author)
                      props.history.push('./UserPage')
                    }}
                  >
                    <button type="submit" className="btn btn-info btn-sml">View Account</button>
                  </form>
                  <li className="list-group-item bg-secondary">
                    <p class="text-center"><img className="uploadedImage" src={getImageURL(post)} alt="" /></p>
                    <p className="text-light border-info card-body">{post.status}</p>
                    {showLink(post)}
                  </li>
                  <li key={key} className="list-group-item py-2">
                    <small className="float-left mt-1 text-muted ">
                      TIPS: {web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} ETH
                    </small>
                    <button
                      className="btn btn-link btn-sm float-right pt-0"
                      name={post.id}
                      onClick={(event) => {
                        let tipAmount = web3.utils.toWei('0.1', 'Ether')

                        tipPost(dispatch, account, cryptogram, event.target.name, tipAmount)
                      }}
                    >
                      TIP 0.1 ETH
                    </button>
                  </li>
                  <li>
                    <div className="text-dark text-left">
                      <Collapsible className="cursor-pointer text-center" trigger="Expand Comment Section" triggerWhenOpen="Collapse Comments">
                        <br></br>
                        {renderComments(post)}
                      </Collapsible>
                    </div>
                  </li>
                </div>
              </div>
            )
          }
        })
      }
    </div>
  )//show feed return
}//show feed





class ImageFeed extends Component {

  render() {
    return (
      <div className="imageFeed pt-5" id="imageFeed">
        <br /><br />
        {
          showFeed(this.props)
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allPosts: allPostSelector(state),
    allUsers: allUsersSelector(state),
    allPosters: allPosterSelector(state),
    allUserIDs: allUserIDSelector(state),
    web3: web3Selector(state),
    account: accountSelector(state),
    cryptogram: cryptogramSelector(state),
    allComments: allCommentsSelector(state),
    commentText: commentTextSelector(state)
  }
}

export default connect(mapStateToProps)(ImageFeed)