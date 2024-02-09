import React, { useContext, useEffect, useState } from 'react';
import './ShareAccount.css';
import { DataContext } from '../../DataContext';
import Svgs from '../../Assets/icons/Svgs';

const ShareAccount = ({ setIsShareAccount, isShareAccount }) => {

    const base_url = 'https://dynamic-mousse-7027f8.netlify.app';
    const { userID } = useContext(DataContext);
    const [isCopied, setIsCopied] = useState(false);
    const myUrl = `${base_url}/profile/${userID}`;

    const copyText = () => {

        navigator.clipboard.writeText(myUrl);
        setIsCopied(true);

    };

    useEffect(() => {
        setIsCopied(false);
    }, [isShareAccount]);

    return (
        <div className='ShareAccountContainer' style={{
            display: isShareAccount ? null : "none"
        }}>

            <div className='exitDiv' onClick={() => setIsShareAccount(false)}>
                <Svgs type={"Exit"}/>
            </div>

            <div className='ShareAccount'>
                <h1>This is your profile url, share it wisely</h1>
                <div>
                    <p>{myUrl}</p>
                    <span onClick={copyText} className={isCopied ? "copied" : null}>
                        <Svgs type={isCopied ? "Done" : "Copy"}/>
                    </span>
                </div>
            </div>
        
        </div>
    )
}

export default ShareAccount
