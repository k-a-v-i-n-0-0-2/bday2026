import { useSpring, animated } from 'react-spring';
import Typed from 'typed.js';
import { useEffect, useRef } from 'react';
import './LoveMessage.css';

const LoveMessage = () => {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 500,
  });

  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ["Happy Birthday, Love!", "You mean the world to me", "Here's to many more memories together"],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true
    });

    return () => typed.destroy();
  }, []);

  return (
    <animated.div style={fadeIn} className="message-container">
      <h1 ref={typedRef}></h1>
    </animated.div>
  );
};

export default LoveMessage;