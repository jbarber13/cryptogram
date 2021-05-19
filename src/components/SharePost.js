import React, { Component } from 'react';
import { connect } from 'react-redux'

import Loading from './Loading'

import {  postTitleChanged, postDescriptionChanged, postLinkChanged} from '../store/actions'
import {
  fileSelector,
  postTitleSelector,
  postDescriptionSelector,
  postLinkSelector,
  accountSelector,
  cryptogramSelector,
  fileUploadedSelector
} from '../store/selectors'
import { makePost, captureFile} from '../store/interactions'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })




const showForm = (props) => {
  const { dispatch, file, postTitle, postDescription, postLink, account, cryptogram } = props

 
  const initiatePost = () => {
    //view image: https://ipfs.infura.io/ipfs/<image hash> 
    
    //add to IPFS
    ipfs.add(file, (error, result) => {      
      //console.log('IPFS Result', result)
      if (error) {
        console.error(error)        
        console.log("An error may have been thrown if there was no image detected, this is expected")
      }
      makePost(dispatch, cryptogram, account, result, postDescription, postTitle, postLink)
    })    

  }



  return (
    <div>
      <p>&nbsp;</p>
      <h3>Make a New Post</h3>
      <form onSubmit={(event) => {
        event.preventDefault()
        initiatePost()
      }} >
        <input
            name="PostTitle"
            type="text"
            onChange={(e) => dispatch(postTitleChanged(e.target.value))}
            className="form-control"
            placeholder="Post Title"
            required />
        <br />
        <div className="form-group mr-sm-2">
          <textarea
            rows="4"
            cols="50"
            onChange={(e) => dispatch(postDescriptionChanged(e.target.value))}
            className="form-control"
            placeholder="Whats on your mind...?"
            >            
          </textarea>
          
          <br></br>
          <input
            name="Link"
            type="url"
            onChange={(e) => dispatch(postLinkChanged(e.target.value))}
            className="form-control"
            placeholder="Add a link URL (optional)"
             />
        </div>
        <input className="btn btn-secondary" type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={(e) => captureFile(e, dispatch)} />
        <br /><br />
        <button type="submit" className="btn btn-primary btn-block btn-lg">Upload</button>

      </form>
      <p>&nbsp;</p>
    </div>
  )
}

class SharePost extends Component {
  render() {

    return (
      <div className="component" id="sharePost">
        <div className="sharePost">
          {showForm(this.props)}          
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {

  return {
    file: fileSelector(state),
    fileUploaded: fileUploadedSelector(state),
    postTitle: postTitleSelector(state),
    postDescription: postDescriptionSelector(state),
    postLink: postLinkSelector(state),
    account: accountSelector(state),
    cryptogram: cryptogramSelector(state)
  }
}

export default connect(mapStateToProps)(SharePost)


/**
 <p>&nbsp;</p>
              <h3>Share Image</h3>
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = this.imageDescription.value
                this.uploadImage(description)
              }} >
                <input className="btn btn-secondary" type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.captureFile} />
                  <div className="form-group mr-sm-2">
                    <br></br>
                      <input
                        id="imageDescription"
                        type="text"
                        ref={(input) => { this.imageDescription = input }}
                        className="form-control"
                        placeholder="Image description..."
                        required />
                  </div>
                <button type="submit" className="btn btn-secondary btn-block btn-lg">Upload</button>
              </form>
 */