import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "./Components/InputField";
import { Icone, Images, Logo } from "../../Assets/AssetsLog";
import styled from "@emotion/styled";
import { Button, CircularProgress } from "@mui/material";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../features/credentials";
import { countryList, resendEmail } from "../../Api/UserCredentials/UserCredentialsApi";

const ForgotPassword = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const userDetailState = useSelector((state) => state.credentials.userDetails);

  const mutation = useMutation({
    mutationFn: (newData) => {
      return resendEmail({ ...newData });
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.StatusCode !== 6000) {
        //SnackBar
      } else {
        // console.log(userDetailState);
        navigate('/emailverify')
      }
    },
  });

  const submitmailFun = function (e) {
    e.preventDefault();
    dispatch(addUser({...userDetailState, resetPassword: true, email: email}));
    mutation.mutate({
      email: email
    })
  };

  // useEffect(()=>{
  //   countryList()
  // })

  return (
    <div className="relative h-screen">
      <div className="middleContainer bg-white p-6 rounded-[20px]">
        <div className="flex items-center flex-col">
          <img className="mb-9 " src={Images.LoginImg} alt="" />
          {/* <div className="flex justify-center">
          <img src={Logo.ZLogo} alt="" className="mr-1" />
          <img src={Logo.ZincoLogo} alt="" />
        </div> */}
        </div>
        <form onSubmit={submitmailFun}>
          <div className="mb-6">
            <p className=" text-[27px] font-[500]">Forgot</p>
            <p className=" text-[27px] font-[500]">Password?</p>
            <p className=" text-[14px] text-[#A2A2A2] font-[400] mb-6">
              Don't worry, please enter your email address.
            </p>
            <InputField
              icon={Icone.EmailIcon}
              placeholder={"Email Address"}
              error={""}
              type={"email"}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
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
              "Continue"
            )}</SaveButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

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
