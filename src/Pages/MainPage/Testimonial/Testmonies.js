import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/swiper-bundle.css";
// import required modules
import { Pagination } from "swiper/modules";
import { Icone, Images } from "../../../Assets/AssetsLog";
// import { Icone, Images } from "../../Asset/AssetsLog";

const testmoneyList = [
  {
    name: "Savad Farooque",
    post: "UI/UX Designer @ Vikncodes",
    description: `Cuentagester is a game-changer for managing finances. It
    streamlines everything, from tracking transactions to loan
    payments and asset management. It made my financial life so much
    easier, and I highly recommend it!`,
    image: Images.Avtar4,
  },
  {
    name: "Savad Farooque",
    post: "UI/UX Designer @ Vikncodes",
    description: `Cuentagester is a game-changer for managing finances. It
    streamlines everything, from tracking transactions to loan
    payments and asset management. It made my financial life so much
    easier, and I highly recommend it!`,
    image: Images.Avtar4,
  },
  {
    name: "Savad Farooque",
    post: "UI/UX Designer @ Vikncodes",
    description: `Cuentagester is a game-changer for managing finances. It
    streamlines everything, from tracking transactions to loan
    payments and asset management. It made my financial life so much
    easier, and I highly recommend it!`,
    image: Images.Avtar4,
  }
]

const Testmonies = () => {
  return (
    <div id="testmonies" className=" py-10">
      <div className="mb-7">
        <h2 className="text-[#028FCB] text-[31px] sm:text-[41px] lg:text-[48px] font-[700] text-center leading-6 sm:leading-8 lg:leading-10 tracking-tighter">
          What Our Users Say
        </h2>
        <h3 className="text-[#654CFA] text-[25px] sm:text-[35px] lg:text-[40px] font-[500] text-center leading-6 sm:leading-8 lg:leading-10 tracking-tighter mb-2">
          About cuentagester.
        </h3>
        <p className=" text-center text-sm sm:text-[18px] font-[400] sm:leading-6 lg:leading-10 ">
          Real stories from real people who've <br className="md:hidden" />{" "}
          transformed their finances.
        </p>
      </div>

      <div className="max-w-[798px] mx-auto">
        <Swiper
          pagination={{
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
          wrapperTag="ul"
        >
          {testmoneyList.map((i, key) => 
          <SwiperSlide key={key + 1}>
            <div className="rounded-2xl bg-[#1767F4] px-16 pt-20 py-10 mx-5 relative mt-[72px]">
              <img src={i.image} alt="" className="h-[140px] w-[140px] absolute top-[-19%] left-1/2 transform -translate-x-1/2 z-50"/>
              <h2 className="text-white text-[31px] font-[600] text-center mb-4">
                {i.name}
              </h2>
              <h3 className="text-[#ABC9FF] text-[19px] font-[400] text-center mb-3">
                {i.post}
              </h3>
              <p className="text-[#fff] text-[17px] font-[400] w-[583px] mx-auto mb-14 text-center italic">
                {i.description}
              </p>
              <img className="absolute top-40 left-4" src={Icone.ComaUpIcon} alt="" />
              <img className="absolute bottom-14 right-14" src={Icone.ComaDownIcon} alt="" />
            </div>
          </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default Testmonies;
