import React, { Component } from 'react';
import Web3 from 'web3';
//import Identicon from 'identicon.js';
import './App.css';
import CryptoGram from '../abis/CryptoGram.json'
import { Switch, Route, Link } from 'react-router-dom';
import {loadWeb3}from '../store/interactions'

import Navbar from './Navbar'
import Main from './Main';
import Loading from './Loading'
//import SharePost from './SharePost'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  //run before render function
  async componentWillMount() {
    await this.loadWeb3()
    if (this.state.web3Loaded) {
      await this.loadBlockchainData()
    } else {
      //this.setState({loading: false})
    }

  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      this.setState({ web3Loaded: true })
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      this.setState({ web3Loaded: true })
    }
    else {
      window.alert('Please install MetaMask in order to access to CryptoGram')
      window.location.href = "https://metamask.io/"
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] }) //set state varriable

    //Load contract
    const networkID = await web3.eth.net.getId()//get networkID from MetaMask
    const cryptogramData = CryptoGram.networks[networkID]
    //check for null contract data
    if (cryptogramData) {
      const cryptogram = new web3.eth.Contract(CryptoGram.abi, cryptogramData.address)
      this.setState({ cryptogram })

      //load images
      const imageCount = await cryptogram.methods.imageCount().call()
      this.setState({ imageCount })

      //load images
      for (var i = 1; i <= imageCount; i++) {
        const image = await cryptogram.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }

      //sort by most tipped first
      this.setState({
        images: this.state.images.sort((a, b) => b.tipAmount - a.tipAmount)
      })

      this.setState({ loading: false })
    } else {
      window.alert('CryptoGram contract not deployed to the detected network, please switch your network in MetaMask to Rinkeby and refresh the page')
    }



  }//loadBlockchianData

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

      this.setState({ loading: true })
      this.state.cryptogram.methods.uploadImage(result[0].hash, description).send({ from: this.state.account })
        .on('transactionHash', (hash) => {
          this.setState({ loading: false })
          console.log("Upload transaction hash: ", hash)
        })
    })

  }

  tipImage(id, tipAmount) {

    this.state.cryptogram.methods.tipImageOwner(id).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
      console.log("tipImageOwner completed", hash)
    })
  }


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

  /**
   * 
   *  
   */


  render() {
    return (
      <div id="header" className="bg-dark">
        <Navbar account={this.state.account} sharePost={this.state.sharePost}/>
        { this.state.loading
        ? <Loading />
        : <Main
            images={this.state.images}
            captureFile={this.captureFile}
            uploadImage={this.uploadImage}
            tipImage={this.tipImage}
          />
      }
      </div>
    );
  }
}

export default App;

/**
 { this.state.loading
        ? <Loading />
        : <Main
            images={this.state.images}
            captureFile={this.captureFile}
            uploadImage={this.uploadImage}
            tipImage={this.tipImage}
          />
      }
 */