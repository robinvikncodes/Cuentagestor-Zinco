import React, { useState } from "react";
import ZincoModal from "../../../Components/Component/ZincoModal";
import InputField from "../../UserCredentials/Components/InputField";
import { Icone } from "../../../Assets/AssetsLog";
import styled from "@emotion/styled";
import { Button, CircularProgress } from "@mui/material";
import { useMutation } from "react-query";
import { resetPassword } from "../../../Api/UserCredentials/UserCredentialsApi";
import { openSnackbar } from "../../../features/snackbar";
import { useDispatch } from "react-redux";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const ChangePassword = (props) => {
    const dispatch = useDispatch();
  const [password, setPassword] = useState({
    old_password: "",
    password1: "",
    password2: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const mutation = useMutation({
    mutationFn: (newData) => {
      return resetPassword({ ...newData });
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
              message: data.data,
              severity: "success",
            })
          );
            
          props.handleClose();
      }
    },
  });

  const submitpassword = function (e) {
    e.preventDefault();
    let payload = {
      user_id: userData.user_id,
      old_password: password.old_password,
      password1: password.password1,
      password2: password.password2,
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
            <p className=" text-[27px] font-[500]">Change</p>
            <p className=" text-[27px] font-[500]">Password?</p>
            <p className=" text-[14px] text-[#A2A2A2] font-[400] mb-6">
              Enter your new password
            </p>
            <InputField
              icon={Icone.LockIcone}
              placeholder={"Old Password"}
              error={""}
              required
              ispassword={true}
              onChange={(e) =>
                setPassword({ ...password, old_password: e.target.value })
              }
            />
            <InputField
              icon={Icone.LockIcone}
              placeholder={"New Password"}
              error={errorMsg}
              required
              ispassword={true}
              onChange={(e) =>
                setPassword({ ...password, password1: e.target.value })
              }
            />
            <InputField
              icon={Icone.LockIcone}
              placeholder={"Confirm password"}
              error={errorMsg}
              required
              ispassword={true}
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
                "Change Password"
              )}
            </SaveButton>
          </div>
        </form>
      </div>
    </ZincoModal>
  );
};

export default ChangePassword;

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
