import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { bannerData } from "../../api/bannerData";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";

const Banner = () => {
  return (
    <div className="mt-10">
      <div className="container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          className="w-full rounded-lg"
        >
          {bannerData.length > 0 &&
            bannerData.map((item) => (
              <SwiperSlide key={item.id}>
                <img
                  src={item.img}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Banner;
