import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { Box, Modal } from "@mui/material";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { listReminder } from "../../../Api/Notification/notificationApi";
import { useNavigate } from "react-router-dom";
import { AmountFormater } from "../../../globalFunctions";

const style = {
  position: "absolute",
  top: "8%",
  right: "2%",
  height: "calc(100vh - 100px)",
  width: 430,
  backgroundColor: "background.paper",
  borderRadius: "22px",
  boxShadow: 24,
  padding: "0px",
  // transform: "translate(-50%, -50%)",
  // border: "2px solid #000",
  // px: "26px",
  // py: "21px",
};

const NotificationModal = (props) => {
  const navigate = useNavigate();
  const [notificationList, setNotificationList] = useState([]);

  const showTransactionRoll = function (voucher_type, amount) {
    // console.log();
    // switch (voucher_type) {
    //   case "LEX":
    //     return { color: "#C90101", edit: false, delete: true };

    //   case "EX":
    //     return { color: "#C90101", edit: true, delete: true };

    //   case "AEX":
    //     return { color: "#C90101", edit: true, delete: true };

    //   case "IC":
    //     return { color: "#15960A", edit: true, delete: true };

    //   case "AIC":
    //     return { color: "#15960A", edit: true, delete: true };

    //   case "LON":
    //     return {
    //       color: amount < 0 ? "#15960A" : "#C90101",
    //       edit: false,
    //       delete: false,
    //     };
    //   default:
    //     return { color: "black", edit: false, delete: false };
    // }
    switch (voucher_type) {
      case "EX":
      case "AEX":
        return "#C90101";
      case "IC":
      case "LON":
      case "AIC":
        return "#15960A";
      default:
        return "black";
    }
  };

  useQuery("listReminder", () => listReminder(), {
    onSuccess: (res) => {
      if (res.StatusCode === 6000) {
        setNotificationList(res.data);
        console.log(res.data);
      }
    },
  });

  return (
    <Modal
      open={props.open}
      onClose={() => props.handleClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="">
          <div className="flex justify-between items-center px-[26px] pt-[21px] pb-4 ">
            <p className="text-[16px] font-[400]">Notifications</p>
            {/* <AddButton addbgcolor={"white"} /> */}
          </div>
          <div className="h-[600px] overflow-y-scroll">
            <div className="px-[18px] py-[21px] border-t-[1px] ">
              {notificationList.map((items, i) => (
                <div className="flex justify-between items-center border-[1px] p-3">
                  <div>
                    <p className="text-[13px] font-[500] text-[#7B61DA]">
                      {items.master_name}
                      {/* <span className="text-[#A50808]">- took</span> */}
                    </p>
                    <p
                      className={`text-[13px] font-[400] text-[${showTransactionRoll(
                        items.voucher_type
                      )}]`}
                    >
                      {items.account_name}
                    </p>
                    <p className={`text-[14px] font-[600] text-[${showTransactionRoll(
                        items.voucher_type
                      )}]`}>
                      Rs. {AmountFormater(items.amount)}
                      <span className="text-[12px] text-[#707070] font-[600] ml-1">
                        {items.day}
                      </span>
                    </p>
                  </div>
                  {/* <StyledButton payed={items.voucher_type === "EX"} onClick={() => showTransactionRoll(items.voucher_type)}>Pay now</StyledButton> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default NotificationModal;

const StyledButton = styled(Button)((props) => ({
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#fff",
  backgroundColor: props.payed ? "#FF5757" : "#49B771",
  borderRadius: "30px",
  border: "1px solid #E4E4E4",
  textTransform: "none",
  ":hover": {
    backgroundColor: props.payed ? "#FF5757" : "#49B771",
  },
}));
