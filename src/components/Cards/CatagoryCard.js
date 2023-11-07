import React from 'react';
import './CatagoryCard.css';

const CatagoryCard = ({ name, color }) => {
  return (
    <div className='CatagoryCard'
        style={{
           background: color
        }}
    >
      <p>{name}</p>
    </div>
  )
};

export default CatagoryCard;
