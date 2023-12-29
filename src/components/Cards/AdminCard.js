import React, { useContext, useState } from 'react';
import './AdminCard.css';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../DataContext';
import adminPic from '../../Assets/icons/admin.png';
import Svgs from '../../Assets/icons/Svgs';
import { deleteAdmin, sendMessage } from '../../logic/api';

const AdminCard = ({ key, userId, username, numOfBlocks, numOfDeletion }) => {
    
    const { 
        userID, set_navigateTo_userID, setIsMyProfile, role, setObjectId, setActivityName, setIsBlockUser
    } = useContext(DataContext);
    const [isWarning, setIsWarning] = useState(false);
    const [warnText, setWarnText] = useState("");
    const [isMenu, setIsMenu] = useState(false);
    const navigate = useNavigate();
    const [result, setResult] = useState("");

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
    
    const removeAdmin = async() => {

        setResult("remove admin");

        try {

            const res = await deleteAdmin(userId);

            if(!res || res.ok !== true){
                setResult(res.dt);
                return;
            };

            setResult("Admin deleted Successfully");

        } catch(err) {
            console.log(err.message);
        }
    };

    const blockUser = () => {

        set_navigateTo_userID(userId);

        setObjectId(key);
        setActivityName("admin");

        setIsBlockUser(true);

    };

    const warnUser = async() => {

        try {

            if(userID === userId) return setResult("Can't send message to yourself");

            if(!warnText || warnText.length <= 0) return setResult("Please write a text to send");

            const res = await sendMessage(username, userId, warnText);

            if(!res || res.ok !== true) { 
                setResult(res.dt ? res.dt.message : "Error sending the message");
                return;
            };

            setResult("Message sent successfully");

            setIsWarning(false);
            setWarnText("");

        } catch(err) {
            console.log(err.message);
        }

    };

    return (

        <li key={key} className='admin'>
            
            <div className='adminHeader'>
                <img src={adminPic}/>
                <h2 onClick={() => navigateToProfile(userId)}>{username}</h2>
                <div className='menu'>
                    <Svgs type={"ThreeDotsMenu"} on_click={() => setIsMenu(!isMenu)}/>
                    <ul style={{scale: isMenu ? "1 1" : "1 0"}}>
                        {role === "owner" && <li onClick={removeAdmin}>Remove</li>}
                        <li onClick={() => setIsWarning(true)}>Warn</li>
                        <li onClick={blockUser}>Block</li>
                    </ul>
                </div>
            </div>

            {result.length > 0 && <p>{result}</p>}
            
            <div className='adminDetails'>
                <div>
                    <p>Number of Blocks</p>
                    <span>{numOfBlocks}</span>
                </div>
                <div>
                    <p>Number of Deletions</p>
                    <span>{numOfDeletion}</span>
                </div>
            </div>
            
            {isWarning && <div className='warnTextInput'>
                <input type='text' placeholder='Send message to this admin' onChange={(e) => setWarnText(e.target.value)}/>  
                <div className='warnbuttons'>
                    <button onClick={() => {setIsWarning(false); setWarnText("")}}>Cancel</button>
                    <button onClick={warnUser} 
                    style={{background: warnText.length > 0 ? "#5039ff" : null,
                    color: warnText.length > 0 ? "white" : null}}>Send</button>
                </div>
            </div>}

        </li>

    )
}

export default AdminCard;
