import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ZincoEditIcon = (props) => {
  const userRollReducer = useSelector((state) => state.userRole.state);
  const [disable, setdisable] = useState(false);
  console.log(userRollReducer[props.name]);
  useEffect(() => {
    if (userRollReducer[props.name] !== undefined) {
      console.log(userRollReducer[props.name].edit_permission);
      setdisable(!userRollReducer[props.name].edit_permission);
    }
  }, [userRollReducer]);
  return (
    <Tooltip title={disable ? "You don't have permission to Edit" : "Edit"}>
      <span>
        <IconButton title="Edit" disabled={disable} {...props}>
          <EditIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ZincoEditIcon;
