import React, { useState } from "react";
import { Icone } from "../../Assets/AssetsLog";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { deleteTransaction } from "../../Api/Finance/FinanceApi";
import { openSnackbar } from "../../features/snackbar";
import { useDispatch } from "react-redux";
import { AmountFormater } from "../../globalFunctions";
import { deleteTransfer } from "../../Api/Transfer/TransferApi";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const TransactionList = (props) => {
  let switchDel = true
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  // const [switchDelete, setSwitchDelete] = useState(true)

  const returnLogo = function (type) {
    switch (type) {
      case 0:
        // contact
        return (
          <div className="bg-[#D5FBDD] p-[10px] rounded-[13px] mr-[10px]">
            <img src={Icone.PersonalcardIcon} alt="" />
          </div>
        );

      case 1:
        // cash
        return (
          <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] mr-[10px] ">
            <img src={Icone.WalletGreenIcon} alt="" className="" />
          </div>
        );

      case 2:
        // Bank
        return (
          <div className="bg-[#E8F0FF] p-[10px] rounded-[13px] mr-[10px]">
            <img src={Icone.BankIcon} alt="" />
          </div>
        );

      case 3:
        // Income
        return (
          <div className="bg-[#E0FFF6] p-[10px] rounded-[13px] mr-[10px]">
            <img src={Icone.WalletAddIcon} alt="" />
          </div>
        );

      case 4:
        // Expenses
        return (
          <div className="bg-[#FFEBF0] p-[10px] rounded-[13px] mr-[10px]">
            <img src={Icone.WalletAdd2Icon} alt="" />
          </div>
        );
      case 8:
        // Transfer
        return (
          <div className="bg-[#E3F1FF] p-[10px] rounded-[13px] mr-[10px]">
            <img src={Icone.ArchiveIcon} alt="" />
          </div>
        );

      default:
        break;
    }
  };

  const returnColo = function (type) {
    // switch(type) {
    //   case "LEX":
    //   case "LIC":
    //     return "Loan";
    //   case "EX":
    //   case "AEX":
    //     return "Expense";
    //   case "IC":
    //   case "AIC":
    //     return "Income";
    //   case "TEX":
    //   case "TIC":
    //     return "Transfer";
    //   default:
    //     return "";
    // }

    switch (type) {
      case "LON":
      case "EX":
      case "AEX":
        return "#C90101";
      case "IC":
      case "AIC":
        return "#15960A";
      default:
        return "black";
    }
  };

  const showTransactionRoll = function (voucher_type, amount) {
    console.log();
    switch (voucher_type) {
      case "LEX":
        return {color: "#C90101", edit: false, delete: true};

      case "LIC":
        return {color: "#15960A", edit: false, delete: false};

      case "EX":
        return {color: "#C90101", edit: true, delete: true};

      case "AEX":
        return {color: "#C90101", edit: true, delete: true};

      case "IC":
        return {color: "#15960A", edit: true, delete: true};

      case "AIC":
        return {color: "#15960A", edit: true, delete: true};

      case "TEX":
        return {color: "#C90101", edit: true, delete: true};

      case "TIC":
        return {color: "#15960A", edit: true, delete: true};
      
      case "LON":
        return {color: amount < 0 ? "#15960A" : "#C90101", edit: false, delete: false};
      default:
        return {color: "black", edit: false, delete: false};
    }
  };

  const editTransaction = function (data) {
    // props.setTransactionData(data.id)
    console.log(data);
    if (data.to_account_account_type === 4 || data.to_account_type === 4) {
      props.setIsEditExpenses(true);
      props.setTransactionData(data);
      props.setOpenExpenses(true);
    } else if (
      data.from_account_type === 3 ||
      data.from_account_account_type === 3
    ) {
      console.log("I am heaar");
      props.setTransactionData(data);
      props.setOpenIncome(true);
      props.setIsEditIncome(true);
    }

    if (data.voucher_type === "TEX" || data.voucher_type === "TIC" ) {
      props.setTransactionData(data);
      props.setOpenTransfer(true)
      props.setIsEditTransfer(true)
    }
  };

  const deleteTsaction = useMutation({
    mutationFn: (newData) => switchDel ? deleteTransaction({ ...newData }) : deleteTransfer({ ...newData}),
    onSuccess: (data) => {
      if (data.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.data,
            severity: "success",
          })
        );
        if (data.to_account_account_type === 4 || data.to_account_type === 4) {
          queryClient.invalidateQueries("finance-expenses-transaction");
        } else if (data.from_account_type === 3 || data.from_account_account_type === 3) {
          queryClient.invalidateQueries("finance-income-transaction");
        } else {
          queryClient.invalidateQueries("account-transationData");
        }
        // setenabled(false);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: data.errors,
            severity: "error",
          })
        );
      }
    },
  });

  const deleteTransation = function (id, type) {
    if (type === "TEX" || type === "TIC") {
      switchDel = false
    } else {
      switchDel = true
    }
    deleteTsaction.mutate({ id });
  };

  return (
    <>
      {props?.transData?.map((list, key) => (
        <div key={key + 1}>
          <div className="flex items-center my-4">
            <div className="p-[10px] bg-[#F1FFF0] mr-3 rounded-[13px]">
              <img src={Icone.CalenderIcon} alt="" />
            </div>
            <p className="text-[16px] font-[400]">{list.date}</p>
          </div>

          {list.data.map((data, key) => (
            <div
              key={key + 1}
              className={`borderStyle p-[15px] rounded-[13px] flex justify-between items-center mb-2 ${
                !showTransactionRoll(data.voucher_type).edit
                  ? null
                  : "cursor-pointer"
              }`}
              
            >
              <div className="flex justify-between w-[100%] mr-2" onClick={() => showTransactionRoll(data.voucher_type).edit && editTransaction(data)}>
                <div className="flex items-center">
                  <div className="flex justify-center items-center">
                    {returnLogo(
                      data.from_account_type ?? data.from_account_account_type
                    )}
                    <p className="text-black font-[400] text-[16px]">
                      {data.from_account_name}
                    </p>
                  </div>
                  <p className="mx-[28px] text-[16px] font-[600] text-[#7F52E8]">
                    -
                  </p>
                  <div className="flex justify-center items-center">
                    {returnLogo(
                      data.to_account_type ?? data.to_account_account_type
                    )}
                    <p className="text-black font-[400] text-[16px]">
                      {data.to_account_name}
                    </p>
                  </div>
                </div>
                <div>
                  <p
                    className={`text-[19px] font-[500] text-[${showTransactionRoll(
                      data.voucher_type, data?.amount
                    ).color}] text-right`}
                  >
                    <span className="text-[#9B9B9B] text-[16px] font-[400] ">
                      {userData.country_details.currency_simbol}
                    </span>{" "}
                    {AmountFormater(data?.amount)}
                  </p>
                  <p className="text-[#9B9B9B] text-[13px] font-[400] text-right">
                    {data?.description || "Note"}
                  </p>
                </div>
              </div>

              {showTransactionRoll(data.voucher_type).delete && 
              <IconButton
                aria-label="delete"
                color="error"
                size="small"
                sx={{
                  color: "white",
                  fontSize: "10px",
                  bgcolor: "#CD0A0A",
                  "&:hover": {
                    bgcolor: "#CD0A0A",
                  },
                }}
                onClick={() => deleteTransation(data.id, data.voucher_type)}
              >
                <DeleteIcon sx={{ fontSize: "18px" }} />
              </IconButton>}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default TransactionList;
