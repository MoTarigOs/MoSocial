import React, { useContext, useState } from 'react';
import './ReportChat.css';
import Svgs from '../../Assets/icons/Svgs';
import { DataContext } from '../../DataContext';
import { useNavigate } from 'react-router-dom';
import { deleteMessageAdmin, deleteReport } from '../../logic/api';

const ReportChat = ({ reportId, messageId, senderId, profilePic, username, text, createdAt, isNoObj }) => {

    const [isMenu, setIsMenu] = useState(false);
    const [result, setResult] = useState("");
    const { 
        userID, set_navigateTo_userID, setIsMyProfile, setIsBlockUser, setObjectId
    } = useContext(DataContext);
    const navigate = useNavigate();

    const deleteMessage = async() => {
        
        try { 

            const res = await deleteMessageAdmin(messageId, senderId, text);

            if(!res || res.ok !== true) { 
                setResult("Error deleting the message");
                console.log(res.dt);
                return;
            };

            setResult("Message deleted successfully");

            deleteHandledReport();

        } catch(err) {
            setResult(err.message);
            console.log(err.message);
        }
    };

    const blockUser = () => {

        set_navigateTo_userID(senderId);

        setIsBlockUser(true);

        setObjectId(reportId);

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

    return (

        <div className='ReportChat'>
            
            <p>{result}</p>

            <div className='messageCreator'>

                <img src={profilePic}/>

                <h2 onClick={() => navigateToProfile(senderId)}>{username}</h2>

                <div className='menu'>
                    <Svgs type={"ThreeDotsMenu"} on_click={() => setIsMenu(!isMenu)}/>
                    <ul style={{scale: isMenu ? "1 1" : "1 0"}}>
                        <li onClick={deleteMessage}>Delete</li>
                        <li onClick={blockUser}>Block</li>
                    </ul>
                </div>

            </div>

            <div className='chatReportContent'>
                <p>{text}</p>
                <h4>{createdAt}</h4>
            </div>
            
        </div>

    )
};

export default ReportChat;
