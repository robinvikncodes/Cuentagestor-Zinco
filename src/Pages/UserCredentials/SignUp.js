import React, { useEffect, useState } from "react";
import InputField from "./Components/InputField";
import { Icone, Images } from "../../Assets/AssetsLog";
import styled from "@emotion/styled";
import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  countryLists,
  createUser,
} from "../../Api/UserCredentials/UserCredentialsApi";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../features/credentials";
import { openSnackbar } from "../../features/snackbar";

const SignUp = () => {
  // useEffect(() => {
  //   const res = countryLists()
  //   console.log(res);
  // }, [])
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const userDetailState = useSelector((state) => state.credentials.userDetails);

  const [userData, setUserData] = useState({
    first_name: "",
    email: "",
    password1: "",
    password2: "",
    country: "",
  });

  const { isLoading, error, data } = useQuery("country-list", () => {
    return countryLists();
  });

  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return createUser({ ...newTodo });
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.StatusCode !== 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "error",
          })
        );
      } else {
        navigate('/emailverify')
      }
    },
  });

  const submitData = () => {
    dispatch(addUser({...userDetailState, newUser: true, email: userData.email}));
    mutation.mutate({ ...userData });
  };

  const tadFunc = () => {
    console.log(userDetailState);
  };

  return (
    <div className="relative h-screen">
      <div className="middleContainer bg-white p-6 rounded-[20px]">
        <div className="">
          <img className="mb-6 " src={Images.SignUpImg} alt="" />
        </div>
        <div className="mb-6">
          <p className=" text-[27px] font-[500]">Sign Up</p>
          <InputField
            icon={Icone.UserIcone}
            placeholder={"Name"}
            error={""}
            onChange={(e) =>
              setUserData({ ...userData, first_name: e.target.value })
            }
          />
          <InputField
            icon={Icone.EmailIcon}
            placeholder={"Email Address"}
            error={""}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
          {
            <div className="relative mb-4">
              <img
                className="absolute top-[15%] "
                src={Icone.LocationIcone}
                alt=""
              />
              <Autocomplete
                // {...defaultProps}
                id="disable-close-on-select"
                // disableCloseOnSelect={false}
                options={data?.data || []}
                getOptionLabel={(optiion) => optiion?.country_name}
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    paddingLeft: "26px",
                    paddingBottom: "10px",
                  },
                }}
                onChange={(event, newInputValue) => {
                  setUserData({ ...userData, country: newInputValue.id });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Location"
                    sx={{
                      fontSize: "16px",
                      width: "100%",
                    }}
                    variant="standard"
                  />
                )}
              />
            </div>
          }
          <InputField
            icon={Icone.LockIcone}
            placeholder={"Password"}
            ispassword={true}
            error={""}
            onChange={(e) =>
              setUserData({ ...userData, password1: e.target.value })
            }
          />
          <InputField
            icon={Icone.LockIcone}
            placeholder={"Conform Password"}
            ispassword={true}
            error={""}
            onChange={(e) =>
              setUserData({ ...userData, password2: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <p className="text-[#6D6D6D] text-[14px] font-[400]">
            By signing up you're agreeing to our{" "}
          </p>
          <p
            className="text-[#5346BD] text-[15px] font-[500] cursor-pointer"
            onClick={tadFunc}
          >
            Terms and contitions
          </p>
        </div>

        <div>
          <SaveButton
            onClick={() => submitData()}
            disabled={mutation.isLoading}
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
              "Register"
            )}
          </SaveButton>
        </div>

        <p className="text-center text-[#6D6D6D] text-[16px] font-[400]">
          Already have an account?
          <Link
            to="/login"
            className="text-[#5346BD] text-[16px] font-[600] ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

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
