import "./App.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Router from "./Router/Router";
import "./Api/zincoApi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Snackbar } from "@mui/material";
import { closeSnackbar } from "./features/snackbar";
import { callSettings } from "./features/setting";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import ZincoModal from "./Components/Component/ZincoModal";
import { Images } from "./Assets/AssetsLog";
import { LogoutFun } from "./globalFunctions";

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
  const dispatch = useDispatch();
  const user = localStorage.getItem("UserCredentials");

  const [isExpired, setIsExpired] = useState(isExpiredReducer.isUserExpired);
  const handleCloseExpire = function () {
    setIsExpired(isExpiredReducer.isUserExpired);
  };

  console.log(isExpiredReducer.isUserExpired, "Thore is back ++++++++++++++++++++++++++++");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(closeSnackbar({}));
    console.log(snackData);
  };

  // useEffect(() => {
  //   setIsExpired(isExpiredReducer.isUserExpired)
  // }, [isExpiredReducer.isUserExpired])
  

  useEffect(() => {
    dispatch(callSettings());
  }, []);

  return (
    <>
      {/* <Outlet /> */}
      {/* <Dashboard /> */}
      <QueryClientProvider client={queryClient}>
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
        <ZincoModal open={isHomePage ? false : isExpired} handleClose={handleCloseExpire}>
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
        </ZincoModal>
      </QueryClientProvider>
    </>
  );
}

export default App;
