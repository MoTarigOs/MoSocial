import React, { useEffect, useState } from 'react';
import './CommentsPage.css';
import { getLatestCommentsOnMyPosts } from '../../logic/api';
import { setPostInfoOnComments } from '../../logic/helperMethods';
import image from '../../Assets/images/idea_image.jpg';
import CommentsPageCard from '../../components/Cards/CommentsPageCard';

const CommentsPage = () => {

  const [comments, setComments] = useState([]);
  const [error, setError] = useState([]);
  const [count, setCount] = useState(1);
  const [runOnce, setRunOnce] = useState(false);

  const fetchLatestCommentsOnMyPosts = async() => {

    try{

      if(count < 0 || count > 10) return setError("You maxed out the number of requests please try again later");

      const res = await getLatestCommentsOnMyPosts(count);

      if(!res || !res.ok || res.ok === false) return setError(res.dt ? res.dt : "Error getting comments, please check your internet connection");

      if(res.dt){
        const fetchedComments = setPostInfoOnComments(res.dt.comments, res.dt.posts)
        console.log("Comments Page fetched data: ", fetchedComments);
        setComments(fetchedComments);
        setCount(count + 1);
      }
    } catch (err){
      console.log(err.message);
    }
  };

  useEffect(() => {
    setRunOnce(true);
  }, []);

  useEffect(() => {
    if(runOnce === true){
      fetchLatestCommentsOnMyPosts();
    }
  }, [runOnce]);

  return (
    <div className='CommentsPage'>

        <ul>

            {comments.map((cm) => (
                <CommentsPageCard 
                    key={cm._id} 
                    id={cm._id}
                    post_id={cm.post_id}
                    post_image={cm.post_first_image}
                    desc={cm.post_title} 
                    date_of_publish={cm.post_created_at} 
                    comment_creator={cm.commenter_name} 
                    commenter_image={cm.commentorImage}
                    comment={cm.comment_text}
                />
            ))}

        </ul>
    </div>
  )
};

export default CommentsPage;
