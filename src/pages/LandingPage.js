import React, { useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './LandingPage.css';
import Button from '../components/Buttons/Button';
import LiCard from '../components/Cards/LiCard';
import CreateIcon from '../Assets/icons/create_icon.svg';
import cardImage from '../Assets/images/landing_bg.jpg';
import cardImage2 from '../Assets/images/ui_design_image.jpg';
import cardImage3 from '../Assets/images/chatgpt_image.jpg';
import cardImage4 from '../Assets/images/idea_image.jpg';
import arrow from '../Assets/icons/arrow.svg';
import { DataContext } from '../DataContext';

const LandingPage = ({ isSelected, setIsSelected, handleScroll }) => {

    const [isCardsSelected, setIsCardsSelected] = useState(1);
    const { userID, setIsMyProfile } = useContext(DataContext);
    const landCardRef = useRef(null);
  
    const right = () => {
      if(isCardsSelected < 4)
      setIsCardsSelected(isCardsSelected + 1)
    }
  
    const left = () => {
      if(isCardsSelected > 1)
      setIsCardsSelected(isCardsSelected - 1)
    }
  
    useEffect(() => {
      landCardRef.current?.scrollTo({
        left: (86 + ((isCardsSelected - 1) * 212)),
        behavior: "smooth"
      })
    }, [isCardsSelected]);

    const navigateToCreatePost = () => {
        setIsMyProfile(true);
        handleScroll();
    };

    const navigateToHero = () => {
        handleScroll();
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
                    <Button name={"Explore"} style={"filled"} size={"large"} hoverStyle={"bgChangeOrange"} bgColor={"orange"} txtColor={"white"} handleClick={navigateToHero} isSelected={isSelected} setIsSelected={setIsSelected} link={"/"} />
                    <Button name={"Create Post"} btnIcon={CreateIcon} style={"outlined"} size={"large"} hoverStyle={"outlineHover"} txtColor={"white"} handleClick={navigateToCreatePost} isSelected={isSelected} setIsSelected={setIsSelected} link={`/profile/${userID}`}/>
                </div>
                </div>  

                <div className='landing_cards_container'>

                <div className='landing_cards' ref={landCardRef}>
                    <ul>
                    <LiCard key={1} image={cardImage} isSelected={isCardsSelected} pos={0}/>
                    <LiCard key={2} image={cardImage2} isSelected={isCardsSelected} pos={1}/>
                    <LiCard key={3} image={cardImage} isSelected={isCardsSelected} pos={2}/>
                    <LiCard key={4} image={cardImage3} isSelected={isCardsSelected} pos={3}/>
                    <LiCard key={6} image={cardImage4} isSelected={isCardsSelected} pos={4}/>
                    <LiCard key={7} image={cardImage} isSelected={isCardsSelected} pos={0}/>
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
