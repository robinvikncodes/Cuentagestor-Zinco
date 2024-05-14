import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import { useMutation } from "react-query";
import ZincoModal from "../../../../Components/Component/ZincoModal";
import { Icone } from "../../../../Assets/AssetsLog";
import { addProperty, editProperty } from "../../../../Api/Assets/AssetsApi";
import { openSnackbar } from "../../../../features/snackbar";

const PropertyAdd = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    propertyName: "",
    value: "",
  });

  const mutateProterty = useMutation({
    mutationFn: (newData) => props.edit ? editProperty(newData) : addProperty(newData),
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

  const submitTransaction = function (e) {
    e.preventDefault();
    let payload = {
      asset_master_id: props.account,
      property_name: data.propertyName,
      property_value: data.value,
    };
    if(props.edit) payload.property_id = props.propertyData.id
    mutateProterty.mutate(payload);
  };

  useEffect(() => {
    if (props.edit) {
      setData({
        propertyName: props.propertyData.property_name,
        value: props.propertyData.property_value,
      })
    }else{
      setData({
        propertyName: "",
        value: "",
      })
    }
  }, [])
  
  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <form onSubmit={e => submitTransaction(e)} >
      <div className="py-[15px] px-3 w-[450px]">
        <input
          required
          placeholder="Property Name"
          value={data.propertyName}
          onChange={(e) => setData({ ...data, propertyName: e.target.value })}
          type="text"
          className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 w-full mb-3"
        />
        <input
          required
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
        <p className="text-[16px] font-[500]">{props.edit ? "Edit" : "Add"} Property</p>
        <IconButton type='submit' >
          <img src={Icone.CheckIcon} alt="" />
        </IconButton>
      </div>
      </form>
    </ZincoModal>
  );
};

export default PropertyAdd;
