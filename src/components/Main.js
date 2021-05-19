import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  subscribeToEvents,
  userExists
} from '../store/interactions'
import { cryptogramSelector, allUsersSelector, accountSelector, userExistsSelector } from '../store/selectors';
import SharePost from './SharePost'
import ImageFeed from './ImageFeed'
import Account from './Account'
import CreateUser from './CreateUser'

class Main extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props)
  }
  async loadBlockchainData(props) {

    const { dispatch, cryptogram } = props
    console.log("loadBlockchainData in MAIN called")
    await subscribeToEvents(cryptogram, dispatch)
    //subscribe to events
  }//loadBlockchainData

  render() {
    userExists(this.props.account, this.props.allUsers, this.props.dispatch)
    return (
      <div id="header" className="bg-dark">
        {this.props.userFound ?
          <Account /> : <CreateUser />
        }
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
    userFound: userExistsSelector(state)

  }
}
export default connect(mapStateToProps)(Main)

//export default Main;
