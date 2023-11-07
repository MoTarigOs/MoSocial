import { Routes, Route } from 'react-router-dom';
import { useEffect, useRef, useState, useContext } from 'react';
import { DataContext } from './DataContext';
import { getUserInfo } from './logic/api';
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

function App() {

    const { setUserID, setUserUsername, setProfileImageName } = useContext(DataContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);  
    const [isChat, setIsChat] = useState(false);  
    const [isSelected, setIsSelected] = useState("Home");
    const [isMyProfile, setIsMyProfile] = useState(false);
    const [runOnce, setRunOnce] = useState(false);
    const contentRef = useRef();
    const wrapperContainerRef = useRef(null);
    const wrapperRef = useRef(null);

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

      wrapperContainer.addEventListener("scroll", scrolled);
      window.addEventListener("resize", settingMobile);

      setRunOnce(true);

      return () => {
        wrapperContainer.removeEventListener("scroll", scrolled);
        window.removeEventListener("resize", settingMobile);
      }
    }, []);

    useEffect(() => {
      async function fetchUserInfo(){
        if(runOnce === true){
          const res = await getUserInfo();
          if(res && res.ok === true && res.dt && res.dt.user_id){
            setUserID(res.dt.user_id);
            setUserUsername(res.dt.user_username ? res.dt.user_username : "");
            if(res.dt.profile_image)
              setProfileImageName(res.dt.user_username ? res.dt.user_username : "");
          }
        }
      };

      fetchUserInfo();
    }, [runOnce])
    
    return (
      <div className="App"  ref={wrapperContainerRef}>

        <div className='Wrapper' ref={wrapperRef}>

          <Header isScrolled={isScrolled} isMobile={isMobile} isSelected={isSelected} setIsSelected={setIsSelected}/>

          <LandingPage />

          <div className='side_page' ref={contentRef}>

            <SideBar isSideBar={isScrolled} isLoading={isLoading} setIsLoading={setIsLoading} isSelected={isSelected} setIsSelected={setIsSelected} setIsMyProfile={setIsMyProfile}/>

            <div className='loading_routes'>

              <Chat isChat={isChat} setIsChat={setIsChat} setIsSelected={setIsSelected} isSelected={isSelected} />

              {isLoading === true && <Loading isLoading={isLoading}/> }

              <Routes>
                
                <Route path='/' element= {<Hero setIsLoading={setIsLoading} isMobile={isMobile}/>} />

                <Route path='/comments' element= {<CommentsPage />} />

                <Route path='/explore' element= {<ExplorePage isMobile={isMobile}/>} />

                <Route path='/profile/:id' element={<Profile isMyProfile={isMyProfile} isMobile={isMobile} setIsSelected={setIsSelected} setIsChat={setIsChat} isChat={isChat}/>} />

                <Route path='/sign' element={<Sign isMobile={isMobile} />} />
                
                <Route path='/contacts' element={<Contacts isChat={isChat} setIsChat={setIsChat} />} />

                <Route path='/single-post' element={<SinglePostPage />} />
              
              </Routes>

            </div>

          </div>

        </div>

      </div>
    );
};

export default App;
