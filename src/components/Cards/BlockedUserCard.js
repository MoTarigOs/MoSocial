import React, { useContext, useEffect, useState } from 'react';
import './BlockedUserCard.css';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../DataContext';
import adminPic from '../../Assets/icons/admin.png';
import profilePic from '../../Assets/icons/profile-circle-svgrepo-com.svg';
import Svgs from '../../Assets/icons/Svgs';
import { unBlockUserAdmin } from '../../logic/api';

const BlockedUserCard = ({ key, adminId, adminUsername, blockedUserId, blockedUsername, reason, dateOfUnBlock }) => {
    
    const { 
        userID, set_navigateTo_userID, setIsMyProfile
    } = useContext(DataContext);
    const [isMenu, setIsMenu] = useState(false);
    const navigate = useNavigate();
    const [result, setResult] = useState("");
    const [remainigTime, setRemainigTime] = useState(0);

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

    const unBlockUser = async() => {
        
        try {

            const res = await unBlockUserAdmin(blockedUserId);

            if(!res || res.ok !== true) return setResult(res.dt);

            setResult("user un blocked");

        } catch(err) {
            console.log(err.message);
        }
    };

    useEffect(() => {

        const time = dateOfUnBlock - Date.now();

        setRemainigTime(time);

    }, []);


    return (

        <li key={key} className='blockedUser'>
            
            <div className='blockHeader'>
                <img src={adminPic}/>
                <h2 onClick={() => navigateToProfile(adminId)}>{adminUsername}</h2>
            </div>

            <h3>{result}</h3>
            
            <div className='blockedUser'>

                <div className='blockHeader'>
                    <img src={profilePic}/>
                    <h2 onClick={() => navigateToProfile(blockedUserId)}>{blockedUsername}</h2>
                    <div className='menu'>
                    <Svgs type={"ThreeDotsMenu"} on_click={() => setIsMenu(!isMenu)}/>
                    <ul style={{scale: isMenu ? "1 1" : "1 0"}}>
                        <li onClick={unBlockUser}>Unblock</li>
                    </ul>
                </div>
                </div>

                {remainigTime > 0 ? <div className='unBlock'>
                <p>{Math.floor(remainigTime/1000/60/60/24)} days remaining to get un-blocked</p>
                </div> : <div className='unBlock'> 
                    <p>Time for unblock passed, un-block this user?</p> 
                    <button onClick={unBlockUser}>Un-Block</button>
                </div>}

                <label>Reason for block</label>
                <p>{reason}</p>

            </div>

        </li>

    )
}

export default BlockedUserCard;
