import { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvidor = ({ children }) => {
    
    const [isMyProfile, setIsMyProfile] = useState(false);
    const [choosenImage, setChoosenImage] = useState(null);
    const [SOCIAL_MEDIA_PLATFORMS, SET_SOCIAL_MEDIA_PLATFORMS] = useState([
        "Facebook", "Gmail", "Whatsapp", "Instagram", "Linkedin",
        "Telegram", "YouTube", "Snapchat", "Behance", "Khamsat",
        "Freelancer", "other"
    ]);
    const [profileImageName, setProfileImageName] = useState("");
    const [userID, setUserID] = useState("");
    const [userUsername, setUserUsername] = useState("");
    const [navigateTo_userID, set_navigateTo_userID] = useState("");
    const [navigateTo_userUsername, set_navigateTo_userUsername] = useState("");
    const [postID, setPostID] = useState("");
    const [contacts, setContacts] = useState([]);
    const [paramsID, setParamsID] = useState("");
   
    return (
        <DataContext.Provider value={{
            isMyProfile, setIsMyProfile,
            choosenImage, setChoosenImage,
            SOCIAL_MEDIA_PLATFORMS, SET_SOCIAL_MEDIA_PLATFORMS,
            profileImageName, setProfileImageName,
            userID, setUserID,
            userUsername, setUserUsername,
            navigateTo_userID, set_navigateTo_userID,
            navigateTo_userUsername, set_navigateTo_userUsername,
            postID, setPostID,
            contacts, setContacts,
            paramsID, setParamsID
        }}>
            {children}
        </DataContext.Provider>
    )
};