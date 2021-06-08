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
import { deleteComment } from '../store/interactions'
import Loading from './Loading'

//test IPFS hash: QmTB1GwdrgfFfPSpKpeYFuS2JidiqnLZv2uaKDzU2tkaYw
//portrait logo: QmUhWdN2ZMoNjxtTywNWJPVqn9TRYgxnNyUhiDa8nAzWtg

const showFeed = (props) => {
  const { dispatch, account, cryptogram, web3, allComments, myComments, deletedPostIDs } = props

  function deleteCommentButton(comment) {
    return (
      <div className="float-right text-right pt-0 text-danger">
        <form onSubmit={(event) => {
          event.preventDefault()
          deleteComment(dispatch, cryptogram, account, comment.id)
        }} >

          <button type="submit" className="btn btn-danger btn-sm  float-right text-right pt-0 text-light">Delete</button>

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
        <div className="card-header bg-primary ">
          <h2 className="text-light">My Comment History</h2>
        </div>
        <ul id="imageList" className="list-group list-group-flush ">
          <div className="my-comments overflow-auto">
            {commentMapping()}

          </div>

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
      <div id="myComments">
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