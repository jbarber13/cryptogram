import React, { Component } from 'react';
import { connect } from 'react-redux'

import Identicon from 'identicon.js';
import moment from 'moment'
import Main from './Main'
import Loading from './Loading'

import { Switch, Route, Link } from 'react-router-dom';
import { fileCaptured, imageDescriptionChanged } from '../store/actions'
import {
  fileSelector,
  imageDescriptionSelector,
  accountSelector,
  cryptogramSelector
} from '../store/selectors'
import { makePost } from '../store/interactions'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


/**
const capture = (event, props) => {
  console.log("CAPTURE FUNCTION CALLED")
  const {dispatch} = props
  event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      //this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', reader.result)
      dispatch(buffer(reader.result))

    }
}

 */

//onChange={(e) => processFile(e, dispatch)}

//dispatch(processFile(captureFile(e)))





const showForm = (props) => {
  const { dispatch, file, imageDescription, account, cryptogram } = props

  const captureFile = (event) => {
    console.log('captureFile arrow function')
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      //this.setState({ buffer: Buffer(reader.result) })
      console.log('file', Buffer(reader.result))
      dispatch(fileCaptured(Buffer(reader.result)))
    }
  }
  const uploadImage = () => {
    console.log("uploading to IPFS... ")
    //view image: https://ipfs.infura.io/ipfs/<image hash> 
    //add to IPFS
    ipfs.add(file, (error, result) => {
      console.log('IPFS Result', result)
      if (error) {
        console.error(error)
        return
      }
      if(result[0].hash != undefined){
        console.log("the thing is not there")
      }
      //makePost(dispatch, account, cryptogram, result, imageDescription)
    })

  }


  
  return (
    <div>
      <p>&nbsp;</p>
      <h3>Share Image</h3>
      <form onSubmit={(event) => {
        event.preventDefault()
        uploadImage()
      }} >
        <input className="btn btn-secondary" type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={captureFile} />
        <div className="form-group mr-sm-2">
          <br></br>
          <input
            name="imageDescription"
            type="text"
            onChange={(e) => dispatch(imageDescriptionChanged(e.target.value))}
            className="form-control"
            placeholder="Image description..."
            required />
        </div>
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
    imageDescription: imageDescriptionSelector(state),
    account: accountSelector(state),
    cryptogram: cryptogramSelector(state),
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