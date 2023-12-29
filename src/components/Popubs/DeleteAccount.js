import React, { useContext, useRef, useState } from 'react';
import './DeleteAccount.css';
import loadingIcon from '../../Assets/icons/loadingGif.gif';
import ReCAPTCHA from 'react-google-recaptcha';
import { deleteAccount } from '../../logic/api';
import { DataContext } from '../../DataContext';
import { useNavigate } from 'react-router-dom';


const DeleteAccount = ({isDeleteAccount, setIsDeleteAccount}) => {

    const [readThisBeforeDeletion, setReadThisBeforeDeletion] = useState([
        {id: 1, val: "Your whole profile will be deleted", selected: false},
        {id: 2, val: "All your posts will be deleted", selected: false},
        {id: 3, val: "All messages & contacts will be deleted", selected: false},
        {id: 4, val: "All comments & likes will be deleted", selected: false},
    ]);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const { setUserID, setUserUsername, setProfileImageName } = useContext(DataContext);
    const reCaptchaRef = useRef(null);
    const navigate = useNavigate();

    const handleDeleting = async() => {

        try{

            if(isDeleted) return setError("Your account had already been deleted");

            const reCaptchaToken = reCaptchaRef?.current?.getValue() ? reCaptchaRef.current.getValue() : null;
            console.log("Captcha token: ", reCaptchaToken);
            reCaptchaRef.current.reset();

            if(!reCaptchaToken){ 
                setError("Verify you are not a robot");
                return;
            }

            for (let i = 0; i < readThisBeforeDeletion.length; i++) {
                if(readThisBeforeDeletion[i].selected !== true) 
                    return setError(`please check: ${readThisBeforeDeletion[i].val}`);                
            };

            setIsDeleting(true);

            const res = await deleteAccount();

            if(!res?.ok || res.ok === false) {
                setError(res.dt);
                setIsDeleting(false);
                return;
            };

            setIsDeleted(true);
            setUserID("");
            setUserUsername("");
            setProfileImageName("");
            navigate('/sign');


        } catch(err){
            console.log(err.message);
            setError(err.message);
            setIsDeleting(false);
        }

    };

    return (
        <div className='DeleteAccountContainer' style={{display: isDeleteAccount === true ? "flex" : "none" }}>

            <div className='DeleteAccount'>

                {(isDeleting === false && isDeleted === false) ? (<div className='DeleteAccountDiv'>

                    <h2>Are you sure you want to permently delete your account ?</h2>
                    
                    <ul>
                        {readThisBeforeDeletion.map((item) => (
                            <li key={item.id}>
                                <input type='checkbox' onChange={(e) => {
                                    if(e.target.checked){
                                        const arr = readThisBeforeDeletion;
                                        for (let i = 0; i < arr.length; i++) {
                                            if(arr[i] === item){
                                                arr[i].selected = true;
                                                setReadThisBeforeDeletion(arr);
                                            }                                        
                                        }
                                    } else {
                                        const arr = readThisBeforeDeletion;
                                        for (let i = 0; i < arr.length; i++) {
                                            if(arr[i] === item){
                                                arr[i].selected = false;
                                                setReadThisBeforeDeletion(arr);
                                            }                                        
                                        }
                                    }
                                }}/>
                                <p>{item.val}</p>
                            </li>
                        ))}
                    </ul>

                    <ReCAPTCHA sitekey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' ref={reCaptchaRef}/>
            
                    <div className='buttons'>
                        <button onClick={() => setIsDeleteAccount(false)}>Cancel</button>
                        <button onClick={() => handleDeleting()} style={{background: "orange", color: "white"}}>Delete</button>
                    </div>

                    <p style={{color: "red"}}>{error}</p>
                    
                </div>) : ((isDeleting === true && isDeleted === false) ?
                    (   <div className='deletingDiv'>
                            <img src={loadingIcon}/>
                            <h3>please wait while we Deleting your account</h3>
                        </div>) : (
                        <div className='deletingDiv'>
                            <h3>your account had been deleted, thank you for your experience</h3>
                        </div>
                    )
                )}

            </div>

        </div>
    )
};

export default DeleteAccount;
