import React, { useContext, useState } from 'react';
import './MainAdminPage.css';
import img from '../../Assets/images/chatgpt_image.jpg';
import ReportSection from './ReportsSection';
import Comments from '../../components/Comments/Comments';
import ModerateSection from './ModerateSection';
import ActivitiesSection from './ActvitiesSection';
import AdminsSection from './AdminsSections';
import BlocksSection from './BlocksSection';
import { DataContext } from '../../DataContext';

const MainAdminPage = () => {

    const [isReport, setIsReport] = useState(false);
    const [isModerates, setIsModerates] = useState(false);
    const [isActivities, setIsActivities] = useState(false);
    const [isAdmins, setIsAdmins] = useState(false);
    const [isBlocks, setIsBlocks] = useState(false);
    const [isComments, setIsComments] = useState(false);
    const { role } = useContext(DataContext);

    const settingReport = () => setIsReport(true);
    const settingModerates = () => setIsModerates(true);
    const settingActivities = () => setIsActivities(true);
    const settingAdmins = () => setIsAdmins(true);
    const settingBlocks = () => setIsBlocks(true);

    const [sections, setSections] = useState([
       {bgclr: "grey", clr: "white", val: "Reports", method: settingReport},
       {bgclr: "green", clr: "white", val: "Moderates", method: settingModerates},
       {bgclr: "blue", clr: "white", val: "Activities", method: settingActivities},
       {bgclr: "purple", clr: "white", val: "Admins", method: settingAdmins},
       {bgclr: "orange", clr: "black", val: "Blocks", method: settingBlocks}
    ]);
    
  return (

    <div className='MainAdminPageContainer'>

        {(role === "admin" || role === "owner") && <div className='sectionsContainer'>

            <Comments setIsComments={setIsComments}/>

            {!isReport && !isModerates && !isActivities && !isAdmins && !isBlocks && <ul>
                {sections.map((item) => (
                    <li 
                    className='sectionCard'
                    style={{background: item.bgclr}}
                    onClick={item.method}
                    >
                        <img src={img} />
                        <h2 style={{color: item.clr}}>{item.val} page</h2>
                    </li>
                ))}
            </ul>}

            {isReport && <ReportSection setIsReport={setIsReport} isReport={isReport}/>}

            {isModerates && <ModerateSection setIsModerates={setIsModerates} isModerates={isModerates}/>}

            {isActivities && <ActivitiesSection setIsActivities={setIsActivities} isActivities={isActivities}/>}

            {isAdmins && <AdminsSection setIsAdmins={setIsAdmins} isAdmins={isAdmins}/>}

            {isBlocks && <BlocksSection setIsBlocks={setIsBlocks} isBlocks={isBlocks}/>}

        </div>}
      
    </div>
  )

};

export default MainAdminPage;
