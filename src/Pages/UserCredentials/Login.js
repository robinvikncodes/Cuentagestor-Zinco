import React, { useState } from "react";
import InputField from "./Components/InputField";
import styled from "@emotion/styled";
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import { Icone, Images, Logo } from "../../Assets/AssetsLog";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { userLogin } from "../../Api/UserCredentials/UserCredentialsApi";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState) => () => {
    setState({ ...newState, open: true });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [loginValid, setLoginValid] = useState('')

  const mutation = useMutation({
    mutationFn: (newData) => {
      return userLogin({ ...newData });
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.success !== 6000) {
        setLoginValid(data.error)
        setState({ ...state, open: true });
      } else {
        const localStorageData = {
          access_token: data.access_token,
          country_details: data.country_details,
          organization: data.organization,
          user_id: data.user_id,
          username: data.username
        }
        localStorage.setItem("UserCredentials", JSON.stringify(localStorageData));
        navigate('/dashboard')
        window.location.reload();
      }
    },
  });

  const loginFun = (e) => {
    e.preventDefault();
    console.log(loginData);
    mutation.mutate({ ...loginData })
  };
  
  return (
    <>
    <div className="relative h-screen">
      <div className="middleContainer bg-white p-6 rounded-[20px]">
        <div className="flex items-center flex-col">
          <img className="mb-9 " src={Images.LoginImg} alt="" />
          <div className="flex justify-center">
            <img src={Logo.MainLogo} alt="" className="mr-1" />
            {/* <img src={Logo.ZincoLogo} alt="" /> */}
          </div>
        </div>
        <form onSubmit={loginFun}>
          <div className="mb-6">
            <p className=" text-[27px] font-[500]">Login</p>
            <InputField
              icon={Icone.UserIcone}
              placeholder={"Email Address"}
              error={""}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              type={"email"}
              required
            />
            <InputField
              icon={Icone.LockIcone}
              placeholder={"Password"}
              error={""}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              type={"text"}
              required
              isPassword={true}
            />
          </div>

          <div>
            <p className="text-right text-[#1479DE] text-[16px] font-[400] mb-2">
              <Link to={"/forgotpassword"}> Forgot Password?</Link>
            </p>
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
              "Log in"
            )}
            </SaveButton>
          </div>
        </form>
        <p className="text-center text-[#6D6D6D] text-[16px] font-[400]">
          Don't have an account?
          <Link
            to="/signup"
            className="text-[#5346BD] text-[16px] font-[600] ml-1"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
          <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          // severity="error"
          // message={loginValid}
          key={vertical + horizontal}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {loginValid}
          </Alert>
        </Snackbar>
        </>
  );
};

export default Login;

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
