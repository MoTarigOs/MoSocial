import React from 'react';
import Svgs from '../../Assets/icons/Svgs';
import './MobileHeader.css'

const MobileHeader = ({ svgIcon, isMobile }) => {
  return (

    <>
      {isMobile === true &&
      <div className='MobileHeader'>
          {/* <Svgs type={svgIcon} /> */}
          
      </div>}
    </>
  )
};

export default MobileHeader;
