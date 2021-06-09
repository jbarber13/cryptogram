import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css';
import {
  loadEverything
} from '../store/interactions'
import { cryptogramLoadedSelector} from '../store/selectors'
import Navbar from './Navbar'
import Main from './Main';
import Loading from './Loading'



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
            This app is a work in progress created by Jake Barber for testing and proof-of-concept purposes only, more information can be found on my <a className="text-light" href="https://www.jake-barber.com" target="_blank" rel="noopener noreferrer">website</a>.
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