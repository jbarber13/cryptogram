import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from '../images/photo.png'
import { connect } from 'react-redux'
import { accountSelector } from '../store/selectors'
import { Link } from 'react-router-dom';
import { userSelector, userAccountLoadedSelector } from '../store/selectors'


const showNavbar = (props) => {
  const { account, user, userAccountLoaded } = props
  function getImageURL() {
    let hash
    hash = user.imageHash
    return `https://ipfs.infura.io/ipfs/${hash}`
  }
  function getUserIcon() {

    if (userAccountLoaded) {
      return (
        <a
          className="nav-link"
          href={`https://rinkeby.etherscan.io/address/${account}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Your Account: </span><span data-toggle="tooltip" data-placement="bottom" title={`Account Address: ${account}`}>{user.userName}</span>

          <img
            className="ml-2 rounded-circle"
            width="40"
            height="40"
            src={getImageURL()}
            alt="profile-picture"
          />

        </a>
      )
    } else {
      return (
        <a
          className="nav-link"
          href={`https://rinkeby.etherscan.io/address/${account}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Your Account: {account}
          { /**Identicon - only show if account exists*/
            account
              ? <img
                className="ml-2"
                width="30"
                height="30"
                src={`data:image/png;base64, ${new Identicon(account, 30).toString()}`}
                alt="identicon"
              />
              : <span></span>
          }
        </a>
      )
    }
  }


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-info fixed-top">
      <a
        className="navbar-brand"
        href="https://www.jake-barber.com/#cryptogram"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={photo} width="30" height="30" className="d-inline-block align-top pr-1" alt="" />
          CryptoGram - A Decentralized Social Media Platform
        </a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse text-center" id="navbarText">
        <ul className="navbar-nav pl-5 ">
          <li className="nav-item">
            <Link to="/">              
                <a className="btn btn-link text-light" href="#header">Front Page</a>
            </Link>
          </li>          
          <li className="nav-item">
            <Link to="/SharePost">
              <button type="button" className="btn btn-link text-light">
                New Post
                </button>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/MyAccount">
              <button type="button" className="btn btn-link text-light">
                Account
                </button>
            </Link>
          </li>
        </ul>

      </div>
      <span className="navbar-text">
        {getUserIcon()}
      </span>
    </nav>
  )
}


class Navbar extends Component {
  render() {
    return (
      <div>
        {showNavbar(this.props)}
      </div>
    );
  }
}
function mapStateToProps(state) {

  return {
    account: accountSelector(state), //display account name in top right of navbar, uses ../store/selectors.js, imported above 
    userAccountLoaded: userAccountLoadedSelector(state),
    user: userSelector(state)

  }
}
export default connect(mapStateToProps)(Navbar)