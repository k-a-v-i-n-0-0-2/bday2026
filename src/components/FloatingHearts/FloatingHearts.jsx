import { motion } from 'framer-motion';
import './FloatingHearts.css';

const FloatingHearts = () => {
  const hearts = Array(15).fill(0);
  
  return (
    <div className="floating-hearts">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          className="heart"
          initial={{ y: 0, x: Math.random() * 100 }}
          animate={{
            y: [0, -100, -200, -300],
            x: [Math.random() * 100, Math.random() * 100 + 50, Math.random() * 100],
            opacity: [1, 0.8, 0.5, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;