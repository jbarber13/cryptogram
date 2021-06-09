import React, { Component } from 'react';
import { connect } from 'react-redux'

import Collapsible from 'react-collapsible';


import {commentTipAmountChanged} from '../store/actions'
import {
  userSelectedSelector,
  cryptogramSelector,
  web3Selector,
  accountSelector,
  allCommentsSelector,
  commentTextSelector,
  deletedPostIDSelector,
  commentTipAmountSelector

} from '../store/selectors'
import {tipComment } from '../store/interactions'

const showFeed = (props) => {
  const { dispatch, account, cryptogram, web3, allComments, deletedPostIDs, user, commentTipAmount} = props

  function tipCommentButton(comment) {
    return (
      <div 
        className="float-right text-center btn btn-primary text-light w-25 cursor-pointer"
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
                placeholder="Amount"
              >
              </input>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-sml">Submit Tip</button>
          </form>
        </Collapsible>
      </div>
    )
  }


  function commentMapping() {
    return (
      <div className="my-comments overflow-auto">
        <ul id="imageList" className="list-group list-group-flush ">
        {allComments.map((comment) => {
          if (comment != null && !deletedPostIDs.includes(comment.postID)) { //check if the post associated with the comment has been deleted
            if (comment.author === user.userAccount) {//only show comments from selected user
              return (
                <li className="list-group-item bg-secondary text-light">
                  <p className="p-2 text-left" key={comment.id}>
                  {tipCommentButton(comment)}
                    <small className="text-light">{comment.formattedTimeStamp} TIPS: {web3.utils.fromWei(comment.tipAmount.toString(), 'Ether')} ETH</small>
                    <br />
                    {comment.comment}
                    
                  </p>
                </li>
              )
            }
          }
        })}
        </ul>
      </div>
    )
  }
  
  function shoCommentHistory() {
    return (
      <div className="card mb-4 position-top"  >
        <div className="card-header bg-primary ">
          <h2 className="text-light">{user.userName}'s Comment History</h2>
        </div>
       
            {commentMapping()}

         
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
      <div id="imageFeed">
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
    deletedPostIDs: deletedPostIDSelector(state),
    commentTipAmount:   commentTipAmountSelector(state)
  }
}

export default connect(mapStateToProps)(UserComments)