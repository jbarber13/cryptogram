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
    userUpdateValueSelector
} from '../store/selectors'
import { updateUser } from '../store/interactions'
import CreateUser from './CreateUser'
import Work from '../images/workIcon.jpg'
import Home from '../images/home.png'
import Contact from '../images/contact.png'


const showUserInfo = (props) => {

    const { dispatch, cryptogram, user, userUpdateValue} = props
    function getImageURL() {
        let hash
        hash = user.imageHash
        return `https://ipfs.infura.io/ipfs/${hash}`
    }
    function editUserValue(type){
        return (
            <div>
              <br></br>
              <form onSubmit={(event) => {
                event.preventDefault()
               updateUser(dispatch, cryptogram, user.userAccount, type, userUpdateValue)
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
                <button type="submit" className="btn btn-primary btn-block btn-lg">Submit {type}</button>
      
              </form>
            </div>
          )
    }

    function renderProfileInfo() {
        return (
            <div className="profile-info">
                <div className="card mb-4"  >
                    <div className="card-header bg-primary ">
                        <h2 className="text-light">Info</h2>
                    </div>
                    <ul id="imageList" className="list-group list-group-flush ">
                        <li className="list-group-item bg-secondary">
                            <img className="infoImage" src={Work} alt="occupation"></img>
                            <span className="float-left pl-4">Occupation: {user.occupation}</span>
                            <br />
                            <Collapsible className="edit-user-value" trigger="Edit">
                                {editUserValue("occupation")}
                            </Collapsible>
                        </li>
                        <li className="list-group-item bg-secondary">
                            <img className="infoImage" src={Home} alt="location"></img>
                            <span className="float-left pl-4">Lives in: {user.location}</span>
                            <br />
                            <Collapsible className="edit-user-value" trigger="Edit">
                                {editUserValue("location")}
                            </Collapsible>
                        </li>
                        <li className="list-group-item bg-secondary">
                            <img className="infoImage" src={Contact} alt="contact"></img>
                            <span className="float-left pl-4">Contact Information: {user.contact}</span>
                            <br />
                            <Collapsible className="edit-user-value" trigger="Edit">
                                {editUserValue("contact")}
                            </Collapsible>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }//renderProfileInfo


    return (
        <div className="profile">
            <br />
            <img className="profile-picture" src={getImageURL()} alt="profile-picture" />
            <h2>{user.userName}</h2>
            <p>{user.status}</p>
            <br />
            {renderProfileInfo()}
        </div>
    )
}//showUserInfo


class MyAccount extends Component {
    render() {
        console.log("User Test: userAccount location: should not be 'Cryptoverse'", this.props.user.location)
        return (
            <div className="component" id="sharePost">
                <div className="sharePost">
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
        userUpdateValue: userUpdateValueSelector(state)
    }
}

export default connect(mapStateToProps)(MyAccount)