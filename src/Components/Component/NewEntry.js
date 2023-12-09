// import React from 'react'
import { Box, Button, Paper, Popover, Typography } from "@mui/material";
import Popper from "@mui/base/Popper";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { styled } from "@mui/system";
// import FilterImg from "../../assets/icones/filter.svg";
import { useState } from "react";
import { Icone } from "../../Assets/AssetsLog";
// import Arrow from "../../assets/icones/arrowUp.svg"

const StyledPopover = styled(Popover)(({ theme }) => ({
  // Custom styles for the popover
  top: "8px",
  "& .MuiPaper-root": {
    width: "177.5px",
    backgroundColor: "#F8F5FF", // Change this to the desired background color
    borderRadius: "6px",
    // padding: theme.spacing(2),
  },
}));

const NewEntry = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Button
        sx={{
          backgroundColor: "#F8F5FF",
          color: "#7F52E8",
          mx: "9px",
          px: "10.6px",
          py: "10px",
          width: "113px",
          height: "34px",
          justifyContent: "start",
          "&:hover": {
            backgroundColor: "#F8F5FF",
          },
          ...props.sx,
        }}
        onClick={handleClick}
        startIcon={
          <img
            style={{ marginLeft: "6px" }}
            src={Icone.FilterIcon}
            alt="icon"
          />
        }
      >
        <Typography
          sx={{ fontSize: "12px", ml: "5px", height: "13px", lineHeight: "1" }}
        >
          Filter
        </Typography>
      </Button>
      <StyledPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {/* {props.children} */}
        <div className="p-2">
          <label htmlFor="fromDate" className="text-[#9B9B9B] text-[13px] font-[500]">From Date :</label>
          <input type="date" id="fromDate" name="fromDate" className="mb-1 p-1 rounded-lg" />

          <label htmlFor="toDate" className="text-[#9B9B9B] text-[13px] font-[500]">To Date :</label>
          <input type="date" id="toDate" name="toDate" className="mb-1 p-1 rounded-lg" />
        </div>
      </StyledPopover>
    </>
  );
};

export default NewEntry;

const StyledSidePopover = styled(Popover)(({ theme }) => ({
  // Custom styles for the popover
  left: "5px",
  "& .MuiPaper-root": {
    // width:'177.5px',
    backgroundColor: "#F8F5FF", // Change this to the desired background color
    borderRadius: "8px",
    fontSize: "12px",
    // padding: theme.spacing(2),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  // Custom styles for the button
  width: "100%",
  backgroundColor: "#F8F5FF",
  borderRadius: "0",
  justifyContent: "space-between", // Align text to the left
  fontSize: "12px",
  "&:hover": {
    backgroundColor: "#F8F5FF",
  },

  "& .MuiButton-endIcon": {
    marginLeft: theme.spacing(1), // Space between text and icon
    fontSize: "12px", // Font size of the endIcon
  },
}));

export const SubDroapDown = (props) => {
  const [anchorElSec, setAnchorElSec] = useState(null);

  const handleClickSec = (event) => {
    setAnchorElSec(event.currentTarget);
  };

  const handleCloseSec = () => {
    setAnchorElSec(null);
  };

  const openSec = Boolean(anchorElSec);
  const idSec = openSec ? "simple-popover" : undefined;

  return (
    <>
      <StyledButton
        aria-describedby={idSec}
        variant="contained"
        onClick={handleClickSec}
        endIcon={<ArrowForwardIosIcon style={{ fontSize: "12px" }} />}
      >
        {props.name}
      </StyledButton>
      <StyledSidePopover
        id={idSec}
        open={openSec}
        anchorEl={anchorElSec}
        onClose={handleCloseSec}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {props.children}
      </StyledSidePopover>
    </>
  );
};

const StyledInnerButton = styled(Button)(({ theme }) => ({
  // Custom styles for the button
  width: "100%",
  backgroundColor: "#F8F5FF",
  borderRadius: "0",
  justifyContent: "flex-start", // Align text to the left
  fontSize: "12px",
  "&:hover": {
    backgroundColor: "#232424",
  },

  "& .MuiButton-endIcon": {
    marginLeft: theme.spacing(1), // Space between text and icon
    fontSize: "12px", // Font size of the endIcon
  },
}));

export const InnerButton = (props) => {
  return (
    <StyledInnerButton variant="contained" {...props}>
      {props.children}
    </StyledInnerButton>
  );
};
