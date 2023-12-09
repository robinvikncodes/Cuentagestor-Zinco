import { Button, IconButton, SwipeableDrawer } from "@mui/material";
import React, { useState } from "react";
import { Icone, Logo } from "../../Assets/AssetsLog";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const comeToLandingPage = function () {
    document.getElementById("landingPage").scrollIntoView();
  };
  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* For Desktop */}
      <div className="lg:flex justify-between hidden py-[32px] px-12">
        <div className="left">
          <a href="/">
            <img src={Logo.MainLogo} alt="" />
          </a>
        </div>
        <nav className="Navbar middle w-[43%]">
          <ul className="flex justify-between items-center ">
            <StyleIconButton onClick={comeToLandingPage} component={Link} to={'/#landingPage'}>
              <img src={Icone.HomeIcone} alt="" className="w-[24px] h-[24px]" />
            </StyleIconButton>
            <li className="mr-4">
              <a href="/#features">Featuers</a>
            </li>
            <li className="mr-4">
              <a href="/#pricing">Pricing</a>
            </li>
            <li className="mr-4">
              <a href="/#testmonies">Testimonials</a>
            </li>
            <li>
              <a href="/#contact">Contacts</a>
            </li>
          </ul>
        </nav>
        <div className="right flex justify-between items-center ">
          <StyleButton variant="text" component={Link} to={"/login"}>
            Sign in
          </StyleButton>
          <div className="mx-3">
            <StyleButtonBlue
              variant="contained"
              component={Link}
              to={"/dashboard"}
            >
              Get Started
            </StyleButtonBlue>
          </div>
          <StyleButton
            variant="text"
            startIcon={<img src={Icone.LanguageIcone} alt="Icone" />}
          >
            English
          </StyleButton>
        </div>
      </div>

      {/* For Mobile */}
      <div className="lg:hidden flex justify-between px-[12px] py-[15px] border-b-2">
        <div className="leftContainer"></div>
        <div className="RightContainer">
          <StyleButton
            variant="text"
            startIcon={<img src={Icone.LanguageIcone} alt="Icone" />}
          >
            English
          </StyleButton>
          <IconButton onClick={openDrawer}>
            <img src={Icone.MenuIcon} alt="" />
          </IconButton>
        </div>
        <SwipeableDrawer
          anchor={"top"}
          open={open}
          onOpen={openDrawer}
          onClose={closeDrawer}
        >
          <div className="pb-4">
            <div className="flex justify-between items-center px-4 py-5 border-b-2">
              <StyleButton variant="text" component={Link} to={"/login"}>
                Sign in
              </StyleButton>
              <StyleButtonBlue
                variant="contained"
                component={Link}
                to={"/dashboard"}
              >
                Get Started
              </StyleButtonBlue>
            </div>
            <div className="flex flex-col">
              <StyleButton
                sx={{ px: "24px", py: "14px", justifyContent: "flex-start" }}
                variant="text"
              >
                Features
              </StyleButton>
              <StyleButton
                sx={{ px: "24px", py: "14px", justifyContent: "flex-start" }}
                variant="text"
              >
                Pricing
              </StyleButton>
              <StyleButton
                sx={{ px: "24px", py: "14px", justifyContent: "flex-start" }}
                variant="text"
              >
                Testimonials
              </StyleButton>
              <StyleButton
                sx={{ px: "24px", py: "14px", justifyContent: "flex-start" }}
                variant="text"
              >
                Contacts
              </StyleButton>
            </div>
          </div>
        </SwipeableDrawer>
      </div>
    </header>
  );
};

export default Header;

const StyleButton = styled(Button)(() => ({
  color: "#000",
  fontFamily: "Poppins",
  fontSize: "15px",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: "normal",
  textTransform: "none",
}));

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
