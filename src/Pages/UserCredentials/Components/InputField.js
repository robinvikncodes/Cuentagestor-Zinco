import React from "react";
import "./inputfield.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";

const InputField = (props) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = function () {
    setShowPassword((show) => !show);
  };
  return (
    <div className="mb-5">
      <div className="input-container">
        {props?.icon && (
          <img src={props.icon} alt="icone" className="mr-[-21px] z-10 " />
        )}
        {/* <input
          type={props.isPassword ? (showPassword ? "text" : "password") : (props.type || "text")}
          // type={!showPassword ? "text" : "password"}
          className={`custom-input ${props?.icon && "pl-[26px]"} p-[10px]`}
          placeholder={props?.placeholder || " "}
          {...props}
        /> */}
        <input
          {...props}
          type={props?.isPassword ? (showPassword ? "text" : "password") : (props.type || "text")}
          className={`custom-input ${props?.icon && "pl-[26px]"} p-[10px]`}
          placeholder={props?.placeholder || " "}
        />
        {props?.isPassword && (
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            // onMouseDown={handleMouseDownPassword}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        )}
      </div>
      {props?.error && (
        <p className="text-[#C80000] text-[12px] font-[400]">{props.error}</p>
      )}
    </div>
  );
};

export default InputField;
