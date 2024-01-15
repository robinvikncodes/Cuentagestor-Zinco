import React from "react";
// import { Icone, Images } from "../../Asset/AssetsLog";
import {Icone, Images} from "../../Assets/AssetsLog"
import { Button, IconButton } from "@mui/material";
import styled from "@emotion/styled";

const Footer = () => {
  return (
    <>
      <div className="hidden lg:block bg-[#141D2E] rounded-t-3xl">
        <div className="md:flex justify-between hidden py-9 px-12">
          <div className="left"></div>
          <nav className="Navbar middle w-[55%]">
            <ul className="flex justify-between items-center ">
              <StyleIconButton>
                <img
                  src={Icone.HomeIcone}
                  alt=""
                  className="w-[24px] h-[24px]"
                />
              </StyleIconButton>
              <li>
                <a className="text-white text-[15px] font-[500]" href="/#">
                  Featuers
                </a>
              </li>
              {/* <li>
                <a className="text-white text-[15px] font-[500]" href="/#">
                  Pricing
                </a>
              </li> */}
              <li>
                <a className="text-white text-[15px] font-[500]" href="/#">
                  Testimonials
                </a>
              </li>
              <li>
                <a className="text-white text-[15px] font-[500]" href="/#">
                  Contacts
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="bg-[#0A1426] px-4 pt-11 pb-9">
        <div className="lg:flex justify-evenly w-full">
          <div>
            <h5 className="text-center  lg:text-left lg:mb-4">Download app</h5>
            <div className="flex flex-col xs:flex-row justify-between items-center max-w-[360px] mx-auto mb-9">
              <img
                className="w-[184px] h-[71px]"
                src={Images.playstoreImage}
                alt=""
              />
              <img
                className="w-[162px] h-[47px]"
                src={Images.appstoreImage}
                alt=""
              />
            </div>

            <div className="mb-9">
              <h5 className="text-center lg:text-left mb-5">Follow us</h5>
              <div className="flex justify-evenly max-w-[290px] mx-auto lg:mx-0 lg:justify-between">
                <IconButton>
                  <img src={Icone.FaceBookIcon} alt="" />
                </IconButton>
                <IconButton>
                  <img src={Icone.InstagramIcon} alt="" />
                </IconButton>
                <IconButton>
                  <img src={Icone.TwitterIcon} alt="" />
                </IconButton>
                <IconButton>
                  <img src={Icone.SnapChatIcon} alt="" />
                </IconButton>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-center mb-9">
              <StyleButton
                variant="text"
                startIcon={<img src={Icone.LanguageIcone} alt="Icone" />}
              >
                English
              </StyleButton>
            </div>

            <div className="mb-9">
              <h5 className="text-center lg:text-left">Security</h5>
              <p className="text-white text-[15px] font-[500] text-center lg:text-left my-3">
                Terms and conditions
              </p>
              <p className="text-white text-[15px] font-[500] text-center lg:text-left">
                Privacy policy
              </p>
            </div>
          </div>

          <div>
            <div className="mb-11">
              <h5 className="text-center lg:text-left">Contact</h5>
              <p className="text-white text-[15px] font-[500] text-center lg:text-left my-3">
                Phone: <span>+91 95775 00400</span>
              </p>
              <p className="text-white text-[15px] font-[500] text-center lg:text-left">
                Email: <span>cuentagestorllp@gmail.com</span>
              </p>
            </div>

            <p className="text-white text-[15px] font-[500] text-center lg:text-left">
              © 2023 Cuentagester LLP | All rights reserved
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;

const StyleButton = styled(Button)(() => ({
  color: "#fff",
  padding: "10px 20px 10px 20px",
  borderRadius: "30px",
  backgroundColor: "#1B2A45",
  fontFamily: "Poppins",
  fontSize: "15px",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: "normal",
  textTransform: "none",
}));

// const StyleButton = styled(Button)(() => ({
//   color: "#000",
//   fontFamily: "Poppins",
//   fontSize: "15px",
//   fontStyle: "normal",
//   fontWeight: "500",
//   lineHeight: "normal",
//   textTransform: "none",
// }));

const StyleButtonBlue = styled(Button)(() => ({
  color: "#fff",
  fontFamily: "Poppins",
  // margin: "0px 32px",
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

const StyleIconButton = styled(IconButton)(() => ({
  backgroundColor: "#EEF3FF",
  borderRadius: "370px",
  // marginRight: "32px",
  padding: "10px 20px 10px 20px",
}));
