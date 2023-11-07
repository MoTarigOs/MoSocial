import React from 'react';
import './TrendingCard.css';
import Svgs from '../../Assets/icons/Svgs';

const TrendingCard = ({name, image}) => {
  return (
    <div className='TrendingCard'>
      <p>{name}</p>
      <img src={image} />
      <Svgs type={"Trending"}/>
    </div>
  )
};

export default TrendingCard;
