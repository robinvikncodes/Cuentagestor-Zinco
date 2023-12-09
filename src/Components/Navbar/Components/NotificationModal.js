import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { Box, Modal } from "@mui/material";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { listReminder } from "../../../Api/Notification/notificationApi";

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
  const [notificationList, setNotificationList] = useState([
    {
      account: "a4e713d1-c3b7-4cb9-bebe-540e81a27bbf",
      account_balance: "-32720877.25590000",
      account_name: "Suspense Account",
      amount: "85.00000000",
      day: "in 1 Days",
      id: "7df64e46-9bf8-4e3c-88c0-30b3defa7b3a",
      master_id: 88,
      master_name: "tiktok",
      reminder_cycle: null,
      transaction_type: 1,
      voucher_type: "EX",
    },
  ]);

  useQuery("listReminder", () => listReminder(), {
    onSuccess: (res) => {
      if (res.StatusCode === 6000) {
        setNotificationList(res.data);
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
            <p className="text-[16px] font-[400]">Notification</p>
            {/* <AddButton addbgcolor={"white"} /> */}
          </div>
          <div className="px-[18px] py-[21px] border-t-[1px]">
            {notificationList.map((items, i) => (
              <div className="flex justify-between items-center border-[1px] p-3">
                <div>
                  <p className="text-[13px] font-[500] text-[#7B61DA]">
                    {items.master_name}
                    {/* <span className="text-[#A50808]">- took</span> */}
                  </p>
                  <p className="text-[13px] font-[400] text-[#DC0000]">
                    {items.account_name}
                  </p>
                  <p className="text-[14px] font-[600] ">
                    Rs. {parseFloat(items.amount).toFixed(2)}
                    <span className="text-[12px] text-[#707070] font-[600] ml-1">
                      {items.master_name}
                    </span>
                  </p>
                </div>
                <StyledButton payed={items.voucher_type === "EX"}>Pay now</StyledButton>
              </div>
            ))}
            {/* <div className="flex justify-between items-center border-[1px] p-3">
              <div>
                <p className="text-[13px] font-[500] text-[#7B61DA]">
                  Loan<span className="text-[#0E9A1C]">- took</span>
                </p>
                <p className="text-[13px] font-[400] text-[#DC0000]">
                  House Loan
                </p>
                <p className="text-[14px] font-[600] text-[#086712]">
                  Rs. 34,165.00
                  <span className="text-[12px] text-[#707070] font-[600] ml-1">
                    Today
                  </span>
                </p>
              </div>
              <StyledButton payed={false}>Receive</StyledButton>
            </div>

            <div className="flex justify-between items-center border-[1px] p-3">
              <div>
                <p className="text-[13px] font-[500] text-[#7B61DA]">Contact</p>
                <p className="text-[13px] font-[400] ">House Loan</p>
                <p className="text-[14px] font-[600] text-[#086712]">
                  Rs. 34,165.00
                  <span className="text-[12px] text-[#707070] font-[600] ml-1">
                    In 2 Days
                  </span>
                </p>
              </div>
              <StyledButton payed={false}>Receive</StyledButton>
            </div>

            <div className="flex justify-between items-center border-[1px] p-3">
              <div>
                <p className="text-[13px] font-[500] text-[#7B61DA]">
                  Loan<span className="text-[#A50808]">- took</span>
                </p>
                <p className="text-[13px] font-[400] text-[#DC0000]">
                  House Loan
                </p>
                <p className="text-[14px] font-[600] ">
                  Rs. 34,165.00
                  <span className="text-[12px] text-[#707070] font-[600] ml-1">
                    In 3 Days
                  </span>
                </p>
              </div>
              <StyledButton payed={true}>Pay now</StyledButton>
            </div> */}
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
