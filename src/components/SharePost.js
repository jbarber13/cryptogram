import React, { Component } from 'react';
import { connect } from 'react-redux'
import { postTitleChanged, postDescriptionChanged, postLinkChanged } from '../store/actions'
import {
  fileSelector,
  postTitleSelector,
  postDescriptionSelector,
  postLinkSelector,
  accountSelector,
  cryptogramSelector,
  fileUploadedSelector
} from '../store/selectors'
import { makePost, captureFile } from '../store/interactions'

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
    <div className="card bg-secondary">
      <div className="card-header bg-primary ">
        <h3>Make a New Post</h3>
      </div>
      
      <form className="p-2" onSubmit={(event) => {
        event.preventDefault()
        initiatePost()
      }} >
        <div className="form-group mr-sm-2">
        <input
          name="PostTitle"
          type="text"
          onChange={(e) => dispatch(postTitleChanged(e.target.value))}
          className="form-control mt-3"
          placeholder="Post Title"
          required 
        />        
          <textarea
            rows="4"
            cols="50"
            onChange={(e) => dispatch(postDescriptionChanged(e.target.value))}
            className="form-control mt-3"
            placeholder="Whats on your mind...?"
          />          
          <input
            name="Link"
            type="url"
            onChange={(e) => dispatch(postLinkChanged(e.target.value))}
            className="form-control mt-3"
            placeholder="Add a link URL (optional)"
          />         
          <input className="btn btn-light text-muted w-100 mt-3" type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={(e) => captureFile(e, dispatch)} />
                   
          <button type="submit" className="btn btn-primary btn-block btn-lg mt-3">Upload</button>
          </div>
      </form>
    </div>
  )
}

//          

class SharePost extends Component {
        render() {

    return (

      <div className="pt-5 p-5 w-50 m-auto">
        <br /><br /><br /><br /><br />
        <div className="card mb-4 bg-secondary m-auto "  >
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