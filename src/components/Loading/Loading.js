import React from 'react';
import { motion } from 'framer-motion';
import './Loading.css';

const Loading = ({ type }) => {
  return (

    <div className='LoadingDiv'>

      <motion.div className='LoadingBar'
          initial={{
              scaleX: 0,
              transformOrigin: "top left"
          }}
          animate={{
              scaleX: 1,
              transition: {
                  duration: 3,
                  ease: 'easeInOut'
              }
          }}
      >
        
      </motion.div>

      <div className='SkeletonLoading'>
          
      </div>

    </div>
  )
}

export default Loading
