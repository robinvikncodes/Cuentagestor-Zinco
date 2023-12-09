import styled from "@emotion/styled";
import { Button } from "@mui/material";
import React from "react";

const Contact = () => {
  return (
    <div id="contact" className="bg-[#141D2E] py-14 px-8 rounded-2xl">
      <div className="mb-7">
        <h2 className="text-[#836DFF] text-[26px] sm:text-[36px] lg:text-[46px] font-[700] leading-7 lg:leading-10 tracking-tighter text-center ">
          Let's Connect and Discuss{" "}
        </h2>
        <h3 className="text-[#53CCFF] text-[25px] sm:text-[35px] lg:text-[45px] font-[500] leading-7 lg:leading-10 tracking-tighter text-center mb-4">
          Your Financial Goals.
        </h3>
        <p className="text-white text-[14px] sm:text-[18px] font-[400] tracking-tighter text-center">
          We're here to assist you every step <br /> of the way.
        </p>
      </div>

      <div className="max-w-[494px] mx-auto">
        <form action="/">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            className="bg-[#233851] p-3 rounded-lg text-[#DEDEDE] text-[15px] font-[400] mb-7 w-full focus:ring-0 focus:ring-offset-0 TextField"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="bg-[#233851] p-3 rounded-lg text-[#DEDEDE] text-[15px] font-[400] mb-7 w-full TextField"
          />

          <input
            type="tel"
            name="phoneNo"
            placeholder="Phone No"
            className="bg-[#233851] p-3 rounded-lg text-[#DEDEDE] text-[15px] font-[400] mb-7 w-full TextField"
          />

          <textarea
            name="message"
            id="message"
            placeholder="Message"
            rows="4"
            className="bg-[#233851] p-3 rounded-lg text-[#DEDEDE] text-[15px] font-[400] mb-10 w-full TextField"
          ></textarea>

          <div className="flex justify-center">
            <StyleButtonBlue type="submit">Submit</StyleButtonBlue>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;

const StyleButtonBlue = styled(Button)(() => ({
  color: "#fff",
  padding: "8px 30px 8px 30px",
  fontFamily: "Poppins",
  fontSize: "15px",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: "normal",
  borderRadius: "25px",
  textTransform: "none",
  backgroundColor: "#1767F4",
  "&:hover": {
    backgroundColor: "#1767F4",
  },
}));
