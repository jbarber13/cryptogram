import React, { Component } from 'react';
import { connect } from 'react-redux'

//import Identicon from 'identicon.js';
import './App.css';
import { Switch, Route, Link } from 'react-router-dom';
import {
  loadEverything
} from '../store/interactions'
import { cryptogramLoadedSelector} from '../store/selectors'
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
    
    await loadEverything(props.dispatch)




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

  

  return {
    cryptogramLoaded: cryptogramLoadedSelector(state)
  }
}

export default connect(mapStateToProps)(App)