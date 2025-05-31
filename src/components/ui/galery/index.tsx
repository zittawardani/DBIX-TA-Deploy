import React, { useEffect, useState } from 'react';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Skeleton } from '../skeleton';

interface CustomCSSProperties extends React.CSSProperties {
  '--swiper-navigation-color'?: string,
  '--swiper-pagination-color'?: string,
}

const Gallery = ({ image }: { image?: string[] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null)
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleSlideChange = (swiper: SwiperCore) => {
    setActiveIndex(swiper.activeIndex || 0);
  }

  const swiperStyle: CustomCSSProperties = {
    '--swiper-navigation-color': '#fff',
    '--swiper-pagination-color': '#fff',
  };

  const hasImages = image && image.length > 0

  return (
    <div className='w-full'>
      <SwiperComponent style={swiperStyle} spaceBetween={10} navigation={true} thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined} modules={[FreeMode, Navigation, Thumbs]} className="mySwiper2" onSlideChange={handleSlideChange}>
        {hasImages ? (
          image?.map((item, index) => (
            <SwiperSlide key={index}>
              <img src={item} alt={`Image ${index}`} className='w-full h-72 rounded-lg object-cover' />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <Skeleton className='w-full h-72' />
          </SwiperSlide>
        )}
      </SwiperComponent>

      <SwiperComponent onSwiper={setThumbsSwiper} spaceBetween={10} slidesPerView={4} freeMode={true} watchSlidesProgress={true} modules={[FreeMode, Navigation, Thumbs]} className="mySwiper mt-3">
        {hasImages ? (
          image?.map((item, index) => (
            <SwiperSlide key={index} className='cursor-pointer relative z-0'>
              <img src={item} alt={`Thumbnail ${index}`} className='w-full h-16 object-cover rounded-lg' />
              {activeIndex === index && (
                <div
                  className='absolute top-0 left-0 w-full h-16 bg-secondary/70 rounded-lg z-10'
                ></div>
              )}
            </SwiperSlide>
          ))
        ) : (
          <>
            {[...Array(4)].map((_, index) => (
              <SwiperSlide key={index}>
                <Skeleton className='w-full h-16 rounded-lg' />
              </SwiperSlide>
            ))}
          </>
        )}
      </SwiperComponent>
    </div>
  );
};

export default Gallery;
