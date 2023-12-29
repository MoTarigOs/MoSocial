import React, { useEffect } from 'react';
import './ReportsSection.css';
import { useState } from 'react';
import { useContext } from 'react';
import { DataContext } from '../../DataContext';
import { useNavigate } from 'react-router-dom';
import ReportPost from '../../components/Cards/ReportPost';
import ReportComment from '../../components/Cards/ReportComment';
import ReportProfile from '../../components/Cards/ReportProfile';
import ReportChat from '../../components/Cards/ReportChat';
import Svgs from '../../Assets/icons/Svgs';
import { deleteReport, getComment, getMessage, getPostDetails, getProfile, getReports } from '../../logic/api';

const ReportSection = ({ setIsReport, isReport }) => {

  const { 
    userID, set_navigateTo_userID, setIsMyProfile
  } = useContext(DataContext);
  const [reports, setReports] = useState([]);
  const [fetchResult, setFetchResult] = useState("");
  const [count, setCount] = useState(10);
  const [runOnce, setRunOnce] = useState(false);
  const navigate = useNavigate();

  const fetchReports = async(limit) => {

    try {

      const res = await getReports(limit);
      
      if(!res || res.ok !== true) return setFetchResult(res.dt ? res.dt : "Error fetching the reports");

      let arr = res.dt;

      console.log("fetched reports: ", arr);

      for (let i = 0; i < arr.length; i++) {
        const obj = await fetchObjectData(arr[i].report_type, arr[i].report_on_this_object_id);
        console.log("fetched ", arr[i].report_type, " object: ", obj);
        arr[i].obj = obj;
      };

      console.log("after fetched the reports object data: ", arr);

      setReports(arr);

    } catch(err){
      console.log(err.message);
      return null
    }

  };

  const fetchObjectData = async(type, objectId) => {

    try {

      switch(type){
        case "post":
          const fetchedPost = await getPostDetails(objectId);
          if(!fetchedPost || fetchedPost.ok !== true) return null;
          return fetchedPost.dt.postDetails;
        case "comment":
          const fetchedComment = await getComment(objectId);
          if(!fetchedComment || fetchedComment.ok !== true) return null;
          return fetchedComment.dt;
        case "profile":
          const fetchedProfile = await getProfile(objectId);
          if(!fetchedProfile || fetchedProfile.ok !== true) return null;
          return fetchedProfile.dt;
        case "chat":
          const fetchedChat = await getMessage(objectId);
          if(!fetchedChat || fetchedChat.ok !== true) return null;
          return fetchedChat.dt;
        default:
          return null;  
      }

    } catch(err){
      console.log(err.message);
      setFetchResult(err.message);
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

  const fetchMoreReports = () => {

    fetchReports(count + 10);

    setCount(count + 10);

  };

  const deleteHandledReport = async(reportId) => {

    try {

        const res = await deleteReport(reportId);

        if(!res || res.ok !== true){
            return;
        };

        setReports(
          reports.filter(r => r._id !== reportId)
        );

    } catch(err) {
        console.log(err.message);
    }
  };

  useEffect(() => {
    setRunOnce(true);
  }, []);

  useEffect(() => {
    if(runOnce && isReport) fetchReports(count);
  }, [runOnce, isReport]);

  return (

    <div className='ReportSectionContainer'>
      
      <div className='returnDiv' onClick={() => setIsReport(false)}>
          <Svgs type={"Exit"}/>
      </div>

      <div className='ReportSection'>

        <ul>
          
          {reports.map((item) => (

            <li key={item._id} className='reportItem'>
              <div className='reportHeader'>
                <h2 onClick={() => navigateToProfile(item.reporter_id)}>Reported From: {item.reporter_username}</h2>
                <label>{item.report_type}</label>
              </div>

              <div className='reportProblem'>
                <label>{item.report_issue}</label>
                <p>{item.report_desc}</p>
              </div>

              {item.obj 
              ? <div className='reportedObject'>

                  {item.report_type === "post" && <ReportPost postId={item.obj._id}
                  images={item.obj.post_images} username={item.obj.creator_username} 
                  profilePic={item.obj.creator_image} title={item.obj.desc} 
                  creatorId={item.obj.creator_id} reportId={item._id}/>}

                  {item.report_type === "comment" && <ReportComment commentId={item.obj._id} commenter_id={item.obj.commenter_id}
                  commenter_name={item.obj.commenter_name} 
                  comment_text={item.obj.comment_text}
                  commenter_image={item.obj.commenter_image} 
                  reportId={item._id} 
                  postId={item.obj.post_id}/>}

                  {item.report_type === "profile" &&  <ReportProfile adminUsername={item.reporter_username} ownerUsername={item.obj.username} 
                  profilePic={item.obj.profileImage} profileUserId={item.obj.profileOwnerId}
                  reportId={item._id} shortDescription={item.obj.shortDesc} details={item.obj.smallDetails} 
                  moreDescription={item.obj.moreDescription} skills={item.obj.skills} contacts={item.obj.contacts} />}

                  {item.report_type === "chat" &&   
                  <ReportChat reportId={item._id} messageId={item.obj._id} senderId={item.obj.sender_id} profilePic={""} createdAt={item.obj.createdAt} text={item.obj.chat_text} 
                  username={item.obj.sender_username} />}

              </div> 

              : <div className='noObjectFoundDiv'>

                     <p>No {item.report_type} found</p>

                     <button onClick={() => deleteHandledReport(item._id)}>Delete Report</button>

              </div>}
              
            </li>

          ))}

          <button onClick={fetchMoreReports}>More Reports</button>

        </ul>

      </div>

    </div>

  )
};

export default ReportSection;
