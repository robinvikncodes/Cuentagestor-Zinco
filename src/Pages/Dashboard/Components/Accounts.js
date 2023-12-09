import styled from "@emotion/styled";
import { Button, Skeleton } from "@mui/material";
import React from "react";
import { Icone } from "../../../Assets/AssetsLog";
import { Link } from "react-router-dom";
import AddAccountModal from "../../Accounts/Components/AddAccountModal";
import { AmountFormater } from "../../../globalFunctions";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const Accounts = ({ accountList, isLoading }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="bg-[#F9F9F9] rounded-[22px] border-[1px] border-[#E7E7E7] px-[14px] py-[12px] mb-3 w-full grid grid-cols-8 grid-rows-1 gap-x-3 ">
        {/* <div className="bg-white  flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] ">
          <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div>
          <p className="text-[#0150B1] text-[10px] font-[400]">Bank Name</p>
          <div className="bg-[#E2EFFF] p-[10px] rounded-[13px] my-[5px] inline-block">
            <img src={Icone.BankIcon} alt="" className="" />
          </div>
          <p className="text-[10px] font-[400]">SAR 400,00,000,00</p>
        </div>

        <div className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] ">
          <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div>
          <p className="text-[#15960A] text-[10px] font-[400]">Wallet Name</p>
          <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] my-[5px] inline-block">
            <img src={Icone.WalletGreenIcon} alt="" className="" />
          </div>
          <p className="text-[10px] font-[400]">SAR 400,00,000,00</p>
        </div> */}

        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((i, key) => (
              <div
                key={key + 1}
                className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] "
              >
                <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div>
                <p className="text-[10px] font-[400] w-3/4 ">
                  <Skeleton variant="text" />
                </p>
                <div className=" rounded-[13px] my-[10px] inline-block ">
                  {/* <img src={Icone.BankIcon} alt="" className="" /> */}
                  <Skeleton variant="rounded" width={"34px"} height={"34px"} />
                </div>
                <p className=" text-[#15960A] text-[10px] font-[400] w-full">
                  <Skeleton variant="text" width={"100%"} />
                </p>
              </div>
            ))
          : accountList?.slice(0, 6).map((data, key) => (
              <CardButton
                key={key + 1}
                component={Link}
                to={`/accounts?id=${data.id}`}
              >
                <div className=" flex flex-col justify-center items-center ">
                  <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div>
                  <p className="text-[#15960A] text-[10px] font-[400]">
                    {data.account_name}
                  </p>
                  {data.account_type === 1 ? (
                    <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] my-[5px] inline-block">
                      <img src={Icone.WalletGreenIcon} alt="" className="" />
                    </div>
                  ) : (
                    <div className="bg-[#E2EFFF] p-[10px] rounded-[13px] my-[5px] inline-block">
                      <img src={Icone.BankIcon} alt="" className="" />
                    </div>
                  )}
                  <p className="text-[10px] font-[400]">
                    {userData.country_details.currency_simbol} {AmountFormater(data.balance) }
                  </p>
                </div>
              </CardButton>
            ))}

        <StyledButton onClick={handleOpen}>
          <img src={Icone.PurplePlus} alt="" className="" />
        </StyledButton>
        <StyledButton component={Link} to="/accounts">
          <p className="text-[13px] font-[400] text-[#7F52E8] ">View all</p>
        </StyledButton>
      </div>
      <AddAccountModal open={open} handleClose={handleClose} />
    </>
  );
};

export default Accounts;

const StyledButton = styled(Button)(() => ({
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#7F52E8",
  backgroundColor: "#EFE8FF",
  borderRadius: "15px",
  border: "1px solid #E4E4E4",
  textTransform: "none",
  height: "121px",
}));

const CardButton = styled(Button)(() => ({
  color: "black",
  backgroundColor: "white",
  borderRadius: "15px",
  border: "1px solid #E7E7E7",
  textTransform: "none",
  height: "130px",
  width: "112px",
  "&.:hover": {
    backgroundColor: "white",
  },
}));
