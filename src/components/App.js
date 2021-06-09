import React, { Component } from 'react';
import { connect } from 'react-redux'

//import Identicon from 'identicon.js';
import './App.css';
import { Switch, Route, Link } from 'react-router-dom';
import {
  loadEverything
} from '../store/interactions'
import { cryptogramInitializedSelector, cryptogramLoadedSelector} from '../store/selectors'
import {cryptogramInitialized} from '../store/actions'
import Navbar from './Navbar'
import Main from './Main';
import Loading from './Loading'
import CreateUser from './CreateUser'
//import SharePost from './SharePost'



class App extends Component {

  componentWillMount() {

    this.loadBlockchainData(this.props)
  }
  //CHECK NETWORK AND ACCOUNT IN META MASK
  async loadBlockchainData(props) {
    
    const {cryptoInit, dispatch} = props
    let done = false
    if(cryptoInit){
      console.log("Cryptogram Already Initialized")
    }else{
      done = await loadEverything(dispatch)
      if(done){
        dispatch(cryptogramInitialized())
      }
    }




  }//loadBlockchainData  
  render() {
    return (
      <div id="header" className="bg-dark">
        <Navbar />
        {this.props.cryptogramLoaded ?
          <Main /> : <Loading />
        }
        <footer>
          <div class="text-center p-3 pb-5">
            <small className="text-muted">
            This app is a work in progress created by Jake Barber for testing and proof-of-concept purposes only, more information can be found on my <a className="text-light" href="https://www.jake-barber.com" target="_blank">website</a>.
          </small>
          </div>
        </footer>

      </div>
    );
  }
}


function mapStateToProps(state) {

  //console.log("cryptogramLoaded", cryptogramLoadedSelector(state))
  //console.log({images: imagesSelector(state)})

  return {
    //account: accountSelector(state)//enable selector for testing via console log
    cryptoInit: cryptogramInitializedSelector(state),
    cryptogramLoaded: cryptogramLoadedSelector(state)
  }
}

export default connect(mapStateToProps)(App)