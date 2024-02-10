import React from 'react';
import './ConnectingToServer.css';
import ConnectingGif from '../../Assets/icons/connecting.gif';

const ConnectingToServer = () => {

  return (

    <div className='connecting' style={{ display: 'flex' }}>
      
        <h1>Please wait a few seconds, while we connecting you to server</h1>

        <img src={ConnectingGif}/>

        <p>It must not take more than a minute</p>

    </div>

  )
}

export default ConnectingToServer
