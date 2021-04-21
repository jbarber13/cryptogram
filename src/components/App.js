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
import { cryptogramLoadedSelector, imagesSelector } from '../store/selectors'

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

  /**
   captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  } 
   */
  

  /**
   uploadImage = description => {
    console.log("uploading to IPFS...")
    //view image: https://ipfs.infura.io/ipfs/<image hash> 

    //add to IPFS
    //console.log(this.state.buffer, description)


    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS Result', result)
      if (error) {
        console.error(error)
        return
      }

      //this.setState({ loading: true })
      this.state.cryptogram.methods.uploadImage(result[0].hash, description).send({ from: this.state.account })
        .on('transactionHash', (hash) => {
          //this.setState({ loading: false })
          console.log("Upload transaction hash: ", hash)
        })
    })

  }
   */
  

  /**
   tipImage(id, tipAmount) {

    this.state.cryptogram.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      console.log("tipImageOwner completed", hash)
    })
  }
   */ 

  /**
   constructor(props) {
    super(props)
    this.state = {
      web3Loaded: false,
      account: '',
      cryptogram: null,
      images: [],
      loading: true,
      sharePost: false
    }
    this.uploadImage = this.uploadImage.bind(this)
    this.tipImage = this.tipImage.bind(this)
    this.captureFile = this.captureFile.bind(this)
  }
   */


  render() {

    return (
      <div id="header" className="bg-dark">
        <Navbar />


        {this.props.cryptogramLoaded ? 
        <Main /> : <div classname = "content"></div>
        }




        
      </div>
    );
  }
}

//export default App;

/**
{ this.props.cryptogramLoaded
        ? <Loading />
        : <Main
            images={this.state.images}
            captureFile={this.captureFile}
            uploadImage={this.uploadImage}
            tipImage={this.tipImage}
          />
      }
 */


function mapStateToProps(state) {

  //console.log("cryptogramLoaded", cryptogramLoadedSelector(state))
  //console.log({images: imagesSelector(state)})

  return {
    //account: accountSelector(state)//enable selector for testing via console log

    cryptogramLoaded: cryptogramLoadedSelector(state),
    //images: imagesSelector(state)
  }
}

export default connect(mapStateToProps)(App)