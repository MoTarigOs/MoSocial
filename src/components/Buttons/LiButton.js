import React, { useContext } from 'react';
import './LiButton.css';
import { Link } from 'react-router-dom';

import Svgs from '../../Assets/icons/Svgs';
import { DataContext } from '../../DataContext';

const LiButton = ({ 
    name, icon, notifications, 
    setIsSelected, isSelected, isLoading,
    isScrolled, sideBar, myLink, onClickHandler
}) => {
  
  return (
    <li className={isSelected === name ? "navBarSel" : ""} onClick={onClickHandler ? onClickHandler : null}>
      <Link to={isLoading === false ? myLink : null} style={{textDecoration: "none", color: 'inherit', }}>
        <button className={`${icon ? "sideBarLiBtn" : ""}`} 
            style={{color: isScrolled ? "inherit" : null}}
            onClick={() => isLoading === false ? setIsSelected(name) : null}>
            {icon && 
              <Svgs type={name} selected={isSelected === name ? isSelected : null} isScrolled={isScrolled}/>
            }
            {sideBar === 1 ? (name) : (isScrolled ? name : null)}
            {sideBar === 1 && notifications && notifications > 0 &&
              <h3>{notifications}</h3>
            }
        </button>
      </Link>
    </li>
  )
};

export default LiButton;
