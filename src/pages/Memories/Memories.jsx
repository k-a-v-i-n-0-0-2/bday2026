import { motion } from 'framer-motion';
import Timeline from '../../components/Timeline/Timeline';
import './Memories.css';

const memories = [
  {
    date: 'June 12, 2022',
    description: 'The day our eyes met over spilled coffee. Your flustered smile stole my heart instantly.',
    image: '/p2.jpg',
    emoji: '☕️'
  },
  {
    date: 'August 5, 2022',
    description: 'Our first date - your laughter at my terrible pasta joke was the sweetest melody.',
    image: '/p.jpg',
    emoji: '🍝'
  },
  {
    date: 'December 24, 2022',
    description: 'Christmas Eve - the tears in your eyes when you opened my gift reflected all my love for you.',
    image: '/p.jpg',
    emoji: '🎁'
  },
  {
    date: 'March 15, 2023',
    description: 'Getting lost in the mountains led us to discover breathtaking views... and deeper love.',
    image: '/p.jpg',
    emoji: '⛰️'
  },
  // Add more memories as needed
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Memories = () => {
  return (
    <motion.div 
      className="memories-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        Our Beautiful Journey
      </motion.h1>
      <motion.p 
        className="subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Every moment with you is a treasure...
      </motion.p>
      <Timeline memories={memories} />
    </motion.div>
  );
};

export default Memories;
