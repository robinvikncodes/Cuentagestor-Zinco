import styled from "@emotion/styled";
import { Button } from "@mui/material";
import React from "react";
import { Icone } from "../../../Assets/AssetsLog";
// import { Icone } from "../../Asset/AssetsLog";

const Pricing = () => {
  return (
    <div id="pricing" className="bg-[#5822F1] rounded-[30px] pt-[126px] pb-6 px-8 -z-20">
      <div className="mb-8">
        <h3 className="text-[#FFF] text-[31px] md:text-[41px] lg:text-[51px] font-[500] text-center leading-8 md:leading-10 lg:leading-10 tracking-tighter">
          Pricing Plans
        </h3>
        <h2 className="text-[#FFF] text-[33px] md:text-[43px] lg:text-[53px] font-[700] text-center leading-8 md:leading-10 lg:leading-[3rem] tracking-tighter mb-3 ">
          To Suit Your Financial Journey.
        </h2>
        <p className="text-[#DEDEDE] text-[14px] lg:text-[20px] font-[400] text-center">
          Choose the perfect plan that aligns with <br className="md:hidden" /> your financial goals
          and needs.
        </p>
      </div>

      <div className="max-w-[362px] mx-auto lg:flex lg:max-w-[640px] justify-between items-center">
        <div className="bg-[#2E1B64] rounded-2xl px-8 pt-[39px] pb-[24px] mb-8 ">
          <p className="text-white text-xl text-center font-[400] ">Starter</p>
          <h2 className="text-white text-[60px] text-center font-[600] mb-7">
            $8
          </h2>
          <ul className="list-disc pl-8 mb-14">
            <li className="text-white text-[16px] font-[400] mb-5 ">
              Upto 5 Accounts
            </li>
            <li className="text-white text-[16px] font-[400] mb-5 ">
              Upto 8 Income accounts
            </li>
            <li className="text-white text-[16px] font-[400] mb-5 ">
              Upto 8 Expense accounts
            </li>
            <li className="text-white text-[16px] font-[400] mb-5 ">
              Contacts Transactions
            </li>
            <li className="text-white text-[16px] font-[400] mb-5 ">
              Domestic Bank Transfers
            </li>
          </ul>

          <div className="flex justify-end w-full">
            <StyleButtonBlue
              variant="text"
              endIcon={<img src={Icone.ArrowUpright} alt="icone" />}
            >
              Get Started
            </StyleButtonBlue>
          </div>
        </div>

        <div className="bg-my-gradient rounded-2xl px-8 pt-[39px] pb-[24px]">
          <p className="text-white text-xl text-center font-[400] ">Premium</p>
          <h2 className="text-white text-[60px] text-center font-[600] mb-7">
            $23<span className="text-xl font-[400] ">/Month</span>
          </h2>
          <ul className="list-disc pl-8 mb-14">
            <li className="text-white text-[16px] font-[400] mb-5 ">
              Asset Managment
            </li>
            <li className="text-white text-[16px] font-[400] mb-5 ">
              Loan Managment
            </li>
            <li className="text-white text-[16px] font-[400] mb-5 ">
              Unlimited Accounts
            </li>
            <li className="text-white text-[16px] font-[400] mb-5 ">
              Unlimited Income accounts
            </li>
            <li className="text-white text-[16px] font-[400] mb-5 ">
              Unlimited Expense accounts
            </li>
            <li className="text-white text-[16px] font-[400] mb-5 ">
              Contacts Transactions
            </li>
            <li className="text-white text-[16px] font-[400] mb-5 ">
              International Bank Transfers
            </li>
          </ul>

          <div className="flex justify-end w-full">
            <StyleButtonBlue
              variant="text"
              endIcon={<img src={Icone.ArrowUpright} alt="icone" />}
            >
              Get Started
            </StyleButtonBlue>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

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
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#1F0256",
  },
}));
