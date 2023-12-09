import styled from "@emotion/styled";
import { Button, Popover } from "@mui/material";
import React, { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Icone } from "../../../Assets/AssetsLog";
import TransactionModal from "../../Income/Components/TransactionModal";
import TransactionModalEx from "../../Expenses/Components/TransactionModal";
import TransactionList from "../../../Components/TransactionList/TransactionList";
import { useQuery } from "react-query";
import { listFinanceTransaction } from "../../../Api/Finance/FinanceApi";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const Transactions = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEditIncome, setIsEditIncome] = useState(false);
  const [isEditExpenses, setIsEditExpenses] = useState(false);
  const [openExpenses, setOpenExpenses] = useState(false);
  const [openIncome, setOpenIncome] = useState(false);
  const [transData, setTransData] = useState(null);
  const [transactionData, setTransactionData] = useState({});

  // Handle Functions
  const handleOpenExpenses = () => setOpenExpenses(true);
  const handleCloseExpenses = () => {
    setOpenExpenses(false);
    setIsEditExpenses(false);
  };
  const handleOpenIncome = () => setOpenIncome(true);
  const handleCloseIncome = () => {
    setOpenIncome(false);
    setIsEditIncome(false);
  };
  const handleClickPoper = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePoper = () => {
    setAnchorEl(null);
  };

  const openPoper = Boolean(anchorEl);
  const id = openPoper ? "simple-popover" : undefined;

  const transationData = useQuery(
    ["asset-transationData", props.paramValue],
    () => listFinanceTransaction({ asset_master_id:  props.assetDetail.asset_master_id ,is_asset: true, finance_type: 2 }),
    {
      enabled: !!props.paramValue,
      onSuccess: (data) => {
        console.log(data);
        if (data.StatusCode !== 6000) {
        } else {
          setTransData(data);
        }
      },
    }
  )

  

  return (
    <>
      <div>
        <div className="flex justify-between items-center px-5 pb-5 border-b-[1px] border-[#DEDEDE]">
          <p className="text-[16px] font-[400]">{props.assetDetail.asset_name}</p>
          <div className="flex items-center">
            {/* <p className="mr-[15px] text-[#868686] text-[13px] font-[400]">User role</p> */}

            <StyledButton startIcon={<AddRoundedIcon />}
              onClick={handleClickPoper}
            >
              Transactions
            </StyledButton>
            <Popover
              id={id}
              open={openPoper}
              anchorEl={anchorEl}
              onClose={handleClosePoper}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              sx={{
                "& .MuiPaper-rounded": {
                  borderRadius: "13px",
                },
              }}
            >
              <div className="p-1 flex flex-col rounded-xl w-[180px]">
                <Button
                  startIcon={
                    <div className="bg-[#FFEBF0] p-[10px] rounded-[13px] mr-[10px]">
                      <img src={Icone.WalletAdd2Icon} alt="" />
                    </div>
                  }
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    color: "#545454",
                    fontSize: "13px",
                    fontWeight: 400,
                  }}
                  onClick={() => handleOpenExpenses()}
                >
                  Expenses
                </Button>

                <Button
                  startIcon={
                    <div className="bg-[#E0FFF6] p-[10px] rounded-[13px] mr-[10px]">
                      <img src={Icone.WalletAddIcon} alt="" />
                    </div>
                  }
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    color: "#545454",
                    fontSize: "13px",
                    fontWeight: 400,
                  }}
                  onClick={() => handleOpenIncome()}
                >
                  Income
                </Button>
              </div>
            </Popover>
          </div>
        </div>

        <div className="p-[20px]">
        <TransactionList
          setIsEditExpenses = {setIsEditExpenses}
          setIsEditIncome= {setIsEditIncome}
          transData={transData?.data}
          setTransactionData={setTransactionData}
          setOpenIncome={setOpenIncome}
          setOpenExpenses={setOpenExpenses}
        />
        </div>
      </div>

      {openExpenses && (
        <TransactionModalEx
          transID={transactionData.id}
          is_asset = {true}
          asset_master_id = {props.assetDetail.asset_master_id}
          open={openExpenses}
          edit={isEditExpenses}
          handleClose={handleCloseExpenses}
        />
      )}

      {openIncome && (
        <TransactionModal
          transID={transactionData.id}
          is_asset = {true}
          asset_master_id = {props.assetDetail.asset_master_id}
          open={openIncome}
          edit={isEditIncome}
          handleClose={handleCloseIncome}
        />
      )}{" "}

    </>
  );
};

export default Transactions;

const StyledButton = styled(Button)(() => ({
  justifyContent: "space-between",
  // width: "100%",
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#7F52E8",
  backgroundColor: "#F8F5FF",
  borderRadius: "30px",
  border: "1px solid #E4E4E4",
  textTransform: "none",
}));