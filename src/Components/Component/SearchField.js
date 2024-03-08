import { IconButton } from "@mui/material";
import React from "react";
import { Icone } from "../../Assets/AssetsLog";

const SearchField = (props) => {
  return (
    <div className="relative">
      <input
        style={{
            width: props.width || "100%",
            height: props.height || "35px",
        }}
        placeholder = {props.placeholder || "Search"}
        type = {props.type || "text"}
        className="border-[#E4E4E4] border-[1px] px-[11px] py-[9px] rounded-[8px] text-[11px] "
        value={props?.valuen}
        onKeyDown={e => props?.onKeyDown(e)}
        onChange={e => props?.onChange(e)}
      />
      <IconButton
        sx={{
          ml: "-40px",
        }}
        onClick={props.onClickBTN}
      >
        <img src={Icone.SearchNormalIcon} alt="" />
      </IconButton>
    </div>
  );
};

export default SearchField;
