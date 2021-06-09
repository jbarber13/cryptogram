import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Router } from 'react-router-dom';

import {
  subscribeToEvents
} from '../store/interactions'
import { cryptogramSelector, allUsersSelector, accountSelector, loadingSelector } from '../store/selectors';
import SharePost from './SharePost'
import ImageFeed from './ImageFeed'
import MyAccount from './MyAccount'
import UserPage from './UserPage'
import CreateUser from './CreateUser'
import Loading from './Loading'

class Main extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props)
  }
  async loadBlockchainData(props) {

    const { dispatch, cryptogram, loading} = props
    //console.log("loadBlockchainData in MAIN called")
    if(loading){
      await subscribeToEvents(cryptogram, dispatch)
    }else{
      console.log("Main ELSE")
    }
    
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
    loading: loadingSelector(state)

  }
}
export default connect(mapStateToProps)(Main)

//export default Main;
