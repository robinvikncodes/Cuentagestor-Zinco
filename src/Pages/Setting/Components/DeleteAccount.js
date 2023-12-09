import React, { useState } from "react";
import ZincoModal from "../../../Components/Component/ZincoModal";
import InputField from "../../UserCredentials/Components/InputField";
import { Icone } from "../../../Assets/AssetsLog";
import { deleteUserAccount } from "../../../Api/UserCredentials/UserCredentialsApi";
import { useMutation } from "react-query";
import { openSnackbar } from "../../../features/snackbar";
import { useDispatch } from "react-redux";
import { Button, CircularProgress } from "@mui/material";
import styled from "@emotion/styled";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const DeleteAccount = (props) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState({
    password1: "",
    password2: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const mutation = useMutation({
    mutationFn: (newData) => {
      return deleteUserAccount({ ...newData });
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.StatusCode !== 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.errors || data.message,
            severity: "error",
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: data.data || data.message,
            severity: "success",
          })
        );

        props.handleClose();
        localStorage.removeItem("UserCredentials");
        window.location.reload();
      }
    },
  });

  const submitpassword = function (e) {
    e.preventDefault();

    let payload = {
      user_id: userData.user_id,
      password: password.password2,
    };

    if (password.password1 === password.password2) {
      mutation.mutate(payload);
      console.log(payload);
      setErrorMsg("");
    } else {
      setErrorMsg("This want to be same");
    }
  };

  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <div className="p-4">
        <form onSubmit={submitpassword}>
          <div className="mb-6">
            <p className=" text-[27px] font-[500]">Delete</p>
            <p className=" text-[27px] font-[500]">Account?</p>
            <InputField
              icon={Icone.LockIcone}
              placeholder={"Password"}
              error={errorMsg}
              required
              isPassword={true}
              onChange={(e) =>
                setPassword({ ...password, password1: e.target.value })
              }
            />
            <InputField
              icon={Icone.LockIcone}
              placeholder={"Confirm password"}
              error={errorMsg}
              required
              isPassword={true}
              onChange={(e) =>
                setPassword({ ...password, password2: e.target.value })
              }
            />
          </div>

          <div>
            <SaveButton disabled={mutation.isLoading} type="submit">
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
                "Delete Account"
              )}
            </SaveButton>
          </div>
        </form>
      </div>
    </ZincoModal>
  );
};

export default DeleteAccount;


const SaveButton = styled(Button)(() => ({
    width: "100%",
    paddingLeft: "18px",
    paddingRight: "18px",
    fontSize: "15px",
    fontWeight: "500",
    color: "#fff",
    backgroundColor: "#CB2424",
    borderRadius: "8px",
    textTransform: "none",
    marginBottom: "12px",
    "&.MuiButtonBase-root:hover": {
      backgroundColor: "#CB2424",
    },
  }));