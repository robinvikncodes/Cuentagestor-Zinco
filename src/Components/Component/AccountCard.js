import { Button, styled } from "@mui/material";
import React from "react";
import { Icone } from "../../Assets/AssetsLog";
import { UserData } from "../../globalVariable";
import { AmountFormater } from "../../globalFunctions";
import { useSelector } from "react-redux";

const AccountCard = (props) => {

  const userRollReducer = useSelector((state) => state.userRole.state);
  return (
    <CardButton active={props.active} {...props}>
      <div className=" flex flex-col justify-center items-center ">
        <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div>
        {props.data.account_type === 1 ? (
          <p className="text-[#15960A] text-[10px] font-[400]">
            {props.data.account_name}
          </p>
        ) : (
          <p className="text-[#0150B1] text-[10px] font-[400]">
            {props.data.account_name}
          </p>
        )}
        {props.data.account_type === 1 ? (
          <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] my-[5px] inline-block">
            <img src={Icone.WalletGreenIcon} alt="" className="" />
          </div>
        ) : (
          <div className="bg-[#E2EFFF] p-[10px] rounded-[13px] my-[5px] inline-block">
            <img src={Icone.BankIcon} alt="" className="" />
          </div>
        )}
        {
          <p className="text-[10px] font-[400] h-[17.5px]">
            {userRollReducer.account_balance.view_permission
              ? UserData.country_details.currency_simbol +
                " " +
                AmountFormater(props.data.balance)
              : "   "}
          </p>
      }
      </div>
    </CardButton>
  );
};

export default AccountCard;

const CardButton = styled(Button)(({active, nocur}) => ({
  color: "black",
  backgroundColor: active ? "#F6F6F6" : "white",
  cursor: nocur ? "none" : "pointer",
  borderRadius: "15px",
  border: "1px solid #E7E7E7",
  textTransform: "none",
  height: "130px",
  width: "112px",
  "&.:hover": {
    backgroundColor: "white",
  },
}));
