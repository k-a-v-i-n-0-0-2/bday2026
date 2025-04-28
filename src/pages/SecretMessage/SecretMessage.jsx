import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import './SecretMessage.css';

const SecretMessage = () => {
  const [password, setPassword] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const correctPassword = 'iloveyou'; // Change this to your secret password

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAccessGranted(true);
    }
  };

  if (accessGranted) {
    return (
      <div className="love-diary">
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={200}
          colors={['#f5ebdd', '#8b4513', '#d4a373']}
        />
        
        {/* Diary decorative elements */}
        <div className="diary-cover"></div>
        <div className="diary-pages"></div>
        <div className="page-edge"></div>
        <div className="page-lines"></div>
        <div className="wax-seal">L</div>
        <div className="diary-ribbon"></div>
        
        <motion.div
          className="diary-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="diary-header">
            <span className="header-scroll">✒️</span>
            <span className="header-letter">💌</span>
            <h1 className="diary-title">
              <span>My Dearest</span>
              <span>Love</span>
            </h1>
            <p className="diary-subtitle">A letter from my heart</p>
          </div>

          <div className="divider">
            <span className="divider-heart">❤️</span>
            <span className="divider-pen">✒️</span>
            <span className="divider-heart">❤️</span>
          </div>

          <motion.div
            className="letter-content"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="letter-date">February 14th</p>
            
            <div className="letter-body">
              <p>
                My darling, as I sit to write these words, my heart overflows with love for you. 
                Each day with you feels like a page from the most beautiful story ever written.
              </p>
              
              <p>
                Your smile is the sunlight that brightens my darkest days, your laughter the melody 
                that plays in my heart's chamber. In your eyes, I've found my home, and in your arms, 
                my peace.
              </p>
              
              <p>
                Like the ancient books that withstand the test of time, my love for you grows only 
                stronger with each passing day. You are my greatest adventure, my most treasured 
                chapter, the story I never want to end.
              </p>
              
              <p>
                I promise to cherish you, to stand by you through all of life's seasons, to love you 
                more today than yesterday, but less than tomorrow.
              </p>
            </div>
            
            <div className="letter-signature">
              <p className="signature-line"></p>
              <p className="signature-name">Forever yours,</p>
              <p className="signature-main">[Your Name]</p>
            </div>
          </motion.div>

          <div className="diary-footer">
            <p>With all my love</p>
            <div className="footer-signature">
              <span className="signature-line"></span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="password-protected">
      <div className="parchment-container">
        <h2 className="spell-title">Unlock My Heart</h2>
        <p className="spell-subtitle">Enter our secret phrase</p>
        <form onSubmit={handleSubmit} className="spell-form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Whisper the magic words..."
            className="spell-input"
          />
          <motion.button
            type="submit"
            className="spell-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Open Diary
          </motion.button>
        </form>
        {password && password !== correctPassword && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="spell-error"
          >
            The diary remains locked... try again
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default SecretMessage;