import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  loadPosts,
  loadComments,
  loadUsers, 
  subscribeToEvents 
} from '../store/interactions'
import { cryptogramSelector} from '../store/selectors';
import SharePost from './SharePost'
import ImageFeed from './ImageFeed'

class Main extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props)
  }
  async loadBlockchainData(props) {    

    const {dispatch, cryptogram} = props

    await loadPosts(cryptogram, dispatch)
    await loadComments(cryptogram, dispatch)
    await loadUsers(cryptogram, dispatch)    

    await subscribeToEvents(cryptogram, dispatch)


    //subscribe to events
  }//loadBlockchainData

  render() {

    return (
      <div id="header" className="bg-dark">  

        <ImageFeed />
        <SharePost />
      </div>
    );
  }
}
function mapStateToProps(state) {
  const cryptogram = cryptogramSelector(state)
  return {
    cryptogram

  }
}
export default connect(mapStateToProps)(Main)

//export default Main;
