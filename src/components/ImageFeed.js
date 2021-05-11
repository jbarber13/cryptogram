import React, { Component } from 'react';
import { connect } from 'react-redux'

import Identicon from 'identicon.js';
import moment from 'moment'
import Main from './Main'

import { Switch, Route, Link } from 'react-router-dom';
import { fileCaptured, imageDescriptionChanged } from '../store/actions'
import {
  allImagesSelector,
  allPostSelector,
  cryptogramSelector,
  web3Selector,
  accountSelector
} from '../store/selectors'
import { tipImage } from '../store/interactions'



//test IPFS hash: QmTB1GwdrgfFfPSpKpeYFuS2JidiqnLZv2uaKDzU2tkaYw
//portrait logo: QmUhWdN2ZMoNjxtTywNWJPVqn9TRYgxnNyUhiDa8nAzWtg

const showFeed = (props) => {
  const { dispatch, account, cryptogram, web3, allImages, allPosts} = props

  function getImageURL(post){
    let output = ''
    let imageID = post.imageID
    console.log(imageID)
    if(imageID != 0){
      
    }

    return 'https://ipfs.infura.io/ipfs/QmTB1GwdrgfFfPSpKpeYFuS2JidiqnLZv2uaKDzU2tkaYw'
  }
  


  return(
    <div className="container-fluid">
          {
            allPosts.map((post, key) => {
              return (
                <div className="ImageFeedImage">
                <div className="card mb-4 " key={key} >
                  <div className="card-header">
                    <img
                      className='mr-2'
                      width='30'
                      height='30'
                      alt="#"
                      src={`data:image/png;base64,${new Identicon(post.author, 30).toString()}`}
                    />
                    <small className="text-muted">{post.author}</small>
                    <small className="text-muted"><br />Posted on: {moment.unix(post.timeStamp).format('M/D/Y')} at: {moment.unix(post.timeStamp).format('h:mm:ss a')}</small>

                  </div>
                  <ul id="imageList" className="list-group list-group-flush ">
                    <li className="list-group-item bg-secondary">
                      <p class="text-center"><img className="uploadedImage" src={getImageURL(post)} alt="" /></p>
                      <p className="text-light border-info card-body">{post.status}</p>
                    </li>
                    <li key={key} className="list-group-item py-2">
                      <small className="float-left mt-1 text-muted ">

                        TIPS: {post.title.toString()} ETH
                        </small>
                      <button
                        className="btn btn-link btn-sm float-right pt-0"
                        name={post.id}
                        onClick={(event) => {
                          let tipAmount = web3.utils.toWei('0.1', 'Ether')
                          tipImage(dispatch, account, cryptogram, event.target.name, tipAmount)
                        }}
                      >
                        TIP 0.1 ETH
                        </button>
                    </li>
                  </ul>
                </div>
              </div>
              )
            })
          }
        </div>
  )
}





class ImageFeed extends Component {
  render() {
    return (
      <div className="imageFeed" id="imageFeed">
        <br /><br /><br /><br /><br /><br />
        {showFeed(this.props)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allImages: allImagesSelector(state),
    allPosts: allPostSelector(state),
    web3: web3Selector(state),
    account: accountSelector(state),
    cryptogram: cryptogramSelector(state)
  }
}

export default connect(mapStateToProps)(ImageFeed)