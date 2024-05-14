import React, { useEffect, useState } from "react";
import ZincoModal from "../../../Components/Component/ZincoModal";
import { Icone } from "../../../Assets/AssetsLog";
import ZincoTextField from "../../../Components/Component/ZincoTextField";
import styled from "@emotion/styled";
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import {
  createAccount,
  updateAccount,
} from "../../../Api/Accounts/AccountsApi";

const AddIncomeModal = (props) => {
  const useQuery = useQueryClient();
  const [userData, setUserData] = useState({
    account_type: 3,
    account_name: "",
    opening_balance: "0",
  });

  const [errorData, setErrorData] = useState("");
  const [open, setOpen] = React.useState(false);
  const [stype, setStype] = useState("");

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
      }));
    }
  }, [props.data, props.edit]);

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
        });
      }
    },
  });

  const submitData = () => {
    props.edit
      ? editAccount.mutate({ ...userData })
      : mutation.mutate({ ...userData });
  };

  return (
    <>
      <ZincoModal open={props.open} handleClose={props.handleClose}>
        <div className="px-[26px] py-[21px] w-[400px]">
          <div className="flex items-center mr-[10px] mb-5">
            <div className="bg-[#E0FFF6] p-[10px] rounded-[13px] mr-[10px]">
              <img src={Icone.WalletAddIcon} alt="" />
            </div>
            <p className="text-black font-[400] text-[16px]">
              {props.edit ? "Edit Income account" : "Add Income account"}
            </p>
          </div>

          <ZincoTextField
            value={userData.account_name}
            onChange={(e) =>
              setUserData({ ...userData, account_name: e.target.value })
            }
            label={"Account Name"}
          />

          <SaveButton
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
          </CancelButton>
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
