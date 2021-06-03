import React, { Component } from 'react';
import { connect } from 'react-redux'

import Collapsible from 'react-collapsible';

import Identicon from 'identicon.js';
import moment from 'moment'

import {
  cryptogramSelector,
  web3Selector,
  accountSelector,
  allCommentsSelector,
  commentTextSelector,
  myCommentSelector,
  deletedPostIDSelector

} from '../store/selectors'
import {deleteComment } from '../store/interactions'
import Loading from './Loading'

//test IPFS hash: QmTB1GwdrgfFfPSpKpeYFuS2JidiqnLZv2uaKDzU2tkaYw
//portrait logo: QmUhWdN2ZMoNjxtTywNWJPVqn9TRYgxnNyUhiDa8nAzWtg

const showFeed = (props) => {
  const { dispatch, account, cryptogram, web3, allComments, myComments, deletedPostIDs } = props

  function deleteCommentButton(comment){
    return (
      <div className="btn btn-link btn-sm float-right text-light">
         <form onSubmit={(event) => {
          event.preventDefault()
          deleteComment(dispatch, cryptogram, account, comment.id)}} >

          <button type="submit" className="btn btn-link btn-sm float-right text-light" >Delete This Comment</button>

        </form>
      </div>
    )
  }

  function commentMapping() {
    return (
      <>
        {myComments.map((comment) => {
          if (comment != null && !deletedPostIDs.includes(comment.postID)) { //check if the post associated with the comment has been deleted
            return (
              <li className="list-group-item bg-secondary text-light">
                <p className="p-2 text-left" key={comment.id}>
                  <small className="text-light">{comment.formattedTimeStamp} TIPS: {web3.utils.fromWei(comment.tipAmount.toString(), 'Ether')} ETH</small>
                  <br />
                  {comment.comment}
                  {deleteCommentButton(comment)}
                </p>
              </li>
            )
          }

        })}
      </>
    )
  }


  function shoCommentHistory() {
    return (
      <div className="card mb-4 position-top"  >
        <div className="card-header bg-info ">
          <h2 className="text-light">My Comment History</h2>
        </div>
        <ul id="imageList" className="list-group list-group-flush ">
          {commentMapping()}

        </ul>
      </div>
    )
  }



  return (
    <div className="mh-50">
      <div class="overflow-auto">
        {shoCommentHistory()}
      </div>
    </div>
  )
}





class MyComments extends Component {
  render() {
    return (
      <div className="p-4" id="imageFeed">
        {
          showFeed(this.props)
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    myComments: myCommentSelector(state),
    web3: web3Selector(state),
    account: accountSelector(state),
    cryptogram: cryptogramSelector(state),
    allComments: allCommentsSelector(state),
    commentText: commentTextSelector(state),
    deletedPostIDs: deletedPostIDSelector(state)
  }
}

export default connect(mapStateToProps)(MyComments)