import React, { Component } from 'react'
import { connect } from 'react-redux'
import Collapsible from 'react-collapsible';
import {
    CollapsibleComponent,
    CollapsibleHead,
    CollapsibleContent
} from "react-collapsible-component";

import {
    userNameChanged,
    statusChanged,
    locationChanged,
    contactChanged,
    userUpdateValueChanged
} from '../store/actions'
import {
    cryptogramSelector,
    userSelector,
    userUpdateValueSelector,
    fileSelector
} from '../store/selectors'
import {
    setUserName,
    setImageHash,
    setBio,
    setLocation,
    setOccupation,
    captureFile
} from '../store/interactions'
import CreateUser from './CreateUser'
import Work from '../images/workIcon.jpg'
import Home from '../images/home.png'
import Contact from '../images/contact.png'
import Edit from '../images/edit.png'
import SharePost from './SharePost'


const showUserInfo = (props) => {

    const { dispatch, cryptogram, user, userUpdateValue, file } = props
    function getImageURL() {
        let hash
        hash = user.imageHash
        return `https://ipfs.infura.io/ipfs/${hash}`
    }

    function renderUserInfo() {
        return (
            <div className="username-bio">
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                <h1 className="centered-user-info text-wrap">{user.userName}</h1>
                <small className="cursor-pointer">
                    <Collapsible className="edit-user-value" trigger="Edit" triggerWhenOpen="Collapse">
                        <div className="m-auto w-25">
                            <br></br>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                setUserName(dispatch, cryptogram, user.userAccount, userUpdateValue)
                            }} >
                                <div className="form-group mr-sm-2">
                                    <textarea
                                        rows="4"
                                        cols="50"
                                        onChange={(e) => dispatch(userUpdateValueChanged(e.target.value))}
                                        className="form-control"
                                        placeholder="Whats the new thing...?"
                                    >
                                    </textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block btn-lg">Submit</button>
                            </form>
                        </div>
                    </Collapsible>
                </small>
                <br /><br /><br />
                <h1 className="centered-user-info text-wrap">{user.bio}</h1>
                <small className="cursor-pointer">
                    <Collapsible className="edit-user-value" trigger="Edit" triggerWhenOpen="Collapse">
                        <div className="m-auto w-25">
                            <br></br>
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                setBio(dispatch, cryptogram, user.userAccount, userUpdateValue)
                            }} >
                                <div className="form-group mr-sm-2">
                                    <textarea
                                        rows="4"
                                        cols="50"
                                        onChange={(e) => dispatch(userUpdateValueChanged(e.target.value))}
                                        className="form-control"
                                        placeholder="Whats the new thing...?"
                                    >
                                    </textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block btn-lg">Submit</button>
                            </form>
                        </div>
                    </Collapsible>
                </small>


                <div>
                    <p></p>
                </div>
            </div>
        )
    }//renderUserInfo

    function renderProfileInfo() {
        return (
            <div>
                <div className="card mb-4"  >
                    <div className="card-header bg-info ">
                        <h2 className="text-light">Info</h2>
                    </div>
                    <ul id="imageList" className="list-group list-group-flush ">
                        <li className="list-group-item bg-secondary">
                            <img className="infoImage" src={Work} alt="occupation"></img>
                            <span className="float-left pl-4">Occupation: {user.occupation}</span>
                            <br />
                            <small className="edit">
                                <Collapsible className="edit-user-value" trigger="Edit" triggerWhenOpen="Collapse">
                                    <div>
                                        <br></br>
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            setOccupation(dispatch, cryptogram, user.userAccount, userUpdateValue)
                                        }} >
                                            <div className="form-group mr-sm-2">
                                                <textarea
                                                    rows="4"
                                                    cols="50"
                                                    onChange={(e) => dispatch(userUpdateValueChanged(e.target.value))}
                                                    className="form-control"
                                                    placeholder="Whats the new thing...?"
                                                >
                                                </textarea>
                                            </div>
                                            <button type="submit" className="btn btn-primary btn-block btn-lg">Submit</button>
                                        </form>
                                    </div>
                                </Collapsible>
                            </small>
                        </li>
                        <li className="list-group-item bg-secondary">
                            <img className="infoImage" src={Home} alt="location"></img>
                            <span className="float-left pl-4">Lives in: {user.location}</span>
                            <br />
                            <small className="edit">
                                <Collapsible className="edit-user-value" trigger="Edit" triggerWhenOpen="Collapse">
                                    <div>
                                        <br></br>
                                        <form onSubmit={(event) => {
                                            event.preventDefault()
                                            setLocation(dispatch, cryptogram, user.userAccount, userUpdateValue)
                                        }} >
                                            <div className="form-group mr-sm-2">
                                                <textarea
                                                    rows="4"
                                                    cols="50"
                                                    onChange={(e) => dispatch(userUpdateValueChanged(e.target.value))}
                                                    className="form-control"
                                                    placeholder="Whats the new thing...?"
                                                >
                                                </textarea>
                                            </div>
                                            <button type="submit" className="btn btn-primary btn-block btn-lg">Submit</button>
                                        </form>
                                    </div>
                                </Collapsible>
                            </small>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }//renderProfileInfo

    function prepImageHash() {
        const ipfsClient = require('ipfs-http-client')
        const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
        //view image: https://ipfs.infura.io/ipfs/<image hash>     
        //add to IPFS
        ipfs.add(file, (error, result) => {
            //console.log('IPFS Result', result)
            if (error) {
                console.error(error)
                console.log("An error may have been thrown if there was no image detected, this is expected")
            }
            setImageHash(dispatch, cryptogram, user.userAccount, result)
        })
    }
    return (
        <div className="profile">
            <br />
            <img className="profile-picture" src={getImageURL()} alt="profile-picture" />
            <small className="cursor-pointer">
                <Collapsible className="edit-user-value" trigger="Edit" triggerWhenOpen="Collapse">
                    <div className="m-auto w-25">
                        <br></br>
                        <form onSubmit={(event) => {
                            event.preventDefault()
                            prepImageHash()
                        }} >
                            <div className="form-group mr-sm-2">
                                <span>Choose a new profile picture </span> <input className="btn btn-secondary" type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={(e) => captureFile(e, dispatch)} />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block btn-lg">Submit</button>
                        </form>
                    </div>
                </Collapsible>
            </small>
            {renderUserInfo()}
            <br />
            <div className="row g-3">
                <div className="col m-auto w-50 float-left">
                    <div>
                        {renderProfileInfo()}
                    </div>                    
                    
                </div>
                <div className="col m-auto w-50 float-right">
                    <div className="bg-info cursor-pointer card mb-4">
                    <Collapsible  trigger="Make a new post" triggerWhenOpen="Collapse">
                        <SharePost />
                    </Collapsible>
                    </div>
                </div>
            </div>
            
        </div>
    )
}//showUserInfo


class OldMyAccount extends Component {
    render() {
        //console.log("User Test: userAccount location: should not be 'Cryptoverse'", this.props.user.location)
        return (
            <div className="component" id="myAccount">
                <div className="myAccount">
                    {showUserInfo(this.props)}
                </div>
                <br /><br /><br /><br />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: userSelector(state),
        cryptogram: cryptogramSelector(state),
        userUpdateValue: userUpdateValueSelector(state),
        file: fileSelector(state),
    }
}

export default connect(mapStateToProps)(OldMyAccount)