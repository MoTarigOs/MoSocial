import React, { useState, useContext, useEffect } from 'react';
import { getContacts, updateContact } from '../../logic/api';
import { DataContext } from '../../DataContext';
import './Contacts.css';
import ContactCard from '../../components/Cards/ContactCard';
const Contacts = ({ setIsChat, isChat }) => {

    const [runOnce, setRunOnce] = useState(false);
    const { contacts, setContacts } = useContext(DataContext);

    const fetchContacts = async() => {

        try{

            const res = await getContacts();

            if(!res || !res?.ok || res.ok === false) return;

            setContacts(res.dt ? res.dt : []);

            console.log("fetched contacts: ", res.dt);

        } catch(err){
            console.log(err.message);
        }

    };

    const updateSeenMessages = async(contactID) => {

        try{

            if(!contactID || contactID === "") return

            const res = await updateContact(contactID);

            if(!res || !res?.ok || res.ok === false) return;

            const newArray = contacts;

            for (let i = 0; i < newArray.length; i++) {
                if(newArray[i]._id === contactID){
                    newArray[i].new_messages = 0;
                }
            };
            
            setContacts(newArray);

        } catch(err){
            console.log(err.message);
        }

    };

    useEffect(() => {
        setRunOnce(true);
    }, []);

    useEffect(() => {
        if(runOnce === true) fetchContacts();
    }, [runOnce]);

  return (
    <div className='ContactsPage'>

        <div className='Contacts'>
            
            <ul>

                {contacts.map(contact => (
                    <ContactCard 
                        key={contact._id} 
                        id={contact._id}
                        contact_id={contact.contact_id}
                        user_id={contact.user_id}
                        pic={contact.contact_image}
                        username={contact.contact_username}
                        new_messages={contact.new_messages}
                        created_at={contact.createdAt}
                        setIsChat={setIsChat}
                        updateSeenMessages={updateSeenMessages}
                    />
                ))}
            </ul>
        </div>
        
    </div>
  )
};

export default Contacts;
