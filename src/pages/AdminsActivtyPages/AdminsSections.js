import React, { useContext, useEffect, useState } from 'react';
import './AdminsSection.css';
import Svgs from '../../Assets/icons/Svgs';
import { DataContext } from '../../DataContext';
import { useNavigate } from 'react-router-dom';
import AdminCard from '../../components/Cards/AdminCard';
import { getAdmins } from '../../logic/api';

const AdminsSection = ({ setIsAdmins, isAdmins }) => {

  const [admins, setAdmins] = useState([]);  
  const [runOnce, setRunOnce] = useState(false);
  const [fetchResult, setFetchResult] = useState("");
  const [count, setCount] = useState(20);

  const fetchAdmins = async() => {

    try {

      const res = await getAdmins(count);

      if(!res || res.ok !== true) return setFetchResult(res.dt);

      let arr = res.dt;

      console.log("fetched admins: ", arr);

      // for (let i = 0; i < arr.length; i++) {
      //   const obj = await fetchObjectData(arr[i].activity_object_id, arr[i].activity_name);
      //   console.log("fetched ", arr[i].activity_name, " object: ", obj);
      //   arr[i].obj = obj;
      // };

      console.log("after fetched the reports object data: ", arr);

      setAdmins(res.dt);

    } catch(err) {
      console.log("Error fetching moderates: ", err.message);
    }

  };

  useEffect(() => {
    setRunOnce(true);
  }, []);

  useEffect(() => {
    if(runOnce && isAdmins) fetchAdmins();
  }, [runOnce, isAdmins]);

  return (

    <div className='AdminsSectionContainer'>
      
      <div className='returnDiv' onClick={() => setIsAdmins(false)}>
          <Svgs type={"Exit"}/>
      </div>
      
      <div className='AdminsSection'>

        <ul>
          {admins.map((item) => (
            <AdminCard key={item._id} profilePic={""} username={item.admin_username} 
            userId={item.admin_user_id} numOfBlocks={item.blocked_users_ids.length} 
            numOfDeletion={item.deletion_objects_ids.length}/>
          ))}
        </ul>

      </div>

    </div>

  )
};

export default AdminsSection;
