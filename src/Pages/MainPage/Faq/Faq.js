import React from "react";
import Accordian from "./Components/Accordian";
import Accordian1 from "./Components/Accordian1";

const Faq = () => {
  return (
    <div id="faq" className="px-4 py-12 md:px-7 lg:px-24">
      <div className="mb-7">
        <h2 className="text-[#028FCB] text-[31px] sm:text-[41px] lg:text-[48px] font-[700] text-center leading-6 sm:leading-8 lg:leading-10 tracking-tighter">
          Common Questions
        </h2>
        <h3 className="text-[#654CFA] text-[25px] sm:text-[35px] lg:text-[40px] font-[500] text-center leading-6 sm:leading-8 lg:leading-10 tracking-tighter mb-2">
          About cuentagester.
        </h3>

        <p className=" text-center text-sm sm:text-[18px] font-[400] sm:leading-6 ">
          Find the answers you're looking for to make <br /> the most of cuentagester.
        </p>
      </div>

      <div >
      <Accordian1 />
      </div>
    </div>
  );
};

export default Faq;
