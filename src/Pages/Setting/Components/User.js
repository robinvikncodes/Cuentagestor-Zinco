// import styled from "@emotion/styled";
import { styled } from "@mui/material/styles";
import { Autocomplete, Button, TextField } from "@mui/material";
import React from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ZincoSwitch from "../../../Components/Component/ZincoSwitch";

const User = () => {
  const popperStyle = {
    // Custom styles for the popper
    backgroundColor: "blue",
    borderRadius: "4px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    zIndex: (theme) => theme.zIndex.modal + 1, // Adjust the z-index as needed
  };

  return (
    <div>
      <div className="flex justify-between items-center px-5 pb-5 border-b-[1px] border-[#DEDEDE]">
        <p className="text-[16px] font-[400]">User roles</p>
        <div className="flex items-center">
          <p className="mr-[15px] text-[#868686] text-[13px] font-[400]">User role</p>
          <StyledAutocomplete
            color="red"
            funce="sound"
            popperprops={{
              style: popperStyle,
            }}
            placeholder="Select App"
            options={["Soman", "Gopi", "Sashi", "Remanan", "Shaji"]}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                // placeholder={"placeholder"}
                fullWidth
              />
            )}
          />
          <StyledButton startIcon={<AddRoundedIcon />}>User role</StyledButton>
        </div>
      </div>
      <div className="p-[21px]">
        <div className="borderStyle rounded-[22px]">
        <table className="w-full">
            <thead>
                <tr>
                    <th className="px-[25px] py-[15px] border-b-[1px] border-[#E0E0E0] text-left text-[16px] font-[400] ">Section</th>
                    <th className="px-[25px] py-[15px] border-b-[1px] border-[#E0E0E0] text-left text-[16px] font-[400] w-[13%]">View</th>
                    <th className="px-[25px] py-[15px] border-b-[1px] border-[#E0E0E0] text-left text-[16px] font-[400] w-[13%]">Create</th>
                    <th className="px-[25px] py-[15px] border-b-[1px] border-[#E0E0E0] text-left text-[16px] font-[400] w-[13%]">Edit</th>
                    <th className="px-[25px] py-[15px] border-b-[1px] border-[#E0E0E0] text-left text-[16px] font-[400] w-[13%]">delete</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0] text-[#868686] text-[14px] font-[400]" >Contacts</td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]" > <ZincoSwitch /> </td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]" > <ZincoSwitch /> </td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]" > <ZincoSwitch /> </td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]" > <ZincoSwitch /> </td>
                </tr>
                <tr>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0] text-[#868686] text-[14px] font-[400]">Incomes</td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch /></td>
                </tr>
                <tr>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0] text-[#868686] text-[14px] font-[400]">Expenses</td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch /></td>
                </tr>
                <tr>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0] text-[#868686] text-[14px] font-[400]">Loans</td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch /></td>
                </tr>
                <tr>
                    <td className="px-[25px] py-[7px] text-[#868686] text-[14px] font-[400]">Transfers</td>
                    <td className="px-[25px] py-[7px]"><ZincoSwitch /></td>
                    <td className="px-[25px] py-[7px]"><ZincoSwitch /></td>
                    <td className="px-[25px] py-[7px]"><ZincoSwitch /></td>
                    <td className="px-[25px] py-[7px]"><ZincoSwitch /></td>
                </tr>
            </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default User;

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

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => {
  return {
    "& .MuiOutlinedInput-root": {
      // Styles for the input element
      //   backgroundColor: 'lightgray',
      width: "289px",
      borderRadius: "8px",
      border: "1px solid #E7E7E7",
      backgroundColor: "#FAFAFA",
      paddingTop: "0px",
      paddingBottom: "0px",
      marginRight: "25px"
    },
    "& .MuiInputLabel-root": {
      // Styles for the label element
      color: "blue",
      fontSize: "14px",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      // Styles for the focused outline of the outlined variant
      // borderColor: 'green',
      border: "none",
    },
    "& .MuiAutocomplete-option": {
      // Styles for each option in the dropdown men

      padding: theme.spacing(1),
      backgroundColor: "white",
      "&:hover": {
        backgroundColor: "lightblue",
      },
    },
    "& .MuiSvgIcon-root": {
      color: "black",
    },
  };
});
