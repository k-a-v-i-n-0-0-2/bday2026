import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaArrowLeft, FaPenFancy, Feather } from 'react-icons/fa';
import { GiLoveLetter, GiTiedScroll } from 'react-icons/gi';
import Album1 from './Album1';
import Album2 from './Album2';
import Album3 from './Album3';
import Album4 from './Album4';
import './Gallery.css';

const Gallery = () => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [hoveredAlbum, setHoveredAlbum] = useState(null);

  const albums = [
    { 
      id: 1, 
      title: 'First Whispers of Love', 
      cover: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      year: 'Spring 2020',
      description: 'When our eyes first met and hearts began their eternal conversation',
      quote: "In your smile I see something more beautiful than all the stars in the night sky",
      pages: 24,
      flowers: ['Rose', 'Lavender']
    },
    { 
      id: 2, 
      title: 'Wanderlust Hearts', 
      cover: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      year: '2021-2023',
      description: 'Footsteps together on foreign sands, love as our compass guiding us home',
      quote: "We travel not to escape life, but for life not to escape our togetherness",
      pages: 36,
      flowers: ['Sunflower', 'Daisy']
    },
    { 
      id: 3, 
      title: 'Celebration of Us', 
      cover: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      year: 'Every Moment',
      description: 'Marking time not by dates on calendars, but by heartbeats synchronized',
      quote: "The best thing to hold onto in this life is each other's hand",
      pages: 42,
      flowers: ['Peony', 'Orchid']
    },
    { 
      id: 4, 
      title: 'Quiet Intimacies', 
      cover: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      year: 'Timeless',
      description: 'The unphotographed moments that live forever in our souls',
      quote: "Love is composed of a single soul inhabiting two bodies - Aristotle",
      pages: 28,
      flowers: ['Baby\'s Breath', 'Forget-Me-Not']
    },
  ];

  const renderAlbum = () => {
    switch(selectedAlbum) {
      case 1: return <Album1 onBack={() => setSelectedAlbum(null)} />;
      case 2: return <Album2 onBack={() => setSelectedAlbum(null)} />;
      case 3: return <Album3 onBack={() => setSelectedAlbum(null)} />;
      case 4: return <Album4 onBack={() => setSelectedAlbum(null)} />;
      default: return null;
    }
  };

  return (
    <div className="love-diary">
      {/* Diary Cover Effect */}
      <div className="diary-cover"></div>
      
      {/* Diary Pages Texture */}
      <div className="diary-pages">
        <div className="page-edge"></div>
        <div className="page-lines"></div>
      </div>
      
      {/* Wax Seal Decoration */}
      <div className="wax-seal">
        <FaHeart />
      </div>
      
      {/* Diary Ribbon */}
      <div className="diary-ribbon"></div>
      
      {selectedAlbum ? (
        <div className="album-view-container">
          <motion.button 
            className="back-button"
            onClick={() => setSelectedAlbum(null)}
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft /> Back to Our Love Diary
          </motion.button>
          {renderAlbum()}
        </div>
      ) : (
        <>
          <motion.div 
            className="diary-header"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: 'spring' }}
          >
            <GiTiedScroll className="header-scroll" />
            <h1 className="diary-title">
              <span>Our Eternal</span>
              <span>Love Diary</span>
            </h1>
            <GiLoveLetter className="header-letter" />
            <p className="diary-subtitle">A chronicle of hearts intertwined through time</p>
            <div className="divider">
              <span className="divider-heart"><FaHeart /></span>
              <span className="divider-pen"><FaPenFancy /></span>
              <span className="divider-heart"><FaHeart /></span>
            </div>
          </motion.div>
          
          <div className="memory-albums">
            {albums.map((album) => (
              <motion.div
                key={album.id}
                className={`memory-chapter ${hoveredAlbum === album.id ? 'hovered' : ''}`}
                onClick={() => setSelectedAlbum(album.id)}
                onMouseEnter={() => setHoveredAlbum(album.id)}
                onMouseLeave={() => setHoveredAlbum(null)}
                initial={{ opacity: 0, y: 30, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: album.id * 0.2,
                  type: 'spring',
                  stiffness: 60
                }}
                whileHover={{ 
                  scale: 1.03, 
                  rotate: hoveredAlbum === album.id ? 1 : 0,
                  boxShadow: '0 15px 35px rgba(139, 69, 19, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="chapter-content">
                  <div className="photo-wrapper">
                    <img 
                      src={album.cover} 
                      alt={album.title} 
                      className="memory-photo"
                    />
                    <div className="photo-corners">
                      <span className="corner top-left"></span>
                      <span className="corner top-right"></span>
                      <span className="corner bottom-left"></span>
                      <span className="corner bottom-right"></span>
                    </div>
                    <div className="photo-tape"></div>
                    <div className="photo-stains"></div>
                  </div>
                  
                  <div className="chapter-details">
                    <h3>{album.title}</h3>
                    <p className="chapter-year">{album.year}</p>
                    <div className="chapter-meta">
                      <span className="pages">
                        <FaPenFancy /> {album.pages} pages
                      </span>
                      <span className="flowers">
                        {album.flowers.join(' & ')}
                      </span>
                    </div>
                    <p className="chapter-quote">"{album.quote}"</p>
                    
                    <motion.button 
                      className="read-chapter-btn"
                      whileHover={{ 
                        scale: 1.05, 
                        backgroundColor: 'rgba(139, 69, 19, 0.8)'
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Relive This Chapter
                    </motion.button>
                  </div>
                </div>
                
                <div className="chapter-decoration">
                  <div className="ink-splotch"></div>
                  <div className="flower-doodle"></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.footer 
            className="diary-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <p>
              "This diary grows heavier with love each year, 
              yet lighter to carry as our hearts become one"
            </p>
            <div className="footer-signature">
              <span>Forever Yours</span>
              <div className="signature-line"></div>
            </div>
          </motion.footer>
        </>
      )}
    </div>
  );
};

export default Gallery;