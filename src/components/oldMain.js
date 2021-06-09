import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Router } from 'react-router-dom';

import {
  subscribeToEvents
} from '../store/interactions'
import { cryptogramSelector, allUsersSelector, accountSelector } from '../store/selectors';
import SharePost from './SharePost'
import ImageFeed from './ImageFeed'
import MyAccount from './MyAccount'
import UserPage from './UserPage'
import CreateUser from './CreateUser'
import Loading from './Loading'

class oldMain extends Component {
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
      <div id="header" className="bg-dark h-100">
        <Switch>
            <Route exact path='/' component={ImageFeed}></Route>
            <Route exact path='/SharePost' component={SharePost}></Route>
            <Route exact path='/CreateUser' component={CreateUser}></Route>
            <Route exact path='/MyAccount' component={MyAccount}></Route>
            <Route exact path='/UserPage' component={UserPage}></Route>
            <Route exact path='/Loading' component={Loading}></Route>
        </Switch>

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

  }
}
export default connect(mapStateToProps)(oldMain)

//export default Main;
