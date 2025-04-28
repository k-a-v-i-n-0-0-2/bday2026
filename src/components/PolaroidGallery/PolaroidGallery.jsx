// components/PolaroidGallery/PolaroidGallery.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PolaroidGallery.css';

const PolaroidGallery = ({ photos }) => {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="polaroid-container">
      <h2>Our Special Moments</h2>
      <div className="polaroid-grid">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            className="polaroid"
            layoutId={`polaroid-${photo.id}`}
            onClick={() => setSelectedId(photo.id)}
            whileHover={{ scale: 1.05 }}
          >
            <div className="polaroid-image">
              <img src={photo.src} alt={photo.caption} />
            </div>
            <p>{photo.caption}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div className="polaroid-overlay" onClick={() => setSelectedId(null)}>
            {photos.map((photo) => (
              photo.id === selectedId && (
                <motion.div
                  key={photo.id}
                  className="polaroid-expanded"
                  layoutId={`polaroid-${photo.id}`}
                >
                  <img src={photo.src} alt={photo.caption} />
                  <motion.p>{photo.caption}</motion.p>
                </motion.div>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PolaroidGallery;