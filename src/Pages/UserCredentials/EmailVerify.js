import styled from "@emotion/styled";
import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "react-query";
import { addUser } from "../../features/credentials";
import { Images } from "../../Assets/AssetsLog";
import { resendEmail, userVerify } from "../../Api/UserCredentials/UserCredentialsApi";
import { openSnackbar } from "../../features/snackbar";

const EmailVerify = () => {
  const userData = useSelector(state => state.credentials.userDetails);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [values, setValues] = useState(Array(6).fill(""));
  const [invalidOTP, setInvalidOTP] = useState(false)

  const [counter, setCounter] = React.useState(30);

  const handleKeyDown = (e, index) => {
    if (e.key >= "0" && e.key <= "9") {
      // If a number key is pressed, set the value and move to the next input
      const newValues = [...values];
      newValues[index] = e.key;
      setValues(newValues);
      if (index < 5) {
        document.getElementById(`input-${index + 1}`).focus();
      }
    } else if (e.key === "Backspace") {
      // If Backspace is pressed, clear the value and move to the previous input
      const newValues = [...values];
      newValues[index] = "";
      setValues(newValues);
      if (index > 0) {
        document.getElementById(`input-${index - 1}`).focus();
      }
    }
  };

  const mutation = useMutation({
    mutationFn: (newData) => {
      return userVerify({ ...newData });
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.StatusCode !== 6000) {
        // setInvalidOTP(true)
        setValues(Array(6).fill(""))
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "warning",
          })
        );
      } else {
        // localStorage.setItem("UserCredentials", userData);
        userData.newUser && navigate('/login')
        userData.resetPassword && navigate('/resetpassword')
      }
    },
  });

  const mutateEmailResend = useMutation({
    mutationFn: (newData) => {
      return resendEmail({ ...newData });
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.StatusCode !== 6000) {
        // setInvalidOTP(true)
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "warning",
          })
        );
      } else if (data.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "success",
          })
        );
        // localStorage.setItem("UserCredentials", userData);
        // userData.newUser && navigate('/login')
        // userData.resetPassword && navigate('/resetpassword')
      }
    },
  });

  const SubmitOTP = () => {
    
    let string='';
    for (var member in values) {
      string += values[member];
    }
    dispatch(addUser({...userData, otp: string}));
    mutation.mutate({
      email: userData.email,
      otp: string,
      is_otp: userData.resetPassword
    });
  };

  const resendOtp = function() {
    // // resendEmail()
    setCounter(30)
    mutateEmailResend.mutate({
      email: userData.email
    })
  }

  // Second Attempts
  React.useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);
 
  // useEffect(() => {
  //   console.log(userData === true);
  //   if (!userData.email) {
  //     navigate("/signup");
  //   }
  // }, []);

  return (
    <div className="relative h-screen">
      <div className="middleContainer bg-white p-6 rounded-[20px]">
        <div className="flex items-center flex-col">
          <img className="mb-9 " src={Images.LoginImg} alt="" />
        </div>
        <div className="mb-6">
          <p className=" text-[27px] font-[500]">Enter OTP</p>
          <p className="text-[#A2A2A2] text-[16px] font-[400]">
            Please enter the OTP send to{" "}
          </p>
          <p className="text-[16px] font-[400]">{userData.email}</p>
          <p className="text-[#5346BD] text-[16px] font-[400] no-underline">
            {/* <Link to="/login">Change</Link> */}
          </p>
        </div>
        <div className="grid grid-cols-6 gap-x-2 mx-7 mb-2">
          {/* <div> */}
          {values.map((value, index) => (
            <input
              className="otp-input text-center"
              key={index + 1}
              id={`input-${index}`}
              type="number"
              value={value}
              onKeyDown={(e) => handleKeyDown(e, index)}
              // onChange={(e) => {
              //   const newValues = [...values];
              //   newValues[index] = e.target.value;
              //   setValues(newValues);
              // }}
            />
          ))}
          {/* </div> */}

          {/* {inputRefs.map((ref, index) => (
            <input key={index}
            type="number"
            ref={ref}
            maxLength="1"
            onKeyDown={(e) => handleKeyDown(e, index)} className="otp-input text-center" />
          ))} */}
          {/* <input type="number" min="0" max="9" step="1"/> */}
        </div>
        {/* */}
        {invalidOTP && (
          <p className="text-[#C80000] text-[12px] font-[400] text-center mb-2">
            Incorrect OTP
          </p>
        )}
        <div>
          {counter === 0 ? <SaveButton actives={false} onClick={resendOtp}>Resent</SaveButton> : <div className="px-[18px] py-[7px] text-center mb-3" >Resend OTP in {counter} seconds</div>}
          <SaveButton actives={true} onClick={SubmitOTP}>
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
            )}
          </SaveButton>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;

const SaveButton = styled(Button)((props) => ({
  width: "100%",
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: props.actives ? "#fff" : "#7F52E8",
  backgroundColor: props.actives ? "#7F52E8" : "#fff",
  borderRadius: "8px",
  textTransform: "none",
  marginBottom: "12px",
  "&.MuiButtonBase-root:hover": {
    backgroundColor: props.actives ? "#7F52E8" : "#fff",
  },
}));
