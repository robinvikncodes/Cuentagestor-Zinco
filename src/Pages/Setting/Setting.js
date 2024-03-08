import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import styled from "@emotion/styled";
import ZincoSwitch from "../../Components/Component/ZincoSwitch";
import User from "./Components/User";
import UserRole from "./Components/UserRole";
import { Icone } from "../../Assets/AssetsLog";
import { Link, useNavigate } from "react-router-dom";
import { ChangeSettings, detailSettings } from "../../Api/Setting/SettingApi";
import { useMutation, useQuery } from "react-query";
import { BaseUrl } from "../../globalVariable";
import { useDispatch, useSelector } from "react-redux";
import { setSettings } from "../../features/setting";
import ChangePassword from "./Components/ChangePassword";
import DeleteAccount from "./Components/DeleteAccount";
import { ArrowRightIcon } from "@mui/x-date-pickers";

let imgFile;

const Setting = () => {
  const settingRedux = useSelector((state) => state.setting.settingDetails);
  const dispatch = useDispatch();
  // console.log(settingRedux);
  const [boole, setBoole] = useState(false);
  // const [second, setbool] = useState(second)
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(settingRedux.isLoading)
  const [editValue, setEditValue] = useState({
    username: true,
    email: true,
    biometricLogin: true,
    is_zakath: settingRedux.is_zakath,
    is_reminder: settingRedux.is_reminder,
    is_interest: settingRedux.is_interest,
    photo: settingRedux.photo,
    name: settingRedux.name,
    emailP: settingRedux.email,
  });
  const [notification, setNotification] = useState(settingRedux.reminder_day);
  const [rounding, setRounding] = useState(settingRedux.rounding);
  const [currency, setCurrency] = useState(settingRedux.currency);
  const [openCP, setOpenCP] = useState(false);
  const [openDA, setOpenDA] = useState(false);

  const userNameRef = useRef(null);
  const emailRef = useRef(null);

  const handleCloseCP = () => {
    setOpenCP(false);
  };

  const handleCloseDA = () => {
    setOpenDA(false);
  };

  const handleNotification = (event) => {
    setNotification(event.target.value);
    submitData({
      type: "reminder_day",
      value: event.target.value,
    })
  };

  const handleRounding = (event) => {
    setRounding(event.target.value);
    submitData({
      type: "rounding",
      value: event.target.value,
    });
    dispatch(
      setSettings({
        rounding: event.target.value,
      })
    );
  };

  const handleCurrency = (event) => {
    setCurrency(event.target.value);
  };

  const handleChangeSwitch = (event) => {
    setEditValue({ ...editValue, is_reminder: event.target.checked });
    submitData({
      type: "is_reminder",
      value: !editValue.is_reminder ? "True" : "False",
    });
    dispatch(
      setSettings({
        is_reminder: !editValue.is_reminder,
      })
    );
  };

  useEffect(() => {
    setEditValue({
      ...editValue,
      is_zakath: settingRedux.is_zakath,
      is_reminder: settingRedux.is_reminder,
      is_interest: settingRedux.is_interest,
      photo: settingRedux.photo,
      name: settingRedux.name,
      emailP: settingRedux.email,
    })
    setIsLoading(settingRedux.isLoading)
    setNotification(settingRedux.reminder_day)
    setRounding(settingRedux.rounding)
  }, [settingRedux])
  

  const handleImageChange = (event) => {
    imgFile = event.target.files[0];
    setSelectedImage(URL.createObjectURL(imgFile));
    // setAccountData({ ...accountData , photo: imgFile});
    setEditValue({
      ...editValue,
      photo: null,
    });
    submitData({ type: "photo", value: imgFile });
  };

  const addImage = () => {
    const input = document.getElementById("imgInput");
    input.click();
  };

  const logoutfun = function () {
    localStorage.removeItem("UserCredentials");
    window.location.reload();
  };

  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return ChangeSettings({ ...newTodo });
    },
    onSuccess: res => {
      if (res.StatusCode === 6000){
        dispatch(
          setSettings({
            name: editValue.name,
          })
        );
      } else {

      }
    }
  });

  const submitData = (data) => {
    mutation.mutate({ ...data });
    // console.log(data);
  };

  return (
    <>
      <div className="flex h-full">
        <div className="LeftContainer w-[28%] min-w-[399px] pl-[14px]">
          <div className="h-full w-full rounded-[15px] border-[1px] border-[#E7E7E7] bg-white p-[16px]">
            <div className="flex justify-between items-center mb-5">
              <p className="text-[16px] font-[400]">Settings</p>
              <div className="flex items-center ">
                <p className="text-[13px] text-[#CB2424] font-[400]">
                  Delete Account
                </p>
                <IconButton
                  color="error"
                  aria-label="delete"
                  onClick={() => setOpenDA(true)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>

            <div className="px-[20px] py-[26px] rounded-2xl bg-[#F3F7FC] mb-5">
              <div className="flex mb-7">
                {isLoading ? (
                  <Skeleton variant="circular" width={96} height={96} />
                ) : (
                  <>
                    <IconButton
                      sx={{
                        height: "96px",
                        width: "96px",
                        mr: "12px",
                        backgroundColor: "#C4D1E1",
                        "&:hover": {
                          backgroundColor: "#C4D1E1",
                        },
                      }}
                      onClick={addImage}
                    >
                      {editValue.photo === null ? (
                        <img src={selectedImage || Icone.PlusIcon} alt="" />
                      ) : (
                        <img src={BaseUrl + editValue.photo} alt="" />
                      )}
                    </IconButton>
                    <input
                      style={{ display: "none" }}
                      name="photo"
                      id="imgInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </>
                )}
                <div>
                  {/* <div className="flex items-center ">
                  {editValue.username ? (
                    <p className="text-[18px] text-[#CB2424] font-[600] ">
                      Savad farooque
                    </p>
                  ) : (
                    <input
                      id="userName"
                      ref={inputRef}
                      className="text-[18px] text-[#CB2424] font-[600] bg-[#F3F7FC] max-w-[169px] h-10 border-b-2 focus:border-primary border-gray-300 transition-all duration-300"
                      type="text"
                      value={"Savad farooque"}
                    />
                  )}
                  {editValue.username && (
                    <IconButton
                      onClick={() =>{
                        if (inputRef.current) {
                          inputRef.current.focus(); // Focus on the input element if it exists
                        }            
                        setEditValue({ ...editValue, username: false })
                      }
                      }
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </div> */}
                  <div className="flex items-center">
                    {isLoading && editValue.username ? (
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={208}
                        height={25}
                        sx={{ mb: "15px" }}
                      />
                    ) : (
                      <>
                        <p
                          className={`${
                            !editValue.username && "hidden"
                          } text-[18px] text-[#CB2424] font-[600]`}
                        >
                          {editValue.name.length >= 14
                            ? editValue.name.slice(0, 14) + "..."
                            : editValue.name}
                        </p>
                        <input
                          ref={userNameRef}
                          id="userName"
                          name="first_name"
                          className={`${
                            editValue.username && "hidden"
                          } text-[18px] text-[#CB2424] font-[600] bg-[#F3F7FC] max-w-[200px] h-10 border-b-2 focus:border-primary border-gray-300 transition-all duration-300`}
                          type="text"
                          // value={"Savad farooque"}
                          value={editValue.name}
                          onChange={(e) =>
                            setEditValue({ ...editValue, name: e.target.value })
                          }
                          onBlur={(e) => {
                            setEditValue({ ...editValue, username: true });
                            submitData({
                              value: e.target.value,
                              type: e.target.name,
                            });
                          }}
                        />
                        {editValue.username && (
                          <IconButton
                            onClick={() => {
                              if (userNameRef.current) {
                                setTimeout(() => {
                                  userNameRef.current.focus();
                                }, 0);
                              }
                              setEditValue({ ...editValue, username: false });
                              // console.log(editValue);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center ">
                    {isLoading && editValue.email ? (
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={208}
                        height={25}
                        sx={{ mb: "15px" }}
                      />
                    ) : (
                      <>
                        {" "}
                        <p
                          className={` ${
                            !editValue.email && "hidden"
                          } text-[12px] text-[#08640B] font-[400]`}
                        >
                          {editValue.emailP.length >= 22
                            ? editValue.emailP.slice(0, 22) + "..."
                            : editValue.emailP}
                        </p>
                        <input
                          ref={emailRef}
                          id="email"
                          name="email"
                          className={` ${
                            editValue.email && "hidden"
                          } text-[12px] text-[#08640B] font-[400] bg-[#F3F7FC] max-w-[200px] h-10 border-b-2 focus:border-primary border-gray-300 transition-all duration-300`}
                          type="text"
                          // value={"Savad farooque"}
                          value={editValue.emailP}
                          onBlur={(e) => {
                            setEditValue({ ...editValue, email: true });
                            submitData({
                              value: e.target.value,
                              type: e.target.name,
                            });
                          }}
                          onChange={(e) =>
                            setEditValue({
                              ...editValue,
                              emailP: e.target.value,
                            })
                          }
                        />
                        {editValue.email && (
                          <IconButton
                            onClick={() => {
                              setEditValue({ ...editValue, email: false });
                              if (emailRef.current) {
                                setTimeout(() => {
                                  emailRef.current.focus();
                                }, 0);
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </>
                    )}
                  </div>

                  <Button
                    onClick={() => setOpenCP(true)}
                    variant="text"
                    sx={{
                      fontSize: "13px",
                      color: "#007BF9",
                      fontWeight: "400",
                      textTransform: "none",
                    }}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
              <LogoutButton
                onClick={logoutfun}
                startIcon={<img src={Icone.LogoutIcon} alt="logout" />}
              >
                Log out
              </LogoutButton>
            </div>

            <div className="flex items-center justify-between mb-[16px]">
              <div className="flex items-center">
                <ZincoSwitch
                  onChange={handleChangeSwitch}
                  checked={editValue.is_reminder}
                  // defaultValue={
                  //   editValue.is_reminder || data?.data?.is_reminder
                  // }
                />
                <p className="text-[15px] font-[400]">Notification</p>
              </div>
              <div className="flex items-center">
                <p className="text-[13px] text-[#5E5E5E] font-[400]">
                  <span className="text-[13px] font-[400] text-[#9974EF]">
                    Before{" "}
                  </span>
                </p>
                {/* <IconButton>
                <ArrowRightRoundedIcon />
              </IconButton> */}

                <FormControl sx={{ m: 1, minWidth: 50 }} size="small">
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={notification}
                    label="Age"
                    onChange={handleNotification}
                    sx={{
                      color: "#878787",
                      fontWeight: 400,
                      fontSize: "14px",
                      border: "none",
                      py: 0, // decrease padding in y-axis
                      "& .MuiSelect-select": {
                        px: 0, // decrease padding in x-axis
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  >
                    <MenuItem value={1}>1 day</MenuItem>
                    <MenuItem value={2}>2 day</MenuItem>
                    <MenuItem value={3}>3 day</MenuItem>
                    <MenuItem value={4}>4 day</MenuItem>
                    <MenuItem value={5}>5 day</MenuItem>
                    <MenuItem value={6}>6 day</MenuItem>
                    <MenuItem value={7}>7 day</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

          <StyledButton
            onClick={() => setBoole(false)}
            is_selected = {!boole}
            // endIcon={<ArrowRightRoundedIcon />}
            endIcon={<ArrowRightIcon />}
          >
            User
          </StyledButton>
          <StyledButton
             onClick={() => setBoole(true)}
             is_selected = {boole}
            // endIcon={<ArrowRightRoundedIcon />}
            endIcon={<ArrowRightIcon />}
          >
            User role
          </StyledButton>

          <div className="flex justify-between items-center rounded-[8px] border-[1px] border-[#E7E7E7] bg-white mb-[7px]">
            <p className="text-[15px] font-[400] px-[18px]">Biometric Login</p>
            <ZincoSwitch defaultValue={false} />
          </div>

            <div className="flex justify-between items-center rounded-[8px] border-[1px] border-[#E7E7E7] bg-white mb-[7px]">
              <p className="text-[15px] font-[400] px-[18px]">Zakah</p>
              <ZincoSwitch
                checked={editValue.is_zakath}
                onChange={() => {
                  setEditValue({
                    ...editValue,
                    is_zakath: !editValue.is_zakath,
                  });
                  submitData({
                    type: "is_zakath",
                    value: !editValue.is_zakath ? "True" : "False",
                  });
                  dispatch(
                    setSettings({
                      is_zakath: !editValue.is_zakath,
                    })
                  );
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div>

            <div className="flex justify-between items-center rounded-[8px] border-[1px] border-[#E7E7E7] bg-white mb-[7px]">
              <p className="text-[15px] font-[400] px-[18px]">Interest</p>
              <ZincoSwitch
                checked={editValue.is_interest}
                onChange={() => {
                  setEditValue({
                    ...editValue,
                    is_interest: !editValue.is_interest,
                  });
                  submitData({
                    type: "is_interest",
                    value: !editValue.is_interest ? "True" : "False",
                  });
                  dispatch(
                    setSettings({
                      is_interest: !editValue.is_interest,
                    })
                  );
                }}
              />
            </div>

            <div className="flex justify-between items-center rounded-[8px] border-[1px] border-[#E7E7E7] bg-white mb-[7px] h-10">
              <p className="text-[15px] font-[400] px-[18px]">Rounding</p>
              {/* <ZincoSwitch /> */}
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={rounding}
                  label="Age"
                  onChange={handleRounding}
                  sx={{
                    color: "#878787",
                    fontWeight: 400,
                    fontSize: "14px",
                    border: "none",
                    py: 0, // decrease padding in y-axis
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                >
                  <MenuItem value={1}>1 Digits</MenuItem>
                  <MenuItem value={2}>2 Digits</MenuItem>
                  <MenuItem value={3}>3 Digits</MenuItem>
                  <MenuItem value={4}>4 Digits</MenuItem>
                  <MenuItem value={5}>5 Digits</MenuItem>
                  <MenuItem value={6}>6 Digits</MenuItem>
                  <MenuItem value={7}>7 Digits</MenuItem>
                  <MenuItem value={8}>8 Digits</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="flex justify-between items-center rounded-[8px] border-[1px] border-[#E7E7E7] bg-white mb-[7px] h-10">
              <p className="text-[15px] font-[400] px-[18px]">Currency</p>
              {/* <p className="text-[14px] font-[400] px-[18px] text-[#878787]">
              ##,###,###.##
            </p> */}
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={currency}
                  label="Age"
                  onChange={handleCurrency}
                  sx={{
                    color: "#878787",
                    fontWeight: 400,
                    fontSize: "14px",
                    border: "none",
                    py: 0, // decrease padding in y-axis
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                >
                  <MenuItem value={1}>##,###,###,##0.</MenuItem>
                  <MenuItem value={2}>##,##,##0</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>

        <div className="RightContainer w-[72%]">
          {boole ? <UserRole /> : <User />}
        </div>
      </div>
      <ChangePassword open={openCP} handleClose={handleCloseCP} />
      <DeleteAccount open={openDA} handleClose={handleCloseDA} />
    </>
  );
};

export default Setting;

const StyledButton = styled(Button)(({is_selected}) => ({
  justifyContent: "space-between",
  width: "100%",
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#000",
  backgroundColor: is_selected ? "#1976d20a" : "white",
  borderRadius: "8px",
  border: "1px solid #E4E4E4",
  textTransform: "none",
  marginBottom: "7px",
  "&:hover": {
    backgroundColor: is_selected ? "white": "#1976d20a",
  }
}));

const LogoutButton = styled(Button)(() => ({
  width: "100%",
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#fff",
  backgroundColor: "#083971",
  borderRadius: "4px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#083971",
  },
}));
