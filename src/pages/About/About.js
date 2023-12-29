import React, { useState } from 'react';
import './About.css';
import ReactLogo from '../../Assets/icons/react-logo.png';
import NodeJsLogo from '../../Assets/icons/nodejs-logo.svg';
import MongoDBLogo from '../../Assets/icons/mongodb-logo.svg';
import ExpressLogo from '../../Assets/icons/express-logo.svg';
import CloudStorageLogo from '../../Assets/icons/cloud-storage-logo.svg';
import Svgs from '../../Assets/icons/Svgs';
import { Link } from 'react-router-dom';

const About = () => {

    const [techs, setTechs] = useState([
        {id: 0, name: "ReactJs", logo: ReactLogo},
        {id: 1, name: "NodeJs", logo: NodeJsLogo},
        {id: 2, name: "MongoDB", logo: MongoDBLogo},
        {id: 3, name: "ExpressJS", logo: ExpressLogo},
        {id: 4, name: "Cloud Storage", logo: CloudStorageLogo}
    ]);
    const [instructions, setInstructions] = useState([
        {id: 0, text: "Go to the sign page, you can create an account with email and password or you can do it with google, if you decide to create account with email and password then fill the feilds, there is a code will be sent to your email."},
        {id: 1, text: "then go to the profile page and edit your profile as you like (click the edit icon), then submit with button in the far top."},
        {id: 2, text: "There is a lot of things you can do in the website like:"},
        {id: 3, text: "Create and publish a post (go to profile page)."},
        {id: 4, text: "Comment on posts (press comment icon on any post)."},       
        {id: 5, text: "Like a post (like button)."},
        {id: 6, text: "See other users profile (click on there names)."},
        {id: 7, text: "Report post, comment, issue or user (Report button)."},
        {id: 8, text: "Chat to other users (Go to user profile and click message icon on the bottom right)."},
        {id: 9, text: "Make contacts and freinds."},
        {id: 10, text: "If you are interested You can use the test account found in Login page (test account) in the top right."},
    ]);
    const [techsConcepts, setTechsConcepts] = useState([
        {id: 0, text: "This website designed with a big eye on Security"},
        {id: 1, text: "The frontend developed with ReactJS framework."},
        {id: 2, text: "The Backend developed with NodeJS & ExpressJS frameworks."},
        {id: 3, text: "The database used is MongoDB."},
        {id: 4, text: "Api is secured with headers and cookies."},       
        {id: 5, text: "Responsive UI, the website is well displayed on desktop and mobile devices."},
        {id: 6, text: "We used Github."},
        {id: 7, text: "The website is 99% completed, it is ready to be part of your business."},
        {id: 8, text: "We used Photoshop and Iluustrator for designing."},
        {id: 9, text: "We handled a lot of security & vulnabirities threats, like XSS, Brute force, CSRF ...etc."},
        {id: 10, text: "We implement a logger for every event or errors, ex: when you request to login, it will get logged."}
    ]);
    const [ownerContacts, setOwnerContacts] = useState([
        {id: 0, name: "Facebook", url: "https://www.facebook.com/elgade.websites"},
        {id: 1, name: "Whatsapp", url: "https://wa.me/message/QKT6HSLXTXL7J1"},
        {id: 2, name: "Gmail", url: ""}
    ]);

  return (

    <div className='AboutContainer'>

        <h1>About this website</h1>

        <div className='About'>

            <h2>How to begin using the website</h2>

            <ul className='instructions'>
                {instructions.map((item) => (
                    <li key={item.id}>
                        {item.text}
                    </li>
                ))}
            </ul>

            <h2>Technolgies used</h2>

            <div className='techs'>
                <ul>
                    {techs.map((item) => (
                        <li key={item.id}>
                            <img src={item.logo} alt=''/>
                            <p>{item.name}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <ul className='instructions'>
                {techsConcepts.map((item) => (
                    <li key={item.id}>
                        {item.text}
                    </li>
                ))}
            </ul>

            <div className='ownerContacts'>

                <h3>Contact Us</h3>

                <ul>
                    {ownerContacts.map((item) => (
                        <li key={item.id}>
                            <Link to={item.url}>
                                <Svgs type={item.name}/>
                                <p>{item.name}</p>
                            </Link>
                        </li>
                    ))}
                </ul>

            </div>
            
        </div>
      
    </div>
  
  )
}

export default About;
