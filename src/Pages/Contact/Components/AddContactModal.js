import React, { useEffect, useState } from "react";
import ZincoModal from "../../../Components/Component/ZincoModal";
import styled from "@emotion/styled";
import { Button, CircularProgress } from "@mui/material";
import ZincoTextField from "../../../Components/Component/ZincoTextField";
import { Icone } from "../../../Assets/AssetsLog";
import { createContact, updateContact } from "../../../Api/Contact/ContactApi";
import { useMutation, useQueryClient } from "react-query";
import { openSnackbar } from "../../../features/snackbar";
import { useDispatch } from "react-redux";
import { BaseUrl } from "../../../globalVariable";

let imgFile;

const AddContactModal = (props) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [toggle, settoggle] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [accountData, setAccountData] = useState({
    phone: "",
    amount: "",
    account_name: "",
  });

  const handleImageChange = (event) => {
    imgFile = event.target.files[0];
    setSelectedImage(URL.createObjectURL(imgFile));
    setAccountData({ ...accountData, photo: imgFile });
  };

  const addImage = () => {
    const input = document.getElementById("imgInput");
    input.click();
  };

  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return createContact({ ...newTodo });
    },
    onSuccess: (data) => {
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
          phone: "",
          amount: "",
          photo: null,
          account_name: "",
        })
        props.handleClose();
        queryClient.invalidateQueries("contact-list");
        queryClient.invalidateQueries("details-dashboard");
      }
    },
  });

  const editContact = useMutation({
    mutationFn: (newData) => updateContact({ ...newData }),
    onSuccess: (data) => {
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
          phone: "",
          amount: "",
          photo: null,
          account_name: "",
        })
        props.handleClose();
        queryClient.invalidateQueries("contact-list");
      }
    },
  });

  const submitAccountData = (e) => {
    e.preventDefault();
    console.log(accountData);
    if (props.edit) {
      editContact.mutate({
        ...accountData,
        amount: !toggle ? "-" + accountData.amount : accountData.amount,
        id: props?.contactData?.id,
      });
    } else {
      mutation.mutate({
        ...accountData,
        amount: !toggle ? "-" + accountData.amount : accountData.amount,
      });
    }
  };

  useEffect(() => {
    console.log(props?.contactData);
    if (
      props?.contactData?.balance &&
      props?.contactData?.account_name &&
      props?.contactData?.phone &&
      props?.contactData?.account_type &&
      props.edit
    ) {

      let accountDataPayload = {}
      accountDataPayload.phone = props.contactData.phone
      accountDataPayload.amount = parseFloat(props.contactData.opening_balance).toFixed(2) < 0
      ? parseFloat(props.contactData.opening_balance).toFixed(2) * -1
      : parseFloat(props.contactData.opening_balance).toFixed(2)
      accountDataPayload.account_name = props.contactData.account_name
      setSelectedImage(
        props.contactData.photo && BaseUrl + props.contactData.photo
      );
      settoggle(parseFloat(props.contactData.balance) > 0 ? true : false);

      fetch(BaseUrl + props.contactData.photo)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.blob();
      })
      .then(blob => {
        accountDataPayload.photo = blob
      })
      .catch(e => {
        console.log('Fetch failed! ' + e.message);
        accountDataPayload.photo = null
      });
      setAccountData(accountDataPayload)
    } else {
      setAccountData({
        phone: "",
        amount: "",
        photo: null,
        account_name: "",
      });
    }
    
    if (!props.edit) {
      setAccountData({
        phone: "",
        amount: "",
        photo: null,
        account_name: "",
      });
    }
  }, [props.contactData, props.edit]);

  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <div className="py-[21px] max-w-[450px]">
        <form onSubmit={(e) => submitAccountData(e)}>
          <div className="px-6 pb-4 border-b-[1px] ">
            <p className="text-[16px] font-[400]">{props.edit ? "Edit Contact":"Add an contacts"}</p>
          </div>
          <div className="w-full flex justify-center py-5">
            <AddButton onClick={() => addImage()}>
              <img
                src={selectedImage || Icone.PurplePlus}
                alt=""
                className=""
              />
            </AddButton>
            <input
              style={{ display: "none" }}
              name="photo"
              id="imgInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="px-6">
            <ZincoTextField
              value={accountData.account_name}
              type={"text"}
              onChange={(e) =>
                setAccountData({ ...accountData, account_name: e.target.value })
              }
              label={"Name"}
              required
            />
            <ZincoTextField
              value={accountData.phone}
              type={"tel"}
              id="phone" 
              name="phone" 
              // pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              onChange={(e) =>
                setAccountData({ ...accountData, phone: e.target.value })
              }
              label={"Phone no"}
              required
            />

            <div className="grid grid-cols-2 gap-x-3 mb-4">
              <ToggleButton
                mbgcolor={toggle ? "#7F52E8" : "#F8F5FF"}
                mcolor={toggle ? "#FFFFFF" : "#7F52E8"}
                onClick={() => settoggle(true)}
              >
                Receivable
              </ToggleButton>
              <ToggleButton
                mbgcolor={toggle ? "#F8F5FF" : "#7F52E8"}
                mcolor={toggle ? "#7F52E8" : "#FFFFFF"}
                onClick={() => settoggle(false)}
              >
                Payable
              </ToggleButton>
            </div>
            <ZincoTextField
              value={accountData.amount}
              type={"number"}
              onChange={(e) =>
                setAccountData({ ...accountData, amount: e.target.value })
              }
              label={"Balance"}
              required
            />
            <SaveButton type="submit">
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
        </form>
      </div>
    </ZincoModal>
  );
};

export default AddContactModal;

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
  "&.MuiButtonBase-root:hover": {
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
  "&.MuiButtonBase-root:hover": {
    backgroundColor: "#fff",
  },
}));

const ToggleButton = styled(Button)((props) => ({
  padding: "10px",
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: props.mcolor,
  backgroundColor: props.mbgcolor,
  borderRadius: "12px",
  textTransform: "none",
  // border: "1px solid #E4E4E4",
  "&.MuiButtonBase-root:hover": {
    backgroundColor: props.mbgcolor,
  },
}));

const AddButton = styled(Button)(() => ({
  width: "142px",
  height: "142px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#7F52E8",
  backgroundColor: "#EFE8FF",
  borderRadius: "15px",
  border: "1px solid #E4E4E4",
  textTransform: "none",
}));
