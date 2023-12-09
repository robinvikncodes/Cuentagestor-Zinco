import styled from "@emotion/styled";
import { Button, IconButton } from "@mui/material";
import React from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Icone } from "../../../Assets/AssetsLog";

const UserRole = () => {
  return (
    <div>
      <div className="flex justify-between items-center px-5 pb-5 border-b-[1px] border-[#DEDEDE]">
        <p className="text-[16px] font-[400]">User</p>
        <div className="flex items-center">
          {/* <p className="mr-[15px] text-[#868686] text-[13px] font-[400]">User role</p> */}

          <StyledButton startIcon={<AddRoundedIcon />}>User role</StyledButton>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between p-3 borderStyle rounded-[12px] mb-2">
          <div className="flex">
            <div className="bg-[#DFFFEA] p-[10px] rounded-full mr-3">
                <img src={Icone.PersonIcon} alt="" />
            </div>
            <div>
                <p className="text-[16px] font-[400]">Savad Farooque</p>
                <p className="text-[#868686] text-[13px] font-[400]">Admin</p>
            </div>
          </div>

          <div className="flex">
            <IconButton aria-label="delete" color="error" sx={{ color: "#3634A8" }}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" color="error" sx={{ color: "#3634A8" }}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>

        <div className="flex justify-between p-3 borderStyle rounded-[12px] mb-2">
          <div className="flex">
            <div className="bg-[#DFFFEA] p-[10px] rounded-full mr-3">
                <img src={Icone.PersonIcon} alt="" />
            </div>
            <div>
                <p className="text-[16px] font-[400]">Dennis Jose</p>
                <p className="text-[#868686] text-[13px] font-[400]">Admin</p>
            </div>
          </div>

          <div className="flex">
            <IconButton aria-label="delete" color="error" sx={{ color: "#3634A8" }}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" color="error" sx={{ color: "#3634A8" }}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRole;

const StyledButton = styled(Button)(() => ({
  justifyContent: "space-between",
  // width: "100%",
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#7F52E8",
  backgroundColor: "#F8F5FF",
  borderRadius: "30px",
  border: "1px solid #E4E4E4",
  textTransform: "none",
}));
