import React, { Component } from 'react';
import Identicon from 'identicon.js';
import moment from 'moment'

import { Switch, Route } from 'react-router-dom';


class Main extends Component {


  

  render() {

    return (
      <div className="container-fluid mt-5 ">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '50%' }}>
            <div className="content mr-auto ml-auto text-light">
              <p>&nbsp;</p>
              <h3>Share Image</h3>
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = this.imageDescription.value
                this.props.uploadImage(description)
              }} >
                <input className="btn btn-secondary" type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
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

              <p>&nbsp;</p>
                
              { this.props.images.map((image, key) => {
                return(
                  <div className="card mb-4 " key={key} >
                    <div className="card-header">
                      <img
                        className='mr-2'
                        width='30'
                        height='30'
                        alt="#"
                        src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}
                      />
                      <small className="text-muted">{image.author}</small>
                      <small className="text-muted"><br />Posted on: {moment.unix(image.timeStamp).format('M/D/Y')} at: {moment.unix(image.timeStamp).format('h:mm:ss a')}</small> 
                      
                    </div>
                    <ul id="imageList" className="list-group list-group-flush ">
                      <li className="list-group-item bg-secondary">
                      <p class="text-center"><img className="uploadedImage" src={`https://ipfs.infura.io/ipfs/${image.hash}`} alt=""/></p>
                        <p className="text-light border-info card-body">{image.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted ">
                          TIPS: {window.web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH
                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name, tipAmount)
                            this.props.tipImage(event.target.name, tipAmount)
                          }}
                        >
                          TIP 0.1 ETH
                        </button>
                      </li>
                    </ul>
                  </div>
                )
              })}

            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;