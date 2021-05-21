import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  subscribeToEvents  
} from '../store/interactions'
import { cryptogramSelector, allUsersSelector, accountSelector, userAccountLoadedSelector } from '../store/selectors';
import SharePost from './SharePost'
import ImageFeed from './ImageFeed'
import MyAccount from './MyAccount'
import CreateUser from './CreateUser'

class Main extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props)
  }
  async loadBlockchainData(props) {

    const { dispatch, cryptogram } = props
    //console.log("loadBlockchainData in MAIN called")
    await subscribeToEvents(cryptogram, dispatch)
    //subscribe to events
  }//loadBlockchainData

  render() {
    return (
      <div id="header" className="bg-dark">
        {this.props.userAccountLoaded ?
          <MyAccount /> : <CreateUser />        
        }
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
         <ImageFeed /> 
         <SharePost />
      </div>
    );
  }
}
function mapStateToProps(state) {
  const cryptogram = cryptogramSelector(state)
  return {
    cryptogram,
    account: accountSelector(state),
    allUsers: allUsersSelector(state),
    userAccountLoaded: userAccountLoadedSelector(state)

  }
}
export default connect(mapStateToProps)(Main)

//export default Main;
