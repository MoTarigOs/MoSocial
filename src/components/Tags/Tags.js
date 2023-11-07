import React from 'react';
import './Tags.css';

const Tags = ({ handleTag }) => {

  const TrendTags = [
    {id: 1, value: "Websites"}, {id: 2, value: "UI / UX"}, 
    {id: 3, value: "Github"}, {id: 4, value: "3D"},
    {id: 5, value: "Animations"}, {id: 6, value: "Websites"},
    {id: 7, value: "posts"}, {id: 8, value: "newbie"}
  ]

  return (
    <div className='HeroTags'>
        <ul>
            {TrendTags.map((item) => (
              <li key={item.id} onClick={() => handleTag(item.value)}>{item.value}</li>
            ))}
        </ul>
    </div>
  )
};

export default Tags;
