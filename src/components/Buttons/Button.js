import React from 'react';
import './Button.css';
import Svgs from '../../Assets/icons/Svgs';
import { Link } from 'react-router-dom';

const styleArr = ["outlined", "filled", "text"];
const sizeArr = ["small", "medium", "large"];
const bgColorArr = ["transparent", "orange", "white", "#2f32ff"];
const txtColorArr = ["orange", "white", "#2f32ff", "black"];
const hoverStyleArr = ["bgChangeOrange", "outlineHover", "sideNavMobileHover"];

const Button = ({ 
    link, name, btnIcon, svg, style, size, hoverStyle, bgColor, txtColor, handleClick
}) => {

    const forStyle = style ? ((styleArr.includes(style)) ? style : styleArr[0]) : styleArr[0];
    const forSize = size ? ((sizeArr.includes(size)) ? size : sizeArr[0]) : sizeArr[0];
    const forHoverStyle = hoverStyle ? ((hoverStyleArr.includes(hoverStyle)) ? hoverStyle : null) : null;
    const forBgColor = bgColor ? ((bgColorArr.includes(bgColor)) ? bgColor : bgColorArr[0]) : bgColorArr[0];
    const forTxtColor = txtColor ? ((txtColorArr.includes(txtColor)) ? txtColor : txtColorArr[0]) : txtColorArr[0];

    return (
        <Link to={link}>
            <button
                className={`myBtn ${forStyle} ${forSize} ${forHoverStyle}`}
                onClick={() => handleClick ? handleClick() : null}
                style={{color: forStyle === "outlined" ? null : forTxtColor, 
                        borderColor: forTxtColor, background: forHoverStyle ? null : forBgColor,
                        display: btnIcon ? "flex" : null, alignItems: 'center', gap: 12}}
            >
            {btnIcon 
                ? (<img className='create_icon' src={btnIcon}/>) 
                : (svg ? <Svgs type={svg}/> : null )} 

            {name}
            </button>
        </Link>
    )
};

export default Button;
