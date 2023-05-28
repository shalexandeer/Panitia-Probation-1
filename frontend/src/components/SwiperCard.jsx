import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-creative';

// import required modules
import { EffectCreative } from 'swiper';

const SwiperCard = ({ children }) => {
    return (
        <>
            <Swiper
                grabCursor={true}
                effect={'creative'}
                creativeEffect={{
                    prev: {
                        shadow: true,
                        translate: [0, 0, -400]
                    },
                    next: {
                        translate: ['100%', 0, 0]
                    }
                }}
                modules={[EffectCreative]}
                className='mySwiper'>
                <SwiperSlide>{children}</SwiperSlide>
            </Swiper>
        </>
    );
};

export default SwiperCard;
