import { IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";

const ZincoDeleteIcon = (props) => {
  const userRollReducer = useSelector((state) => state.userRole.state);
  const [disable, setdisable] = useState(false);
  console.log(userRollReducer[props.name]);
  useEffect(() => {
    if (userRollReducer[props.name] !== undefined) {
      console.log(userRollReducer[props.name].delete_permission);
      setdisable(!userRollReducer[props.name].delete_permission);
    }
  }, [userRollReducer]);
  
  return (
    <Tooltip title={disable ? props.name ? "You don't have permission to Delete " + props.name : "You don't have permission to Delete" : "Delete"}>
      <span>
        <IconButton
          disabled={disable}
          title={disable ? "Delete" : ""}
          {...props}
        >
          <DeleteIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ZincoDeleteIcon;
