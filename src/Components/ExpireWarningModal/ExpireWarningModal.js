import React, { useEffect, useState } from "react";
import { LogoutFun } from "../../globalFunctions";
import { Box, Button, CircularProgress, Modal, styled } from "@mui/material";
import { Images } from "../../Assets/AssetsLog";
import ExpireDateImage from "../../Assets/Images/Group 1414.svg"
// import { Modal } from "@mui/base";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
import { listOrginization } from "../../Api/Organizations/organizationsApi";
import { UserData } from "../../globalVariable";
import { openSnackbar } from "../../features/snackbar";
import CompanyModal from "../Navbar/Components/CompanyModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "background.paper",
  borderRadius: "22px",
  boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.12)", // Shadow
  padding: "0px",
  backdropFilter: "blur(20px)",
};

const ExpireWarningModal = (props) => {
  const settingData = useSelector((state) => state.setting.settingDetails);
  const [openCountryList, setOpenCountryList] = useState(false)
  const [openExpire, setOpenExpire] = useState(!settingData.isExpired)
  const dispatch = useDispatch();

  const mutateOrg = useMutation({
    mutationFn: (newData) => listOrginization(newData),
    onSuccess: (res) => {
      if (res.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: res.message || "Company Switch Successfully",
            severity: "success",
          })
        );
        // let uei = UserData
        let storageData = JSON.stringify({
          ...UserData,
          organization: res.data.id,
          country_details: res.data.country_details,
        });
        localStorage.setItem("UserCredentials", storageData);
        window.location.reload();
        // console.log(res.data.id);
      }
    },
  });

  const changeCompany = function () {
    setOpenExpire(false)
    setOpenCountryList(true)
    // mutateOrg.mutate({
    //   method: "post",
    //   data: { id: UserData.mainOrganization },
    // });
  };
  const handleCloseCountryList =  function() {
    setOpenCountryList(false)
    setOpenExpire(true)
  }


  useEffect(() => {
    setOpenExpire(!settingData.isExpired)
  }, [settingData.isExpired])

  return (
    <>
    <Modal
      open={openExpire}
      // onClose={() => props.handleClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        "& .MuiBackdrop-root": {
          backdropFilter: "blur(4px)", // Adjust the blur value as needed
        },
      }}
    >
      <Box sx={style}>
        <div className="px-[48px] py-[41px]">
          <img src={ExpireDateImage} alt="" className="mb-4" />
          <p className="text-[#5346BD] texxt-[16px] font-[400] text-center">
            Contact
          </p>
          <p className="text-center mb-6">+91 8789 0099</p>
          { (
            <SaveButton onClick={changeCompany} disabled={mutateOrg.isLoading}>
              {mutateOrg.isLoading ? (
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
                "Switch Company"
              )}
            </SaveButton>
          )}
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
      </Box>
    </Modal>
    <CompanyModal is_blur={true} open={openCountryList} handleClose={handleCloseCountryList}/>
    </>

  );
};

export default ExpireWarningModal;

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
  "&:hover": {
    backgroundColor: "#7F52E8",
  },
}));
