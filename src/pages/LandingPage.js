import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../DataContext';
import { motion } from 'framer-motion';
import './LandingPage.css';
import Button from '../components/Buttons/Button';
import LiCard from '../components/Cards/LiCard';
import CreateIcon from '../Assets/icons/create_icon.svg';
import cardImage from '../Assets/images/landing_bg.jpg';
import arrow from '../Assets/icons/arrow.svg';

const LandingPage = () => {

    const [isSelected, setIsSelected] = useState(1);
    const landCardRef = useRef(null);
    const { setIsMyProfile } = useContext(DataContext);
    const navigate = useNavigate();
  
    const right = () => {
      if(isSelected < 4)
        setIsSelected(isSelected + 1)
    }
  
    const left = () => {
      if(isSelected > 1)
        setIsSelected(isSelected - 1)
    }
  
    useEffect(() => {
      landCardRef.current?.scrollTo({
        left: (86 + ((isSelected - 1) * 212)),
        behavior: "smooth"
      })
    }, [isSelected]);

    const navigateToCreatePost = () => {
        console.log("reached");
        setIsMyProfile(true);
        navigate('/profile');
    };

    return (

        <div className='LandingSectionContainer'>
            <div className='LandingSection'>

                <div className='landing_info'>
                <h1>SOCIAL. Create, Chat & Explore amazing portofolios</h1>
                <p>Make outstanding portofolios profile with the help of our 
                    team, then share your profile link all over the world, also
                    we have good appearance in google searches.
                </p>

                <div className='home_buttons'>
                    <Button name={"Explore"} style={"filled"} size={"large"} hoverStyle={"bgChangeOrange"} bgColor={"orange"} txtColor={"white"}/>
                    <Button name={"Create Post"} btnIcon={CreateIcon} style={"outlined"} size={"large"} hoverStyle={"outlineHover"} txtColor={"white"} handleClick={navigateToCreatePost}/>
                </div>
                </div>  

                <div className='landing_cards_container'>

                <div className='landing_cards' ref={landCardRef}>
                    <ul>
                    <LiCard key={1} image={cardImage} isSelected={isSelected} pos={0}/>
                    <LiCard key={2} image={cardImage} isSelected={isSelected} pos={1}/>
                    <LiCard key={3} image={cardImage} isSelected={isSelected} pos={2}/>
                    <LiCard key={4} image={cardImage} isSelected={isSelected} pos={3}/>
                    <LiCard key={6} image={cardImage} isSelected={isSelected} pos={4}/>
                    <LiCard key={7} image={cardImage} isSelected={isSelected} pos={0}/>
                    </ul>
                </div>  

                <div className='arrows_to_scroll'>
                    <motion.img 
                        src={arrow} 
                        style={{transform: "rotateZ(180deg)"}} 
                        onClick={left}
                        initial={{
                        rotateZ: 180,
                        x: 0
                        }}  
                        animate={{
                        rotateZ: 180,
                        x: isSelected >= 4 ? [0, -4, 0, -4, 0] : 0,
                        transition: {
                            repeat: Infinity,
                            duration: 1,
                            repeatDelay: 5,
                            delay: 3
                        }
                        }}
                        whileTap={{
                        scale: 0.75
                        }}
                    /> 
                    <motion.img 
                        src={arrow}  
                        onClick={right} 
                        initial={{
                        x: 0
                        }}  
                        animate={{
                        x: isSelected <= 1 ? [0, 4, 0, 4, 0] : 0,
                        transition: {
                            repeat: Infinity,
                            duration: 1,
                            repeatDelay: 5,
                            delay: 3
                        }
                        }}
                        whileTap={{
                        scale: 0.75
                        }}
                    /> 
                </div>
                
                </div>  
            </div>
        </div>
    )
}

export default LandingPage;
