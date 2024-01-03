import React, { useEffect, useState, useContext } from 'react';
import { DataContext } from '../../DataContext';
import './SideBar.css';
import { motion } from 'framer-motion';
import { logout, refreshTokens, getContacts, deleteAccount } from '../../logic/api';
import shareIcon from '../../Assets/icons/share_massenger_icon.svg';
import LiButton from '../Buttons/LiButton';
import { Link, useNavigate } from 'react-router-dom';
import Svgs from '../../Assets/icons/Svgs';
import useInterval from '../../logic/CustomHooks/useInterval';
import profilePNG from '../../Assets/icons/profile-circle-svgrepo-com.svg';

  const SideBar = ({ 
    isSideBar, isLoading, setIsLoading, isSelected, setIsSelected, 
    setIsDeleteAccount, setIsReport, setIsShareAccount
  }) => {

  const [sideBar, setSideBar] = useState(1);
  const [contactNewMessages, setContactNewMessages] = useState(0);
  const [runOnce, setRunOnce] = useState(false);
  const [fetchResult, setFetchResult] = useState("");
  const [isSettingsItems, setIsSettingsItems] = useState(false);
  const [delay, setDelay] = useState(null);
  const { 
    setIsMyProfile, contacts, setContacts, userID, 
    setUserID, userUsername, setUserUsername, profileImageName,
    set_navigateTo_userID, set_navigateTo_userUsername, setReportType,
    setReportOnThisId, role, setRole,
    setIsBlockUser, setActivityName
  } = useContext(DataContext);
  const [settingsItemsArray, setSettingsItemsArray] = useState([
    {id: 0, val: "Report issue", toLink: null, enable: false}, 
    {id: 1, val: "Participate in our demos", toLink: null, enable: false}, 
    {id: 2, val: "Delete My Account", toLink: null, enable: false}
  ]);
  const navigate = useNavigate();

  const logOut = async() => {

    try{

      const res = await logout();

      if(!res || !res?.ok || res.ok !== true){
        setFetchResult( res.dt ? res.dt : "Error logging out");
        return;
      }

      setFetchResult(res.dt);
      setUserID(""); 
      setUserUsername("");
      setRole("");
      navigate("/sign");

    } catch(err){
      setFetchResult(err.message);
      console.log(err.message);
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

  const settingSettings = () => setIsSettingsItems(!isSettingsItems);

  const handleSettingsItem = (id) => {

    if(userID.length <= 0) return;

    if(id === 0) {
      set_navigateTo_userID("");
      set_navigateTo_userUsername("");
      setReportType("");
      setReportOnThisId("");
      setIsReport(true);
      return;
    }
    
    if(id === 2) setIsDeleteAccount(true);

  };

  const navigateToProfile = async() => {

      setIsMyProfile(true);
      set_navigateTo_userID("");
      navigate(`/profile/${userID}`);

};

  const bePartener = () => {

    setActivityName("be an admin");

    setIsBlockUser(true);

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
    return () => {
      window.removeEventListener("resize", settingSideBar);
      setDelay(null);
    };
  }, []);

  useInterval(() => {
    fetchContacts();
  }, delay);

  useEffect(() => {
    if(runOnce === true) 
      setDelay(10 * 60 * 1000);
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

            {(userID.length > 0 && userUsername.length > 0) ?
            <img onClick={navigateToProfile} src={`https://f003.backblazeb2.com/file/mosocial-all-images-storage/${profileImageName}`} className='profileImageSideNav'/>
            : <img src={profilePNG} className='profileImageSideNav' style={{padding: 4}}/>}
            
            {sideBar === 1 && userID.length > 0 && userUsername.length > 0 ? (
              <>
                <div>
                  <h1>{userUsername}</h1>
                  <Link to={`/profile/${userID}`} onClick={() => {setIsMyProfile(true); setIsSelected("myProfile");}}><p>Edit my profile</p></Link>
                </div>
                <Svgs type={"Share"} on_click={() => setIsShareAccount(true)}/> 
              </> ) : (
              <>
                {sideBar === 1 && <Link to="/sign" className={`notAuthedATag ${isSelected === "signPage" ? "signPageSelected" : ""}`} onClick={() => setIsSelected("signPage")}>
                  <section className={`notAuthedSection ${isSelected === "signPage" ? "signPageSelected" : ""}`}>
                      <button>Sign Up</button>
                      <Svgs type={"Profile"}/>
                  </section>
                </Link>}
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

        {window.innerWidth > 1100 && <><p style={{fontSize: "0.75rem", fontWeight: 400, marginLeft: 16, marginTop: 24}}>Improve our website</p>
        </>}

        {(role === "admin" || role === "owner") && <LiButton 
          key={6}
          myLink={"/admin-page"}
          name={"Admin Console"}
          icon={shareIcon}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          isLoading={isLoading}
          sideBar={sideBar}
        />}

        <LiButton 
          key={7}
          myLink={"/about"}
          name={"About"}
          icon={"sdn"}
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
          Help us with your feedback, and be one of our partners. you will get a lot of experience</p>
          </>}
          
        <LiButton 
          key={8}
          name={"Be a partener"}
          icon={shareIcon}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          isLoading={isLoading}
          sideBar={sideBar}
          onClickHandler={bePartener}
        />

        <LiButton 
          key={9}
          name={"Settings"}
          icon={shareIcon}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          isLoading={isLoading}
          sideBar={sideBar}
          onClickHandler={settingSettings}
        />

        {isSettingsItems && <ul className='settingsItemUL'> 
          {settingsItemsArray.map((item) => (
            <li onClick={() => handleSettingsItem(item.id)}>
              <button style={{color: (userID.length > 0) ? null : "#d6d6d6"}}>
                {item.val}
              </button>
            </li>
          ))}
        </ul>}

        <div className='logoutDiv' onClick={logOut}>
          <LiButton 
            key={13}
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
