import React from 'react';
import './ReportPost.css';
import { useState } from 'react';
import Svgs from '../../Assets/icons/Svgs';
import { useContext } from 'react';
import { DataContext } from '../../DataContext';
import { useNavigate } from 'react-router-dom';
import { deleteActivity, deletePostAdmin, deleteReport } from '../../logic/api';
import DeleteObjectAdmin from '../Delete/DeleteObjectAdmin';

const ReportPost = ({ 
    postId, images, creatorId, username, profilePic, title,
    reportId, moderateId
}) => {

    const [isMenu, setIsMenu] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [reason, setReason] = useState(false);
    const [result, setResult] = useState("");
    const { 
        userID, set_navigateTo_userID, setIsMyProfile, 
        setIsBlockUser, setObjectId, setActivityName
    } = useContext(DataContext);
    const navigate = useNavigate();

    const deletePost = async() => {

        try {

            if(!reason || reason.length <= 0) return setResult("Please write a reason why you will delete this post");
            
            setResult("deleting post");

            setIsDeleting(true);

            const res = await deletePostAdmin(postId, reason);

            if(!res || res.ok !== true) { 
                setResult("failed to delete post");
                setIsDelete(false);
                setIsDeleting(false);
                return;
            };

            setResult("post deleted successfully");

            setIsDeleted(true);

            setIsDelete(false);

            setIsDeleting(false);

            deleteHandledReport();

        } catch(err) {
            setResult(err.message);
        }

    };

    const blockUser = () => {

        set_navigateTo_userID(creatorId);

        if(reportId) {
            setObjectId(reportId);
            setActivityName("report");
        };

        if(moderateId) {
            setObjectId(moderateId);
            setActivityName("moderate");
        };

        setIsBlockUser(true);

    };

    const deleteHandledReport = async() => {

        try {

            if(reportId) await deleteReport(reportId);

            if(moderateId) await deleteActivity(moderateId);

        } catch(err) {
            console.log(err.message);
        }
    };

    const navigateToProfile = (id) => {
        if(id === userID){
            set_navigateTo_userID("");
            setIsMyProfile(true);
            navigate(`/profile/${0}`);
        } else {
            set_navigateTo_userID(id);
            setIsMyProfile(false);
            navigate(`/profile/${id}`);
        }
    };

    return (

        <div className='postDiv'>

            <p>{result}</p>

            <div className='postCreator'>
                <img src={`https://f003.backblazeb2.com/file/mosocial-all-images-storage/${profilePic}`}/>
                <h2 onClick={() => navigateToProfile(creatorId)}>{username}</h2>
                <div className='menu'>
                    <Svgs type={"ThreeDotsMenu"} on_click={() => setIsMenu(!isMenu)}/>
                    <ul style={{scale: isMenu ? "1 1" : "1 0"}}>
                        <li onClick={() => setIsDelete(!isDelete)}>Delete</li>
                        <li onClick={blockUser}>Block</li>
                    </ul>
                </div>
            </div>

            <div className='images'>
                {images && images.length > 0 ? (<ul className='postCardImagesUL'>
                    {images.map((i) => (
                        <li key={i._id} style={{maxWidth: `${(100 / (100*images.length)) * 100}%`}} >
                        <img src={`https://f003.backblazeb2.com/file/mosocial-all-images-storage/${i.picturesNames}`}/>
                        </li>
                    ))}
                </ul>) : (<p>no images found</p>)}
            </div>

            <p>Title <span>
            {title}
            </span>
            </p>

            {isDelete && <DeleteObjectAdmin handleDelete={deletePost} isDeleting={isDeleting} objectType={"post"}
            reason={reason} setReason={setReason} setIsDeleting={setIsDeleting} setIsDelete={setIsDelete}/>}

        </div>
    )
};

export default ReportPost;
