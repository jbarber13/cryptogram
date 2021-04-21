import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from '../images/photo.png'
import { connect } from 'react-redux'
import {accountSelector} from '../store/selectors'
import { Switch, Route } from 'react-router-dom';



class Navbar extends Component {
  
  
  
  

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary bg-primary fixed-top">
        <a
          className="navbar-brand"
          href="https://www.jake-barber.com/#cryptogram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp;CryptoGram - A Decentralized Social Media Platform  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
          <li className="nav-item">
              <a className="nav-link" href="#" >Front Page</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">New Post</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Account</a>
            </li>
            
          </ul>
          <span className="navbar-text">
          <a
                className="nav-link"
                href={`https://rinkeby.etherscan.io/address/${this.props.account}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Your Account: {this.props.account}
                { /**Identicon - only show if account exists*/
                  this.props.account
                    ? <img
                      className="ml-2"
                      width="30"
                      height="30"
                      src={`data:image/png;base64, ${new Identicon(this.props.account, 30).toString()}`}
                      alt=""
                    />
                    : <span></span>
                }
              </a>
    </span>
        </div>
      </nav>
    );
  }
}
function mapStateToProps(state) {
  
  return {
    account: accountSelector(state), //display account name in top right of navbar, uses ../store/selectors.js, imported above    
  }
}
export default connect(mapStateToProps)(Navbar)