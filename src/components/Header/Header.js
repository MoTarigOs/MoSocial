import React, { useEffect, useState } from 'react';
import './Header.css';
import { motion } from 'framer-motion';

import LiButton from '../Buttons/LiButton';
import myLogoImage from '../../Assets/icons/myLogo.png';
import Svgs from '../../Assets/icons/Svgs';
import Button from '../Buttons/Button';
import shareIcon from '../../Assets/icons/share_icon.svg';
import profileImage from '../../Assets/images/bg.jpg';
import { Link } from 'react-router-dom';

const Header = ({ isScrolled, isMobile, isSelected, setIsSelected }) => {

    const [isMenuBarClicked, setIsMneuBarClicked] = useState(false);

    const topBarVariant = {
        rest : {
            rotate: 0,
            y: 0,
            x: 0,
            backgroundColor: "#fff"
        },
        anim: {
            rotate: -45,
            y: 9.5,
            x: 4,
            backgroundColor: "#fff"
        }
    }

    const midBarVariant = {
        rest : {
            opacity: 1,
            backgroundColor: "#fff"
        },
        anim: {
            opacity: 0,
            backgroundColor: "#fff"
        }
    }

    const btmBarVariant = {
        rest : {
            rotate: 0,
            y: 0,
            x: 0,
            backgroundColor: "#fff"
        },
        anim: {
            rotate: 45,
            y: -9.5,
            x: 4,
            backgroundColor: "#fff"
        }
    }

    useEffect(() => {
        if(isMenuBarClicked)
            setIsMneuBarClicked(false);
    }, [isMobile])

    return (
        <div className='HeaderContainer' style={{zIndex: isScrolled === true && isMobile === false ? 1 : null}}>

            <motion.div className='Header'
                initial={{
                    color: "#fff",
                    y: 0
                }}
                animate={{
                    color: isScrolled ? "#00000000" : "#fff",
                    y: isScrolled ? -100 : 0
                }}
            >

                <div className='Logo'>
                    <img src={myLogoImage}/>
                    <h1>MoSocial</h1>
                </div>

                <div className='right_section'>

                    {isMobile === false ? (
                        <>
                            <ul className='headerButtons'>
                                <LiButton key={1} name={"Home"} isScrolled={"exist"}/>
                                <LiButton key={2} name={"Explore"} isScrolled={"exist"}/>
                                <LiButton key={3} name={"About"} isScrolled={"exist"}/>
                            </ul> 
                            
                            <motion.div className='profile' 
                                initial={{
                                    color: "#fff"
                                }}
                                animate={{
                                    color: isScrolled ? "#00000000" : "#fff"
                                }}
                            >
                                <Link to="/sign" style={{color: "inherit"}}><button>Sign Up</button></Link>
                                <Svgs type={"Profile"}/>
                            </motion.div>
                        </>
                        ) : (
                            <>
                                <motion.div className='menuBar' 
                                initial="rest" 
                                onClick={() => {setIsMneuBarClicked(!isMenuBarClicked)}}
                                animate={{
                                    y: isScrolled ? 96 : 0
                                }}
                                >
                                    <motion.span variants={topBarVariant} animate={isMenuBarClicked ? "anim" : "rest"} />
                                    <motion.span variants={midBarVariant} animate={isMenuBarClicked ? "anim" : "rest"} style={{background: "white"}} />
                                    <motion.span variants={btmBarVariant} animate={isMenuBarClicked ? "anim" : "rest"} />
                                </motion.div>
                            </>
                        )
                    }
                </div>

            </motion.div>

            <motion.div className='mobileSideMenu'
                initial={{
                    x: "-100%"
                }}
                animate={{
                    x: isMenuBarClicked && isMobile ? 0 : "-100%",
                    transition: {
                        damping: 5
                    }
                }}
            >
                <ul>

                    <li key={1}>
                        <div className='sideNavMobileProfile'>
                            <img src={profileImage} className='profileImageSideNav'/>
                            <h1>Mohammed</h1>   
                        </div>
                    </li>

                    <Button 
                    key={2} 
                    name={"Home"} 
                    svg={"Home"} 
                    bgColor={"transparent"} 
                    size={"large"} 
                    txtColor={"black"} 
                    style={"text"}
                    hoverStyle={"sideNavMobileHover"}
                    isSelected={isSelected} 
                    setIsSelected={setIsSelected} />

                    <Button 
                    key={3} 
                    name={"Explore"} 
                    svg={"Explore"} 
                    bgColor={"transparent"} 
                    size={"large"} 
                    txtColor={"black"} 
                    style={"text"}
                    hoverStyle={"sideNavMobileHover"}
                    isSelected={isSelected} 
                    setIsSelected={setIsSelected} />

                    <Button 
                    key={4} 
                    name={"About"} 
                    svg={"Search"} 
                    bgColor={"transparent"} 
                    size={"large"} 
                    txtColor={"black"} 
                    style={"text"}
                    hoverStyle={"sideNavMobileHover"}
                    isSelected={isSelected} 
                    setIsSelected={setIsSelected} />

                </ul>
            </motion.div>

        </div>
    )
};

export default Header;
