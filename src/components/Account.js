import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    userNameChanged,
    statusChanged,
    locationChanged,
    contactChanged,
    occupationChanged
} from '../store/actions'
import {
    allUsersSelector,
    accountSelector,
    cryptogramSelector,
    userExistsSelector
} from '../store/selectors'
import { userExists } from '../store/interactions'
import CreateUser from './CreateUser'


const showUserInfo = (props) => {

    const { dispatch } = props



    return (
        <div>
            Build out to look like facebook....
        </div>
    )
}


class Account extends Component {
    render() {
        return (
            <div className="component" id="sharePost">
                <div className="sharePost">
                    {showUserInfo(this.props)}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {

    }
}

export default connect(mapStateToProps)(Account)