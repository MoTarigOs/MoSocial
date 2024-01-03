import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataContext } from '../DataContext';
import './Profile.css';
import choose_image_icon from '../Assets/icons/icons8-image-96.png';
import Skill from '../components/SkillsSection/Skill';
import HeroPostCard from '../components/Cards/HeroPostCard';
import Svgs from '../Assets/icons/Svgs';
import { Link } from 'react-router-dom';
import CreatePostCard from '../components/Cards/CreatePostCard';
import { isValidUsername, validateImageType, handleImage, setLikedPosts, getBadWords } from '../logic/helperMethods';
import { updateProfileInfo, getProfile, getMyProfile, getMyProfileImage, getPostsByUserID, getUserInfo, profilePicFailed, moderate } from '../logic/api';
import Comments from '../components/Comments/Comments';
import * as buffer from 'buffer';
import arrow from '../Assets/icons/arrow.svg';
import CryptoJS from 'crypto-js';

const Profile = ({
  setIsChat, isChat, setIsSelected, setIsReport, setIsShareAccount
 }) => {

  const [submitError, setSubmitError] = useState(false);
  const [postsFetchError, setPostsFetchError] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [postsFetchLoading, setPostsFetchLoading] = useState(false);
  const [isEditSmallInfo, setIsEditSmallInfo] = useState(false);
  const [isEditMoreInfo, setIsEditMoreInfo] = useState(false);
  const [isEditContacts, setIsEditContacts] = useState(false);
  const [isCheckUrl, setIsCheckUrl] = useState(false);
  const [checkUrl, setCheckUrl] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileContact, setMobileContact] = useState(false);
  const [runFetchOnce, setRunFetchOnce] = useState(false);
  const [choosenImageURL, setChoosenImageURL] = useState(null);
  const [otherOption, setOtherOption] = useState([]);
  const [isComments, setIsComments] = useState(false);
  const [myLastProjects, setMyLastProjects] = useState([]);
  const chooseFileRef = useRef();
  const { 
    userID, setUserID, isMyProfile, setIsMyProfile,
    userUsername, setUserUsername, set_navigateTo_userUsername, set_navigateTo_userID,
    choosenImage, setChoosenImage, 
    SOCIAL_MEDIA_PLATFORMS, SET_SOCIAL_MEDIA_PLATFORMS,
    profileImageName, setProfileImageName, set_navigateTo_userProfilePic,
    setReportType, setReportOnThisId, reportOnThisId, setRole, setPostID, 
  } = useContext(DataContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [myDetails, setMyDetails] = useState([]);
  const [moreDetailsDesc, setMoreDetailsDesc] = useState("");
  const [mySkills, setMySkills] = useState([]);
  const [mySocialMedia, setMySocialMedia] = useState([]);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotification] = useState([]);
  const [fetchResult, setFetchResult] = useState("");
  const [limit, setLimit] = useState(10);
  const [otherProfilePicName, setOtherProfilePicName] = useState("");
  const [hisId, setHisId] = useState("");
  const [profileId, setProfileId] = useState("");
  const limitGap = 5;

  const handleFailedUpload = async() => {

    try{

      console.log("upload failed handling");

      const res = await profilePicFailed();

      console.log(res.dt);

      console.log("Handled");

    } catch(err){
      console.log(err.message);
    }

  };

  const submit = async() => {

    if(choosenImage && (!validateImageType(choosenImage) || !choosenImage.size || choosenImage.size > 300000)) return setSubmitError("This is not an image :(");

    if(!isValidUsername(username)) return setSubmitError("invalid username");

    if(shortDesc?.length > 200) return setSubmitError("Short description is too long!");

    if(myDetails?.length > 8) return setSubmitError("too many details! the max is 8");

    if(moreDetailsDesc?.length > 1500) return setSubmitError("detailed description is too long!");

    if(mySkills?.length > 25) return setSubmitError("too many skills! the max is 25");

    if(mySocialMedia?.length > 25) return setSubmitError("too many Accounts! the max is 25");

    const testUsernameForBadWords = getBadWords(username);
    const testShortDescForBadWords = getBadWords(shortDesc);
    const testMoreDescForBadWords = getBadWords(moreDetailsDesc);

    if(testUsernameForBadWords.length > 0 || testShortDescForBadWords.length > 0 || testMoreDescForBadWords.length > 0) {
      let er = "";
      const testsArray = [...testUsernameForBadWords, ...testShortDescForBadWords, ...testMoreDescForBadWords];
      for (let i = 0; i < testsArray.length; i++) {
          if(i !== testsArray.length - 1){
              er += `"${testsArray[i]}", `;
          } else {
              er += `"${testsArray[i]}"`;
          }
      }
      setSubmitError("This is bad words: ", er);
      return;
    };

    let skillsNames = "";
    for (let i = 0; i < mySkills.length; i++) {
      if(i !== mySkills.length - 1){
        skillsNames += `"${mySkills[i].name}", `;
      } else {
        skillsNames += `"${mySkills[i].name}"`;
      }
    };

    const testForSkillsBadWords = getBadWords(skillsNames);

    if(testForSkillsBadWords.length > 0){
      let er = "";
      for (let i = 0; i < testForSkillsBadWords.length; i++) {
          if(i !== testForSkillsBadWords.length - 1){
              er += `"${testForSkillsBadWords[i]}", `;
          } else {
              er += `"${testForSkillsBadWords[i]}"`;
          }
      }
      setSubmitError("This is bad words: ", er);
      return;
    };

    try{

      const res = await updateProfileInfo(
        choosenImage?.name ? choosenImage.name : "" , username, shortDesc, myDetails, moreDetailsDesc, mySkills, mySocialMedia
      );

      if(!res || !res?.ok) return setSubmitError("Unknown error :(");

      if(res.ok !== true) return setSubmitError(res?.dt ? res.dt : "Error updating your profile, please try again later");

      sendToModerate();
      
      if(username !== userUsername) setUserUsername(username);

      /* Upload pic to Backblaze b2 cloud storage */
      if(!choosenImage) return setSubmitError(null);

      let optimisedImage = choosenImage;
      if(optimisedImage?.size > 300000)
        optimisedImage = await handleImage(choosenImage, 0.3);

      console.log("image file: ", optimisedImage);

      if(!optimisedImage) return setSubmitError("Error please try again or use different picture");

      uploadPicture(optimisedImage, res)
        .then((ress) => {
          console.log("uploadPic response: ", ress);
        }, (ress) => {
          console.log("uploadPic response: ", ress);
          handleFailedUpload();
        });

      return setSubmitError(null);

    } catch(err){
      console.log("error submitting profile", err.message);
      setSubmitError(err.message);
    }

  };

  const uploadPicture = async(pic, res) => {

    if(!pic || pic.length <= 0) return false;

    return new Promise(function(resolve, reject) {
      const reader = new FileReader();
      reader.onload = function() {
        const hash = CryptoJS.SHA1(CryptoJS.enc.Latin1.parse(reader.result));
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.addEventListener("load", function () {
          let msg;
          if (xhr.status >= 200 && xhr.status < 300) {
              msg = '2xx response from B2 API. Success.';
              setProfileImageName(res.dt.picName);
              resolve(true);
          } else if (xhr.status >= 400 && xhr.status < 500) {
              msg = '4xx error from B2 API. See other console log messages and requests in network tab for details.';
          } else if (xhr.status >= 500) {
              msg = '5xx error from B2 API. See other console log messages and requests in network tab for details.';
          } else {
              msg = 'Unknown error. See other console log messages and requests in network tab for details.';
          }
          console.log(`Upload file result: ${msg}`);
          reject(false);
        });

        xhr.onerror = function() {
          reject(false);
        };

        xhr.open("POST", res.dt.uploadUrl);
        xhr.setRequestHeader("Content-Type", pic.type);
        xhr.setRequestHeader("Authorization", res.dt.authToken);
        xhr.setRequestHeader("X-Bz-File-Name", res.dt.picName);
        xhr.setRequestHeader("X-Bz-Content-Sha1", hash);
        const fileToSend = pic;
        xhr.send(fileToSend);
      };
      reader.readAsBinaryString(pic);
    });
  };

  useEffect(() => {
    if(choosenImage){
      const url = URL.createObjectURL(choosenImage);
      if(url)
        setChoosenImageURL(url);
    }
  }, [choosenImage]);

  useEffect(() => {
    console.log(isComments)
  },[isComments]);

  const calculateID = () => {
    let ids = [];

    if(mySocialMedia.length <= 0)
      return 1;

    for (let i = 0; i < mySocialMedia.length; i++) {
      if(mySocialMedia[i]?.key_id)
        ids.push(mySocialMedia[i].key_id);
    }


    return Math.max(...ids) + 1;
  };

  async function fetchMyProfileData(){
    try{

      setFetchLoading(true);

      const profileData = await getMyProfile();

      if(!profileData || !profileData?.ok || profileData.ok === false || !profileData.dt) return

      setUsername(profileData.dt.username);
      setShortDesc(profileData.dt.introParagraph);
      setMyDetails(profileData.dt.smallDetails ? profileData.dt.smallDetails : []);
      setMoreDetailsDesc(profileData.dt.paragraph);
      setMySkills(profileData.dt.skills ? profileData.dt.skills : []);
      setMySocialMedia(profileData.dt.contacts ? profileData.dt.contacts : []);
      setNotification(profileData.dt.notifications);
      setProfileImageName(profileData.dt.profileImageName);
      
      setFetchLoading(false);

      const postsRes = await getPostsForThisUser(true);

      console.log(postsRes);

    } catch(err){
      console.log(err.message);
    }
  };

  async function fetchProfileData(){

    try{

      setFetchLoading(true);

      const profileData = await getProfile(params.id);

      if(!profileData || !profileData?.ok || profileData.ok === false || !profileData.dt) return;

      console.log("profile data: ", profileData);

      setUsername(profileData.dt.username);
      setHisId(profileData.dt.profileOwnerId);
      setProfileId(profileData.dt.profileId);
      setShortDesc(profileData.dt.introParagraph);
      setMyDetails(profileData.dt.smallDetails ? profileData.dt.smallDetails : []);
      setMoreDetailsDesc(profileData.dt.paragraph);
      setMySkills(profileData.dt.skills ? profileData.dt.skills : []);
      setMySocialMedia(profileData.dt.contacts ? profileData.dt.contacts : []);
      setOtherProfilePicName(profileData.dt.profileImageName);

      setFetchLoading(false);

      const postsRes = await getPostsForThisUser();

      console.log(postsRes);
      
    } catch(err){
      console.log(err.message);
    }
    
  };

  async function getPostsForThisUser(isMe){

      if(postsFetchLoading === true) return;

      setPostsFetchLoading(true);

      if(!isMe) isMe = false;

      if(isMe === false){
        if(!params.id || params.id === "") return setPostsFetchError("Error getting this user posts");
      }

      if(isMe === true){
        if(!userID || userID.length <= 0) 
          return setPostsFetchError("Error in your account please login again");
      }

      const res = await getPostsByUserID(isMe === false ? params.id : (userID ? userID : params.id), limit);

      if(!res || !res.ok || res.ok === false) return setPostsFetchError(res.dt ? res.dt : "Error getting this user posts");

      if(!res.dt || !res.dt.posts || res.dt.posts.length <= 0) return

      const newArray = setLikedPosts(res.dt.posts, res.dt.likedPosts);

      setFetchResult(newArray.length === posts.length ? "No more posts" : "");

      setPosts(newArray);

      const newLimit = limit + limitGap;

      setLimit(newLimit);

      setPostsFetchLoading(false);

      return "Done fetching posts";

  };

  async function setUserInfo(){

    try{

      const res = await getUserInfo();

      if(!res || !res.ok || res.ok === false || !res.dt) return;

      setUserID(res.dt.user_id);
      setUserUsername(res.dt.user_username);
      setProfileImageName(res.dt.profile_image);
      setRole(res.dt.role);

      if(res.dt.user_id === params.id) setIsMyProfile(true);

    } catch(err){
      console.log(err.message);
    }

  };

  const navigateToChat = () => {
      setIsChat(true);
      set_navigateTo_userProfilePic(otherProfilePicName);
      set_navigateTo_userUsername(username);
      set_navigateTo_userID(hisId);
  };

  function handleLastProjects() {

    let arr = [];

    for (let i = 0; (i < posts.length && i < 8); i++) {
      arr.push({
        key_id: posts[i]._id,
        name: posts[i].desc,
        image: posts[i].post_images[0].picturesNames
      });
    };

    setMyLastProjects(arr);

  };

  const handleProfileReport = () => {

    console.log("handle report function, hisId: ", hisId, " report_objectId: ", profileId);

    if(isMyProfile) return setFetchResult("Can't report on your self :l");

    if(hisId.length <= 0 || profileId.length <= 0)
      return setFetchResult("Refresh the page or exit and enter again");

    if(!userID || userID.length <= 0) return setFetchResult("please login to your account to make a report");

    set_navigateTo_userID(hisId);
    set_navigateTo_userUsername(username);
    setReportOnThisId(hisId);
    setReportType("profile");
    setIsReport(true);

  };

  const sendToModerate = async() => {

    try {

        const res = await moderate(userID, "moderate profile");

        if(res.ok === true) return console.log("Successfully send to moderate");

        console.log(res.dt);

    } catch(err) {
        console.log("Error send to moderate: ", err.message);
    }

  };

  const navigateToPost = (postId) => {
    setPostID(postId);
    navigate('/single-post');
  };

  const navigateToExternalUrl = (url) => {

    window.open(url, "_blank");

  };

  const params = useParams();

  useEffect(() => {

    setRunFetchOnce(true);

    window.Buffer = buffer.Buffer;

    if(window.innerWidth <= 920) setIsMobile(true);

    function settingMobile (){
      if(window.innerWidth > 920){
        setIsMobile(false);
        setMobileContact(false);
      } else {
        setIsMobile(true);
      }
    };

    window.addEventListener("resize", settingMobile);

    return () => window.removeEventListener("resize", settingMobile);

  }, []);

  useEffect(() => {
    
    setUsername("");
    setShortDesc("");
    setMyDetails([]);
    setMoreDetailsDesc("");
    setMySkills([]);
    setMySocialMedia([]);
    setPosts([]);
    setMyLastProjects([]);
    setIsSelected("Profile");
    set_navigateTo_userID("");
    set_navigateTo_userUsername("");
    setReportType("profile");
    setMobileContact(false);

    if(!userID || userID === "" || !userUsername || userUsername === "") setUserInfo();

    if(runFetchOnce === true){

      if(isMyProfile === true){
        fetchMyProfileData();
        setOtherProfilePicName("");
      } else{
        if(userID !== params.id){
          fetchProfileData();
          setIsMyProfile(false);
        } else {
          fetchMyProfileData();
          setOtherProfilePicName("");
          setIsMyProfile(true);
        }
      }

    };
  }, [runFetchOnce, isMyProfile]);

  useEffect(() => {
    if(posts.length > 0) handleLastProjects();
  }, [posts]);

  useEffect(() => {
    console.log("report_objectId: ", reportOnThisId);
  }, [reportOnThisId]);

  return (

    <>
    {isMyProfile === false ? (

        <div className='ProfilePageContainer'>

          {isCheckUrl && <div className='checkUrlContainer'><div className='checkUrl'>
            <h2>You are heading to this url</h2>
            <p>{checkUrl}</p>
            <h3>-- if it looks suspicous to you, please consider 
              checking the url with urL scanners 
              toolsHere some tools to use 
              <span onClick={() => navigateToExternalUrl("https://urlscan.io/")}>
              {" "}urlScan</span>, 
              <span onClick={() => navigateToExternalUrl("https://www.ipqualityscore.com/threat-feeds/malicious-url-scanner")}>
              {" "}IpQualityScore</span>,  
              <span onClick={() => navigateToExternalUrl("https://www.criminalip.io/domain")}>
              {" "}Criminal Ip</span>...etc
            </h3>
            <div className='checkUrlButtons'>
              <button onClick={() => setIsCheckUrl(false)} 
              style={{background: "#e9e9e9", color: "grey"}}>Cancel</button>
              <button onClick={() => navigateToExternalUrl(checkUrl)}>Navigate</button>
            </div>
          </div></div>}
          
          {isMobile && <div className='mobileContact' onClick={() => setMobileContact(!mobileContact)}>
            <img src={arrow} style={{
              transform: mobileContact ? null : "rotateZ(180deg)"
            }}/>
          </div>}

          <Comments isComments={isComments} setIsComments={setIsComments} setIsReport={setIsReport} />

          <div className='ProfilePage'>

            <div className='ProfilePageContentContainer'>
              <div className='ProfielPageContent'>

                {fetchResult.length > 0 && <p>{fetchResult}</p>}

                <div className='ProfileInfo'>

                  <div className="ProfileSmallInfo">

                    <button className='reportButton' onClick={handleProfileReport}>Report</button>
                    
                    <img src={(otherProfilePicName && otherProfilePicName.length > 0) ? 
                    `https://f003.backblazeb2.com/file/mosocial-all-images-storage/${otherProfilePicName}` : null} alt=''/>
                    <h2>{username}</h2>
                    <hr />

                    <p>{shortDesc}</p>
                    <hr />
                    
                    <div className='detailsList'>

                      <ul>
                        {myDetails.map((d) => (
                          <li key={d.key_id}>
                            <h4>{d.title + " :"}</h4>
                          </li>
                        ))}
                      </ul>

                      <ul>
                        {myDetails.map((d) => (
                          <li key={d.key_id}>
                            <p>{d.value}</p>
                          </li>
                        ))}
                      </ul>

                    </div>

                  </div>

                  <div className='ProfileDetailedInfo'>
                    
                    <h3>More Details</h3>
                    <p>{moreDetailsDesc}</p>

                    <h3>Last Posts</h3>
                    <div className='lastProjectsDiv'>
                      <ul className='lastProjects'>
                          {myLastProjects.map((pj) => (
                            <li key={pj.key_id} onClick={() => navigateToPost(pj.key_id)}>
                              <img src={`https://f003.backblazeb2.com/file/mosocial-all-images-storage/${pj.image}`} alt=''/>
                              <p>{pj.name}</p>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <h3>Skills</h3>
                    <div className='skillsDiv'>
                      <ul className='skills'>
                          {mySkills.map((skill) => (
                            <Skill key={skill.key_id} skill_name={skill.name} percentage={skill.percentage} />
                          ))}
                      </ul>
                    </div>

                  </div>

                </div>

                <div className='ProfileProjects'>

                  <ul className='projectsCards'>
                    {posts.map((post) => (
                      <HeroPostCard 
                        key={post._id}
                        id={post._id}
                        postIsLiked={post.liked}
                        creator_name={post.creator_username}
                        creator_image={post.creator_image}
                        creator_id={post.creator_id}
                        images={post.post_images}
                        desc={post.desc}
                        topCommentCreatorImage={post.topCommentCreatorImage ? post.topCommentCreatorImage : "odhfuiehf"}
                        topCommentCreatorName={post.topCommentCreatorName ? post.topCommentCreatorName : "odhfuiehf"}
                        topComment={post.topComment ? post.topComment : "odhfuiehfwqkln3rljkqehuruq3rgyagfjheg"}
                        setIsComments={setIsComments}
                        setIsReport={setIsReport}                        
                        handleDeleteThisPost={() => {
                          setPosts(
                            posts.filter(p => p._id !== post._id)
                          )
                        }}
                      />
                    ))}

                    {fetchResult !== "No more posts" &&
                      <button className='morePostsButton' onClick={() => getPostsForThisUser()}>{posts.length > 0 ? "More posts" : "Get posts"}</button>
                    }

                    <h3 style={{marginTop: 24, color: "#7d7d7d", fontWeight: 600}}>{fetchResult}</h3>

                  </ul>

                </div>

              </div>
            </div>  

            <div className='ProfilePageContact' style={{
              position: isMobile ? "absolute" : "unset", 
              right: mobileContact ? "0" : "100%",
              boxShadow: !mobileContact ? "none" : null
            }}>

              <h2>Social Media</h2>

              {mySocialMedia.map((c) => (
                <Link onClick={() => {setIsCheckUrl(true); setCheckUrl(c.url);}}>
                  <div className={`ContactWith changeSVGcolor ${c.special_class ? c.special_class : ""}`}>
                    <Svgs type={c.name_of_app} />
                    <label>Contact me on {c.name_of_app}</label>
                  </div>
                </Link>
              ))}

            </div>

          </div>

          <div className='message_me' onClick={navigateToChat}>
              <Svgs type={"Comments"} />
          </div>

        </div>

      ) : (

        <div className='ProfilePageContainer'>

          {isCheckUrl && <div className='checkUrlContainer'><div className='checkUrl'>
            <h2>You are heading to this url</h2>
            <p>{checkUrl}</p>
            <h3>-- if it looks suspicous to you, please consider 
              checking the url with url scanners 
              tools, here some tools to use 
              <span onClick={() => navigateToExternalUrl("https://urlscan.io/")}>
              {" "}urlScan</span>, 
              <span onClick={() => navigateToExternalUrl("https://www.ipqualityscore.com/threat-feeds/malicious-url-scanner")}>
              {" "}IpQualityScore</span>,  
              <span onClick={() => navigateToExternalUrl("https://www.criminalip.io/domain")}>
              {" "}Criminal Ip</span>...etc
            </h3>
            <div className='checkUrlButtons'>
              <button onClick={() => setIsCheckUrl(false)} 
              style={{background: "#e9e9e9", color: "grey"}}>Cancel</button>
              <button onClick={() => navigateToExternalUrl(checkUrl)}>Navigate</button>
            </div>
          </div></div>}

          {isMobile && <div className='mobileContact' onClick={() => setMobileContact(!mobileContact)}>
            <img src={arrow} style={{
              transform: mobileContact ? null : "rotateZ(180deg)"
            }}/>
          </div>}

          <Comments isComments={isComments} setIsComments={setIsComments} setIsReport={setIsReport}/>

          {(isEditSmallInfo === true || isEditContacts === true || isEditMoreInfo === true) && 
            <div className='EditProfilePageHeader'>
              <p>{submitError}</p>
              <button className='cancelEdit' onClick={() => {
                setIsEditContacts(false);
                setIsEditMoreInfo(false);
                setIsEditSmallInfo(false);
              }}>Cancel</button>
              <button className='submitEdit' onClick={() => submit()}>Submit</button>
            </div>}
            
          <div className='ProfilePage'>

            <div className='ProfilePageContentContainer'>
              <div className='ProfielPageContent'>

                <div className='ProfileInfo'>

                  {isEditSmallInfo === false ? ( <div className="ProfileSmallInfo">

                    <div className='edit_icon' onClick={() => {setIsEditSmallInfo(!isEditSmallInfo)}}>
                      <Svgs type={"Edit"} />
                    </div>

                    <div className='share_icon' onClick={() => setIsShareAccount(true)}>
                      <Svgs type={"Share"}/>
                    </div>
                    
                    <img src={(profileImageName && profileImageName.length > 0) ? 
                    `https://f003.backblazeb2.com/file/mosocial-all-images-storage/${profileImageName}` : null} alt='' />
                    
                    <h2>{username}</h2>
                    <hr />

                    <p>{shortDesc}</p>
                    <hr />
                    
                    <div className='detailsList'>

                      <ul>
                        {myDetails.map((d) => (
                          <li key={d.key_id}>
                            <h4>{d.title}</h4>
                          </li>
                        ))}
                      </ul>

                      <ul>
                        {myDetails.map((d) => (
                          <li key={d.key_id}>
                            <p>{d.value}</p>
                          </li>
                        ))}
                      </ul>

                    </div>

                  </div>
                  ) : (
                  <div className="ProfileSmallInfo">

                    <div className='edit_icon' onClick={() => {setIsEditSmallInfo(!isEditSmallInfo)}}>
                      <Svgs type={"Edit"} />
                    </div>
                    
                    <img src={choosenImage?.name && choosenImageURL ? choosenImageURL : choose_image_icon} 
                          alt='' 
                          style={{padding: choosenImageURL ? 0 : 16, 
                          background: "#d9d9d9",
                          cursor: 'pointer'}}
                          onClick={() => {
                            chooseFileRef.current.click();
                          }}
                          />

                    <input 
                      type='file' 
                      ref={chooseFileRef} 
                      accept="image/*"
                      onChange={(e) => {
                        console.log(e.target.files)
                        const file = e.target.files[0];
                        if(file)
                          setChoosenImage(file);
                      }} 
                      style={{transform: "translateY(-1000px)"}}
                    />      
                    
                    <input type='text' placeholder='username ?' maxLength={25}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <hr />

                    <textarea placeholder='Descripe yourself in short words' 
                        onChange={(e) => setShortDesc(e.target.value)}
                        maxLength={75}
                    />
                    <hr />
                    
                    <div className='detailsList'>

                      <ul>
                        {myDetails.map((d) => (
                          <li key={d.key_id}>
                            <input type='text'
                              maxLength={16}
                              placeholder={d.title ? d.title : null}
                              onChange={(e) => d.title = e.target.value}
                            />
                          </li>
                        ))}
                      </ul>

                      <ul>
                        {myDetails.map((d) => (
                          <li key={d.key_id}>
                            <input type='text'
                              maxLength={16}
                              onChange={(e) => d.value = e.target.value}
                              placeholder={d.value ? d.value : null}
                            />
                          </li>
                        ))}
                      </ul>

                    </div>

                    <div className='detailsButtons'>

                      <button className='handleDetailsRow' 
                        onClick={() => {
                          setMyDetails(
                            [...myDetails, {
                              key_id: myDetails.length + 1,
                              title: "",
                              value: ""
                            }]
                          )
                        }}>Add row</button>
                        
                        --

                      <button className='handleDetailsRow' 
                        onClick={() => {
                          setMyDetails(
                            myDetails.filter(
                              item => item.key_id !== myDetails.length
                            )
                          )
                        }}>Remove row</button>

                    </div>

                  </div> )}

                  {isEditMoreInfo === false ? ( <div className='ProfileDetailedInfo'>
                    
                    <div className='edit_icon' onClick={() => {setIsEditMoreInfo(!isEditMoreInfo)}}>
                      <Svgs type={"Edit"} />
                    </div>

                    <h3>More Details</h3>
                    <p>{moreDetailsDesc}</p>

                    <h3>Last Posts</h3>
                    <div className='lastProjectsDiv'>
                      <ul className='lastProjects'>
                          {myLastProjects.map((pj) => (
                            <li key={pj.key_id} onClick={() => navigateToPost(pj.key_id)}>
                              <img src={`https://f003.backblazeb2.com/file/mosocial-all-images-storage/${pj.image}`} alt=''/>
                              <p>{pj.name}</p>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <h3>Skills</h3>
                    <div className='skillsDiv'>
                      <ul className='skills'>
                          {mySkills.map((skill) => (
                            <>
                            {skill?.name && skill.name !== "" && <Skill key={skill.key_id} skill_name={skill.name} percentage={skill.percentage} />
                            }
                            </>
                          ))}
                      </ul>
                    </div>

                  </div> 
                  ) : (
                  <div className='ProfileDetailedInfo'>

                    <div className='edit_icon' onClick={() => {setIsEditMoreInfo(!isEditMoreInfo)}}>
                      <Svgs type={"Edit"} />
                    </div>
                                      
                    <h3>More Details</h3>
                    <textarea 
                      rows={3}
                      placeholder='More details about you ?'
                      onChange={(e) => {
                        setMoreDetailsDesc(e.target.value)
                      }}
                    />

                    <h3>Last Projects</h3>
                    <div className='lastProjectsDiv'>
                      <ul className='lastProjects'>
                          {myLastProjects.map((pj) => (
                            <li key={pj.key_id}>
                              <img src={`https://f003.backblazeb2.com/file/mosocial-all-images-storage/${pj.image}`} alt=''/>
                              <p>{pj.name}</p>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <h3>Skills</h3>
                    <div className='skillsDiv'>

                      {mySkills.map((skill) => (
                        <div style={{width: "100%", overflow: 'hidden'}}>
                          { skill ? (
                            <div className='skillInputsDiv'>
                              <input type='text' placeholder={skill.name} onChange={(e) => {
                                skill.name = e.target.value
                              }}
                              maxLength={16}/>
                              <input 
                              type='number' 
                              max="100"
                              min="0"
                              placeholder={skill.percentage} 
                              onChange={(e) => {
                                skill.percentage = e.target.value
                              }}/>
                            </div>
                          ) : (
                            <div className='skillInputsDiv'>
                              <input 
                              type='text' 
                              placeholder='skill name' 
                              onChange={(e) => {
                                skill.name = e.target.value
                              }} 
                              maxLength={16}/>
                              <input 
                              max="100"
                              min="0"
                              type='number' 
                              placeholder='level percentage' 
                              onChange={(e) => {
                                skill.percentage = e.target.value
                              }}/>
                            </div>
                          )}
                        </div>
                      ))}

                      <div className='detailsButtons'>

                        <button className='handleDetailsRow' 
                          onClick={() => {
                            setMySkills(
                              [...mySkills, {
                                key_id: mySkills.length + 1,
                                name: "",
                                percentage: 0
                              }]
                            )
                          }}>Add skill</button>
                          
                          --

                        <button className='handleDetailsRow' 
                          onClick={() => {
                            setMySkills(
                              mySkills.filter(
                                item => item.key_id !== mySkills.length
                              )
                            )
                          }}>Remove skill</button>

                      </div>
                    </div>

                  </div>
                  )}

                </div>

                <div className='ProfileProjects'>

                  <CreatePostCard username={username} />

                  <ul className='projectsCards'>
                    {posts.map((post) => (
                      <HeroPostCard 
                        key={post._id}
                        id={post._id}
                        postIsLiked={post.liked}
                        creator_name={post.creator_username}
                        creator_image={post.creator_image}
                        creator_id={post.creator_id}
                        images={post.post_images}
                        desc={post.desc}
                        topCommentCreatorImage={post.topCommentCreatorImage ? post.topCommentCreatorImage : "odhfuiehf"}
                        topCommentCreatorName={post.topCommentCreatorName ? post.topCommentCreatorName : "odhfuiehf"}
                        topComment={post.topComment ? post.topComment : "odhfuiehfwqkln3rljkqehuruq3rgyagfjheg"}
                        setIsComments={setIsComments}
                        setIsReport={setIsReport}
                        handleDeleteThisPost={() => {
                          setPosts(
                            posts.filter(p => p._id !== post._id)
                          )
                        }}
                      />
                    ))}

                    {fetchResult !== "No more posts" &&
                      <button className='morePostsButton' onClick={() => getPostsForThisUser()}>{posts.length > 0 ? "More posts" : "Get posts"}</button>
                    }
                    <h3 style={{marginTop: 24, color: "#7d7d7d", fontWeight: 600}}>{fetchResult}</h3>

                  </ul>

                </div>

              </div>
            </div>  

            {isEditContacts === false ? (<div className='ProfilePageContact' style={{
              position: isMobile ? "absolute" : "unset", 
              right: mobileContact ? "0" : "100%",
              boxShadow: mobileContact ? null : "none"
            }}>

              <div className='edit_icon' onClick={() => {setIsEditContacts(!isEditContacts)}}>
                  <Svgs type={"Edit"} />
              </div>

              <h2>Social Media</h2>

              {mySocialMedia.map((c) => (
                <Link onClick={() => {setIsCheckUrl(true); setCheckUrl(c.url);}}>
                  <div className={`ContactWith changeSVGcolor ${c.special_class ? c.special_class : ""}`}>
                    <Svgs type={c.name_of_app} />
                    <label>Contact me on {c.name_of_app}</label>
                  </div>
                </Link>
              ))}

            </div>) : (
            <div className='ProfilePageContact' style={{
              position: isMobile ? "absolute" : "unset", 
              right: mobileContact ? "100%" : "0",
              boxShadow: mobileContact ? "none" : null
            }}>

              <div className='edit_icon' onClick={() => {setIsEditContacts(!isEditContacts)}}>
                  <Svgs type={"Edit"} />
              </div>

              <h2>Edit my Social Media</h2>
              
              {mySocialMedia.map((c) => (
                  <div className='contactMeOn'>

                    <div className='select_delete_platform'>

                      <label for="socialMediaDropDown">Choose platform: </label>

                      <select id='socialMediaDropDown' onChange={(e) => {
                        if(e.target.value !== "other"){
                          c.name_of_app = e.target.value;
                          setOtherOption(
                            otherOption.filter(
                              item => item.key_id !== c.key_id
                            )
                          );
                          return
                        } else {
                          setOtherOption([
                            ...otherOption,
                            {key_id: c.key_id}
                          ]);
                          return
                        }
                      }}>
                        {SOCIAL_MEDIA_PLATFORMS.map((item) => (
                          <option value={item} selected={item === c.name_of_app ? true : false}>{item}</option>
                        ))}
                      </select>

                      <div className='deleteSocial'
                        onClick={() => {
                          setMySocialMedia(
                            mySocialMedia.filter(
                              item => item.key_id !== c.key_id
                            )
                          )
                        }}><Svgs type={"delete"} /></div>
                    
                    </div>
                    
                    {otherOption.find(
                      (item) => item.key_id === c.key_id
                      ) ? (<input 
                      type='text' 
                      placeholder={c.name_of_app ? c.name_of_app+"..." : "platform name..."}
                      onChange={(e) => {
                        const name = e.target.value;
                        if(name?.length > 0){
                          const str = name.charAt(0).toUpperCase() + name.slice(1);
                          c.name_of_app = str;
                          if(!SOCIAL_MEDIA_PLATFORMS.find(
                            val => val === str.length === 1 ? str : str.slice(0, -1)
                          )){
                            if(str.length > 0 && !SOCIAL_MEDIA_PLATFORMS.find(v => v === str))
                            SET_SOCIAL_MEDIA_PLATFORMS([
                              ...SOCIAL_MEDIA_PLATFORMS,
                              str
                            ])
                          } else if(str.length > 1 && !SOCIAL_MEDIA_PLATFORMS.find(
                            val => val === str
                          )) {
                            const newSocialArray = SOCIAL_MEDIA_PLATFORMS;
                            const index = newSocialArray.indexOf(str.slice(0, -1))
                            newSocialArray[index] = str;
                            SET_SOCIAL_MEDIA_PLATFORMS(newSocialArray);
                          }
                          return;
                        }
                      }}
                      style={{
                        display: "default"
                      }}
                      maxLength={16}/>) : null}
                    
                    <input 
                      type='text' 
                      placeholder="http://..."
                      onChange={(e) => {
                        c.url = e.target.value
                      }}/>
                  </div>
              ))}
              

              <div className='ContactButtons'>

                <button 
                  onClick={() => {
                    setMySocialMedia(
                      [...mySocialMedia, {
                        key_id: calculateID(),
                        name_of_app: "Facebook",
                        url: ""
                      }]
                    )
                  }}>Add new URL</button>
                  
              </div>

            </div>
            )}

          </div>

        </div>

      )}
    </>
  )
};

export default Profile;
