import React, { useContext, useEffect, useState } from 'react';
import './ReportProfile.css';
import Svgs from '../../Assets/icons/Svgs';
import image from '../../Assets/images/bg.jpg';
import { DataContext } from '../../DataContext';
import { Link, useNavigate } from 'react-router-dom';
import { deleteActivity, deleteReport, sendMessage } from '../../logic/api';

const ReportProfile = ({ adminUsername, reportId, moderateId, profilePic, profileUserId, ownerUsername, shortDescription, details, moreDescription, skills, contacts }) => {

    const [isMenu, setIsMenu] = useState(false);
    const [isWarning, setIsWarning] = useState(false);
    const [warnText, setWarnText] = useState("");
    const [result, setResult] = useState("");
    const { 
        userID, set_navigateTo_userID, setIsMyProfile, setIsBlockUser, setObjectId, setActivityName
    } = useContext(DataContext);
    const navigate = useNavigate();

    const blockUser = () => {

        set_navigateTo_userID(profileUserId);

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

    const warnUser = async() => {

        try {

            if(!warnText || warnText.length <= 0) return setResult("Please write a text to send");

            const res = await sendMessage(adminUsername, profileUserId, warnText);

            if(!res || res.ok !== true) { 
                setResult(res.dt ? res.dt : "Error sending the message");
                return;
            };

            setResult("Message sent successfully");

            setIsWarning(false);
            setWarnText("");

            deleteHandledReport();

        } catch(err) {
            console.log(err.message);
        }

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

        <div className='ReportPorfile'>
            
            <p>{result}</p>

            <div className='profileOwner'>

                <img src={`https://f003.backblazeb2.com/file/mosocial-all-images-storage/${profilePic}`}/>

                <h2 onClick={() => navigateToProfile(profileUserId)}>{ownerUsername}</h2>

                <div className='menu'>
                    <Svgs type={"ThreeDotsMenu"} on_click={() => setIsMenu(!isMenu)}/>
                    <ul style={{scale: isMenu ? "1 1" : "1 0"}}>
                        <li onClick={() => setIsWarning(!isWarning)}>Warn</li>
                        <li onClick={blockUser}>Block</li>
                    </ul>
                </div>

            </div>

            <div className='contentInfo'>

                <p>Username -- {ownerUsername}</p>

                <p>Short Description -- {shortDescription}</p>

                <p>More Description -- {moreDescription}</p>

                {details && 
                <><p>Details: </p>
                <ul>
                    {details.map((item) => (
                        <li>{item.title} -- {item.value},</li>
                    ))}
                </ul></>}

                {skills && <><p>Skills: </p>
                <ul>
                    {skills.map((item) => (
                        <li>{item.name} -- {item.percentage},</li>
                    ))}
                </ul></>}

                {contacts && <><p>Contacts: </p>
                <ul>
                    {contacts.map((item) => (
                        <li>{item.name_of_app} -- <Link to={item.url}>{item.url}</Link>,</li>
                    ))}
                </ul></>}

            </div>

            {isWarning && <div className='warnTextInput'>
                <input type='text' placeholder='Send message to this user' onChange={(e) => setWarnText(e.target.value)}/>  
                <div className='warnbuttons'>
                    <h3 onClick={() => {setIsWarning(false); setWarnText("")}}>Cancel</h3>
                    <h3 onClick={warnUser} 
                    style={{background: warnText.length > 0 ? "#5039ff" : null,
                    color: warnText.length > 0 ? "white" : null}}>Send</h3>
                </div>
            </div>}

        </div>

    )
};

export default ReportProfile;
