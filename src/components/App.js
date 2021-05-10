import React, { Component } from 'react';
import { connect } from 'react-redux'

import Web3 from 'web3';
//import Identicon from 'identicon.js';
import './App.css';
import CryptoGram from '../abis/CryptoGram.json'
import { Switch, Route, Link } from 'react-router-dom';
import {
  loadWeb3,
  loadAccount,
  loadCryptogram,
} from '../store/interactions'
import { cryptogramLoadedSelector, contractUpdatingSelector  } from '../store/selectors'

import Navbar from './Navbar'
import Main from './Main';
import Loading from './Loading'
//import SharePost from './SharePost'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  componentWillMount() {
    this.loadBlockchainData(this.props.dispatch)
  }
  //CHECK NETWORK AND ACCOUNT IN META MASK
  async loadBlockchainData(dispatch) {
    const web3 = await loadWeb3(dispatch)
    const networkId = await web3.eth.net.getId()
    await loadAccount(web3, dispatch)
    const cryptogram = await loadCryptogram(web3, networkId, dispatch)
    if(!cryptogram) {
      window.alert('Exchange smart contract not detected on the current network. Please select another network with Metamask.')
      return
    }    
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
    cryptogramLoaded: cryptogramLoadedSelector(state),
    contractUpdating: contractUpdatingSelector(state)
  }
}

export default connect(mapStateToProps)(App)