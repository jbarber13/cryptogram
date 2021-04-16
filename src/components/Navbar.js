import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from '../images/photo.png'

import { Switch, Route } from 'react-router-dom';



class Navbar extends Component {
  
  
  
  

  render() {
    return (
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary bg-primary fixed-top">
        <a
          className="navbar-brand"
          href="https://www.jake-barber.com/#cryptogram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp;CryptoGram - A Decentralized Social Media Platform  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav mr-auto">
          <li class="nav-item">
              <a class="nav-link" href="#" >Front Page</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">New Post</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Account</a>
            </li>
            
          </ul>
          <span class="navbar-text">
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

export default Navbar;