import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    cryptogramSelector,
    userSelectedSelector,
} from '../store/selectors'

import Work from '../images/workIcon.jpg'
import Home from '../images/home.png'
import UserComments from './UserComments'
import UserPostFeed from './UserPostFeed'


const showUserInfo = (props) => {

    const { user } = props

    function getImageURL() {
        let hash
        hash = user.imageHash
        return `https://ipfs.infura.io/ipfs/${hash}`
    }

    function renderUserInfo() {
        return (
            <div className="profile-picture-username-bio w-80 mt-3 mb-5">
                <img className="profile-picture" src={getImageURL()} alt="profile" />
                <br />
                <div className="mt-3">
                    <h1 className="centered-user-info text-wrap mt-3">{user.userName}</h1>
                </div>
                <br />
                <div className="mt-3">
                    <h3 className="centered-user-info text-wrap ">{user.bio}</h3>
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

                        </li>
                        <li className="list-group-item bg-secondary">
                            <img className="infoImage" src={Home} alt="location"></img>
                            <span className="float-left pl-4">Lives in: {user.location}</span>
                            <br />

                        </li>
                    </ul>
                </div>
            </div>
        )
    }//renderProfileInfo


    return (
        <div className="w-75 h-100">
            <a
                className="text-light"
                href={`https://rinkeby.etherscan.io/address/${user.userAccount}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Account Address: {user.userAccount}

            </a>
            <div className="">
                {renderUserInfo()}
            </div>

            <div className="row g-3 pt-0">
                <div className="profile-box col m-auto w-50 float-left">
                    {renderProfileInfo()}
                </div>
                <div className="profile-box col m-auto w-50 float-right">
                    <UserComments />
                </div>
            </div>
            <div className="pt-5">
                <h1>{user.userName}'s Post History</h1>
                <UserPostFeed />
            </div>


        </div>
    )
}//showUserInfo


class UserPage extends Component {
    render() {
        //redirect back to ImageFeed if user data does not exist, such as on a page refresh
        if (!this.props.user) { this.props.history.push('/') }
        return (
            <div className="myAccount bg-dark text-light h-100">
                {showUserInfo(this.props)}

            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
        user: userSelectedSelector(state),
        cryptogram: cryptogramSelector(state),


    }
}

export default connect(mapStateToProps)(UserPage)