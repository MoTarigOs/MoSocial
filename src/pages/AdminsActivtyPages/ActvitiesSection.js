import React, { useContext, useEffect, useState } from 'react';
import './ActivitiesSection.css';
import image from '../../Assets/images/chatgpt_image.jpg';
import Svgs from '../../Assets/icons/Svgs';
import { DataContext } from '../../DataContext';
import { useNavigate } from 'react-router-dom';
import { getActivities, getProfile } from '../../logic/api';

const ActivitiesSection = ({ setIsActivities, isActivities }) => {

  const [activities, setActivities] = useState([]);  
  const { 
    userID, set_navigateTo_userID, setIsMyProfile
  } = useContext(DataContext);
  const [fetchResult, setFetchResult] = useState("");
  const navigate = useNavigate();
  const [runOnce, setRunOnce] = useState(false);
  const [count, setCount] = useState(20);

  const fetchActivities = async() => {

    try {

      const res = await getActivities(count, "any");

      if(!res || res.ok !== true) return setFetchResult(res.dt);

      let arr = res.dt;

      console.log("fetched activities: ", arr);

      for (let i = 0; i < arr.length; i++) {
        const obj = await fetchObjectData(arr[i].activity_object_id, arr[i].activity_name);
        console.log("fetched ", arr[i].activity_name, " object: ", obj);
        arr[i].obj = obj;
      };

      console.log("after fetched the reports object data: ", arr);

      setActivities(res.dt);

    } catch(err) {
      console.log("Error fetching moderates: ", err.message);
    }

  };

  const fetchObjectData = async(objectId, type) => {

    try {

      if(type !== "block user" 
      && type !== "un-block user"
      && type !== "remove admin"
      && type !== "make admin") return null;

      const res = await getProfile(objectId);

      if(!res || res.ok !== true) return null;

      return res.dt;

    } catch(err){
      console.log(err.message);
      setFetchResult(err.message);
      return null;
    }

  };

  const navigateToProfile = (id) => {
    if(id === userID){
        set_navigateTo_userID("");
        setIsMyProfile(true);
        navigate(`/profile/${0}`);
    } else {
        set_navigateTo_userID(id);
        setIsMyProfile(false);
        navigate(`/profile/${id}`);
    }
  };

  const getWhatHappened = (type) => {
    switch(type){
      case "delete post":
        return "deleted a post";
      case "delete comment":
        return "deleted a comment";
      case "delete message":
        return "deleted a message";
      case "block user":
        return "blocked a user";
      case "un-block user":
        return "un-block a user";
      case "remove admin":
        return "removed an admin";
      case "make admin":
        return "make a new admin";
      default:
        return "did something";
    };
  };

  useEffect(() => {
    setRunOnce(true);
  }, []);

  useEffect(() => {
    if(runOnce && isActivities) fetchActivities();
  }, [runOnce, isActivities]);

  return (

    <div className='ActivitiesSectionContainer'>
      
      <div className='returnDiv' onClick={() => setIsActivities(false)}>
          <Svgs type={"Exit"}/>
      </div>
      
      <div className='ActivitiesSection'>

        <ul>
          {activities.map((item) => (
            <li key={item._id} className='activity'>
              <div className='ActivityHeader'>
                <img src={image}/>
                <h2 onClick={() => navigateToProfile(item.admin_user_id)}>{item.admin_username} <span>{getWhatHappened(item.activity_name)}</span></h2>
                <label>{item.activity_name}</label>
              </div>

              <div className='activityObject'>

                  {item.activity_name !== "delete post" && item.activity_name !== "delete comment" && item.obj && <div className='objectUser'>
                    <img src={`https://f003.backblazeb2.com/file/mosocial-all-images-storage/${item.obj.profileImageName}`}/>
                    <h2 onClick={() => navigateToProfile(item.obj.profileOwnerId)}>{item.obj.username}</h2>
                  </div>}

                  <div className='reasonDiv'>
                    <h4>Reason: </h4>
                    <p>{item.reason}</p>
                  </div>

              </div>
            </li>
          ))}
        </ul>

      </div>

    </div>

  )
};

export default ActivitiesSection;
