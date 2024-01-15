import React from "react";

import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { Icone, Images } from "../../../Assets/AssetsLog";
import { Link } from "react-router-dom";

const userData = localStorage.getItem("UserCredentials");

const LandingPage = () => {
  return (
    <div className="h-[100vh] bg-white lg:px-32 ">
      <div id="landingPage" className="lg:flex justify-between items-center h-full">
        <div className="LeftContainer flex flex-col items-center lg:items-start pt-16">
          <div className="mb-3">
            <h1 className="text-[43px] md:text-[49px] lg:text-[59px] 2xl:text-[91px] font-[700] leading-8 lg:leading-10 tracking-tighter text-center lg:text-left lg:mb-1">Take Control</h1>
            <h2 className="text-[#0E0256] text-[31px] md:text-[37px] 2xl:text-[45px] lg:text-[] font-[500] leading-8 lg:leading-[4rem] tracking-tighter text-center lg:text-left lg:mb-3">
              of Your Finances
            </h2>
          </div>
          <h3 className="text-sm md:text-[19px] lg:text-[] text-center font-[400] mb-7 lg:mb-11">
            Manage Money Exchanges, Income, Expenses, <br /> 
            Loans, Assets, and Bank Transfers Effortlessly.
          </h3>

          <StyleButtonBlue
            component={Link} to={userData ? '/dashboard': "login"} 
            endIcon={<img src={Icone.ArrowUpright} alt="icone" />}
          >
            Try for Free
          </StyleButtonBlue>
        </div>
        <div className="rightContainer mt-14">
          <div className="flex justify-center">
            {/* <img src={Images.dashboardImage} alt="" /> */}
            <div className="w-[379px] relative">
              <img className="w-[270px] mx-auto " src={Images.dashboardImage} alt="" />
              <img className="absolute bottom-2" src={Images.SummarySlice} alt="" />
              <img className="absolute top-16 right-8" src={Images.Avtar3} alt="" />
              <img className="absolute top-44 left-8" src={Images.Avtar2} alt="" />
              <img className="absolute bottom-36 right-8" src={Images.Avtar1} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

const StyleButtonBlue = styled(Button)(() => ({
  color: "#fff",
  minWidth: "150px",
  maxWidth: "172px",
  fontFamily: "Poppins",
  fontSize: "15px",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: "normal",
  borderRadius: "25px",
  background: "#1F0256",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#1F0256",
  },
}));
