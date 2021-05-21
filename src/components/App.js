import React, { Component } from 'react';
import { connect } from 'react-redux'

//import Identicon from 'identicon.js';
import './App.css';
import { Switch, Route, Link } from 'react-router-dom';
import {
  
  loadEverything
} from '../store/interactions'
import { cryptogramLoadedSelector, contractUpdatingSelector, allPostsLoadedSelector, eventHeardSelector  } from '../store/selectors'
import Navbar from './Navbar'
import Main from './Main';
import Loading from './Loading'
import CreateUser from './CreateUser'
//import SharePost from './SharePost'



class App extends Component {

  componentWillMount() {
    
    if(!this.props.eventHeard){
      this.loadBlockchainData(this.props.dispatch)
    }
  }
  //CHECK NETWORK AND ACCOUNT IN META MASK
  async loadBlockchainData(dispatch) {
   // if(this.props.eventHeard){console.log("EVENT HEARD IN STATE!!!!", this.props.eventHeard)}
   //console.log("loadBlockchainData in APP called")

   await loadEverything(dispatch)
    /**
     const web3 = await loadWeb3(dispatch)
    const networkId = await web3.eth.net.getId()
    await loadAccount(web3, dispatch)
    const cryptogram = await loadCryptogram(web3, networkId, dispatch)
    if(!cryptogram) {
      window.alert('Exchange smart contract not detected on the current network. Please select another network with Metamask.')
      return
    }


    {this.props.cryptogramLoaded || this.props.allPostsLoaded ? 
        <Main /> : <Loading />
        }
     */


        
  }//loadBlockchainData  
   render() {
    return (
      <div id="header" className="bg-dark">
        <Navbar />

        {this.props.cryptogramLoaded ? 
        <Main /> : <Loading />
        }

       
      </div>
    );
  }
}


function mapStateToProps(state) {

  //console.log("cryptogramLoaded", cryptogramLoadedSelector(state))
  //console.log({images: imagesSelector(state)})

  return {
    //account: accountSelector(state)//enable selector for testing via console log
    cryptogramLoaded: cryptogramLoadedSelector(state)    
  }
}

export default connect(mapStateToProps)(App)