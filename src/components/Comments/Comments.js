import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../DataContext';
import { createComment, getComments, deleteComment, getUserInfo } from '../../logic/api';
import './Comments.css';
import { motion } from 'framer-motion';
import Svgs from '../../Assets/icons/Svgs';
import likeIcon from '../../Assets/icons/like_icon.png';
import likedIcon from '../../Assets/icons/liked_icon.png';
import { getBadWords } from '../../logic/helperMethods';

const Comments = ({ isComments, setIsComments, setIsReport }) => {

    const { 
        postID, setUserID, userID, userUsername,
        setUserUsername, setProfileImageName, profileImageName, 
        set_navigateTo_userID, navigateTo_userID, setIsMyProfile,
        setReportType, setReportOnThisId, set_navigateTo_userUsername
    } = useContext(DataContext);
    const textToSendRef = useRef();
    const commentsArrayListRef = useRef();
    const [isLoading, setIsLoading] = useState(null);
    const [isNoMoreComments, setIsNoMoreComments] = useState(false);
    const [commentsArray, setCommentsArray] = useState([]);
    const [deleteAlert, setDeleteAlert] = useState([]);
    const [reRenderAlert, setReRenderAlert] = useState(false);
    const [keyCounter, setKeyCounter] = useState(0);
    const [runOnce, setRunOnce] = useState(false);
    const [error, setError] = useState("");
    const [publishingComment, setPublishingComment] = useState(false);
    const [limit, setLimit] = useState(12);
    const limitGap = 8;
    const navigate = useNavigate();

    const publishComment = async() => {

        try{

            const text = textToSendRef.current.value;

            if(!text || text.length <= 0) return setError("Text is empty");

            const testForBadWords = getBadWords(text);

            if(testForBadWords.length > 0) {
                let er = "";
                for (let i = 0; i < testForBadWords.length; i++) {
                    if(i !== testForBadWords.length - 1){
                        er += `"${testForBadWords[i]}", `;
                    } else {
                        er += `"${testForBadWords[i]}"`;
                    }
                }
                setError("This is bad words: ", er);
                return;
            }
            
            if(!profileImageName || profileImageName.length <= 0){
                const askUser = window.confirm("There is error in your profile image\npublish the comment without image & fix it later ?");
                if(!askUser) return;
            }

            if(!postID || postID.length <= 0) return setError("there is no post to comment on :(");

            setPublishingComment(true);

            const res = await createComment(userUsername, profileImageName, text, postID);

            if(!res || res.ok === false) return setError(res.dt ? res.dt : "Error publishing comment please try again if same error occure refresh the page or login again");

            if(res.dt){
                const newArray = [res.dt, ...commentsArray];
                setCommentsArray(newArray);
                setDeleteAlert([
                    ...deleteAlert, {id: res.dt._id, isAlerting: false}
                ]);
                commentsArrayListRef.current.scrollTo({
                    top: 0,
                    behaviour: 'smooth'
                });
            } else {
                const textObj = {
                    key_id: keyCounter,
                    client: true,
                    text: text,
                    liked: false,
                    disliked: false
                };
                const newcommentsArray = [textObj, ...commentsArray];
                setCommentsArray(newcommentsArray);
                setKeyCounter(keyCounter + 1);
                setDeleteAlert([
                    ...deleteAlert, {id: keyCounter, isAlerting: false}
                ]);
                commentsArrayListRef.current.scrollTo({
                    top: 0,
                    behaviour: 'smooth'
                });
            }

            setPublishingComment(false);

            setError("");
            
        } catch(err){
            console.log(err.message);
        }
    };

    const getCommentsOnThisPost = async() => {

        try{

            if(commentsArray.length > 0 && (isLoading === true || isNoMoreComments === true)) return;

            setIsLoading(true);

            if(commentsArray.length < 12 && limit > 12){
                setIsNoMoreComments(true);
                setIsLoading(false);
                return;
            };

            const res = await getComments(postID, limit);

            if(!res || !res?.ok || res.ok === false){ 
                setError("There is an error with this post");
                setIsLoading(false);
                return;
            }

            if(res.dt && res.dt.length > 0){
                const data = res.dt;
                let newAlertArray = [];
                for (let i = 0; i < data.length; i++) {
                    newAlertArray.push({id: data[i]._id, isAlerting: false});
                }

                if(res.dt.length - commentsArray.length < limitGap) setIsNoMoreComments(true);

                setDeleteAlert(newAlertArray);
                setCommentsArray(res.dt)
                const newLimit = limit + limitGap;
                setLimit(newLimit);
                setIsLoading(false);
                return;
            }

            setIsLoading(false);
            setCommentsArray([])
            return;

        } catch(err){
            console.log(err.message);
        }
    };

    const deleteThisComment = async(comment_id, commenter_id) => {
        
        try{

            console.log("Deleting comment with id: ", comment_id, "userID: ", userID, "commenterID: ", commenter_id);

            if(commenter_id !== userID) return setError("You can't delete this comment");

            const res = await deleteComment(comment_id);

            console.log("res: ", res);

            if(!res || !res.ok || res.ok === false) return setError(res.dt ? res.dt : "Error deleting this comment please try again");

            setCommentsArray(
                commentsArray.filter(
                    comment => comment._id !== comment_id
                )
            );

            setDeleteAlert(
                deleteAlert.filter(
                    element => element.id !== comment_id
                )
            );

            setReRenderAlert(!reRenderAlert);

        } catch(err){
            console.log(err);
        }
    };

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

    const alertDeletion = (comment_id) => {
        console.log(comment_id);
        console.log("alert");
        const arr = deleteAlert;
        for (let i = 0; i < arr.length; i++) {
            console.log(arr[i].id)
            if(arr[i].id === comment_id){ 
                arr[i].isAlerting = true;  
                console.log(arr[i])
                setDeleteAlert(arr);
                setReRenderAlert(!reRenderAlert);
                return;
            }
        };
    };

    const removeAlertDeletion = (comment_id) => {
        console.log("remove alert");
        const arr = deleteAlert;
        for (let i = 0; i < arr.length; i++) {
            if(arr[i].id === comment_id){ 
                arr[i].isAlerting = false;  
                setDeleteAlert(arr);
                setReRenderAlert(!reRenderAlert);
                return;
            }
        };
    };

    const checkIsAlerting = (comment_id) => {
        console.log("checking alert");
        const arr = deleteAlert;
        for (let i = 0; i < arr.length; i++) {
            if(arr[i].id === comment_id){ 
                console.log(arr[i])
                if(arr[i].isAlerting === true){
                    return true;
                } else {
                    return false;
                }
            }
        };
    };

    const navigateToProfile = (id) => {
        if(id === userID){
            set_navigateTo_userID("");
            setIsMyProfile(true);
            navigate(`/profile/${id}`);
        } else {
            set_navigateTo_userID(id);
            setIsMyProfile(false);
            navigate(`/profile/${id}`);
        }
    };

    const handleCommentReport = (creator_id, creator_name, id) => {

        if(!userID || userID.length <= 0) return setError("please login to your account");

        set_navigateTo_userID(creator_id);
        set_navigateTo_userUsername(creator_name);
        setReportType("comment");
        setReportOnThisId(id);
        setIsReport(true);

    };

    useEffect(() => {
        commentsArrayListRef.current.scrollTo({
            bottom: 2000,
            behaviour: "smooth"
        });
        setRunOnce(true);
    }, []);

    useEffect(() => {

        if(!userID || userID === "") fetchUserInfo();

        if(isComments === true) getCommentsOnThisPost();

        if(isComments === false){
            setCommentsArray([]);
            setLimit(12);
            setIsLoading(null);
            setIsNoMoreComments(false);
            set_navigateTo_userID("");
            set_navigateTo_userUsername("");
            setReportType("");
            setReportOnThisId("");
        }

    }, [isComments]);

    return (
        <motion.div className='CommentsContainer'
            initial={{
                y: "150vh",
                display: "flex"
            }}
            animate={{
                y: isComments === true ? 0 : "180vh",
                display: isComments === true ? "flex" : "none"
            }}
        >

            <div className='Comments'>
                
                <p>{error}</p>

                <div className='QuitComments' onClick={() => setIsComments(false)}>
                    <Svgs type={"Exit"}/>
                </div>

                <div className='ulDiv' ref={commentsArrayListRef}>

                    <ul>
                        {commentsArray.map((c) => (
                            <li key={c._id}>

                                <div className='comments'>
                                    {c.commenter_id === userID && (reRenderAlert === true || reRenderAlert === false) && <div className='deleteComment' onMouseLeave={() => removeAlertDeletion(c._id)}>
                                        <div className='svgDiv' onClick={() => alertDeletion(c._id)}><Svgs type={"Delete"} /></div>
                                        {checkIsAlerting(c._id) === true 
                                        && <div className='alert'>
                                                <p>delete this Comment ?</p>
                                                <div style={{}}>
                                                    <button style={{color: '#cdcdcd'}} onClick={() => removeAlertDeletion(c._id)}>Cancel</button>
                                                    <button onClick={() => deleteThisComment(c._id, c.commenter_id)}>Delete</button>
                                                </div>
                                            </div>}
                                    </div>}

                                    <div className='commentCreator'>
                                        <img src={`https://f003.backblazeb2.com/file/mosocial-all-images-storage/${c.commenter_image}`} className='profileImage'/>
                                        <h1 onClick={() => navigateToProfile(c.commenter_id)}>{c.commenter_name}</h1> 

                                        <div className='likeDiv' style={{transform: "rotateZ(180deg) translateY(-6px)"}}>
                                            <motion.img 
                                            src={likeIcon} 
                                            onClick={() => {
                                                
                                            }}
                                            initial={{scale: 0}}
                                            animate={{scale: c.liked === false ? 1 : 0}}
                                            />
                                        
                                            <motion.img 
                                            src={likedIcon} 
                                            onClick={() => {
                                                
                                            }}
                                            initial={{scale: 0}}
                                            animate={{scale: c.liked === true ? 1 : 0}}
                                            />
                                        </div>

                                        <div className='likeDiv' style={{transform: "translateY(-2px)"}}>
                                            <motion.img 
                                            src={likeIcon} 
                                            onClick={() => {
                                                
                                            }}
                                            initial={{scale: 0}}
                                            animate={{scale: c.disliked === false ? 1 : 0}}
                                            />
                                        
                                            <motion.img 
                                            src={likedIcon} 
                                            onClick={() => {
                                                
                                            }}
                                            initial={{scale: 0}}
                                            animate={{scale: c.disliked === true ? 1 : 0}}
                                            />
                                        </div>

                                        <button className='reportButton' onClick={() => handleCommentReport(c.commenter_id, c.commenter_name, c._id)}>Report</button>
                                    </div>
                                    <p>{c.comment_text}</p>
                                    <h6>Created At: {(c.createdAt && (typeof c.createdAt === 'string' || c.createdAt instanceof String)) ?
                                    (<>{c.createdAt.split('T')[0].replaceAll("-", "/")} {c.createdAt.split('T')[1].split('.')[0]}</>) : ("no date exist")}</h6>
                                </div>
                                
                            </li>
                        ))}

                    </ul>

                    <div className='morePostsButton' 
                    style={{
                        display: 'flex',
                        position: !isLoading && commentsArray.length > 0 ? "unset" : null, 
                        height: !isLoading && commentsArray.length > 0 ? "fit-content" : null, 
                        padding: !isLoading && commentsArray.length > 0 ? "24px 0" : null
                    }}>
                        <button onClick={() => getCommentsOnThisPost()}>{commentsArray.length > 0 ? (isLoading === false ? (isNoMoreComments === false ? "More comments" : "No more comments") : "Loading Comments...") : (isLoading ? "Loading..." :  "No Comments")}</button>
                    </div>
                            
                </div>
                
                <div className='commentSend' style={{ display: 'flex' }}>
                    <textarea placeholder='Type here' ref={textToSendRef}></textarea>
                    <div onClick={publishComment}>
                        <Svgs type={"SendMessage"} />
                    </div>
                </div>

            </div>
        
        </motion.div>
    )
};

export default Comments;
