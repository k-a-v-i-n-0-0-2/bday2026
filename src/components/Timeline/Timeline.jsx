import { motion } from 'framer-motion';
import './Timeline.css';
import { useState, useRef, useEffect } from 'react';

const TimelineItem = ({ memory, index }) => {
  const imgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleLoad = () => {
      if (!imgRef.current) return;
      setDimensions({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight
      });
    };

    const imgEl = imgRef.current;
    if (imgEl) {
      imgEl.addEventListener('load', handleLoad);
      if (imgEl.complete) handleLoad();
    }

    return () => {
      if (imgEl) {
        imgEl.removeEventListener('load', handleLoad);
      }
    };
  }, [memory.image]);

  return (
    <motion.div
      className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      transition={{ duration: 0.6 }}
      style={{
        '--img-width': dimensions.width,
        '--img-height': dimensions.height
      }}
    >
      <motion.div 
        className="memory-card"
        whileHover={{ scale: 1.02 }}
      >
        <div className="memory-header">
          <div className="memory-date">
            {memory.date}
            <span className="heart-emoji">❤️</span>
          </div>
        </div>
        
        <div className="image-container">
          <img 
            ref={imgRef}
            src={memory.image} 
            alt={`Memory from ${memory.date}`}
            className="memory-image"
            loading="lazy"
            onError={(e) => e.target.style.display = 'none'} // Optional: hide if image fails
          />
          <div className="image-overlay"></div>
        </div>
        
        <div className="memory-content">
          <p>{memory.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Timeline = ({ memories }) => {
  return (
    <div className="timeline-container">
      <div className="timeline-line"></div>
      {memories.map((memory, i) => (
        <TimelineItem key={i} memory={memory} index={i} />
      ))}
    </div>
  );
};

export default Timeline;
