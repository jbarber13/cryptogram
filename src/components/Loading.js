import React, { Component } from 'react';
import Typed from 'react-typed'

class Loading extends Component {

    componentDidMount() {
        setTimeout(function () { //Start the timer
            this.setState({ render: true }) //After 20 seconds, set render to true
        }.bind(this), 30000)
    }



    constructor(props) {
        super(props);
        this.state = {
            render: false //Set render state to false
        }
    }

    render() {
        let timoutContent = false //By default don't render anything
        if (this.state.render) { //If this.state.render == true, which is set to true by the timer.
            timoutContent = 
            <div>
                <br/><br/><br/><br/>
                If you are stuck here, the network may be running slowly, or you might not be on the correct network. Please make sure your MetaMask network is set to Rinkeby. If you had to change it, please refresh the page.
            </div> //Add dom elements
        }

        return (
            

            <div className="component" id="loading">

                <div className="main-info">
                 
                    <div className="typed">
                        <Typed
                            className="typed-text"
                            strings={["Loading...."]}
                            typeSpeed={80}
                            backSpeed={100}
                            loop
                        />
                    </div>

                    {timoutContent}
                </div>
            </div>




        );
    }
}

export default Loading;