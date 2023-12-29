import React, { useContext, useEffect, useState } from 'react';
import './ModerateSection.css';
import ReportPost from '../../components/Cards/ReportPost';
import ReportProfile from '../../components/Cards/ReportProfile';
import Svgs from '../../Assets/icons/Svgs';
import { DataContext } from '../../DataContext';
import { deleteActivity, getActivities, getPostDetails, getProfile } from '../../logic/api';

const ModerateSection = ({ setIsModerates, isModerates }) => {

  const [moderates, setModerates] = useState([]);  
  const { 
    userID, set_navigateTo_userID, setIsMyProfile, setActivityName
  } = useContext(DataContext);
  const [fetchResult, setFetchResult] = useState("");
  const [runOnce, setRunOnce] = useState(false);
  const [count, setCount] = useState(20);

  const fetchModerates = async() => {

    try {

      const res = await getActivities(count, "moderates");

      if(!res || res.ok !== true) return setFetchResult(res.dt);

      let arr = res.dt;

      console.log("fetched moderates: ", arr);

      for (let i = 0; i < arr.length; i++) {
        const obj = await fetchObjectData(arr[i].activity_name, arr[i].activity_object_id);
        console.log("fetched ", arr[i].activity_name, " object: ", obj);
        arr[i].obj = obj;
      };

      console.log("after fetched the reports object data: ", arr);

      setModerates(res.dt);

    } catch(err) {
      console.log("Error fetching moderates: ", err.message);
      return null;
    }

  };

  const accept = async(moderateId) => {
    
    try {

      if(!moderateId) return;

      console.log("Accepting: ", moderateId);

      const res = await deleteActivity(moderateId);

      if(!res || res.ok !== true) return;

      setModerates(
        moderates.filter(m => m._id !== moderateId)
      );

    } catch(err) {
      console.log(err.message);
    }

  };

  const fetchObjectData = async(type, objectId) => {

    try {

      switch(type){
        case "moderate post":
          const fetchedPost = await getPostDetails(objectId);
          if(!fetchedPost || fetchedPost.ok !== true) return null;
          return fetchedPost.dt.postDetails;
        case "moderate profile":
          const fetchedProfile = await getProfile(objectId);
          if(!fetchedProfile || fetchedProfile.ok !== true) return null;
          return fetchedProfile.dt;
        default:
          return null;  
      }

    } catch(err){
      console.log(err.message);
      setFetchResult(err.message);
    }

  };

  useEffect(() => {
    setRunOnce(true);
  }, []);

  useEffect(() => {
    if(runOnce && isModerates) fetchModerates();
  }, [runOnce, isModerates]);

  return (

    <div className='ModerateSectionContainer'>
      
      <div className='returnDiv' onClick={() => setIsModerates(false)}>
          <Svgs type={"Exit"}/>
      </div>
      
      <div className='ModerateSection'>

        <ul>
          {moderates.map((item) => (
            <li key={item._id} className='moderateItem'>
              <div className='ModerateHeader'>
                <label>{item.activity_name}</label>
              </div>

              {item.obj ? <><div className='moderateObject'>

                  {item.activity_name === "moderate post" && <ReportPost postId={item.obj._id}
                  images={item.obj.post_images} username={item.obj.creator_username} 
                  profilePic={item.obj.creator_image} title={item.obj.desc} 
                  creatorId={item.obj.creator_id} moderateId={item._id}/>}

                  {item.activity_name === "moderate profile" && <ReportProfile ownerUsername={item.obj.username} 
                  profilePic={item.obj.profileImageName} profileUserId={item.obj.profileOwnerId}
                  moderateId={item._id} shortDescription={item.obj.introParagraph} details={item.obj.smallDetails} 
                  moreDescription={item.obj.paragraph} skills={item.obj.skills} contacts={item.obj.contacts} />}

              </div> 

              <button className='acceptButton' onClick={() => accept(item._id)}>
                Accept {item.type}</button> </> 
                
              : <div className='noObj'>
                  <p>No {item.activity_name.split(" ")[1]} found</p>
                  <button>Remove</button>
              </div>}
            </li>
          ))}
        </ul>

      </div>

    </div>

  )
};

export default ModerateSection;
