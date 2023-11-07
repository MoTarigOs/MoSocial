import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../DataContext';
import { useNavigate } from 'react-router-dom';
import './CommentsPageCard.css';

const CommentsPageCard = ({
    id, post_id, post_image, desc, date_of_publish, comment_creator, comment_image, comment
}) => {

  const { setPostID, postID } = useContext(DataContext);
  const [isRunned, setIsRunned] = useState(false);

  const navigate = useNavigate();
  //navigate to post page (/single-post-page)

  const navigateToPost = () => {
    setPostID(post_id);
    setTimeout(() => {
    setIsRunned(true);
    }, 10);
  };

  useEffect(() => {
    if(postID === post_id  && isRunned === true){
      setIsRunned(false);
      navigate('/single-post');
    }
  }, [isRunned]);

  return (
    <li className='CommentPageCardLi' onClick={navigateToPost}>
      <div className='CommentsPageCard'>

        <div className='comments_page_postDiv'>
            <img src={post_image} />
            <div style={{display: 'flex', flexDirection: "column", justifyContent: 'center', gap: 12}}>
                <p>{desc}</p>
                <h5>{date_of_publish}</h5>
            </div>
        </div>

        <div className='commentsPageCreator'>
            <img src={comment_image} />
            <h1>{comment_creator}</h1> 
        </div>

        <p>{comment}</p>

      </div>
    </li>
  )
};

export default CommentsPageCard;
