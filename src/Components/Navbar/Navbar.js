import React from "react";
import { Avatar, Button, IconButton, Popover } from "@mui/material";
import NewEntry from "../Component/NewEntry";
import { Icone, Images, Logo } from "../../Assets/AssetsLog";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationModal from "./Components/NotificationModal";
import CountryModal from "./Components/CountryModal";
import CompanyModal from "./Components/CompanyModal";
import AddExpenses from "../../Pages/Expenses/Components/AddExpenses";
import AddIncomeModal from "../../Pages/Income/Components/AddIncomeModal";
import ZincoModal from "../Component/ZincoModal";
import { LogoutFun } from "../../globalFunctions";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isDashboardPage = location.pathname === "/dashboard";
  const isAboutPage = location.pathname === "/about";

  const [openCountry, setOpenCountry] = React.useState(false);
  const [openCompany, setOpenCompany] = React.useState(false);

  const handleOpenCountry = () => setOpenCountry(true);
  const handleCloseCountry = () => setOpenCountry(false);

  const handleOpenCompany = () => setOpenCompany(true);
  const handleCloseCompany = () => setOpenCompany(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [isExpired, setIsExpired] = React.useState(false);
  const handleCloseExpire = function () {
    setIsExpired(false);
  };

  const handleClickPoper = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePoper = () => {
    setAnchorEl(null);
  };

  const openPoper = Boolean(anchorEl);
  const id = openPoper ? "simple-popover" : undefined;

  const [openNotifaction, setOpenNotifaction] = React.useState(false);
  const handleOpenNotifaction = () => setOpenNotifaction(true);
  const handleCloseNotifaction = () => setOpenNotifaction(false);

  const [openExpenses, setOpenExpenses] = React.useState(false);
  const handleOpenExpenses = () => setOpenExpenses(true);
  const handleCloseExpenses = () => setOpenExpenses(false);

  const [openIncome, setOpenIncome] = React.useState(false);
  const handleOpenIncome = () => setOpenIncome(true);
  const handleCloseIncome = () => setOpenIncome(false);

  const navigate = useNavigate();

  return (
    <>
      <header style={{ display : isHomePage ? "none" : "block"}}>
        <nav className="flex justify-between py-4 px-6">
          <div className="flex cursor-pointer" onClick={() => isAboutPage ? navigate("/") : navigate("/dashboard")}>
            <img src={Logo.MainLogo} alt="" className="mr-1" />
            {/* <img src={Logo.ZincoLogo} alt="" /> */}
          </div>

          <div style={{ display: isAboutPage ? "none" : "flex"}} className="flex justify-between items-center">

            <IconButton
              aria-describedby={id}
              onClick={handleClickPoper}
              sx={{
                backgroundColor: "#7F52E8",
                mr: "32px",
                "&:hover": {
                  backgroundColor: "#7F52E8",
                },
              }}
            >
              <img src={Icone.PlusIcon} alt="" />
            </IconButton>
            <Popover
              id={id}
              open={openPoper}
              anchorEl={anchorEl}
              onClose={handleClosePoper}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              sx={{
                "& .MuiPaper-rounded": {
                  borderRadius: "13px",
                },
              }}
            >
              <div className="flex flex-col">
                <Button
                  sx={{
                    justifyContent: "space-between",
                    textTransform: "none",
                    color: "#545454",
                    fontSize: "13px",
                    fontWeight: 400,
                    width: 170,
                  }}
                  endIcon={<img src={Icone.PurplePlus} alt="" />}
                  onClick={handleOpenExpenses}
                >
                  New Expenses
                </Button>
                <Button
                  onClick={handleOpenIncome}
                  sx={{
                    justifyContent: "space-between",
                    textTransform: "none",
                    color: "#545454",
                    fontSize: "13px",
                    fontWeight: 400,
                    width: 170,

                    borderTop: "1px solid #E7E7E7",
                    borderBlock: "1px solid #E7E7E7",
                  }}
                  endIcon={<img src={Icone.PurplePlus} alt="" />}
                >
                  New Income
                </Button>
                <Button
                  sx={{
                    justifyContent: "space-between",
                    textTransform: "none",
                    color: "#545454",
                    fontSize: "13px",
                    fontWeight: 400,
                    width: 170,
                  }}
                  endIcon={<img src={Icone.PurplePlus} alt="" />}
                >
                  Make a transfer
                </Button>
              </div>
            </Popover>

            <Button
              onClick={() => handleOpenCountry()}
              disabled={!isDashboardPage}
              className="country"
              startIcon={<img src={Icone.FlagIcon} alt="flagIcon" />}
              endIcon={isDashboardPage && <img src={Icone.DownArrow} alt="" />}
              sx={{
                mr: "22px",
                borderRadius: "30px",
                px: "16px",
                backgroundColor: "#FFF", // Background color
                color: "black", // Text color
                "&:hover": {
                  backgroundColor: "#FFF", // Background color on hover
                },
                "&.Mui-disabled": {
                  backgroundColor: "#FFF", // Background color when disabled
                  color: "black"
                },
              }}
            >
              {userData.country_details.country_name}
            </Button>
            {/* <NewEntry/> */}

            <div className="userProfile flex items-center mr-4">
              <p className="mr-2">{userData.username}</p>
              {/* <img src="" alt="" /> */}
              <Avatar alt="Remy Sharp" />
            </div>

            <IconButton
              sx={{ mr: "6px" }}
              onClick={() => handleOpenNotifaction()}
            >
              <img src={Icone.NotificationIcon} alt="" />
            </IconButton>
            <IconButton component={Link} to="/setting">
              <img src={Icone.SettingIcon} alt="" />
            </IconButton>
          </div>
        </nav>
      </header>

      {/* <CompanyModal
        open={openCompany}
        handleClose={handleCloseCompany}
      /> */}

      <CountryModal open={openCountry} handleClose={handleCloseCountry} />

      <NotificationModal
        open={openNotifaction}
        handleClose={handleCloseNotifaction}
      />

      <AddExpenses open={openExpenses} handleClose={handleCloseExpenses} />
      <AddIncomeModal open={openIncome} handleClose={handleCloseIncome} />

      <ZincoModal open={isExpired} handleClose={handleCloseExpire}>
          <div className="px-[48px] py-[41px]">
            <img src={Images.ExpireImg} alt="" className="mb-4"/>
            <p className="text-[#5346BD] texxt-[16px] font-[400] text-center">
              Contact
            </p>
            <p className="text-center mb-6">+91 8789 0099</p>
            <div className="flex justify-center">
              <Button
                onClick={LogoutFun}
                sx={{
                  color: "#DE4343",
                  fontSize: "16px",
                  fontWeight: "400",
                  textTransform: "none",
                }}
                variant="text"
              >
                Log out
              </Button>
            </div>
          </div>
        </ZincoModal>
    </>
  );
};

export default Navbar;
