import React from 'react';
import './Skill.css';

const Skill = ({ skill_name, percentage }) => {

    

    function myColor (percentage) {

        if(!percentage)
            return "#cfcfcf";

        if(percentage >= 0 && percentage < 50)    
            return "#ed3232"

        if(percentage >= 50 && percentage < 70)    
            return "#eeff2e"

        if(percentage >= 70 && percentage < 90)    
            return "#2e7bff"

        if(percentage >= 90 && percentage <= 100)    
            return "#00ff04"

        return "#cfcfcf";
        
    };

    const clr = myColor(percentage);
    console.log(clr)
        
    return (
        <li className='Skill'>
                <strong>{skill_name}</strong>
                <div>
                    <div
                        style={{background: clr, 
                        width: `${percentage}%`}}>
                    </div>
                </div>
        </li>
    )
};

export default Skill;
