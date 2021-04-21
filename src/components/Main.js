import React, { Component } from 'react';
import { connect } from 'react-redux';
import {buffer} from '../store/actions'
import {
  loadImages,
  loadUsers,  
} from '../store/interactions'
import { cryptogramSelector } from '../store/selectors';
import {processFile} from '../store/actions'
import SharePost from './SharePost'

class Main extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props)
  }
  async loadBlockchainData(props) {    

    const {dispatch, cryptogram} = props
    loadImages(cryptogram, dispatch)
    loadUsers(cryptogram, dispatch)    
    //subscribe to events
  }//loadBlockchainData
  
  render() {

    return (
      <div className="container-fluid mt-5 text-light ">
        <br /><br /><br /><br /><br />
        MAIN STUFF GOES HERE
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