import React from 'react';
import './ExplorePage.css';
import CatagoryCard from '../../components/Cards/CatagoryCard';
import TrendingCard from '../../components/Cards/TrendingCard';

import image from '../../Assets/images/bg.jpg';
import shatGptImage from '../../Assets/images/chatgpt_image.jpg';
import marketingImage from '../../Assets/images/idea_image.jpg';
import ui_ux_Image from '../../Assets/images/ui_design_image.jpg';
import MiniProfileCard from '../../components/Cards/MiniProfileCard';
import MobileHeader from '../../components/MobileHeader/MobileHeader';

const ExplorePage = ({ isMobile }) => {

  return (

    <div className='ExploreContainer'>

      {isMobile === true &&
      <MobileHeader  isMobile={isMobile} /> 
      }

      <div className='ExplorePage'>
        
        <div className='Catagory'>
          <h3>Catagories</h3>
          <ul>
            <CatagoryCard key={1} name={"Android"} color={"#2f32ff"}/>
            <CatagoryCard key={2} name={"AI designs"} color={"orange"}/>
            <CatagoryCard key={3} name={"Websites"} color={"violet"}/>
            <CatagoryCard key={4} name={"Games"} color={"turquoise"}/>
            <CatagoryCard key={5} name={"3D"} color={"red"}/>
            <CatagoryCard key={6} name={"Animations"} color={"lightblue"}/>
            <CatagoryCard key={7} name={"Architucture"} color={"green"}/>
          </ul>
        </div>

        <div className='Trending'>
          <h3>Trending</h3>
          <ul>
            <TrendingCard key={1} name={"ChatGPT"} image={shatGptImage} />
            <TrendingCard key={2} name={"Marketing"} image={marketingImage} />
            <TrendingCard key={3} name={"UI / UX"} image={ui_ux_Image} />
          </ul>
        </div>

        <div className='FollowPeople'>
          <h3>Most Famous</h3>
          <ul>
            <MiniProfileCard profile_image={image} name={"Hamada"} bio={"Aniamtor & Drawer"} />
            <MiniProfileCard profile_image={image} name={"Hamada"} bio={"Aniamtor & Drawer"} />
            <MiniProfileCard profile_image={image} name={"Hamada"} bio={"Aniamtor & Drawer"} />
          </ul>
        </div>

      </div>
      
    </div>
  )
};

export default ExplorePage;
