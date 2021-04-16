import React, { Component } from 'react';
import Identicon from 'identicon.js';
import moment from 'moment'
import Main from './Main'
import Loading from './Loading'

import { Switch, Route, Link } from 'react-router-dom';


class SharePost extends Component {




    render() {

        return (
            <div className="component" id="loading">

                <div className="main-info">
                 
                    <div className="typed">
                        SHARE POST PAGE
                    </div>

                </div>
            </div>

        );
    }
}

export default SharePost;