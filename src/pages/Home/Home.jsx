import { useState, useRef } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, useAnimation } from 'framer-motion';
import './Home.css';

const Home = () => {
  const photos = [
    { id: 1, src: '/p.jpg', caption: 'First Date', date: 'June 2022'},
    { id: 2, src: '/p.jpg', caption: 'Summer Trip', date: 'Aug 2022' },
    { id: 3, src: '/p.jpg', caption: 'Anniversary', date: 'Dec 2022' },
    { id: 4, src: '/p.jpg', caption: 'Beach Day', date: 'Mar 2023' },
    { id: 5, src: '/p.jpg', caption: 'Your Surprise', date: 'Today!' },
    { id: 6, src: '/p.jpg', caption: 'Your Surprise', date: 'Today!'},
    { id: 7, src: '/p.jpg', caption: 'Your Surprise', date: 'Today!' },
    { id: 8, src: '/p.jpg', caption: 'First Date', date: 'June 2022',  },
    { id: 9, src: '/p.jpg', caption: 'Summer Trip', date: 'Aug 2022'  },
    { id: 10, src: '/p.jpg', caption: 'Anniversary', date: 'Dec 2022' },
    { id: 11, src: '/p.jpg', caption: 'Beach Day', date: 'Mar 2023' },
    { id: 12, src: '/p.jpg', caption: 'Your Surprise', date: 'Today!' },
    { id: 13, src: '/p.jpg', caption: 'Your Surprise', date: 'Today!' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const dragX = useMotionValue(0);
  const rotate = useTransform(dragX, [-200, 200], [-25, 25]);
  const opacity = useTransform(dragX, [-150, -100, 100, 150], [1, 0, 0, 1]);

  const handleDragEnd = async (event, info) => {
    if (Math.abs(info.velocity.x) > 500) {
      await controls.start({
        x: info.velocity.x > 0 ? 500 : -500,
        opacity: 0,
        transition: { duration: 0.5 }
      });
      
      setCurrentIndex(prev => 
        info.velocity.x > 0 
          ? Math.max(0, prev - 1) 
          : Math.min(photos.length - 1, prev + 1)
      );
      
      await controls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0 }
      });
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  const spring = {
    type: "spring",
    damping: 15,
    stiffness: 100,
    bounce: 0.5
  };

  // Romantic color palette
  const romanticColors = [
    '#ff9a9e', '#fad0c4', '#fbc2eb', '#a6c1ee', 
    '#ffecd2', '#fcb69f', '#ff8177', '#ff867a',
    '#ff8c7f', '#f99185', '#f4c4f3', '#e7c6ff'
  ];

  return (
    <div className="memory-wall">
      {/* Enhanced Romantic Background */}
      <motion.div 
        className="bg-gradient"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      
      {/* Floating Hearts */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="floating-heart"
          initial={{ 
            y: window.innerHeight + 100,
            x: Math.random() * window.innerWidth,
            rotate: Math.random() * 360,
            opacity: 0
          }}
          animate={{
            y: -200,
            x: Math.random() * window.innerWidth,
            rotate: Math.random() * 360,
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 15 + Math.random() * 15,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
          style={{
            color: romanticColors[Math.floor(Math.random() * romanticColors.length)],
            fontSize: `${Math.random() * 30 + 20}px`,
          }}
        >
          ❤️
        </motion.div>
      ))}

      {/* Enhanced Bubbles with romantic colors */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="bubble"
          initial={{ y: window.innerHeight + 100, x: Math.random() * window.innerWidth }}
          animate={{
            y: -200,
            x: Math.random() * window.innerWidth,
            opacity: [0.8, 0.5, 0],
            scale: [1, 1.2, 1.5]
          }}
          transition={{
            duration: 20 + Math.random() * 20,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: "linear"
          }}
          style={{
            background: romanticColors[Math.floor(Math.random() * romanticColors.length)],
            width: `${Math.random() * 60 + 30}px`,
            height: `${Math.random() * 60 + 30}px`,
            borderRadius: `${Math.random() * 50 + 50}%`,
            filter: `blur(${Math.random() * 8 + 4}px)`
          }}
        />
      ))}

      <motion.div 
        className="header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.3 }}
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ ...spring, delay: 0.4 }}
        >
          Our Love Story
        </motion.h1>
        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Swipe or click to reveal memories
        </motion.p>
      </motion.div>

      <div className="photo-stack-container">
        <AnimatePresence custom={currentIndex}>
          {photos.map((photo, index) => (
            index >= currentIndex && (
              <motion.div
                key={photo.id}
                className={`polaroid ${index === currentIndex ? 'active' : ''}`}
                custom={index - currentIndex}
                drag={index === currentIndex ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{
                  zIndex: photos.length - index,
                  rotate: index === currentIndex ? rotate : 0,
                  opacity: index === currentIndex ? opacity : 1,
                  cursor: index === currentIndex ? 'grab' : 'default',
                }}
                whileTap={{ cursor: 'grabbing' }}
                whileHover={index === currentIndex ? { scale: 1.02 } : {}}
                initial={{ 
                  y: 50 + (index * 10),
                  opacity: 0,
                  rotate: Math.random() * 10 - 5
                }}
                animate={{
                  y: (index - currentIndex) * 5,
                  opacity: 1,
                  rotate: index === currentIndex ? 0 : Math.random() * 6 - 3,
                  transition: { 
                    delay: index * 0.1,
                    ...spring 
                  }
                }}
                exit={{
                  y: 300,
                  opacity: 0,
                  rotate: Math.random() * 30 - 15,
                  transition: { duration: 0.7 }
                }}
                onClick={() => {
                  if (index === currentIndex) {
                    controls.start({
                      y: 300,
                      opacity: 0,
                      rotate: Math.random() * 30 - 15,
                      transition: { duration: 0.7 }
                    }).then(() => {
                      setCurrentIndex(prev => (prev < photos.length - 1 ? prev + 1 : 0));
                      controls.start({ 
                        y: 0, 
                        opacity: 1,
                        rotate: 0
                      });
                    });
                  }
                }}
              >
                <motion.div 
                  className="polaroid-img"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ ...spring, delay: 0.2 }}
                >
                  <motion.img 
                    src={photo.src} 
                    alt={photo.caption}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
                <motion.div 
                  className="caption"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3>{photo.caption}</h3>
                  <p className="date">{photo.date}</p>
                </motion.div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Progress Dots */}
        <motion.div 
          className="progress-dots"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {photos.map((_, i) => (
            <motion.div
              key={i}
              className={`dot ${i === currentIndex ? 'active' : ''}`}
              animate={{
                scale: i === currentIndex ? 1.3 : 1,
                background: i === currentIndex ? romanticColors[i % romanticColors.length] : '#ddd'
              }}
              transition={spring}
            />
          ))}
        </motion.div>
      </div>

      {/* Enhanced Celebration Confetti */}
      <AnimatePresence>
        {currentIndex === photos.length - 1 && (
          <motion.div
            className="confetti-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(200)].map((_, i) => (
              <motion.div
                key={i}
                className="confetti"
                initial={{ 
                  x: 0,
                  y: -10,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{
                  x: Math.random() * 600 - 300,
                  y: Math.random() * 600 + 100,
                  rotate: Math.random() * 360,
                  opacity: 0
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.005,
                  ease: "circOut"
                }}
                style={{
                  background: romanticColors[Math.floor(Math.random() * romanticColors.length)],
                  width: `${Math.random() * 15 + 5}px`,
                  height: `${Math.random() * 15 + 5}px`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '0'
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Romantic Final Message */}
      <AnimatePresence>
        {currentIndex === photos.length - 1 && (
          <motion.div
            className="final-message"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <h2>I Love You</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;