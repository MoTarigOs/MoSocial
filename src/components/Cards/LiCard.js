import React from 'react';
import './LiCard.css';
import { motion } from 'framer-motion';

const LiCard = ({ image, isSelected, pos }) => {

    const side = () => {
        if((isSelected - pos) > 0){
            return 24;
        } else {
            return -24;
        }
    }

    return (
        <motion.li className={`LiCard ${isSelected === pos ? "selected" : null}`}
            initial={{
                scale: 1,
                opacity: 1,
                x: 0
            }}
            animate={{
                scale: isSelected === pos ? 1 : 0.65,
                opacity: isSelected === pos ? 1 : 0.4,
                x: isSelected === pos ? 0 : side(),
                transition:{
                    type: "tween",
                    duration: 0.3,
                    ease: 'easeIn'
                }
            }}
        >
        <img src={pos !== 0 ? image : null} style={{opacity: pos === 0 ? 0 : 1}}/>
        </motion.li>
    )
};

export default LiCard;


// ${isSelected === true ? "selected" : null}
