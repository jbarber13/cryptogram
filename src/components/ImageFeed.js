import React, { Component } from 'react'
import { connect } from 'react-redux'
import Collapsible from 'react-collapsible'


import { commentTextChanged, postTipAmountChanged, commentTipAmountChanged } from '../store/actions'
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
  postTipAmountSelector,
  commentTipAmountSelector
} from '../store/selectors'
import { tipPost, tipComment, makeComment, getPostHeader, getCommentHeader } from '../store/interactions'



//test IPFS hash: QmTB1GwdrgfFfPSpKpeYFuS2JidiqnLZv2uaKDzU2tkaYw
//portrait logo: QmUhWdN2ZMoNjxtTywNWJPVqn9TRYgxnNyUhiDa8nAzWtg

const showFeed = (props) => {
  const { dispatch, account, cryptogram, web3, allPosts, allUsers, allComments, postTipAmount, commentTipAmount, allUserIDs, commentText } = props

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

  const setCommentTipAmount = (comment) => {
    return (
      <div
        className="float-right text-right pt-0 text-primary"
        data-toggle="tooltip"
        data-placement="right"
        title="Send a tip if you feel this comment deserves it! Comments with the most tips are shown first."
      >
        <Collapsible className="cursor-pointer" trigger="Tip This Comment" triggerWhenOpen="Collapse">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              let tipAmount = web3.utils.toWei(commentTipAmount, 'Ether')
              tipComment(dispatch, account, cryptogram, comment.id, tipAmount)
            }} >
            <div className="form-group mr-sm-2">
              <input
                type="number"
                step="0.0001"
                onChange={(e) => dispatch(commentTipAmountChanged(e.target.value))}
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



  function renderComments(post) {
    return (
      <div>
        <div>
          {allComments.map((comment) => {
            //only show comments for the correct post
            if (comment.postID === post.id) {
              return (
                <div className="card m-2 mb-4">
                  <p className="p-2" key={comment.id}>
                    {
                      getCommentHeader(comment, web3, allUsers, allUserIDs)
                    }
                    {comment.comment}
                    {setCommentTipAmount(comment)}
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
          if (post.id != 0x0 && post != undefined) {
            return (
              <div className="ImageFeedImage">
                <div className="card mb-4" key={key} >
                  {getPostHeader(dispatch, props, post, allUsers, allUserIDs)}

                  <ul id="imageList" className="list-group list-group-flush text-center">
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
                        {renderComments(post)}
                      </Collapsible>
                    </div>
                  
                  </ul>
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
      <div className="pt-5" id="imageFeed">        
        <div className="mt-5">
        {
          showFeed(this.props)
        }
        </div>
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
    commentText: commentTextSelector(state),
    postTipAmount: postTipAmountSelector(state),
    commentTipAmount: commentTipAmountSelector(state)
  }
}

export default connect(mapStateToProps)(ImageFeed)