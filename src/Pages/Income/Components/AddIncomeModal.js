import React, { useEffect, useState } from "react";
import ZincoModal from "../../../Components/Component/ZincoModal";
import { CreatorIcons, Icone } from "../../../Assets/AssetsLog";
import ZincoTextField from "../../../Components/Component/ZincoTextField";
import styled from "@emotion/styled";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
} from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import {
  createAccount,
  updateAccount,
} from "../../../Api/Accounts/AccountsApi";
import { IconColor } from "../../../utilsValue";

const AddIncomeModal = (props) => {
  const useQuery = useQueryClient();
  const [userData, setUserData] = useState({
    id: "",
    account_type: 3,
    account_name: "",
    opening_balance: "0",
    color: "#7477E6",
    icon: "BALL",
  });

  const [errorData, setErrorData] = useState("");
  const [open, setOpen] = React.useState(false);
  const [stype, setStype] = useState("");
  // const [avtar, setAvtar] = useState({
  //   color: "#7477E6",
  //   icon: "BALL",
  // });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    if (props.data && props.data.id && props.data.accountName && props.edit) {
      console.log(props.data);
      setUserData((prevState) => ({
        ...prevState,
        id: props.data.id,
        account_name: props.data.accountName,
        color: "#"+props.data.color,
        icon: props.data.icon
      }));
    }
  }, [props.data, props.edit]);
  // console.log(props.data);
  const mutation = useMutation({
    mutationFn: (newData) => {
      return createAccount({ ...newData });
    },
    onSuccess: (data) => {
      if (data.StatusCode === 6001) {
        setStype("error");
        setErrorData(data.errors);
        setOpen(true);
      } else {
        setStype("success");
        setErrorData(data.data);
        setOpen(true);
        props.handleClose();
        useQuery.invalidateQueries("Incomes-list");
        useQuery.invalidateQueries("Incomes-list-only");
        setUserData({
          account_type: 3,
          account_name: "",
          opening_balance: "0",
          color: "#7477E6",
          icon: "BALL",
        });
      }
    },
  });

  const editAccount = useMutation({
    mutationFn: (newData) => updateAccount({ ...newData }),
    onSuccess: (data) => {
      if (data.StatusCode === 6001) {
        setStype("error");
        setErrorData(data.errors);
        setOpen(true);
      } else {
        setStype("success");
        setErrorData(data.data);
        setOpen(true);
        props.handleClose();

        setUserData({
          account_type: 3,
          account_name: "",
          opening_balance: "0",
          color: "#7477E6",
          icon: "BALL",
        });
      }
    },
  });

  const submitData = () => {
    const payload =  {
      id: userData.id,
      account_type: userData.account_type,
      account_name: userData.account_name,
      opening_balance: userData.opening_balance,
      color: userData.color.slice(1),
      icon: userData.icon,
    }
    props.edit
      ? editAccount.mutate(payload)
      : mutation.mutate(payload);
  };

  // console.log(CreatorIcons);
  // Object.keys(CreatorIcons).map((value, index) => ( console.log(CreatorIcons[value], index) ))

  return (
    <>
      <ZincoModal open={props.open} handleClose={props.handleClose}>
        <div className="pt-[21px] pb w-[400px]">
          <div className="flex items-center mr-[10px] mb-5 px-[26px] ">
            <div className="bg-[#E0FFF6] p-[10px] rounded-[13px] mr-[10px]">
              <img src={Icone.WalletAddIcon} alt="" />
            </div>
            <p className="text-black font-[400] text-[16px]">
              {props.edit ? "Edit Income account" : "Add Income account"}
            </p>
          </div>
    <div className="px-[26px] ">
          <ZincoTextField
            value={userData.account_name}
            onChange={(e) =>
              setUserData({ ...userData, account_name: e.target.value })
            }
            placeholder={"Account Name"}
          />
</div>
          <div class="grid grid-cols-7 px-[26px] ">
            {IconColor.map((e, i) => (
              <IconButton
                key={i}
                sx={{
                  width: "54px",
                  height: "54px",
                }}
                onClick={() => setUserData({ ...userData, color: e })}
              >
                <div
                  className="w-[38px] h-[38px] rounded-full"
                  style={{
                    backgroundColor: e,
                    border: userData.color === e ? "3px solid white" : "none",
                    boxShadow: userData.color === e ? "0 0 0 2px #3B3B3B" : "none",
                  }}
                ></div>
              </IconButton>
            ))}
          </div>
<div className="overflow-y-scroll h-[300px] border-t px-[26px] ">
          <div class="grid grid-cols-5 gap-2 justify-items-center mb-2 pt-2">
            {Object.keys(CreatorIcons).map((value, index) => (
              <IconButton
                sx={{
                  width: "54px",
                  height: "54px",
                  backgroundColor: userData.color,
                  alignItems: "center",
                  border: userData.icon === value ? "3px solid white" : "none",
                  boxShadow: userData.icon === value ? "0 0 0 2px #3B3B3B" : "none",
                  ":hover": {
                    backgroundColor: userData.color,
                  },
                }}
                key={index}
                onClick={() => setUserData({...userData, icon: value})}
              >
                {/* <div className="w-[38px] h-[38px] rounded-full" style={{ backgroundColor: e}}></div> */}
                <img src={CreatorIcons[value]} alt="" />
              </IconButton>
            ))}
          </div>
          </div>
          {/* <SaveButton
            disabled={mutation.isLoading}
            onClick={() => submitData()}
          >
            {mutation.isLoading ? (
              <CircularProgress
                sx={{
                  color: (theme) =>
                    theme.palette.grey[
                      theme.palette.mode === "light" ? 200 : 800
                    ],
                }}
                size={25}
                thickness={4}
                color="secondary"
              />
            ) : (
              "Save"
            )}
          </SaveButton>
          <CancelButton onClick={() => props.handleClose()}>
            Cancel
          </CancelButton> */}
          <div className="flex justify-between items-center py-1 px-[26px] border-t">
            <IconButton onClick={() => props.handleClose()}>
              <img src={Icone.ClipIcon} alt="" />
            </IconButton>
            <div className="flex items-center">
              {/* <p className="text-[16px] font-[500]">
                {selected?.expenses?.account_name}
              </p>
              <span className="text-[18px] font-[500] mx-2">{">"}</span>
              <p className="text-[16px] font-[500]">
                {selected?.candb?.account_name}
              </p> */}
              <p className="text-[16px] font-[500]">
                {userData.account_name ? userData.account_name : "Account Name"}
              </p>
            </div>

            <IconButton
            // disabled={buttonDisable && !calvalue}
            onClick={() => submitData()}
            >
              {mutation.isLoading ? (
              <CircularProgress
                sx={{
                  color: "#7F52E8",
                }}
                size={30}
                thickness={5}
                color="secondary"
              />
              ) : <img src={Icone.CheckIcon} alt="" />}
            </IconButton>
          </div>
        </div>
      </ZincoModal>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={stype} sx={{ width: "100%" }}>
          {errorData}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddIncomeModal;

const SaveButton = styled(Button)(() => ({
  width: "100%",
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#fff",
  backgroundColor: "#7F52E8",
  borderRadius: "8px",
  textTransform: "none",
  marginBottom: "12px",
  // border: "1px solid #E4E4E4",
  "&:hover": {
    backgroundColor: "#7F52E8",
  },
}));

const CancelButton = styled(Button)(() => ({
  width: "100%",
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#7F52E8",
  backgroundColor: "#fff",
  borderRadius: "8px",
  textTransform: "none",
  // marginBottom: "12px",
  // border: "1px solid #E4E4E4",
  "&:hover": {
    backgroundColor: "#fff",
  },
}));
