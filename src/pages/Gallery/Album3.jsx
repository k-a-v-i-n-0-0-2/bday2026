import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import './Album3.css';
import { saveAs } from 'file-saver';

const Album1 = ({ onBack }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const xInput = [-100, 0, 100];
  const background = useTransform(x, xInput, [
    "linear-gradient(180deg, #ff008c 0%, rgb(211, 9, 225) 100%)",
    "linear-gradient(180deg, #7700ff 0%, rgb(68, 0, 255) 100%)",
    "linear-gradient(180deg, rgb(230, 255, 0) 0%, rgb(3, 209, 0) 100%)"
  ]);

  const photos = [
    { id: 1, src: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', caption: 'Our first date' },
    { id: 2, src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', caption: 'First movie together' },
    { id: 3, src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', caption: 'First dinner date' },
  ];

  const handleDownload = (imgUrl) => {
    saveAs(imgUrl, `our-memory-${Date.now()}.jpg`);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      // Swipe right
      setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);
    } else if (info.offset.x < -100) {
      // Swipe left
      setCurrentIndex(prev => (prev + 1) % photos.length);
    }
  };

  return (
    <motion.div className="album-view" style={{ background }}>
      <motion.button 
        className="back-button" 
        onClick={onBack}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ← Back to Albums
      </motion.button>
      
      <motion.h2 
        className="album-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Our First Dates
      </motion.h2>

      <div className="hearts-container">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="heart"
            initial={{ scale: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              opacity: 0
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "loop",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="photo-grid">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            className="photo-card"
            whileHover={{ scale: 1.05, rotate: Math.random() * 4 - 2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => {
              setSelectedId(photo.id);
              setCurrentIndex(photos.findIndex(p => p.id === photo.id));
            }}
          >
            <img src={photo.src} alt={photo.caption} />
            <p>{photo.caption}</p>
            <motion.div 
              className="heart-badge"
              whileHover={{ scale: 1.2 }}
            >
              ❤️
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div 
            className="photo-overlay" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="swipe-container" ref={constraintsRef}>
              <motion.div
                className="photo-carousel"
                drag="x"
                dragConstraints={constraintsRef}
                onDragEnd={handleDragEnd}
                style={{ x }}
              >
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    className="photo-slide"
                    animate={{ 
                      scale: index === currentIndex ? 1 : 0.9,
                      opacity: index === currentIndex ? 1 : 0.7
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <img src={photo.src} alt={photo.caption} />
                    <motion.p>{photo.caption}</motion.p>
                    <motion.button
                      className="download-btn"
                      onClick={() => handleDownload(photo.src)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Download Memory
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.button
              className="close-btn"
              onClick={() => setSelectedId(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>

            <div className="navigation-dots">
              {photos.map((_, index) => (
                <motion.div
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Album1;