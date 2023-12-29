import React, { useEffect, useState } from 'react';
import './ImageFullScreen.css';
import Svgs from '../../Assets/icons/Svgs';
import arrow from '../../Assets/icons/arrow.svg';

const ImageFullScreen = ({ imageNames, imageIndex, imageFullScreen, setImageFullScreen }) => {

    const [index, setIndex] = useState(0);

    useEffect(() => {
        console.log("imageIndex: ", imageIndex, " images length: ", imageNames.length);
        if(imageIndex >= 0 && imageIndex < imageNames.length) setIndex(imageIndex);
    }, []);

    useEffect(() => {
        if(imageFullScreen && imageIndex >= 0 && imageIndex < imageNames.length - 1) setIndex(imageIndex);
        console.log("images: ", imageNames);
    }, [imageFullScreen]);

    useEffect(() => {
        console.log("index: ", index);
    }, [index]);

  return (
    <div className='ImageFullScreenContainer'>

        <div className='exitDiv' onClick={() => setImageFullScreen(false)}>
            <Svgs type={"Exit"}/>
        </div>

        <img src={arrow} className='arrows' style={{
            transform: "rotateZ(180deg)"
        }} onClick={() => {if(index > 0) setIndex(index - 1)}}/>

        <div className='mainImageDiv'>

            <img src={imageNames[0].url} className='mainImage' style={{
                display: index === 0 ? null : "none"
            }}/>

            {imageNames.length > 1 && <img src={imageNames[1].url} className='mainImage' style={{
                display: index === 1 ? null : "none"
            }}/>}

            {imageNames.length > 2 &&<img src={imageNames[2].url} className='mainImage' style={{
                display: index === 2 ? null : "none"
            }}/>}

            <div className='mobileDots'>
                <span style={{background: index === 0 ? "white" : null}}
                    onClick={() => setIndex(0)}/>
                {imageNames.length > 1 && <span 
                    style={{background: index === 1 ? "white" : null}}
                    onClick={() => setIndex(1)}/>}
                {imageNames.length > 2 && <span 
                    style={{background: index === 2 ? "white" : null}}
                    onClick={() => setIndex(2)}/>}
            </div>

        </div>

        <img src={arrow} className='arrows'
        onClick={() => {if(index < imageNames.length - 1) setIndex(index + 1)}}/>

    </div>
  )
};

export default ImageFullScreen
