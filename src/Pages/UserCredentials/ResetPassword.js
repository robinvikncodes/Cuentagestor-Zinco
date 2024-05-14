import styled from "@emotion/styled";
import { Button } from "@mui/material";
import React, { useState } from "react";
import InputField from "./Components/InputField";
import { Icone, Images } from "../../Assets/AssetsLog";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetPasswordOTP } from "../../Api/UserCredentials/UserCredentialsApi";
import { openSnackbar } from "../../features/snackbar";

const ResetPassword = () => {
  const navigate = useNavigate()
  const userData = useSelector(state => state.credentials.userDetails);
  const dispatch = useDispatch()

  const [password, setPassword] = useState({
    email: userData.email,
    otp: userData.otp,
    password1: "",
    password2: "",
  });

  const mutation = useMutation({
    mutationFn: (newData) => {
      return resetPasswordOTP({ ...newData });
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.StatusCode !== 6000) {
        //SnackBar        
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "warning",
          })
        );
      } else if (data.StatusCode === 6000){
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "success",
          })
        );
        navigate('/login')
      } else {
        // console.log(userDetailState);
        navigate('/login')
      }
    },
  });

  const submitpassword = function (e) {
    e.preventDefault();
    console.log(password);
    mutation.mutate({...password})
  };
  return (
    <div className="relative h-screen">
      <div className="middleContainer bg-white p-6 rounded-[20px]">
        <div className="flex items-center flex-col">
          <img className="mb-9 " src={Images.LoginImg} alt="" />
        </div>
        <form onSubmit={submitpassword}>
          <div className="mb-6">
            <p className=" text-[27px] font-[500]">Forgot</p>
            <p className=" text-[27px] font-[500]">Password?</p>
            <p className=" text-[14px] text-[#A2A2A2] font-[400] mb-6">
              Enter your new password
            </p>
            <InputField
              icon={Icone.LockIcone}
              placeholder={"Password"}
              error={""}
              onChange={ e => setPassword({ ...password, password1: e.target.value })}
              required
              ispassword={true}
            />
            <InputField
              icon={Icone.LockIcone}
              placeholder={"Confirm password"}
              error={""}
              onChange={ e => setPassword({ ...password, password2: e.target.value })}
              required
              ispassword={true}
            />
          </div>

          <div>
            <SaveButton type="submit">Reset password</SaveButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

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
