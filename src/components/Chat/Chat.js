import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../DataContext';
import { getChats, sendMessage, deleteMessage, createContact } from '../../logic/api';
import { getBadWords, setClientOnChats } from '../../logic/helperMethods';
import './Chat.css';
import { motion } from 'framer-motion';
import Svgs from '../../Assets/icons/Svgs';
import image from '../../Assets/images/idea_image.jpg';
import useInterval from '../../logic/CustomHooks/useInterval';

const Chat = ({ isChat, setIsChat, setIsSelected, isSelected, setIsReport, isMobile }) => {

    const textToSendRef = useRef();
    const chatsListRef = useRef();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [chats, setChats] = useState([]);
    const [runOnce, setRunOnce] = useState([]);
    const [isAddedContact, setIsAddedContact] = useState(null);
    const [delay, setDelay] = useState(null);
    const { 
        userID, navigateTo_userID, 
        navigateTo_userUsername, contacts, setContacts, 
        setIsMyProfile, navigateTo_userProfilePic,
        setReportOnThisId, setReportType
    } = useContext(DataContext);
    const navigate = useNavigate();

    const sendText = async() => {

        try{

            const text = textToSendRef.current.value;

            if(!text || text === "") return setError("Message can't be empty");

            const testForBadWords = getBadWords(text);

            if(testForBadWords.length > 0) {
                let er = "";
                for (let i = 0; i < testForBadWords.length; i++) {
                    if(i !== testForBadWords.length - 1){
                        er += `"${testForBadWords[i]}", `;
                    } else {
                        er += `"${testForBadWords[i]}"`;
                    }
                }
                setError("This is bad words: ", er);
                return;
            };

            setSendingMessage(true);

            const res = await sendMessage(navigateTo_userID, text);

            if(!res || !res.ok || res.ok === false) return setError(res.dt ? res.dt : "Error sending message please refresh the page or login to your account");

            const fetchedChat = setClientOnChats(res.dt, userID);

            setChats([...chats, fetchedChat]);

        } catch(err){
            console.log(err.message);
        }

    };

    const fetchChat = async() => {

        try{

            if(!userID || !navigateTo_userID) return setError("Error please refresh the website");

            const res = await getChats(navigateTo_userID);

            if(!res || !res.ok || res.ok === false) return setError(res.dt ? res.dt : "not-known error");

            if(res.dt){
                const fetchedChat = setClientOnChats(res.dt, userID);
                setChats(fetchedChat);
                setError("");
            } else {
                setError("No Chats Found!");
                setChats([]);
            }

            setLoading(false);

        } catch(err){
            console.log(err.message);
            setError(err.message);
        }
        
    };

    const deleteChat = async(messageID) => {

        try{

            for (let i = 0; i < chats.length; i++) {
                if(chats[i]._id === messageID){
                    if(chats[i].sender_id !== userID) return
                }                
            };

            const res = await deleteMessage(messageID);

            if(!res || !res.ok || res.ok === false) return setError(res.dt ? res.dt : "Error deleting this message please try again");

            setChats(
                chats.filter(item => item._id !== messageID)
            );

        } catch (err){
            console.log(err.message);
        }

    };

    const createNewContact = async() => {

        try{

            const contactID = navigateTo_userID;

            if(!contactID || contactID === "") return setError("Error Creating the contact");

            const res = await createContact(contactID);

            if(!res || !res.ok || res.ok === false) return setError(res.dt ? res.dt : "Error Creating the contact");

            setIsAddedContact(true);

            if(res.dt) setContacts([res.dt, ...contacts])

        } catch (err){
            console.log(err.message);
        }
    };

    const isExistContact = () => {

        for (let i = 0; i < contacts.length; i++) {

            if(contacts[i].contact_id === navigateTo_userID) return setIsAddedContact(true);
            
        };

        setIsAddedContact(false);

    };

    const navigateToProfile = async() => {
        try{

            if(isSelected === "Profile"){
                setIsChat(false);
            };

            if(userID === navigateTo_userID){
                setIsMyProfile(true);
                setIsSelected("Profile");
                setIsChat(false);
            } else {
                setIsMyProfile(false);
                setIsSelected("Profile");
                setIsChat(false);
            }

            navigate(`/profile/${navigateTo_userID}`);

        } catch(err){
            console.log(err);
        }
    };

    const handleChatReport = (message_id) => {

        console.log("handle chat report function, hisId: ", navigateTo_userID, " report_objectId: ", message_id);
    
        if(navigateTo_userID.length <= 0 || message_id.length <= 0)
          return setError("Refresh the page or exit and enter again");
    
        if(!userID || userID.length <= 0) return setError("please login to your account to make a report");
    
        setReportOnThisId(message_id);
        setReportType("chat");
        setIsReport(true);
    
    };

    useEffect(() => {

        chatsListRef.current.scrollTo({
            top: 900,
            behaviour: "smooth"
        });

        for (let i = 0; i < contacts.length; i++) {
            if(contacts[i].contact_id === navigateTo_userID)
                setIsAddedContact(true);
        }

        setRunOnce(true);

    }, []);

    useEffect(() => {
        if(runOnce === true && isChat === true) {
            setDelay(10000);
        } else if(runOnce === true && isChat === false) {
            setDelay(null);
        }
        setChats([]);
        setReportType("");
        setReportOnThisId("");
        setIsAddedContact(null);
        isExistContact();
    }, [runOnce, isChat]);

    useInterval(() => {
        fetchChat();
    }, delay);

    return (
        <motion.div className='ChatContainer'
            initial={{
                y: "150vh"
            }}
            animate={{
                y: isChat === true ? 0 : "150vh"
            }}
        >

            <div className='Chat'>

                <div className='ChatHeader' style={{ display: 'flex' }}>
                    <img src={(navigateTo_userProfilePic && navigateTo_userProfilePic.length > 0) ? 
                    `https://f003.backblazeb2.com/file/mosocial-all-images-storage/${navigateTo_userProfilePic}` : null} alt=''/>
                    <h3 onClick={() => navigateToProfile()} >{navigateTo_userUsername}</h3>
                    {isAddedContact === false && <div className='addContactDiv' onClick={() => createNewContact()}>
                        {!isMobile && 'Add Contact'} <Svgs type={"addContact"}/>
                    </div>}
                    <div className='QuitChatting' onClick={() => setIsChat(false)}>
                        <Svgs type={"Exit"}/>
                    </div>
                </div>

                {error.length > 0 && <p className='error'>{error}</p>}

                <div className='ulDiv' ref={chatsListRef}>

                    <ul>
                        {chats.map((c) => (
                            <li key={c._id}>
    
                                {c.client === true ? (
                                    <div className='ChatClientDiv'>
                                        <div style={{ display: 'flex' }}>
                                            <h3>You</h3>
                                            <div className='deleteChatText' onClick={() => deleteChat(c._id)}><Svgs type={"Delete2"} /></div>
                                        </div>
                                        <p>{c.chat_text}</p>
                                    </div>
                                ) : (
                                    <div className='ChatRecieverDiv'>
                                        <div style={{ display: 'flex' }}>
                                            <h3>{c.sender_username}</h3>
                                            <button onClick={() => handleChatReport(c._id)} 
                                            >Report</button>
                                        </div>
                                        <p>{c.chat_text}</p>
                                    </div>
                                )}

                                <label style={{
                                    display: 'flex',
                                    justifyContent: c.client === true ? "start" : "end",
                                    marginLeft: c.client === true ? "4px" : null,
                                    marginRight: c.client === false ? "16px" : null
                                }}>{c.createdAt}</label>

                            </li>
                        ))}
                    </ul>

                </div>
                
                <div className='ChatSend' style={{ display: 'flex' }}>
                    <textarea placeholder='Type here' ref={textToSendRef}></textarea>
                    <div onClick={sendText}>
                        <Svgs type={"SendMessage"} />
                    </div>
                </div>

            </div>
        
        </motion.div>
    )
};

export default Chat;
