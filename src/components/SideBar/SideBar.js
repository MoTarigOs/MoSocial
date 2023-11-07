import React, { useEffect, useState, useContext } from 'react';
import { DataContext } from '../../DataContext';
import './SideBar.css';
import { motion } from 'framer-motion';
import { logout, refreshTokens, getContacts } from '../../logic/api';
import profileImage from '../../Assets/images/bg.jpg';
import shareIcon from '../../Assets/icons/share_massenger_icon.svg';
import LiButton from '../Buttons/LiButton';
import { Link } from 'react-router-dom';
import Svgs from '../../Assets/icons/Svgs';

  const SideBar = ({ isSideBar, isLoading, setIsLoading, isSelected, setIsSelected }) => {

  const [sideBar, setSideBar] = useState(1);
  const [contactNewMessages, setContactNewMessages] = useState(0);
  const [runOnce, setRunOnce] = useState(false);
  const [fetchResult, setFetchResult] = useState("");
  const { setIsMyProfile, contacts, setContacts, userID, setUserID, userUsername, setUserUsername } = useContext(DataContext);

  const logOut = async() => {

    try{

      const res = await logout();

      if(!res || !res?.ok){
        setFetchResult( res.dt ? res.dt : "Error logging out");
        return;
      }

      if(res.ok === false){
        setFetchResult(res.dt);
      } else{
        setFetchResult(res.dt)
      }   

    } catch(err){
      setFetchResult(err.message);
    }

  };

  const fetchContacts = async() => {

    try{

        const res = await getContacts();

        if(!res || !res?.ok || res.ok === false) return;

        setContacts(res.dt ? res.dt : []);

    } catch(err){
        console.log(err.message);
    }

  };
  
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => {
      setIsLoading(false);
    }, 500)

    return () => {
      clearTimeout(t);
    }
  }, [isSelected])

  useEffect(() => {
    function settingSideBar(){
      if(window.innerWidth <= 960){
        setSideBar(-1);
      } else if(window.innerWidth > 960 && window.innerWidth < 1100){
        setSideBar(0);
      } else {
        setSideBar(1);
      }
    };

    window.addEventListener("resize", settingSideBar);

    setRunOnce(true);
    return () => {window.removeEventListener("resize", settingSideBar)};
  }, []);

  useEffect(() => {
    if(runOnce === true) setInterval(() => fetchContacts(), 10 * 60 * 1000);
    return () => clearInterval();
  }, [runOnce]);

  useEffect(() => {
    if(contacts && contacts.length > 0){

        let newMsg = 0;

        for (let i = 0; i < contacts.length; i++) {
            if(contacts[i].new_messages > 0){
                newMsg += contacts[i].new_messages;
            }
        };

        console.log("newMSG: ", newMsg);

        if(newMsg && newMsg > 0){
          setContactNewMessages(newMsg);
        } else {
          setContactNewMessages(0);
        }
    }
  }, [contacts]);

  return (
    
    <motion.div className='SideBar' 
      initial={{
        x: 0
      }}
      animate={{
        x: isSideBar === true ? 0 : "-100%",
        width: sideBar === -1 ? 0 : null
      }}
    >

      {sideBar !== -1 && <ul>

        <li key={1}>
          <div className='sideNavProfile'>

            {userID.length > 0 && userUsername.length > 0 && <img src={profileImage} className='profileImageSideNav'/>}
            
            {sideBar === 1 && userID.length > 0 && userUsername.length > 0 ? (
              <>
                <div>
                  <h1>{userUsername}</h1>
                  <Link to="/profile/0" onClick={() => {setIsMyProfile(true); setIsSelected("myProfile");}}><p>Edit my profile</p></Link>
                </div>
                <img src={shareIcon} className='share_icon'/> 
              </> ) : (
              <>
                <Link to="/sign" className={`notAuthedATag ${isSelected === "signPage" ? "signPageSelected" : ""}`} onClick={() => setIsSelected("signPage")}>
                  <section className={`notAuthedSection ${isSelected === "signPage" ? "signPageSelected" : ""}`}>
                      <button>Sign Up</button>
                      <Svgs type={"Profile"}/>
                  </section>
                </Link>
              </>
              )
            }
          </div>
        </li>

        {window.innerWidth > 1100 && <><p style={{fontSize: "0.75rem", fontWeight: 400, marginLeft: 16, marginTop: 32}}>Your interactions</p>
        </>}

        <LiButton 
          key={2}
          myLink={"/"}
          name={"Home"}
          icon={shareIcon}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          isLoading={isLoading}
          sideBar={sideBar}
        />

        <LiButton 
          key={3}
          myLink={"/comments"}
          name={"Comments"}
          selected={true}
          icon={shareIcon}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          isLoading={isLoading}
          sideBar={sideBar}
        />

        <LiButton 
          key={4}
          myLink={"/explore"}
          name={"Explore"}
          icon={shareIcon}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          isLoading={isLoading}
          sideBar={sideBar}
        />

        <LiButton 
          key={5}
          myLink={"/contacts"}
          name={"Contacts"}
          icon={shareIcon}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          isLoading={isLoading}
          sideBar={sideBar}
          notifications={contactNewMessages > 0 ? contactNewMessages : null}
        />

        {window.innerWidth > 1100 && <><p style={{fontSize: "0.75rem", fontWeight: 400, marginLeft: 16, marginTop: 24}}>Improve your appearance</p>
        </>}

        <LiButton 
          key={6}
          myLink={"/ads"}
          name={"Ads"}
          icon={shareIcon}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          isLoading={isLoading}
          sideBar={sideBar}
        />

        <LiButton 
          key={7}
          myLink={"/top_searches"}
          name={"Top Searches"}
          icon={shareIcon}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          isLoading={isLoading}
          sideBar={sideBar}
        />

        <LiButton 
          key={8}
          myLink={"/quality"}
          name={"Quality"}
          icon={shareIcon}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          isLoading={isLoading}
          sideBar={sideBar}
        />

        <LiButton 
          key={9}
          myLink={"/colaperate"}
          name={"Colaperate"}
          icon={shareIcon}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          isLoading={isLoading}
          sideBar={sideBar}
        />
        
        {window.innerWidth > 1100 && <><p style={{
          fontSize: "0.85rem", 
          fontWeight: 400, 
          marginLeft: 16, 
          marginTop: 24,
          letterSpacing: 0,
          maxWidth: 200
        }}>
          Help us with your feedback, and be one of our partners. it will get a lot of experience</p>
          </>}
          
        <LiButton 
          key={10}
          myLink={"/partener"}
          name={"Be a partener"}
          icon={shareIcon}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          isLoading={isLoading}
          sideBar={sideBar}
        />

        <LiButton 
          key={11}
          myLink={"/help"}
          name={"Help"}
          icon={shareIcon}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          isLoading={isLoading}
          sideBar={sideBar}
        />

        <div className='logoutDiv' onClick={() => {logOut(); setUserID(""); setUserUsername("");}}>
          <LiButton 
            key={11}
            myLink={"/"}
            name={"Exit"}
            icon={shareIcon}
            isSelected={isSelected}
            setIsSelected={setIsSelected}
            isLoading={isLoading}
            sideBar={sideBar}
          />
        </div>

      </ul>}
      
    </motion.div>
  )
};

export default SideBar;
