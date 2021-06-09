import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
    userNameChanged, 
    statusChanged, 
    locationChanged,
    occupationChanged
} from '../store/actions'
import {
    fileSelector,   
    accountSelector,
    cryptogramSelector,
    fileUploadedSelector,
    userNameSelector,
    statusSelector,
    locationSelector,
    contactSelector,
    occupationSelector
  } from '../store/selectors'
import {captureFile, makeUser} from '../store/interactions'
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

const showForm = (props) => {
const {dispatch, account, cryptogram, file, userName, status, location, contact, occupation} = props

const initiateUser = () => {
    //view image: https://ipfs.infura.io/ipfs/<image hash> 
    
    //add to IPFS
    ipfs.add(file, (error, result) => {      
      //console.log('IPFS Result', result)
      if (error) {
        console.error(error)        
        console.log("An error may have been thrown if there was no image detected, this is expected")
      }
      makeUser(dispatch, cryptogram, account, userName, result, status, location, contact, occupation)
    })    

  }

    return (
        <div>
            <h3>Create a User Account</h3>
            <form onSubmit={(event) => {
                event.preventDefault()
                initiateUser()
            }} >
                <input
                    name="userName"
                    type="text"
                    onChange={(e) => dispatch(userNameChanged(e.target.value))}
                    className="form-control"
                    placeholder="Public User Name (required) "
                    required />
                <br />
                <span>Choose a profile picture </span> <input className="btn btn-secondary" type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={(e) => captureFile(e, dispatch)} />
                <br /><br />
                <div className="form-group mr-sm-2">
                    <textarea
                        name="status"
                        onChange={(e) => dispatch(statusChanged(e.target.value))}
                        rows="4"
                        cols="50"
                        className="form-control"
                        placeholder="Describe yourself...."
                    >
                    </textarea>
                    <br></br>
                    <input
                        name="location"
                        type="text"
                        onChange={(e) => dispatch(locationChanged(e.target.value))}
                        className="form-control"
                        placeholder="Where are you located? "
                    />
                    <br></br>
                  
                    <input
                        name="occupation"
                        type="text"
                        onChange={(e) => dispatch(occupationChanged(e.target.value))}
                        className="form-control"
                        placeholder="Occupation"
                    />
                </div>
                
                
                <button type="submit" className="btn btn-primary btn-block btn-lg">Create User</button>

            </form>
        </div>
    )
}








class CreateUser extends Component {
    render() {

        return (
            <div className="component" id="sharePost">
                <div>
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
        account: accountSelector(state),
        cryptogram: cryptogramSelector(state),
        userName: userNameSelector(state),
        status: statusSelector(state),
        location: locationSelector(state),
        contact: contactSelector(state),
        occupation: occupationSelector(state)
    }
}

export default connect(mapStateToProps)(CreateUser)