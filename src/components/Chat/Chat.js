import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../DataContext';
import { getChats, sendMessage, deleteMessage, createContact } from '../../logic/api';
import { setClientOnChats } from '../../logic/helperMethods';
import './Chat.css';
import { motion } from 'framer-motion';
import Svgs from '../../Assets/icons/Svgs';
import image from '../../Assets/images/idea_image.jpg';

const Chat = ({ isChat, setIsChat, setIsSelected, isSelected }) => {

    const textToSendRef = useRef();
    const chatsListRef = useRef();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [chats, setChats] = useState([]);
    const [runOnce, setRunOnce] = useState([]);
    const [isAddedContact, setIsAddedContact] = useState(null);
    const { 
        userID, userUsername, navigateTo_userID, navigateTo_userUsername, contacts, setContacts, setIsMyProfile
    } = useContext(DataContext);
    const navigate = useNavigate();

    const sendText = async() => {

        try{

            setSendingMessage(true);

            const text = textToSendRef.current.value;

            if(!text || text === "") return setError("Message can't be empty");

            const res = await sendMessage(userUsername, navigateTo_userID, text);

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
        let myInterval = null;
        if(runOnce === true && isChat === true) fetchChat();
        if(isChat === false){
            setChats([]);
            clearInterval(myInterval);
        };
        if(isChat === true){
            myInterval = setInterval(() => {
                fetchChat();
            }, 10000);
        };
        setIsAddedContact(null);
        isExistContact();
    }, [runOnce, isChat]);

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

                <div className='ChatHeader'>
                    <img src={image} alt=''/>
                    <h3 onClick={() => navigateToProfile()} >{navigateTo_userUsername}</h3>
                    {isAddedContact === false && <div className='addContactDiv' onClick={() => createNewContact()}>
                        Add Contact <Svgs type={"addContact"}/>
                    </div>}
                    <div className='QuitChatting' onClick={() => setIsChat(false)}>
                        <Svgs type={"Exit"}/>
                    </div>
                </div>

                <label style={{color: 'red', background: 'white'}}>{error}</label>

                <div className='ulDiv' ref={chatsListRef}>

                    <ul >
                        {chats.map((c) => (
                            <li key={c._id}>

                                <label style={{
                                    justifyContent: c.client === true ? "start" : "end",
                                    marginLeft: c.client === true ? "4px" : null,
                                    marginRight: c.client === false ? "16px" : null
                                }}>{c.createdAt}</label>
                                
                                {c.client === true ? (
                                    <div className='ChatClientDiv'>
                                        <div>
                                            <h3>You</h3>
                                            <div className='deleteChatText' onClick={() => deleteChat(c._id)}><Svgs type={"Delete2"} /></div>
                                        </div>
                                        <p>{c.chat_text}</p>
                                    </div>
                                ) : (
                                    <div className='ChatRecieverDiv'>
                                        <h3>{c.sender_username}</h3>
                                        <p>{c.chat_text}</p>
                                    </div>
                                )}

                                
                                
                                
                                
                            </li>
                        ))}
                    </ul>

                </div>
                
                <div className='ChatSend'>
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
