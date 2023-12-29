import React from 'react';
import consoleIcon from './management.png';

const Svgs = ({ type, selected, on_click }) => {

  return (
    <>
        { type === "Home" && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#00000000" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>}
    
        { type === "Comments" && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path className={selected ? "pathFillColor" : ""} style={{transform: "translateX(-12px) translateY(-4px)"}} strokeWidth="0px"  d="M20.265 12.824c-0.589 0-1.066 0.478-1.066 1.066s0.477 1.066 1.066 1.066 1.066-0.477 1.066-1.066c0-0.588-0.477-1.066-1.066-1.066z" fill="#000000"></path><path className={selected ? "pathFillColor" : ""} style={{transform: "translateX(-8px) translateY(-4px)"}} strokeWidth="0px" d="M20.265 12.824c-0.589 0-1.066 0.478-1.066 1.066s0.477 1.066 1.066 1.066 1.066-0.477 1.066-1.066c0-0.588-0.477-1.066-1.066-1.066z" fill="#000000"></path><path className={selected ? "pathFillColor" : ""} style={{transform: "translateX(-4px) translateY(-4px)"}} strokeWidth="0px"  d="M20.265 12.824c-0.589 0-1.066 0.478-1.066 1.066s0.477 1.066 1.066 1.066 1.066-0.477 1.066-1.066c0-0.588-0.477-1.066-1.066-1.066z" fill="#000000"></path></svg>}
    
        { type === "Explore" && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z"/></svg>}
    
        { type === "Projects" && <svg fill="#00000000" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke='#000' d="M7.25 6a.75.75 0 00-.75.75v7.5a.75.75 0 001.5 0v-7.5A.75.75 0 007.25 6zM12 6a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0v-4.5A.75.75 0 0012 6zm4 .75a.75.75 0 011.5 0v9.5a.75.75 0 01-1.5 0v-9.5z"/><path stroke='#000' fillRule="evenodd" d="M3.75 2A1.75 1.75 0 002 3.75v16.5c0 .966.784 1.75 1.75 1.75h16.5A1.75 1.75 0 0022 20.25V3.75A1.75 1.75 0 0020.25 2H3.75zM3.5 3.75a.25.25 0 01.25-.25h16.5a.25.25 0 01.25.25v16.5a.25.25 0 01-.25.25H3.75a.25.25 0 01-.25-.25V3.75z"/></svg>}

        {type === "contacts" || type === "Contacts" && <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.99994 8.99996C9.99994 7.89539 10.8954 6.99996 11.9999 6.99996C13.1045 6.99996 13.9999 7.89539 13.9999 8.99996C13.9999 10.1045 13.1045 11 11.9999 11C10.8954 11 9.99994 10.1045 9.99994 8.99996Z" fill="#000000"/>
        <path d="M10.9999 12.5C9.34308 12.5 7.99994 13.8431 7.99994 15.5C7.99994 16.0522 8.44765 16.5 8.99994 16.5H14.9999C15.5522 16.5 15.9999 16.0522 15.9999 15.5C15.9999 13.8431 14.6568 12.5 12.9999 12.5H10.9999Z" fill="#000000"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M7.54347 2.88264C10.4993 2.4579 13.5006 2.4579 16.4564 2.88264C17.9219 3.09323 19.051 4.28262 19.1851 5.75708L19.3121 7.15281C19.6055 10.3776 19.6055 13.6223 19.3121 16.8471L19.1851 18.2428C19.051 19.7173 17.9219 20.9067 16.4564 21.1173C13.5006 21.542 10.4993 21.542 7.54347 21.1173C6.07798 20.9067 4.94888 19.7173 4.81475 18.2428L4.68779 16.8471C4.39444 13.6223 4.39444 10.3776 4.68779 7.15281L4.81475 5.75708C4.94888 4.28262 6.07798 3.09323 7.54347 2.88264ZM16.2431 4.36739C13.4288 3.96299 10.5711 3.96299 7.75682 4.36739C6.97903 4.47916 6.37977 5.11042 6.30859 5.89297L6.18162 7.2887C5.89649 10.4231 5.89649 13.5769 6.18162 16.7112L6.30859 18.107C6.37977 18.8895 6.97903 19.5208 7.75682 19.6325C10.5711 20.0369 13.4288 20.0369 16.2431 19.6325C17.0209 19.5208 17.6201 18.8895 17.6913 18.107L17.8183 16.7112C18.1034 13.5769 18.1034 10.4231 17.8183 7.2887L17.6913 5.89297C17.6201 5.11042 17.0209 4.47916 16.2431 4.36739Z" fill="#000000"/>
        </svg>}
    
        { type === "Ads" && <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: "scale(1.1)"}}>
        <path d="M5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5Z" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 15V11C7 9.89543 7.89543 9 9 9V9C10.1046 9 11 9.89543 11 11V15" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 9V15" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 12H15.5C13.5 12 13.5 15 15.5 15H17" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 13H11" stroke="#323232" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>}
    
        { type === "Be a partener" && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>}
    
        { (type === "Help" || type === "About") && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>}
    
        {type === "Profile" && <svg className="profile_icon" width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>}

        {type === "Search" && <svg onClick={on_click} width="24px" height="24px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Icon-Set" transform="translate(-256.000000, -1139.000000)" fill="#000000">
        <path d="M269.46,1163.45 C263.17,1163.45 258.071,1158.44 258.071,1152.25 C258.071,1146.06 263.17,1141.04 269.46,1141.04 C275.75,1141.04 280.85,1146.06 280.85,1152.25 C280.85,1158.44 275.75,1163.45 269.46,1163.45 L269.46,1163.45 Z M287.688,1169.25 L279.429,1161.12 C281.591,1158.77 282.92,1155.67 282.92,1152.25 C282.92,1144.93 276.894,1139 269.46,1139 C262.026,1139 256,1144.93 256,1152.25 C256,1159.56 262.026,1165.49 269.46,1165.49 C272.672,1165.49 275.618,1164.38 277.932,1162.53 L286.224,1170.69 C286.629,1171.09 287.284,1171.09 287.688,1170.69 C288.093,1170.3 288.093,1169.65 287.688,1169.25 L287.688,1169.25 Z" id="search">
        </path></g></g></svg>}

        {type === "Trending" && <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="Vector" d="M20.0005 7L14.1543 12.9375C14.0493 13.0441 13.9962 13.0976 13.9492 13.1396C13.1899 13.8193 12.0416 13.8193 11.2822 13.1396C11.2352 13.0976 11.1817 13.0442 11.0767 12.9375C10.9716 12.8308 10.9191 12.7774 10.8721 12.7354C10.1127 12.0557 8.96397 12.0557 8.20461 12.7354C8.15771 12.7773 8.10532 12.8305 8.00078 12.9367L4 17M20.0005 7L20 13M20.0005 7H14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>}

        {(type === "Facebook" || type === "facebook") && <svg width="24px" height="24px" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{scale: "1.23"}}>
        <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_87_7208)"/>
        <path d="M21.2137 20.2816L21.8356 16.3301H17.9452V13.767C17.9452 12.6857 18.4877 11.6311 20.2302 11.6311H22V8.26699C22 8.26699 20.3945 8 18.8603 8C15.6548 8 13.5617 9.89294 13.5617 13.3184V16.3301H10V20.2816H13.5617V29.8345C14.2767 29.944 15.0082 30 15.7534 30C16.4986 30 17.2302 29.944 17.9452 29.8345V20.2816H21.2137Z" fill="white"/>
        <defs>
        <linearGradient id="paint0_linear_87_7208" x1="16" y1="2" x2="16" y2="29.917" gradientUnits="userSpaceOnUse">
        <stop stopColor="#18ACFE"/>
        <stop offset="1" stopColor="#0163E0"/>
        </linearGradient>
        </defs>
        </svg>}

        {(type === "Google" || type === "google") && <svg width="24px" height="24px" viewBox="-0.5 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Color-" transform="translate(-401.000000, -860.000000)">
            <g id="Google" transform="translate(401.000000, 860.000000)">
                <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"></path>
                <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"></path>
                <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"></path>
                <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"></path></g></g></g></svg>}

        {type === "X" && <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" version="1.1" width="24px" height="24px">
        <path stroke='#fff' fill='#fff' d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>}

        {(type === "Whatsapp" || type === "whatsapp") && <svg width="24px" height="24px" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Color-" transform="translate(-700.000000, -360.000000)" fill="#67C15E">
            <path d="M723.993033,360 C710.762252,360 700,370.765287 700,383.999801 C700,389.248451 701.692661,394.116025 704.570026,398.066947 L701.579605,406.983798 L710.804449,404.035539 C714.598605,406.546975 719.126434,408 724.006967,408 C737.237748,408 748,397.234315 748,384.000199 C748,370.765685 737.237748,360.000398 724.006967,360.000398 L723.993033,360.000398 L723.993033,360 Z M717.29285,372.190836 C716.827488,371.07628 716.474784,371.034071 715.769774,371.005401 C715.529728,370.991464 715.262214,370.977527 714.96564,370.977527 C714.04845,370.977527 713.089462,371.245514 712.511043,371.838033 C711.806033,372.557577 710.056843,374.23638 710.056843,377.679202 C710.056843,381.122023 712.567571,384.451756 712.905944,384.917648 C713.258648,385.382743 717.800808,392.55031 724.853297,395.471492 C730.368379,397.757149 732.00491,397.545307 733.260074,397.27732 C735.093658,396.882308 737.393002,395.527239 737.971421,393.891043 C738.54984,392.25405 738.54984,390.857171 738.380255,390.560912 C738.211068,390.264652 737.745308,390.095816 737.040298,389.742615 C736.335288,389.389811 732.90737,387.696673 732.25849,387.470894 C731.623543,387.231179 731.017259,387.315995 730.537963,387.99333 C729.860819,388.938653 729.198006,389.89831 728.661785,390.476494 C728.238619,390.928051 727.547144,390.984595 726.969123,390.744481 C726.193254,390.420348 724.021298,389.657798 721.340985,387.273388 C719.267356,385.42535 717.856938,383.125756 717.448104,382.434484 C717.038871,381.729275 717.405907,381.319529 717.729948,380.938852 C718.082653,380.501232 718.421026,380.191036 718.77373,379.781688 C719.126434,379.372738 719.323884,379.160897 719.549599,378.681068 C719.789645,378.215575 719.62006,377.735746 719.450874,377.382942 C719.281687,377.030139 717.871269,373.587317 717.29285,372.190836 Z" id="Whatsapp"></path></g></g></svg>}


        {type === "Gmail" && <svg style={{scale: "1.6"}} xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"><rect 
        width="24px" height="24px"
        rx="15%"
        fill="#ffffff"/><path d="M158 391v-142l-82-63V361q0 30 30 30" fill="#4285f4"/><path d="M 154 248l102 77l102-77v-98l-102 77l-102-77" fill="#ea4335"/><path d="M354 391v-142l82-63V361q0 30-30 30" fill="#34a853"/><path d="M76 188l82 63v-98l-30-23c-27-21-52 0-52 26" fill="#c5221f"/><path d="M436 188l-82 63v-98l30-23c27-21 52 0 52 26" fill="#fbbc04"/></svg>}

        {type === "ThreeDotsMenu" && <svg onClick={on_click} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6C12.5523 6 13 5.55228 13 5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>}

        {type === "SendMessage" && <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.99811 10.2467L7.43298 11.0077C7.70983 11.4922 7.84825 11.7344 7.84825 12C7.84825 12.2656 7.70983 12.5078 7.43299 12.9923L7.43298 12.9923L6.99811 13.7533C5.75981 15.9203 5.14066 17.0039 5.62348 17.5412C6.1063 18.0785 7.24961 17.5783 9.53623 16.5779L15.8119 13.8323C17.6074 13.0468 18.5051 12.654 18.5051 12C18.5051 11.346 17.6074 10.9532 15.8119 10.1677L9.53624 7.4221C7.24962 6.42171 6.1063 5.92151 5.62348 6.45883C5.14066 6.99615 5.75981 8.07966 6.99811 10.2467Z" fill="#222222"/>
        </svg>}

        {(type === "Exit" || type === "exit") && <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 7.63636L14 4.5C14 4.22386 13.7761 4 13.5 4L4.5 4C4.22386 4 4 4.22386 4 4.5L4 19.5C4 19.7761 4.22386 20 4.5 20L13.5 20C13.7761 20 14 19.7761 14 19.5L14 16.3636" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 12L21 12M21 12L18.0004 8.5M21 12L18 15.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>}

        {type === "Edit" && <svg xmlns="http://www.w3.org/2000/svg" onClick={on_click} viewBox="0 0 72 72" width="64px" height="64px"><path d="M38.406 22.234l11.36 11.36L28.784 54.576l-12.876 4.307c-1.725.577-3.367-1.065-2.791-2.79l4.307-12.876L38.406 22.234zM41.234 19.406l5.234-5.234c1.562-1.562 4.095-1.562 5.657 0l5.703 5.703c1.562 1.562 1.562 4.095 0 5.657l-5.234 5.234L41.234 19.406z"/></svg>}

        {type === "ImageIcon" && <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z" fill="#0F0F0F"/>
        <path d="M4.80665 17.5211L9.1221 9.60947C9.50112 8.91461 10.4989 8.91461 10.8779 9.60947L14.0465 15.4186L15.1318 13.5194C15.5157 12.8476 16.4843 12.8476 16.8682 13.5194L19.1451 17.5039C19.526 18.1705 19.0446 19 18.2768 19H5.68454C4.92548 19 4.44317 18.1875 4.80665 17.5211Z" fill="#0F0F0F"/>
        <path d="M18 8C18 9.10457 17.1046 10 16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8Z" fill="#0F0F0F"/>
        </svg>}

        {type === "404_icon" && <svg width="24px" height="24x" viewBox="-20 0 190 190" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M38.155 140.475L48.988 62.1108L92.869 67.0568L111.437 91.0118L103.396 148.121L38.155 140.475ZM84.013 94.0018L88.827 71.8068L54.046 68.3068L44.192 135.457L98.335 142.084L104.877 96.8088L84.013 94.0018ZM59.771 123.595C59.394 123.099 56.05 120.299 55.421 119.433C64.32 109.522 86.05 109.645 92.085 122.757C91.08 123.128 86.59 125.072 85.71 125.567C83.192 118.25 68.445 115.942 59.771 123.595ZM76.503 96.4988L72.837 99.2588L67.322 92.6168L59.815 96.6468L56.786 91.5778L63.615 88.1508L59.089 82.6988L64.589 79.0188L68.979 85.4578L76.798 81.5328L79.154 86.2638L72.107 90.0468L76.503 96.4988Z" fill="#000000"/>
        </svg>}

        {type === "Upload" && <svg width="24px" height="24px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(-377.000000, -378.000000)" id="Group" stroke="#000000" strokeWidth="2">
        <g transform="translate(375.000000, 376.000000)" id="Shape">
        <polygon points="9.375 21 9.375 14.5072464 5 14.5072464 12 7 19 14.5072464 14.625 14.5072464 14.625 21">
        </polygon><line x1="3" y1="3" x2="21" y2="3"></line></g></g></g></svg>}

        {(type === "Delete" || type === "delete") && <svg width="24px" height="24px" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" ><g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><path d="M12.566,8 L15.611,4.956 C16.031,4.535 16.031,3.853 15.611,3.434 L12.566,0.389 C12.146,-0.031 11.464,-0.031 11.043,0.389 L7.999,3.433 L4.955,0.389 C4.534,-0.031 3.852,-0.031 3.432,0.389 L0.388,3.434 C-0.034,3.854 -0.034,4.536 0.387,4.956 L3.431,8 L0.387,11.044 C-0.034,11.465 -0.034,12.147 0.388,12.567 L3.432,15.611 C3.852,16.032 4.534,16.032 4.955,15.611 L7.999,12.567 L11.043,15.611 C11.464,16.032 12.146,16.032 12.566,15.611 L15.611,12.567 C16.031,12.146 16.031,11.464 15.611,11.044 L12.566,8 L12.566,8 Z" fill="#434343" class="si-glyph-fill"></path></g></svg>}

        {type === "delete2" || type === "Delete2" && <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>}

        {type === "addContact" && <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width="48.000000pt" height="48.000000pt" viewBox="0 0 48.000000 48.000000"
        preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)"
        fill="#000000" stroke="none"><path d="M367 414 c-4 -4 -7 -18 -7 -31 0 -18 -5 -23 -26 -23 -31 0 -28 -23 4
        -28 12 -2 22 -12 24 -25 4 -29 32 -29 36 0 2 13 12 23 24 25 31 4 35 28 4 28
        -19 0 -25 6 -28 27 -3 26 -18 39 -31 27z"/>
        <path d="M122 357 c-50 -53 -13 -137 59 -137 47 0 79 34 79 81 0 71 -90 107
        -138 56z m96 -19 c15 -15 15 -61 0 -76 -15 -15 -61 -15 -76 0 -15 15 -15 61 0
        76 7 7 24 12 38 12 14 0 31 -5 38 -12z"/>
        <path d="M85 203 c-36 -9 -55 -34 -55 -73 0 -63 23 -75 150 -75 127 0 150 12
        150 75 0 60 -24 74 -133 76 -51 2 -101 0 -112 -3z m189 -33 c37 -14 37 -66 0
        -80 -33 -13 -155 -13 -188 0 -35 13 -37 66 -3 80 30 12 160 12 191 0z"/></g></svg>}
      
        {(type === "Settings" || type === "settings" || 
        type === "setting" || type === "Setting") && <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px"><path fill='#00000000' strokeWidth={1.8} stroke='#000' d="M 10.490234 2 C 10.011234 2 9.6017656 2.3385938 9.5097656 2.8085938 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 5.2851562 5.2480469 C 4.8321563 5.0920469 4.33375 5.2793594 4.09375 5.6933594 L 2.5859375 8.3066406 C 2.3469375 8.7216406 2.4339219 9.2485 2.7949219 9.5625 L 4.1132812 10.708984 C 4.0447181 11.130337 4 11.559284 4 12 C 4 12.440716 4.0447181 12.869663 4.1132812 13.291016 L 2.7949219 14.4375 C 2.4339219 14.7515 2.3469375 15.278359 2.5859375 15.693359 L 4.09375 18.306641 C 4.33275 18.721641 4.8321562 18.908906 5.2851562 18.753906 L 6.9296875 18.1875 C 7.5958842 18.734206 8.3553934 19.166339 9.1757812 19.476562 L 9.5097656 21.191406 C 9.6017656 21.661406 10.011234 22 10.490234 22 L 13.509766 22 C 13.988766 22 14.398234 21.661406 14.490234 21.191406 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 18.714844 18.751953 C 19.167844 18.907953 19.66625 18.721641 19.90625 18.306641 L 21.414062 15.691406 C 21.653063 15.276406 21.566078 14.7515 21.205078 14.4375 L 19.886719 13.291016 C 19.955282 12.869663 20 12.440716 20 12 C 20 11.559284 19.955282 11.130337 19.886719 10.708984 L 21.205078 9.5625 C 21.566078 9.2485 21.653063 8.7216406 21.414062 8.3066406 L 19.90625 5.6933594 C 19.66725 5.2783594 19.167844 5.0910937 18.714844 5.2460938 L 17.070312 5.8125 C 16.404116 5.2657937 15.644607 4.8336609 14.824219 4.5234375 L 14.490234 2.8085938 C 14.398234 2.3385937 13.988766 2 13.509766 2 L 10.490234 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z"/></svg> }
      
        {type === "Admin Console" && <img src={consoleIcon} style={{
          width: 24, height: 24, 
          scale: '1.4', 
          transform: 'translateY(-2px)'
        }}/>
        }

        {type === "Copy" && <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_429_11155)">
        <path d="M16 3H4V16" stroke="#292929" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 7H20V19C20 20.1046 19.1046 21 18 21H10C8.89543 21 8 20.1046 8 19V7Z" stroke="#292929" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </g><defs>
        <clipPath id="clip0_429_11155">
        <rect width="24" height="24" fill="white"/>
        </clipPath>
        </defs></svg>}

        {type === "Done" && <svg width="24px" height="24px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-179.000000, -400.000000)" fill="#000000">
                <g transform="translate(56.000000, 160.000000)">
                    <path d="M141.9,243 C141.9,242.448 141.4296,242 140.85,242 L126.15,242 C125.5704,242 125.1,242.448 125.1,243 L125.1,257 C125.1,257.552 125.5704,258 126.15,258 L140.85,258 C141.4296,258 141.9,257.552 141.9,257 L141.9,243 Z M144,242 L144,258 C144,259.105 143.06025,260 141.9,260 L125.1,260 C123.93975,260 123,259.105 123,258 L123,242 C123,240.895 123.93975,240 125.1,240 L141.9,240 C143.06025,240 144,240.895 144,242 L144,242 Z M137.72205,247.015 C138.1326,247.405 138.1326,248.039 137.72205,248.429 L133.63965,252.317 C133.0233,252.903 132.0258,252.903 131.40945,252.317 L129.5541,250.55 C129.1446,250.16 129.1446,249.527 129.5541,249.136 C129.96465,248.746 130.6293,248.746 131.0388,249.136 L131.7801,249.842 C132.19065,250.233 132.8574,250.233 133.269,249.842 L136.23735,247.015 C136.64685,246.624 137.31255,246.624 137.72205,247.015 L137.72205,247.015 Z">
        </path></g></g></g></svg>}

        {type === "Share" && <svg style={{cursor: "pointer"}} onClick={on_click} fill="#dfdfdf" width="24px" height="24px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 25.472q0 2.368 1.664 4.032t4.032 1.664h18.944q2.336 0 4-1.664t1.664-4.032v-8.192l-3.776 3.168v5.024q0 0.8-0.544 1.344t-1.344 0.576h-18.944q-0.8 0-1.344-0.576t-0.544-1.344v-18.944q0-0.768 0.544-1.344t1.344-0.544h9.472v-3.776h-9.472q-2.368 0-4.032 1.664t-1.664 4v18.944zM5.696 19.808q0 2.752 1.088 5.28 0.512-2.944 2.24-5.344t4.288-3.872 5.632-1.664v5.6l11.36-9.472-11.36-9.472v5.664q-2.688 0-5.152 1.056t-4.224 2.848-2.848 4.224-1.024 5.152zM32 22.080v0 0 0z"></path>
        </svg>}

        {type === "No internet" && <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="24px" height="24px" viewBox="0 -1 26 26"><path fillOpacity=".3" d="M24.24 8l1.35-1.68C25.1 5.96 20.26 2 13 2S.9 5.96.42 6.32l12.57 15.66.01.02.01-.01L20 13.28V8h4.24z"/><path d="M22 22h2v-2h-2v2zm0-12v8h2v-8h-2z"/></svg>}
        
      </>
  )
}

export default Svgs
