import { Routes, Route } from 'react-router-dom';
import { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from './DataContext';
import { getUserInfo, refreshTokens } from './logic/api';
import Header from './components/Header/Header';
import Profile from './pages/Profile';
import Sign from './pages/Sign';
import SideBar from './components/SideBar/SideBar';
import LandingPage from './pages/LandingPage';
import Hero from './pages/Hero';
import Loading from './components/Loading/Loading';
import CommentsPage from './pages/CommentsPage/CommentsPage';
import ExplorePage from './pages/ExplorePage/ExplorePage';
import Chat from './components/Chat/Chat';
import Contacts from './pages/Contacts/Contacts';
import SinglePostPage from './pages/OnePost/SinglePostPage';
import DeleteAccount from './components/Popubs/DeleteAccount';
import Report from './components/Popubs/Report';
import MainAdminPage from './pages/AdminsActivtyPages/MainAdminPage';
import BlockUser from './components/Popubs/BlockUser';
import ImageFullScreen from './components/Popubs/ImageFullScreen';
import About from './pages/About/About';
import ShareAccount from './components/Popubs/ShareAccount';
import Svgs from './Assets/icons/Svgs';

function App() {

    const { 
      setUserID, setUserUsername, setProfileImageName, setRole,
      imageFullScreen, postImages, imageIndex, setImageFullScreen,
      isTestAccount, setIsTestAccount
    } = useContext(DataContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);  
    const [isChat, setIsChat] = useState(false);  
    const [isSelected, setIsSelected] = useState("Home");
    const [isMyProfile, setIsMyProfile] = useState(false);
    const [isDeleteAccount, setIsDeleteAccount] = useState(false);
    const [isReport, setIsReport] = useState(false);
    const [isShareAccount, setIsShareAccount] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [runOnce, setRunOnce] = useState(false);
    const contentRef = useRef();
    const wrapperContainerRef = useRef(null);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    async function fetchUserInfo(){
        
      let res = await getUserInfo();

      console.log("Get user info res: ", res);

      if(res && res.ok === true && res.dt && res.dt.user_id){
        setUserID(res.dt.user_id);
        setUserUsername(res.dt.user_username ? res.dt.user_username : "");
        setProfileImageName(res.dt.profile_image);
        setRole(res.dt.role);
        if(res.dt.tokenExp > 24 * 60 * 60 * 1000) return;
      } 

      const refreshRes = await refreshTokens();

      console.log("refreshed? app.js ", refreshRes?.ok ? refreshRes.ok : false);

      if(!refreshRes || refreshRes.ok !== true){
        setIsSelected("Sign"); 
        navigate("/sign");
      }

      res = await getUserInfo();

      if(res && res.ok === true && res.dt && res.dt.user_id){
        setUserID(res.dt.user_id);
        setUserUsername(res.dt.user_username ? res.dt.user_username : "");
        setProfileImageName(res.dt.profile_image);
        setRole(res.dt.role);
      } 

    };

    const headerNavButtonsScroll = () => {

      const wrapperContainer = wrapperContainerRef.current;

      if(wrapperContainer) wrapperContainer.scroll({top: 2000, behaviour: 'smooth'});

    };

    useEffect(() => {
      console.log(runOnce);
      
      const wrapperContainer = wrapperContainerRef?.current ? wrapperContainerRef.current : null;
      const wrapper = wrapperRef?.current ? wrapperRef.current : null;

      const scrolled = () => {
        const scrollY = Math.abs(wrapper.getBoundingClientRect().top);
        if(scrollY){
          if(scrollY >= window.innerHeight - (window.innerHeight / 3)){
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }
        }
      };

      function settingMobile (){
        if(window.innerWidth > 680){
            setIsMobile(false);
        } else {
            setIsMobile(true);
        }
      };

      scrolled();
      settingMobile();
      setIsOnline(navigator.onLine);

      wrapperContainer.addEventListener("scroll", scrolled);
      window.addEventListener("resize", settingMobile);
      window.addEventListener("online", () => setIsOnline(true));
      window.addEventListener("offline", () => setIsOnline(false));

      setRunOnce(true);

      return () => {
        wrapperContainer.removeEventListener("scroll", scrolled);
        window.removeEventListener("resize", settingMobile);
        window.removeEventListener("online", () => setIsOnline(true));
        window.removeEventListener("offline", () => setIsOnline(false));
      }
    }, []);

    useEffect(() => {

      if(runOnce === true) fetchUserInfo();

    }, [runOnce]);

    useEffect(() => {
      if(isTestAccount){
        const askUser = window.confirm("This is Test account, other users can see every message, comment...etc\nCreate your own account ?");
          if(askUser === true){
              navigate("/sign");
          }
      }
    }, [isTestAccount]);
    
    return (

      <div className="App"  ref={wrapperContainerRef}>

        {isOnline && <Header isScrolled={isScrolled} isMobile={isMobile} 
        setIsReport={setIsReport} isSelected={isSelected} 
        setIsSelected={setIsSelected} 
        setIsDeleteAccount={setIsDeleteAccount} 
        handleScroll={headerNavButtonsScroll} 
        setIsShareAccount={setIsShareAccount}/>}

         <div className='Wrapper' ref={wrapperRef}>

          {isOnline ? <><DeleteAccount setIsDeleteAccount={setIsDeleteAccount} isDeleteAccount={isDeleteAccount}/>

          <Report isReport={isReport} setIsReport={setIsReport}/>

          <BlockUser />

          <ShareAccount isShareAccount={isShareAccount} setIsShareAccount={setIsShareAccount}/>

          <LandingPage isSelected={isSelected} setIsSelected={setIsSelected} handleScroll={headerNavButtonsScroll}/>

          {imageFullScreen && <ImageFullScreen imageNames={postImages} imageIndex={imageIndex} setImageFullScreen={setImageFullScreen} imageFullScreen={imageFullScreen} />}

          <div className='side_page' ref={contentRef}>

            <SideBar isSideBar={isScrolled} isLoading={isLoading} setIsLoading={setIsLoading} 
            isSelected={isSelected} setIsSelected={setIsSelected} setIsMyProfile={setIsMyProfile} 
            setIsDeleteAccount={setIsDeleteAccount} setIsReport={setIsReport} setIsShareAccount={setIsShareAccount}/>

            <div className='loading_routes'>

              <Chat isChat={isChat} setIsChat={setIsChat} setIsSelected={setIsSelected} isSelected={isSelected} setIsReport={setIsReport}/>

              {isLoading === true && <Loading isLoading={isLoading}/> }

              <Routes>
                
                <Route path='/' element= {<Hero setIsLoading={setIsLoading} isMobile={isMobile} setIsReport={setIsReport}/>} />

                <Route path='/comments' element= {<CommentsPage />} />

                <Route path='/explore' element= {<ExplorePage isMobile={isMobile}/>} />

                <Route path='/profile/:id' element={<Profile isMyProfile={isMyProfile} isMobile={isMobile} setIsSelected={setIsSelected} setIsChat={setIsChat} isChat={isChat} setIsReport={setIsReport} setIsShareAccount={setIsShareAccount}/>} />

                <Route path='/sign' element={<Sign isMobile={isMobile} />} />
                
                <Route path='/contacts' element={<Contacts isChat={isChat} setIsChat={setIsChat} />} />

                <Route path='/single-post' element={<SinglePostPage setIsReport={setIsReport}/>} />

                <Route path='/about' element={<About />} />

                <Route path='/admin-page' element={<MainAdminPage />} />
              
              </Routes>

            </div>

          </div></> : <div className='offline'>
            <Svgs type={"No internet"}/>
              <h3>No Internet Connection</h3>  
          </div>}

        </div>  

      </div>
    );
};

export default App;
