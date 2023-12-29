import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../DataContext';
import { likePost, removeLikePost, deletePost, getTopComment, fetchPic } from '../../logic/api';
import './HeroPostCard.css';
import { motion } from 'framer-motion';
import icon from '../../Assets/icons/wish_heart_pre_click.png';
import icon2 from '../../Assets/icons/wish_heart_click_filled.png';
import comment_icon from '../../Assets/icons/comment_icon.svg';
import likeIcon from '../../Assets/icons/like_icon.png';
import likedIcon from '../../Assets/icons/liked_icon.png';

const HeroPostCard = ({
    id, creator_name, creator_image, creator_id, 
    images, desc, setIsComments, postIsLiked, 
    handleDeleteThisPost, setIsReport
}) => {

    const navigate = useNavigate();

    const { 
        setIsMyProfile, userID, set_navigateTo_userID, 
        set_navigateTo_userUsername, setPostID,
        setReportType, setReportOnThisId, 
        setImageFullScreen, setImageIndex, setPostImages
    } = useContext(DataContext);
    const [runOnce, setRunOnce] = useState(false);
    const [isCommentLiked, setIsCommentLiked] = useState(false);
    const [isWishList, setIsWishList] = useState(postIsLiked ? (postIsLiked === true ? true : false) : false);
    const [isCommentDisLiked, setIsCommentDisLiked] = useState(false);
    const [error, setError] = useState("");
    const [menuOptions, setMenuOptions] = useState(false);
    const [topCommentCreatorName, setTopCommentCreatorName] = useState("");
    const [topComment, setTopComment] = useState("");
    const [topCommentCreatorImage, setTopCommentCreatorImage] = useState("");
    const [fetchedPictures, setFetchedPictures] = useState([]);
    const [creatorPic, setCreatorPic] = useState(null);

    const like = async() => {
        try{
            const res = await likePost(id);
            if(!res || !res?.ok || res.ok === false) return setError(res.dt ? res.dt.message : "Error connecting to server, please like the post again");
            setError("");
        } catch(err){
            console.log(err.message);
        }
    };

    const removeLike = async() => {
        try{
            const res = await removeLikePost(id);
            if(!res || !res?.ok || res.ok === false) return setError(res.dt ? res.dt.message : "Error connecting to server, please remove your like again");
            setError("");
        } catch(err){
            console.log(err.message);
        }
    };

    const navigateToProfile = async() => {
        try{
            if(userID === creator_id){
                setIsMyProfile(true);
                set_navigateTo_userID("");
            } else {
                setIsMyProfile(false);
                set_navigateTo_userID(creator_id);
            }
            navigate(`/profile/${creator_id}`);
        } catch(err){
            console.log(err);
        }
    };

    const deleteThisPost = async() => {
        try{

            if(creator_id !== userID) return setError("You can't delete other's posts");

            const res = await deletePost(id);

            if(!res || !res.ok || res.ok === false) return setError("Error please try again later");

            handleDeleteThisPost(id);

        } catch(err){
            console.log(err);
        }
    };

    const fetchTopComment = async() => {

        try{

            if(!id || id.length <= 0) return;

            const res = await getTopComment(id);

            if(!res || !res.ok || res.ok === false || !res.dt) return;

            setTopCommentCreatorName(res.dt.commenter_name);
            setTopComment(res.dt.comment_text);
            setTopCommentCreatorImage(res.dt.commenter_image);

        } catch(err){

        }

    };

    const fetchPictures = () => {
        
        try{

            let fetchingPics = [];
            for (let i = 0; i < images.length; i++) {
                const url = `https://f003.backblazeb2.com/file/mosocial-all-images-storage/${images[i].picturesNames}`;
                fetchingPics.push({
                    url: url,
                    name: images[i].picturesNames,
                    id: images[i]._id
                });
            };

            console.log("fetching this Post: ", desc, "\tpictures object: ", images, "fetchingPics: ", fetchingPics);

            setFetchedPictures(fetchingPics);

        } catch(err){
            console.log(err.message);
        }
    };

    const fetchCreatorPic = async() => {
         try{

            const url = `https://f003.backblazeb2.com/file/mosocial-all-images-storage/${creator_image}`;
            setCreatorPic(url);

         } catch(err){
            console.log(err.message);
         }
    };

    const handleReport = () => {

        if(!userID || userID.length <= 0) return setError("please login to your account");

        set_navigateTo_userID(creator_id);
        set_navigateTo_userUsername(creator_name);
        setReportType("post");
        setReportOnThisId(id);
        setIsReport(true);

    };

    const handlePostImageClick = (id) => {

        const index = fetchedPictures.map(i => i.id).indexOf(id);
        console.log("made index: ", index);
        setImageIndex(index);
        setPostImages(fetchedPictures);
        setImageFullScreen(true);
    };

    useEffect(() => {
        setRunOnce(true);
        setReportType("");
        setReportOnThisId("");
        set_navigateTo_userID("");
        set_navigateTo_userUsername("")
    }, [])

    useEffect(() => {
        if(runOnce === true){ 
            fetchTopComment();
            fetchPictures();
            fetchCreatorPic();
        }
    }, [runOnce])

    useEffect(() => {
        const timeErrorClearance = setTimeout(() => {
            setError(null);
        }, 5000);

        return () => clearTimeout(timeErrorClearance);
    }, [error]);

    return (
        <li className='PostHeroCard' onMouseLeave={() => {if(menuOptions === true) setMenuOptions(false)}}>

            <label style={{color: "red"}}>{error}</label>

            <div className='PostCreator'>
                <img src={creatorPic} onClick={navigateToProfile} />
                <h1 onClick={navigateToProfile}>{creator_name}</h1>
                <div className='postMenuIcon' onClick={() => setMenuOptions(!menuOptions)}>
                    <motion.div className='postCardMenuOptions'
                        style={{
                            transformOrigin: "50% top"
                        }}
                        initial={{
                            scaleY: 1
                        }}
                        animate={{
                            scaleY: menuOptions === true ? 1 : 0
                        }}
                    >
                        <ul>
                            <li>Follow</li>
                            <li onClick={deleteThisPost}>Delete</li>
                            <li onClick={handleReport}>Report</li>
                        </ul>
                    </motion.div>
                </div>
            </div>

            <div className='postImages' onClick={() => {if(menuOptions === true) setMenuOptions(false)}} >
                <ul>
                    {fetchedPictures.map((pic) => (
                        <li onClick={() => handlePostImageClick(pic.id)} key={pic.id}>
                            <img src={pic.url}/>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className='postCardInfo' onClick={() => {if(menuOptions === true) setMenuOptions(false)}}>
                <p>{desc}</p>

                <img src={comment_icon} className='comment_icon' 
                    onClick={() => {setIsComments(true); setPostID(id);}}
                />
                
                <div className='wishDiv'>
                    <motion.img 
                    src={icon} 
                    onClick={() => {setIsWishList(true); like();}}
                    initial={{scale: 0}}
                    animate={{scale: isWishList === false ? 1 : 0}}
                    />
                
                    <motion.img 
                    src={icon2} 
                    onClick={() => {setIsWishList(false); removeLike();}}
                    initial={{scale: 0}}
                    animate={{scale: isWishList === true ? 1 : 0}}
                    />
                </div>
            </div>

            {topComment && <div className='comments' onClick={() => {if(menuOptions === true) setMenuOptions(false)}}>
                <div className='commentCreator'>
                    <img src={(topCommentCreatorImage && topCommentCreatorImage.length > 0) ?
                    `https://f003.backblazeb2.com/file/mosocial-all-images-storage/${topCommentCreatorImage}` : null} />
                    <h1>{topCommentCreatorName}</h1> 

                    <div className='likeDiv' style={{transform: "rotateZ(180deg) translateY(-6px)"}}>
                        <motion.img 
                        src={likeIcon} 
                        onClick={() => {setIsCommentLiked(true); if(isCommentDisLiked === true) setIsCommentDisLiked(false)}}
                        initial={{scale: 0}}
                        animate={{scale: isCommentLiked === false ? 1 : 0}}
                        />
                    
                        <motion.img 
                        src={likedIcon} 
                        onClick={() => {setIsCommentLiked(false)}}
                        initial={{scale: 0}}
                        animate={{scale: isCommentLiked === true ? 1 : 0}}
                        />
                    </div>

                    <div className='likeDiv' style={{transform: "translateY(-2px)"}}>
                        <motion.img 
                        src={likeIcon} 
                        onClick={() => {setIsCommentDisLiked(true); if(isCommentLiked === true) setIsCommentLiked(false)}}
                        initial={{scale: 0}}
                        animate={{scale: isCommentDisLiked === false ? 1 : 0}}
                        />
                    
                        <motion.img 
                        src={likedIcon} 
                        onClick={() => {setIsCommentDisLiked(false)}}
                        initial={{scale: 0}}
                        animate={{scale: isCommentDisLiked === true ? 1 : 0}}
                        />
                    </div>
                </div>
                <p>{topComment}</p>
            </div>}

        </li>
    )
};

export default HeroPostCard;
