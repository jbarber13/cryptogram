import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from '../images/photo.png'

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-info flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://www.jake-barber.com/#DSM"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={photo} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp;Decentralized Social Media (DSM)
        </a>

        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a
              className="nav-link small"
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
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;