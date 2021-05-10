import React, { Component } from 'react';
import { connect } from 'react-redux';
import {buffer} from '../store/actions'
import {
  loadPosts,
  loadImages,
  loadUsers,  
} from '../store/interactions'
import { cryptogramSelector } from '../store/selectors';
import {processFile} from '../store/actions'
import SharePost from './SharePost'
import ImageFeed from './ImageFeed'

class Main extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props)
  }
  async loadBlockchainData(props) {    

    const {dispatch, cryptogram} = props

    loadPosts(cryptogram, dispatch)
    loadUsers(cryptogram, dispatch)    
    //subscribe to events
  }//loadBlockchainData
  
  render() {

    return (
      <div id="header" className="bg-dark">  
        <SharePost />
        <ImageFeed />
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
