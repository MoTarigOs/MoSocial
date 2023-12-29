import React, { useContext, useEffect, useState } from 'react';
import './BlockUser.css';
import { DataContext } from '../../DataContext';
import { blockUserAdmin, deleteActivity, deleteAdmin, deleteReport, makeAdmin } from '../../logic/api';
import loadingAnimation from '../../Assets/icons/loadingGif.gif';

const BlockUser = () => {

    const [result, setResult] = useState("");
    const [duration, setDuration] = useState("");
    const [reason, setReason] = useState("");
    const [isBlocking, setIsBlocking] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const { 
        isBlockUser, setIsBlockUser, navigateTo_userID, 
        set_navigateTo_userID, objetcId, setObjectId, activityName, setActivityName
    } = useContext(DataContext);

    const blockUser = async() => {

        try {

            console.log("id: ", navigateTo_userID, "duration: ", duration, " reason: ", reason);

            if(!duration || duration < (24 * 60 * 60 * 1000)) return setError("duration error");
          
            if(!reason || reason.length <= 0) return setError("reason error");

            setResult("blocking user ...");

            setIsBlocking(true);

            const res = await blockUserAdmin(navigateTo_userID, reason, duration);

            if(!res || res.ok !== true) {
                setResult("failed to block the user");
                setError(res.dt);
                console.log(res.dt);
                setIsBlocking(false);
                return;
            }

            setIsBlocking(false);
            setIsBlocked(true);
            setError("");

            deleteHandledReport();

        } catch(err) {
            setError(err.message);
        }

    };

    const deleteHandledReport = async() => {

        try {

            if(activityName === "report") await deleteReport(objetcId);

            if(activityName === "moderate") await deleteActivity(objetcId);

            if(activityName === "admin") await deleteAdmin(objetcId);

        } catch(err) {
            console.log(err.message);
        }
    };

    const askToBeAnAdmin = async() => {

        try{

            setIsBlocking(true);

            const res = await makeAdmin(reason, email);

            if(!res || res.ok !== true) {
                setIsBlocking(false);
                setError(res.dt);
                setTimeout(() => {
                    setError("");
                }, 5000);
                return;
            };

            setIsBlocking(false);
            setIsBlocked(true);

        } catch(err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if(!isBlockUser){
            setDuration("");
            setReason("");
            setResult("");
            setError("");
            set_navigateTo_userID("");
            setIsBlocking(false);
            setIsBlocked(false);
            setObjectId("");
            setActivityName("");
            setEmail("");
        }
    }, [isBlockUser]);

    return (

        <div className='BlockUserContainer' style={{display: isBlockUser ? "flex" : "none" }}>

            {!isBlocking && activityName !== "be an admin" && !isBlocked && <div className='BlockUser'>
                
                <h2>Do you want to block this user from using the website ?</h2>

                <p>{result}</p>

                <label style={{color: error === "duration error" ? "red" : null}}>
                    {error === "duration error" ? 
                    "please select a duration for the block" 
                    : "Block duration "}</label>
                <select placeholder={reason} onChange={(e) => setDuration(e.target.value)}>
                    <option value={0}></option>
                    <option value={1 * 24 * 60 * 60 * 1000}>1 day</option>
                    <option value={7 * 1 * 24 * 60 * 60 * 1000}>1 week</option>
                    <option value={30.5 * 1 * 24 * 60 * 60 * 1000}>1 month</option>
                    <option value={6 * 30.5 * 1 * 24 * 60 * 60 * 1000}>6 months</option>
                    <option value={365 * 1 * 24 * 60 * 60 * 1000}>1 year</option>
                    <option value={10 * 365 * 1 * 24 * 60 * 60 * 1000}>10 years</option>
                    <option value={100 * 365 * 1 * 24 * 60 * 60 * 1000}>Forever</option>
                </select>

                <label style={{color: error === "reason error" ? "red" : null}}>
                    {error === "reason error" ? 
                    "please write a reason for the block" 
                    : "Reason for block "}</label>
                <input 
                placeholder='Why do you want to block this user?' 
                type='text'
                onChange={(e) => setReason(e.target.value)}/>

                <div className='buttons'>
                    <button onClick={() => setIsBlockUser(false)}>Cancel</button>
                    <button onClick={blockUser} 
                    style={{background: (!reason || reason.length <= 0 || !duration || duration === 0) 
                        ? null : "#5147ff",
                    color: (!reason || reason.length <= 0 || !duration || duration === 0) 
                    ? null : "white"}}>Block</button>
                </div>

            </div>}

            {isBlocking && !isBlocked && <div className='blocking'>
                    <img src={loadingAnimation}/>    
                </div>}

            {isBlocked && <div className='blocked'>
                <p>{activityName === "be an admin" 
                ? "Your request sent successfully, we will sent an email to you as soon as possible." 
                : "This user blocked successfully"}</p>
                <button onClick={() => setIsBlockUser(false)}>Exit</button>
            </div>}

            {!isBlocking && !isBlocked && activityName === "be an admin" && <div className='BlockUser'>
                
                <h2>Be an Admin and help us grow the website</h2>

                {error.length > 0 && <p style={{background: '#ff3a3a', color: '#f3f3f3', padding: 12, borderRadius: 4, lineBreak: 'anywhere'}}>{error}</p>}

                <label>Write something to the owner (optional)</label>
                <input placeholder='Why we should make you an admin ?' 
                onChange={(e) => setReason(e.target.value)}/>

                <label>Enter email where we can respond to you (optional)</label>
                <input placeholder='Enter an email' 
                onChange={(e) => setEmail(e.target.value)}/>

                <div className='buttons'>
                    <button onClick={() => setIsBlockUser(false)}>Cancel</button>
                    <button onClick={askToBeAnAdmin} 
                    style={{background: "#5147ff", color: "white"}}>Send</button>
                </div>
                
            </div>}

        </div>
    )
};

export default BlockUser;
