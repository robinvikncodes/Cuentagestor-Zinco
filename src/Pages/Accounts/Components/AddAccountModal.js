import { Box, Button, CircularProgress, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Icone } from "../../../Assets/AssetsLog";
import ZincoTextField from "../../../Components/Component/ZincoTextField";
import styled from "@emotion/styled";
import { createAccount, updateAccount } from "../../../Api/Accounts/AccountsApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { openSnackbar } from "../../../features/snackbar";
import { useDispatch } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "background.paper",
  borderRadius: "22px",
  boxShadow: 24,
};

const AddAccountModal = (props) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient()
  const [account, setAccount] = useState(true);
  const [accountData, setAccountData] = useState({
    account_name: "",
    opening_balance: "",
  });

  const mutateAccount = useMutation({
    mutationFn: (newData) => {
      return props.edit ? updateAccount({ ...newData }) : createAccount({ ...newData }) 
    },
    onSuccess: (data) => {
      // props.handleClose();
      if (data.StatusCode !== 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.errors,
            severity: "error",
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: data.data,
            severity: "success",
          })
        );
        setAccountData({
            account_name: "",
            opening_balance: "",
          })
        props.handleClose();
        queryClient.invalidateQueries('details-dashboard')
      }
    },
  }); 

  // const mutation = useMutation({
  //   mutationFn: (newData) => {
  //     return createAccount({ ...newData });
  //   },
  //   onSuccess: (data) => {
  //     // props.handleClose();
  //     if (data.StatusCode !== 6000) {
  //       dispatch(
  //         openSnackbar({
  //           open: true,
  //           message: data.errors,
  //           severity: "error",
  //         })
  //       );
  //     } else {
  //       dispatch(
  //         openSnackbar({
  //           open: true,
  //           message: data.data,
  //           severity: "success",
  //         })
  //       );
  //       props.handleClose();
  //       queryClient.invalidateQueries('details-dashboard')
  //     }
  //   },
  // });

  // const update = useMutation({
  //   mutationFn: (newData) => {
  //     return updateAccount({ ...newData });
  //   },
  //   onSuccess: (data) => {
  //     // props.handleClose();
  //     if (data.StatusCode !== 6000) {
  //       dispatch(
  //         openSnackbar({
  //           open: true,
  //           message: data.errors,
  //           severity: "error",
  //         })
  //       );
  //     } else {
  //       dispatch(
  //         openSnackbar({
  //           open: true,
  //           message: data.data,
  //           severity: "success",
  //         })
  //       );
  //       props.handleClose();
  //       queryClient.invalidateQueries('details-dashboard')
  //     }
  //   },
  // });

  const submitData = (e) => {
    e.preventDefault();
    let payload = {
      account_name: accountData.account_name,
      opening_balance: accountData.opening_balance,
      account_type: account ? 1 : 2,
    }

    if (props.edit) {
      payload.id = props.accountDetail.data.id
    }

    mutateAccount.mutate(payload)
  };

  useEffect(() => {
    // console.log(props.accountDetail.data);
    console.log(props.edit);
    if (props.edit) {
      setAccountData({
        account_name : props.accountDetail.data.account_name,
        opening_balance : parseFloat(props.accountDetail.data.opening_balance).toFixed(2)
      })
      setAccount(props.accountDetail.data.account_type === '1' ? true : false)
    } else {
      setAccountData({
        account_name : "",
        opening_balance : ""
      })
    }
  }, [props.accountDetail, props.edit])
  
  

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="px-[26px] py-[21px]">
          <p className="text-[16px] font-[400] mb-5">{props.edit ? "Edit Account" : "Add an account"}</p>
          <div className="grid grid-cols-2 gap-x-2 mb-3">
            <ModalButton
              mbgcolor={account ? "#F1FFF0" : "#F8F8F8"}
              onClick={() => setAccount(true)}
              startIcon={
                // <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] my-[5px] inline-block">
                <img src={Icone.WalletGreenIcon} alt="" className="" />
                // </div>
              }
            >
              <p className="w-4/5 text-center text-[13px] font-[400]">Cash</p>
            </ModalButton>
            <ModalButton
              mbgcolor={!account ? "#E2EFFF" : "#F8F8F8"}
              onClick={() => setAccount(false)}
              startIcon={
                // <div className="bg-[#E2EFFF] p-[10px] rounded-[13px] my-[5px] inline-block">
                <img src={Icone.BankIcon} alt="" className="text-white" />
                // </div>
              }
            >
              <p className="w-4/5 text-center text-[13px] font-[400]">Bank</p>
            </ModalButton>
          </div>
          <form id="createAccount" onSubmit={(e) => submitData(e)}>
            <ZincoTextField
             required
              value={accountData.account_name}
              onChange={(e) =>
                setAccountData({ ...accountData, account_name: e.target.value })
              }
              name="account_name"
              label={"Account Name"}
            />
            <ZincoTextField
              required
              value={accountData.opening_balance}
              onChange={(e) =>
                setAccountData({
                  ...accountData,
                  opening_balance: e.target.value,
                })
              }
              name="opening_balance"
              label={"Balance"}
            />

            <SaveButton type="submit" disabled={mutateAccount.isLoading}>
              {mutateAccount.isLoading ? (
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
          </form>
          <CancelButton onClick={() => props.handleClose()}>
            Cancel
          </CancelButton>
        </div>
      </Box>
    </Modal>
  );
};

export default AddAccountModal;

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
  "&:hover": {
    backgroundColor: "#fff",
  },
  // marginBottom: "12px",
  // border: "1px solid #E4E4E4",
}));

const ModalButton = styled(Button)((props) => ({
  padding: "10px",
  justifyContent: "space-between",
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#000",
  backgroundColor: props.mbgcolor,
  borderRadius: "12px",
  // border: "1px solid #E4E4E4",
  textTransform: "none",
  "&:hover": {
    backgroundColor: props.mbgcolor,
  },
}));
