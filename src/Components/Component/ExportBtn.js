import styled from "@emotion/styled";
import { Button, Popover, Typography } from "@mui/material";
import React, { useState } from "react";
import { Icone } from "../../Assets/AssetsLog";
import GridOnIcon from "@mui/icons-material/GridOn";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { ExportExcel } from "../../globalFunctions";

const ExportBtn = (props) => {
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
        variant="text"
        sx={{
          color: "#0245B2",
          px: "10.6px",
          py: "10px",
          width: "113px",
          height: "34px",
          justifyContent: "start",
          ...props.sx,
        }}
        onClick={handleClick}
        startIcon={
          <img
            style={{ marginLeft: "6px" }}
            src={Icone.ExportIcone}
            alt="icon"
          />
        }
      >
        <Typography
          sx={{ fontSize: "12px", ml: "5px", height: "13px", lineHeight: "1" }}
        >
          Export
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
        <Button
          startIcon={<GridOnIcon />}
          onClick={() => ExportExcel(props.JSONData, props.filename)}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            textTransform: "none",
            p: "10px",
            fontSize: "14px",
            width: "100%",
            color: "black",
          }}
          variant="text"
        >
          Excel
        </Button>
        <Button
          startIcon={<PictureAsPdfIcon />}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            textTransform: "none",
            p: "10px",
            fontSize: "14px",
            width: "100%",
            color: "black",
          }}
          variant="text"
        >
          PDF
        </Button>
      </StyledPopover>
    </>
  );
};

export default ExportBtn;

const StyledPopover = styled(Popover)(({ theme }) => ({
  // Custom styles for the popover
  top: "8px",
  "& .MuiPaper-root": {
    width: "137.5px",
    backgroundColor: "#F8F5FF", // Change this to the desired background color
    borderRadius: "6px",
    // padding: theme.spacing(2),
  },
}));
