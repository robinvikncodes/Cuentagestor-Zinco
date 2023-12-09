import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import { useMutation } from "react-query";
import ZincoModal from "../../../../Components/Component/ZincoModal";
import { Icone } from "../../../../Assets/AssetsLog";
import { addProperty } from "../../../../Api/Assets/AssetsApi";
import { openSnackbar } from "../../../../features/snackbar";

const PropertyAdd = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    propertyName: "",
    value: "",
  });

  const mutateProterty = useMutation({
    mutationFn: (newData) => addProperty(newData),
    onSuccess: (data) => {
      if (data.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "success",
          })
        );
        setData({
          propertyName: "",
          value: "",
        });
        props.handleClose();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: data.errors,
            severity: "error",
          })
        );
      }
    },
    onError: (data) => {
      dispatch(
        openSnackbar({
          open: true,
          message: "Some error occure in API",
          severity: "error",
        })
      );
    },
  });

  const submitTransaction = function () {
    let payload = {
      asset_master_id: props.account,
      property_name: data.propertyName,
      property_value: data.value,
    };
    mutateProterty.mutate(payload);
  };
  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <div className="py-[15px] px-3 w-[450px]">
        <input
          placeholder="Property Name"
          value={data.propertyName}
          onChange={(e) => setData({ ...data, propertyName: e.target.value })}
          type="text"
          className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 w-full mb-3"
        />
        <input
          placeholder="Value"
          value={data.value}
          onChange={(e) => setData({ ...data, value: e.target.value })}
          type="text"
          className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 mb-3 w-full"
        />
      </div>
      <div className="flex justify-between items-center p-1">
        <IconButton onClick={() => props.handleClose()}>
          <img src={Icone.ClipIcon} alt="" />
        </IconButton>
        <p className="text-[16px] font-[500]">Add Property</p>
        <IconButton onClick={submitTransaction}>
          <img src={Icone.CheckIcon} alt="" />
        </IconButton>
      </div>
    </ZincoModal>
  );
};

export default PropertyAdd;
