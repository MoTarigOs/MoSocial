import React from 'react';
import './MiniProfileCard.css';

const MiniProfileCard = ({ profile_image, name, bio }) => {
  return (
    <li>
      <div className='MiniProfileCard'>
        <img src={profile_image} />
        <h5>{name}</h5>
        <p>{bio}</p>
      </div>
    </li>
  )
};

export default MiniProfileCard;
