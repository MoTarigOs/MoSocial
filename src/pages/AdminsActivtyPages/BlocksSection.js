import React, { useEffect, useState } from 'react';
import './BlocksSection.css';
import BlockedUserCard from '../../components/Cards/BlockedUserCard';
import Svgs from '../../Assets/icons/Svgs';
import { getBlocks } from '../../logic/api';
import { useNavigate } from 'react-router-dom';

const BlocksSection = ({ setIsBlocks, isBlocks }) => {

  const [blocks, setBlocks] = useState([]);  
  const [fetchResult, setFetchResult] = useState("");
  const [count, setCount] = useState(10);
  const [runOnce, setRunOnce] = useState(false);

  const fetchBlocks = async() => {

    try {

      const res = await getBlocks(count);

      if(!res || res.ok !== true) return setFetchResult(res.dt);

      console.log("after fetched the reports object data: ", res.dt);

      setBlocks(res.dt);

    } catch(err) {
      console.log("Error fetching moderates: ", err.message);
    }

  };

  useEffect(() => {
    setRunOnce(true);
  }, []);

  useEffect(() => {
    if(runOnce && isBlocks) fetchBlocks(count);
  }, [runOnce, isBlocks]);

  return (

    <div className='BlocksSectionContainer'>
      
      <div className='returnDiv' onClick={() => setIsBlocks(false)}>
          <Svgs type={"Exit"}/>
      </div>
      
      <div className='BlocksSection'>

        <ul>
          {blocks.map((item) => (
            <BlockedUserCard key={item.userId} adminId={item.adminId} adminUsername={item.adminUsername} 
            blockedUserId={item.blockedUserId} blockedUsername={item.blockedUsername} 
            dateOfUnBlock={item.dateOfUnBlock} reason={item.reason}/>
          ))}
        </ul>

      </div>

    </div>

  )
};

export default BlocksSection;
