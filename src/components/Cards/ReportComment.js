import React, { useContext, useEffect, useState } from 'react';
import './ReportComment.css';
import Svgs from '../../Assets/icons/Svgs';
import { DataContext } from '../../DataContext';
import { useNavigate } from 'react-router-dom';
import { deleteCommentAdmin, deleteReport } from '../../logic/api';
import DeleteObjectAdmin from '../Delete/DeleteObjectAdmin';

const ReportComment = ({ commentId, postId, commenter_id, commenter_name, comment_text, commenter_image, reportId }) => {

    const [isMenu, setIsMenu] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [reason, setReason] = useState("");
    const [result, setResult] = useState("");
    const { 
        userID, set_navigateTo_userID, setIsMyProfile, setIsBlockUser, setObjectId, setPostID
    } = useContext(DataContext);
    const navigate = useNavigate();

    const deleteComment = async() => {
       
        try {

            if(!reason || reason.length <= 0) return setResult("Please write a reason why you will delete this comment");
            
            setResult("deleting comment");

            setIsDeleting(true);

            console.log("commentid: ", commentId, " report id: ", reportId);

            const res = await deleteCommentAdmin(commentId, reason);

            if(!res || res.ok !== true) { 
                setResult(`failed to delete comment ${res.dt}`);
                setIsDeleting(false);
                return;
            };

            setResult("comment deleted successfully");

            setIsDeleted(true);

            setIsDelete(false);

            setIsDeleting(false);

            deleteHandledReport();

        } catch(err) {
            setResult(err.message);
            setIsDeleting(false);
        }

    };

    const blockUser = () => {

        set_navigateTo_userID(commenter_id);

        setIsBlockUser(true);

        setObjectId(reportId);

    };

    const navigateToPost = () => {
        
        setPostID(postId);

        navigate('/single-post');

    };

    const deleteHandledReport = async() => {

        try {

            const res = await deleteReport(reportId);

            if(!res || res.ok !== true){
                return;
            };

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

    useEffect(() => {
        if(!isDelete) setReason("");
    }, [isDelete]);

    return (

        <div className='comment'>

            <p style={{background: "transparent", 
            padding: 0, 
            marginBottom: result.length > 0 ? 12 : 0,
            fontSize: "1.25rem", fontWeight: 600, color: 'grey'}}>{result}</p>

            <div className='creator'>

            <img src={`https://f003.backblazeb2.com/file/mosocial-all-images-storage/${commenter_image}`} />
            <h2 onClick={() => navigateToProfile(commenter_id)}>{commenter_name}</h2>

            <div className='menu'>
                <Svgs type={"ThreeDotsMenu"} on_click={() => setIsMenu(!isMenu)}/>
                <ul style={{scale: isMenu ? "1 1" : "1 0"}}>
                <li onClick={() => setIsDelete(!isDelete)}>Delete</li>
                <li onClick={navigateToPost}>Posts</li>
                <li onClick={blockUser}>Block</li>
                </ul>
            </div>

            </div>

            <p>{comment_text}</p>

            {isDelete && <DeleteObjectAdmin handleDelete={deleteComment} isDeleting={isDeleting} objectType={"comment"}
            reason={reason} setReason={setReason} setIsDeleting={setIsDeleting} setIsDelete={setIsDelete}/>}

        </div>

    )
};

export default ReportComment;
