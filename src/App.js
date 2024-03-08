import "./App.css";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Router from "./Router/Router";
import "./Api/zincoApi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Snackbar } from "@mui/material";
import { closeSnackbar, openSnackbar } from "./features/snackbar";
import { callSettings } from "./features/setting";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import ZincoModal from "./Components/Component/ZincoModal";
import { Images } from "./Assets/AssetsLog";
import { LogoutFun } from "./globalFunctions";
import { closeSuccessModal, openSuccessModal } from "./features/userinvite";
import { invitedUser } from "./Api/UserCredentials/UserCredentialsApi";
import { UserData } from "./globalVariable";
import ExpireWarningModal from "./Components/ExpireWarningModal/ExpireWarningModal";

const queryClient = new QueryClient();
let userData = JSON.parse(localStorage.getItem("UserCredentials"))
let isActive = JSON.parse(localStorage.getItem("isUserActivate"))
!isActive && localStorage.setItem("isUserActivate", JSON.stringify({isUserExpired: false, date: ""}))

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const navigate = useNavigate();
  const snackData = useSelector((state) => state.snackbar.snackBarRedux);
  const settingData = useSelector((state) => state.setting.settingDetails);
  const isExpiredReducer = useSelector(state => state.expireState.userDetails)  
  const inviteUserData = useSelector((state) => state.userinvite.userInviteRedux);
  const dispatch = useDispatch();
  const user = localStorage.getItem("UserCredentials");
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("invitation_id");

  const [isExpired, setIsExpired] = useState(false);
  const handleCloseExpire = function () {
    setIsExpired(false);
  };

  console.log(isExpiredReducer.isUserExpired, "Thore is back ++++++++++++++++++++++++++++");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(closeSnackbar({}));
    console.log(snackData);
  };

  const handleCloseInviteuser = (e, value) => {
    dispatch(closeSuccessModal({}));
  }

  // useEffect(() => {
  //   setIsExpired(isExpiredReducer.isUserExpired)
  // }, [isExpiredReducer.isUserExpired])

  const mutateInvite = useMutation({
    mutationFn: (newTodo) => {
      return invitedUser({ ...newTodo });
    },
    onSuccess: res => {
      if (res.StatusCode === 6000) {
        dispatch(openSuccessModal({}))
        UserData  && navigate("/")
      } else{
        dispatch(
          openSnackbar({
            open: true,
            message: res.message,
            severity: "warning",
          })
        );
      }
    }
  })
  
  useEffect(() => {
    paramValue && mutateInvite.mutate({invitation_id: paramValue})
  }, [paramValue])

  useEffect(() => {
    UserData && dispatch(callSettings());
  }, []);

  return (
    <>
      {/* <Outlet /> */}
      {/* <Dashboard /> */}
      {/* <QueryClientProvider client={queryClient}> */}
        <div
          className="App"
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          <div style={{ flexGrow: "1" }}>{user && <Navbar />}</div>
          <Router />
          {snackData && (
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={snackData.open}
              autoHideDuration={6000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity={snackData.severity}
                sx={{ width: "100%" }}
              >
                {snackData.message}
              </Alert>
            </Snackbar>
          )}
        </div>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        {/* <ZincoModal open={isExpired} handleClose={handleCloseExpire}>
          <div className="px-[48px] py-[41px]">
            <img src={Images.ExpireImg} alt="" className="mb-4"/>
            <p className="text-[#5346BD] texxt-[16px] font-[400] text-center">
              Contact
            </p>
            <p className="text-center mb-6">+91 8789 0099</p>
            <div className="flex justify-center">
              <Button
                onClick={LogoutFun}
                sx={{
                  color: "#DE4343",
                  fontSize: "16px",
                  fontWeight: "400",
                  textTransform: "none",
                }}
                variant="text"
              >
                Log out
              </Button>
            </div>
          </div>
        </ZincoModal> */}
        <ZincoModal open={inviteUserData.open} handleClose={handleCloseInviteuser}>
          <div className="px-[48px] py-[41px]">
            {/* <img src={Images.ExpireDateImage} alt="" className="mb-4"/> */}
            <iframe style={{width: "272px"}} title="loty" src="https://lottie.host/embed/de98b8ab-fcfe-4d43-a423-92e51a058a79/aJqsiphWLE.json"></iframe>
            <p className="text-[#5346BD] texxt-[16px] font-[400] text-center">
              You invited Successfully
            </p>
            <p className="text-center mb-6"></p>
            <div className="flex justify-center">
              <Button
                onClick={handleCloseInviteuser}
                sx={{
                  background: "#5346BD",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "400",
                  textTransform: "none",
                }}
                variant="contained"
              >
                Done
              </Button>
            </div>
          </div>
        </ZincoModal>
        {!isHomePage && <ExpireWarningModal />}
      {/* </QueryClientProvider> */}
    </>
  );
}

export default App;
