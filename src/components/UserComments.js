import React, { Component } from 'react';
import { connect } from 'react-redux'

import Collapsible from 'react-collapsible';

import Identicon from 'identicon.js';
import moment from 'moment'

import {
  userSelectedSelector,
  cryptogramSelector,
  web3Selector,
  accountSelector,
  allCommentsSelector,
  commentTextSelector,
  deletedPostIDSelector

} from '../store/selectors'
import { } from '../store/interactions'
import Loading from './Loading'

//test IPFS hash: QmTB1GwdrgfFfPSpKpeYFuS2JidiqnLZv2uaKDzU2tkaYw
//portrait logo: QmUhWdN2ZMoNjxtTywNWJPVqn9TRYgxnNyUhiDa8nAzWtg

const showFeed = (props) => {
  const { dispatch, account, cryptogram, web3, allComments, deletedPostIDs, user} = props

 

  function commentMapping() {
    return (
      <>
        {allComments.map((comment) => {
          if (comment != null && !deletedPostIDs.includes(comment.postID)) { //check if the post associated with the comment has been deleted
            if(comment.author === user.userAccount){//only show comments from selected user
                return (
                    <li className="list-group-item bg-secondary text-light">
                      <p className="p-2 text-left" key={comment.id}>
                        <small className="text-light">{comment.formattedTimeStamp} TIPS: {web3.utils.fromWei(comment.tipAmount.toString(), 'Ether')} ETH</small>
                        <br />
                        {comment.comment}
                      </p>
                    </li>
                  )
            }
            
          }

        })}
      </>
    )
  }


  function shoCommentHistory() {
    return (
      <div className="card mb-4 position-top"  >
        <div className="card-header bg-info ">
          <h2 className="text-light">{user.userName}'s Comment History</h2>
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





class UserComments extends Component {
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
    user: userSelectedSelector(state),
    allComments: allCommentsSelector(state),
    web3: web3Selector(state),
    account: accountSelector(state),
    cryptogram: cryptogramSelector(state),
    commentText: commentTextSelector(state),
    deletedPostIDs: deletedPostIDSelector(state)
  }
}

export default connect(mapStateToProps)(UserComments)