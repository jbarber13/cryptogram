import React, { Component } from 'react'
import { connect } from 'react-redux'
import Collapsible from 'react-collapsible';


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
    fileSelector,
    userAccountLoadedSelector,
    userAccountUpdatingSelector
} from '../store/selectors'
import {
    setUserName,
    setImageHash,
    setBio,
    setLocation,
    setOccupation,
    captureFile,
    deleteUser
} from '../store/interactions'
import CreateUser from './CreateUser'
import Work from '../images/workIcon.jpg'
import Home from '../images/home.png'
import Contact from '../images/contact.png'
import Edit from '../images/edit.png'
import MyComments from './MyComments'
import MyPostFeed from './MyPostFeed'


const showUserInfo = (props) => {

    const { dispatch, cryptogram, user, userUpdateValue, file, userAccountUpdating } = props
    function getImageURL() {
        let hash
        hash = user.imageHash
        return `https://ipfs.infura.io/ipfs/${hash}`
    }

    function renderUserInfo() {
        return (
            <div className="profile-picture-username-bio w-80 mt-3 mb-5">
                <img className="profile-picture" src={getImageURL()} alt="profile-picture" />
                <br />
                <small className="cursor-pointer">
                    <Collapsible className="edit-user-value" trigger="Edit Profile Picture" triggerWhenOpen="Collapse">
                        <div className="m-auto w-25 manual-span-size">
                            <div className="card bg-secondary">
                                <div className="card-header bg-primary ">
                                    <span>Choose a new profile picture </span>
                                </div>
                                <form
                                    className="p-2"
                                    onSubmit={(event) => {
                                        event.preventDefault()
                                        prepImageHash()
                                    }} >
                                    <div className="form-group mr-sm-2 mt-2">
                                        <input className="btn btn-light text-muted w-100" type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={(e) => captureFile(e, dispatch)} />
                                        <button type="submit" className="btn btn-primary btn-block btn-lg w-100 mt-3">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Collapsible>
                </small>
                <div className="mt-3" id="SetUserName">
                    <h1
                        className="centered-user-info text-wrap cursor-pointer mt-3 mb-5"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Click to edit..."
                    >
                        <Collapsible trigger={user.userName}>
                            <div className="m-auto w-25 manual-span-size">
                                <div className="card bg-secondary">
                                    <div className="card-header bg-primary ">
                                        <span className="">Set a new User Name</span>
                                    </div>
                                    <form
                                        className="p-2"
                                        onSubmit={(event) => {
                                            event.preventDefault()
                                            setUserName(dispatch, cryptogram, user.userAccount, userUpdateValue)
                                        }} >
                                        <div className="form-group mr-sm-2 mt-2">
                                            <textarea
                                                rows="4"
                                                cols="50"
                                                onChange={(e) => dispatch(userUpdateValueChanged(e.target.value))}
                                                className="form-control"
                                                placeholder={user.userName}
                                            >
                                            </textarea>

                                            <button type="submit" className="btn btn-primary btn-block btn-lg mt-3">Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Collapsible>
                    </h1>
                </div>
                <div className="mt-5 mb-3" id="setBio">
                    <h3
                        className="cursor-pointer centered-user-info text-wrap mt-5"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Click to edit..."
                    >
                        <Collapsible trigger={user.bio}>
                            <div className="m-auto w-25 manual-span-size">
                                <div className="card bg-secondary">
                                    <div className="card-header bg-primary ">
                                        <span className="">Set your new Bio...</span>
                                    </div>
                                    <form
                                        className="p-2"
                                        onSubmit={(event) => {
                                            event.preventDefault()
                                            setBio(dispatch, cryptogram, user.userAccount, userUpdateValue)
                                        }} >
                                        <div className="form-group mr-sm-2 mt-2">
                                            <textarea
                                                rows="4"
                                                cols="50"
                                                onChange={(e) => dispatch(userUpdateValueChanged(e.target.value))}
                                                className="form-control"
                                                placeholder={user.bio}
                                            >
                                            </textarea>

                                            <button type="submit" className="btn btn-primary btn-block btn-lg mt-3">Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Collapsible>
                    </h3>
                </div>
            </div>
        )
    }//renderUserInfo

    function renderProfileInfo() {
        return (
            <div>
                <div className="card mb-4 position-top"  >
                    <div className="card-header bg-primary ">
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
                                                    placeholder={user.occupation}
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
                                                    placeholder={user.location}
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
        <div className="w-75 h-100">
            <a
                className="text-light"
                href={`https://rinkeby.etherscan.io/address/${user.userAccount}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Your Account: {user.userAccount}

            </a>
            <div className="">
                {renderUserInfo()}
            </div>

            <div className="row g-3 pt-0">
                <div className="profile-box col m-auto w-50 float-left">
                    {renderProfileInfo()}

                </div>
                <div className="profile-box col m-auto w-50 float-right">
                    <MyComments />
                </div>
            </div>
            <div className="mt-5">
                <h1>My Post History</h1>
                <MyPostFeed />
            </div>
            <form
                className="p-5"
                onSubmit={(event) => {
                    event.preventDefault()
                    deleteUser(dispatch, cryptogram, user.userAccount)
                }} >
                <button type="submit" className="btn btn-danger btn-sml  ">Delete Account</button>
            </form>

            <footer>
                <div class="text-center p-3 pb-5">
                    <small className="text-muted">
                        This app is a work in progress created by Jake Barber for testing and proof-of-concept purposes only, more information can be found on my <a className="text-light" href="https://www.jake-barber.com" target="_blank">website</a>.
                    </small>
                </div>
            </footer>

        </div>
    )
}//showUserInfo


class MyAccount extends Component {
    render() {
        //console.log("User Test: userAccount location: should not be 'Cryptoverse'", this.props.user.location)
        return (
            <div className="myAccount bg-dark text-light h-100">

                {this.props.userAccountLoaded ? showUserInfo(this.props) : <CreateUser />}

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
        userAccountLoaded: userAccountLoadedSelector(state),
        userAccountUpdating: userAccountUpdatingSelector(state)
    }
}

export default connect(mapStateToProps)(MyAccount)