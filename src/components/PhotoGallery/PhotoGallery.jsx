import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards, Autoplay } from 'swiper/modules';
import './PhotoGallery.css';

const PhotoGallery = ({ photos }) => {
  return (
    <div className="gallery-container">
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards, Autoplay]}
        autoplay={{ delay: 3000 }}
        className="mySwiper"
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index}>
            <motion.img
              src={photo}
              alt={`Memory ${index}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PhotoGallery;