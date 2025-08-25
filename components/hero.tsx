'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="w-full aspect-square lg:h-screen overflow-hidden relative after:content-[''] after:w-full after:h-12 after:lg:h-24 after:absolute after:bottom-0 after:left-0 after:from-black/0 after:to-black after:bg-gradient-to-b after:z-10">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        className="w-full h-full"
        modules={[Autoplay]}
        autoplay={{ delay: 5000 }}
        loop={true}
      >
        <SwiperSlide className='relative after:content-[""] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-black/30 after:z-10'>
          <Image
            src="/photo1.jpeg"
            alt="Slide 1"
            className="object-cover w-full h-full"
            layout="fill"
          />
        </SwiperSlide>
        <SwiperSlide className='relative after:content-[""] after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-black/30 after:z-10'>
          <Image
            src="/photo2.jpeg"
            alt="Slide 2"
            className="object-cover w-full h-full"
            layout="fill"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
