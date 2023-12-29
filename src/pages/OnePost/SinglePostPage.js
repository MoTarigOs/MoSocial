import React, { useEffect, useState, useContext } from 'react';
import { DataContext } from '../../DataContext';
import { setLikedPosts } from '../../logic/helperMethods';
import { getPostDetails } from '../../logic/api';
import './SinglePostPage.css';
import HeroPostCard from '../../components/Cards/HeroPostCard';
import Comments from '../../components/Comments/Comments';
import LoadingGIF from '../../Assets/icons/loading_anim.gif';

const SinglePostPage = ({ setIsReport }) => {

    const [postDetails, setPostDetails] = useState({});
    const [runOnce, setRunOnce] = useState(false);
    const [error, setError] = useState(false);
    const [isComments, setIsComments] = useState(false);
    const [isLoading, setIsLoading] = useState(null);
    const { postID } = useContext(DataContext);

    const fetchPostDetails = async() => {

      try{

        setIsLoading(true);

        if(!postID || postID.length <= 0) return setError("No posts found!");

        const res = await getPostDetails(postID);

        if(!res || !res.ok || res.ok === false || !res.dt || !res.dt.postDetails) return () => { 
          setError(res.dt ? res.dt : "Error getting this post details"); 
          setPostDetails([]);
        };

        const arr = [];
        arr.push(res.dt.postDetails);
        
        console.log("arr: ", arr);

        const finalPostDetails = setLikedPosts(arr, res.dt.likedPosts);

        console.log("finalArray: ", finalPostDetails);

        setPostDetails(finalPostDetails[0]);
        setError("");

        setIsLoading(false);

      } catch(err){
        console.log(err);
      }

    };

    useEffect(() => {
      setRunOnce(true);
    }, [])

    useEffect(() => {
      if(runOnce === true) fetchPostDetails();
    }, [runOnce])

    return (
      <div className='SinglePostPage'>

        <Comments isComments={isComments} setIsComments={setIsComments} setIsReport={setIsReport}/>
       
        {isLoading === false && <HeroPostCard 
            key={postDetails._id}
            id={postDetails._id}
            postIsLiked={postDetails.liked}
            creator_name={postDetails.creator_username}
            creator_image={postDetails.creator_image}
            creator_id={postDetails.creator_id}
            images={postDetails.post_images ? postDetails.post_images : []}
            desc={postDetails.desc}
            topCommentCreatorImage={null}
            topCommentCreatorName={"udhfuidshf"}
            topComment={"skjdgfh8ewy7gfsdf78dsfbshjdgfhsdgfywsehfjgsdjhfgsdhjfgjshdghsfg"}
            setIsComments={setIsComments}
            setIsReport={setIsReport}
        />}

        {isLoading !== false && <img src={LoadingGIF}/>}

      </div>
    )
};

export default SinglePostPage;
