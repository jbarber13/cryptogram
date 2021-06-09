import React, { Component } from 'react';
import Identicon from 'identicon.js';
import photo from '../images/cryptogram.png'
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
          <img
            className="ml-3 rounded-circle "
            width="75"
            height="75"
            data-toggle="tooltip"
            data-placement="bottom"
            title={`Account Address: ${account}`}
            src={getImageURL()}
            alt="profile"
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
          
          { /**Identicon - only show if account exists*/
            account
              ? <img
                width="75"
                height="75"
                data-toggle="tooltip"
                data-placement="bottom"
                title={`Account Address: ${account}`}
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">

      <a
        className="navbar-brand"
        href="https://www.jake-barber.com/#cryptogram"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={photo} width="75" height="75" className="cryptogram-logo pl-1" alt="" />
      </a>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav w-100 list-inline mx-auto justify-content-center">
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






      <div className="d-flex justify-content-end">
        <span className="navbar-text">
          {getUserIcon()}
        </span>
      </div>


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