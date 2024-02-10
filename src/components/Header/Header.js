import React, { useContext, useEffect, useState } from 'react';
import './Header.css';
import { motion } from 'framer-motion';
import LiButton from '../Buttons/LiButton';
import myLogoImage from '../../Assets/icons/myLogo.png';
import Svgs from '../../Assets/icons/Svgs';
import Button from '../Buttons/Button';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../../DataContext';
import { logout } from '../../logic/api';

const Header = ({ 
    isScrolled, setIsReport, isSelected, 
    setIsSelected, handleScroll, setIsDeleteAccount, 
    setIsShareAccount 
}) => {

    const [isMenuBarClicked, setIsMneuBarClicked] = useState(false);
    const { 
        setActivityName, setIsBlockUser, setUserID, setUserUsername,
        userID, set_navigateTo_userID, set_navigateTo_userUsername, 
        setReportType, setReportOnThisId, userUsername,
        profileImageName, setIsMyProfile, setProfileImageName,
        role
    } = useContext(DataContext);
    const [sideButtons, setSideButtons] = useState([
        {id: 1, name: "Home", link: "/"},
        {id: 2, name: "Comments", link: "/comments"},
        {id: 3, name: "Explore", link: "/explore"},
        {id: 4, name: "Contacts", link: "/contacts"},
        {id: 5, name: "About", link: "/about"},
        {id: 6, name: role === "admin" || role === "owner" ? "Admin Console" : "Be a partner", link: role === "admin" || role === "owner" ? "/admin-page" : null},
        {id: 7, name: "Report issue", link: null},
        {id: 8, name: "Delete Account", link: null},
        {id: 9, name: "Exit", link: null}
    ]);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

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

    const handleSettingsItem = (id) => {

        setIsMneuBarClicked(false);

        if(userID.length <= 0) return;
    
        if(id === 6 && role !== "admin" && role !== "owner") {
        
            setActivityName("be an admin");
        
            setIsBlockUser(true);

            return;

        }

        if(id === 7){
        
            set_navigateTo_userID("");
            set_navigateTo_userUsername("");
            setReportType("");
            setReportOnThisId("");
            setIsReport(true);

            return;
        }
        
        if(id === 8) return setIsDeleteAccount(true);

        if(id === 9) return logOut();
    
    };

    const logOut = async() => {

        try{
    
          const res = await logout();
    
          if(!res || !res?.ok || res.ok !== true){
            console.log(res.dt);
            return;
          }
    
          setUserID(""); 
          setUserUsername("");
          setProfileImageName("");
          set_navigateTo_userID("");
          set_navigateTo_userUsername("");
          navigate('/sign');
    
        } catch(err){
          console.log(err.message);
        }
    
    };

    const navigateToProfile = async() => {
        
            setIsMyProfile(true);
            set_navigateTo_userID("");
            setIsSelected("Profile");
            navigate(`/profile/${userID}`);

    };

    const headerButtonNavigation = (x) => {
        setIsSelected(x); 
        handleScroll();
        navigate(`/${x === "Home" ? "" : x.toLowerCase()}`);
    }

    useEffect(() => {
        const settingMobile = () => {
            if(window.innerWidth > 960){
                setIsMobile(false);
            } else {
                setIsMobile(true);
            }
        };

        settingMobile();

        window.addEventListener("resize", settingMobile);

        return () => window.removeEventListener("resize", settingMobile);
    }, []);

    useEffect(() => {
        if(isMenuBarClicked)
            setIsMneuBarClicked(false);
    }, [isMobile])

    return (
        <div className='HeaderContainer' style={{
            zIndex: isScrolled === true && isMobile === false ? 0 : null
        }}>

            <motion.div className='Header'
                initial={{
                    color: "#fff",
                    y: 0,
                    background: null
                }}
                animate={{
                    color: isScrolled ? "#00000000" : "#fff",
                    background: isScrolled && isMobile ? "#208af5" : "transparent"
                }}
            >

                <div className='Logo'>
                    <img src={myLogoImage}/>
                    <h1>MoSocial</h1>
                </div>

                <div className='right_section'>

                    {isMobile === false ? (
                        <>
                            {!isScrolled && <><ul className='headerButtons'>
                                <LiButton key={1} name={"Home"} isScrolled={"exist"} onClickHandler={() => headerButtonNavigation("Home")}/>
                                <LiButton key={2} name={"Explore"} isScrolled={"exist"} onClickHandler={() => headerButtonNavigation("Explore")}/>
                                <LiButton key={3} name={"About"} isScrolled={"exist"} onClickHandler={() => headerButtonNavigation("About")}/>
                            </ul> 
                            
                            <motion.div className='profile' 
                                initial={{
                                    color: "#fff"
                                }}
                                animate={{
                                    color: isScrolled ? "orange" : "#fff"
                                }}
                                style={{
                                    padding: userID.length > 0 ? 0 : null, 
                                    border: userID.length > 0 ? "none" : null, 
                                }}
                            >
                                {userID.length <= 0 ? <Link to="/sign" style={{color: "inherit"}} onClick={handleScroll}>
                                    <button>Sign Up</button>
                                    <Svgs type={"Profile"}/>
                                </Link> : <Link to={`/profile/${userID}`} onClick={handleScroll}><img src={`https://f003.backblazeb2.com/file/mosocial-all-images-storage/${profileImageName}`} style={{width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover"}}/></Link>}
                            </motion.div>
                            </>}
                        </>
                        ) : (
                            <>
                                <motion.div className='menuBar' 
                                initial="rest" 
                                onClick={() => {setIsMneuBarClicked(!isMenuBarClicked)}}
                                
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
                <div className='sideNavDiv'>

                    <ul className='sideButtonsUL'>

                        <li key={0} style={{zIndex: 2}} onClick={() => setIsMneuBarClicked(false)}>
                            {userID.length > 0 ? <div className='sideNavMobileProfile'>
                                <img onClick={navigateToProfile} src={`https://f003.backblazeb2.com/file/mosocial-all-images-storage/${profileImageName}`} className='profileImageSideNav'/>
                                <h1 onClick={navigateToProfile}>{userUsername}</h1>     
                                <Svgs type={"Share"}
                                on_click={() => setIsShareAccount(true)}/> 
                            </div> : <div className='sideNavMobileSign'>
                                <Link to="/sign" onClick={() => setIsSelected("")}><button>Sign Up</button></Link>
                                <Svgs type={"Profile"}/>
                            </div>}
                        </li>

                        {sideButtons.map((item) => (
                            <Button 
                            link={item.link}
                            key={item.id}
                            name={item.name}
                            handleClick={() => handleSettingsItem(item.id)}
                            bgColor={"white"} 
                            size={"large"} 
                            txtColor={"black"} 
                            style={"text"}
                            hoverStyle={"sideNavMobileHover"}
                            setIsSelected={setIsSelected}
                            isSelected={isSelected}
                            />
                        ))}



                    </ul>
                    
                </div>
            </motion.div>

        </div>
    )
};

export default Header;
