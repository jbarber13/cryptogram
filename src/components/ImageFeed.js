import React, { Component } from 'react';
import { connect } from 'react-redux'

import Identicon from 'identicon.js';
import moment from 'moment'
import Main from './Main'
import Loading from './Loading'

import { Switch, Route, Link } from 'react-router-dom';
import { fileCaptured, imageDescriptionChanged } from '../store/actions'
import {
  allImagesSelector,
  cryptogramSelector,
  web3Selector,
  accountSelector
} from '../store/selectors'
import { tipImage } from '../store/interactions'



//test IPFS hash: QmTB1GwdrgfFfPSpKpeYFuS2JidiqnLZv2uaKDzU2tkaYw
//portrait logo: QmUhWdN2ZMoNjxtTywNWJPVqn9TRYgxnNyUhiDa8nAzWtg





class ImageFeed extends Component {
  render() {

    return (
      <div className="container-fluid mt-5">
        { this.props.allImages.map((image, key) => {
          return (
            <div className="card mb-4 " key={key} >
              <div className="card-header">
                <img
                  className='mr-2'
                  width='30'
                  height='30'
                  alt="#"
                  src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}
                />
                <small className="text-muted">{image.author}</small>
                <small className="text-muted"><br />Posted on: {moment.unix(image.timeStamp).format('M/D/Y')} at: {moment.unix(image.timeStamp).format('h:mm:ss a')}</small>

              </div>
              <ul id="imageList" className="list-group list-group-flush ">
                <li className="list-group-item bg-secondary">
                  <p class="text-center"><img className="uploadedImage" src={`https://ipfs.infura.io/ipfs/${image.hash}`} alt="" /></p>
                  <p className="text-light border-info card-body">{image.description}</p>
                </li>
                <li key={key} className="list-group-item py-2">
                  <small className="float-left mt-1 text-muted ">
                   
                    TIPS: {this.props.web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH
                        </small>
                  <button
                    className="btn btn-link btn-sm float-right pt-0"
                    name={image.id}
                    onClick={(event) => {
                      let tipAmount = this.props.web3.utils.toWei('0.1', 'Ether')
                      tipImage(this.props.dispatch, this.props.account, this.props.cryptogram, event.target.name, tipAmount)
                    }}
                  >
                    TIP 0.1 ETH
                        </button>
                </li>
              </ul>
            </div>
          )
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allImages: allImagesSelector(state),
    web3: web3Selector(state),
    account: accountSelector(state),
    cryptogram: cryptogramSelector(state)
  }
}

export default connect(mapStateToProps)(ImageFeed)