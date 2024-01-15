import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Button,
  IconButton,
  Popover,
  Skeleton,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Icone } from "../../Assets/AssetsLog";
import AddButton from "../../Components/Component/AddButton";
import AddAccountModal from "./Components/AddAccountModal";
import {
  deleteAccount,
  detailsAccount,
  listAccount,
  listAccountTransiction,
} from "../../Api/Accounts/AccountsApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { dashboardDetails } from "../../Api/Dashboard/DashboardApi";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { listAccountFinance } from "../../Api/Finance/FinanceApi";
import TransactionList from "../../Components/TransactionList/TransactionList";
import AddContactModal from "../Contact/Components/AddContactModal";
import AddExpenses from "../Expenses/Components/AddExpenses";
import AddIncomeModal from "../Income/Components/AddIncomeModal";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { openSnackbar } from "../../features/snackbar";
import { useDispatch, useSelector } from "react-redux";
import TransactionModal from "../Income/Components/TransactionModal";
import TransactionModalEx from "../Expenses/Components/TransactionModal";
import TransferTransaction from "./Components/TransferTransaction";
import NewEntry from "../../Components/Component/NewEntry";
import ExportBtn from "../../Components/Component/ExportBtn";
import { AmountFormater } from "../../globalFunctions";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const Accounts = () => {
  const reducer = useSelector((state) => state.setting.settingDetails);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("id");

  const [open, setOpen] = React.useState(false);
  const [accountDetail, setAccountDetail] = useState(null);
  const [transData, setTransData] = useState(null);
  const [isEditAccount, setIsEditAccount] = useState(false);
  const [isEditExpenses, setIsEditExpenses] = useState(false);
  const [isEditIncome, setIsEditIncome] = useState(false);
  const [isEditTransfer, setIsEditTransfer] = useState(false);
  const [transactionData, setTransactionData] = useState({});
  const [filterDate, setFilterDate] = React.useState({
    from_date: "",
    to_date: ""
  })
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsEditAccount(false);
    queryClient.invalidateQueries("account-details-dashboard")
  };

  const [openContact, setOpenContact] = React.useState(false);
  const handleOpenContact = () => setOpenContact(true);
  const handleCloseContact = () => setOpenContact(false);

  const [openExpenses, setOpenExpenses] = React.useState(false);
  const handleOpenExpenses = () => setOpenExpenses(true);
  const handleCloseExpenses = () => {
    setOpenExpenses(false);
    setIsEditExpenses(false);
    queryClient.invalidateQueries("account-details-dashboard")
    queryClient.invalidateQueries(["call-account-data", paramValue])
    queryClient.invalidateQueries(["account-transationData", paramValue])
  };

  const [openIncome, setOpenIncome] = React.useState(false);
  const handleOpenIncome = () => setOpenIncome(true);
  const handleCloseIncome = () => {
    setOpenIncome(false);
    setIsEditIncome(false);
    queryClient.invalidateQueries("account-details-dashboard")
    queryClient.invalidateQueries(["call-account-data", paramValue])
    queryClient.invalidateQueries(["account-transationData", paramValue])
  };

  const [openTransfer, setOpenTransfer] = React.useState(false);
  const handleOpenTransfer = () => setOpenTransfer(true);
  const handleCloseTransfer = () => {
    setOpenTransfer(false);
    setIsEditTransfer(false);
    queryClient.invalidateQueries("account-details-dashboard")
    queryClient.invalidateQueries(["call-account-data", paramValue])
    queryClient.invalidateQueries(["account-transationData", paramValue])
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickPoper = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePoper = () => {
    setAnchorEl(null);
  };

  const openPoper = Boolean(anchorEl);
  const id = openPoper ? "simple-popover" : undefined;

  const { isLoading, error, data } = useQuery("account-details-dashboard", () => {
    return dashboardDetails();
  });

  const accountData = useQuery(
    ["call-account-data", paramValue],
    () => detailsAccount({ id: paramValue }),
    {
      enabled: !!paramValue,
      onSuccess: (data) => {
        console.log(data);
        if (data.StatusCode !== 6000) {
        } else {
          setAccountDetail(data);
        }
      },
    }
  );

  const transationData = useQuery(
    ["account-transationData", paramValue],
    () => listAccountFinance({ account_id: paramValue,         from_date: filterDate.from_date,
      to_date: filterDate.to_date, }),
    {
      enabled: !!paramValue,
      onSuccess: (data) => {
        console.log(data);
        if (data.StatusCode !== 6000) {
        } else {
          setTransData(data);
        }
      },
    }
  );

  const editAccountDetails = function () {
    setOpen(true);
    setIsEditAccount(true);
  };

  const deleteAccountfun = useMutation({
    mutationFn: (newData) => deleteAccount({ ...newData }),
    onSuccess: (data) => {
      if (data.StatusCode !== 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.errors,
            severity: "error",
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: data.data,
            severity: "success",
          })
        );
        queryClient.invalidateQueries({
          queryKey: ["account-details-dashboard", "call-account-data", "account-transationData", paramValue],
        });
        setAccountDetail(null);
        navigate("/accounts");
      }
    },
  });

  useEffect(() => {
    // console.log(filterDate);
    if (filterDate.from_date && filterDate.to_date) {
      transationData.refetch()
    }
  }, [filterDate])


  return (
    <>
      <div className="flex h-[90%]">
        <div className="LeftContainer w-[28%] min-w-[399px] pl-[14px] ">
          <div className="h-full w-full rounded-[15px] border-[1px] border-[#E7E7E7] bg-white p-[16px]">
            <div className="flex justify-between items-center mb-5">
              <p className="text-[16px] font-[400]">Accounts</p>
              <AddButton onClick={() => handleOpen()} />
            </div>

            <div className="w-full bg-white rounded-[9px] border-[#E4E4E4] border-[1px] flex justify-between items-center px-[16px] py-[13px] mb-3">
              <div className="flex justify-center items-center">
                <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] mr-[10px]">
                  <img src={Icone.WalletGreenIcon} alt="" />
                </div>
                <p className="text-black font-[400] text-[16px]">Cash</p>
              </div>

              <div className="flex justify-center items-center">
                {/* <p className="text-[#9B9B9B] text-[16px] font-[400] mr-1">
                  SAR
                </p>
                <p className="text-[19px] font-[500]">{!isLoading && data.total_bank_balance}</p> */}
                {isLoading ? (
                  <Skeleton variant="text" height={26} width={150} />
                ) : (
                  <>
                    <p className="text-[#9B9B9B] text-[16px] font-[400] mr-1">
                      {userData.country_details.currency_simbol}
                    </p>
                    <p className="text-[19px] font-[500]">
                      {AmountFormater(data?.data?.total_cash_balance) || "00.00"}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="w-full bg-white rounded-[9px] border-[#E4E4E4] border-[1px] flex justify-between items-center px-[16px] py-[13px] mb-3">
              <div className="flex justify-center items-center">
                <div className="bg-[#E8F0FF] p-[10px] rounded-[13px] mr-[10px]">
                  <img src={Icone.BankIcon} alt="" />
                </div>
                <p className="text-black font-[400] text-[16px]">Bank</p>
              </div>

              <div className="flex justify-center items-center">
                {/* <p className="text-[#9B9B9B] text-[16px] font-[400] mr-1">
                  SAR
                </p>
                <p className="text-[19px] font-[500]">10,000.00</p> */}
                {isLoading ? (
                  <Skeleton variant="text" height={26} width={150} />
                ) : (
                  <>
                    <p className="text-[#9B9B9B] text-[16px] font-[400] mr-1">
                      {userData.country_details.currency_simbol}
                    </p>
                    <p className="text-[19px] font-[500]">
                      {AmountFormater(data?.data?.total_bank_balance) || "00.00"}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="overflow-y-scroll h-[66%]">
              <div className="grid grid-cols-3 grid-rows-3 gap-2">
                {!isLoading &&
                  data?.data?.accounts_list?.map((data, key) => (
                    <CardButton
                      key={key + 1}
                      component={Link}
                      to={`/accounts?id=${data.id}`}
                    >
                      <div className=" flex flex-col justify-center items-center ">
                        {/* <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div> */}
                        <p className="text-[#15960A] text-[10px] font-[400]">
                          {data.account_name}
                        </p>
                        {data.account_type === 1 ? (
                          <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] my-[5px] inline-block">
                            <img
                              src={Icone.WalletGreenIcon}
                              alt=""
                              className=""
                            />
                          </div>
                        ) : (
                          <div className="bg-[#E2EFFF] p-[10px] rounded-[13px] my-[5px] inline-block">
                            <img src={Icone.BankIcon} alt="" className="" />
                          </div>
                        )}
                        <p className="text-[10px] font-[400]">
                          {userData.country_details.currency_simbol}{" "}
                          {AmountFormater(data.balance)}
                        </p>
                      </div>
                    </CardButton>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="RightContainer w-[72%]">
          {accountDetail ? (
            <>
              <div className=" flex px-[20px]">
                <div className="w-[35%] bg-white rounded-[9px] border-[#E4E4E4] border-[1px] flex justify-between items-center px-[16px] py-[13px] mb-3 mr-2">
                  <div className="flex justify-center items-center">
                    {/* <div className="bg-[#E8F0FF] p-[10px] rounded-[13px] mr-[10px]">
                      <img src={Icone.BankIcon} alt="" />
                    </div> */}
                    {accountDetail.data.account_type === "1" ? (
                      <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] mr-[10px]">
                        <img src={Icone.WalletGreenIcon} alt="" className="" />
                      </div>
                    ) : (
                      <div className="bg-[#E8F0FF] p-[10px] rounded-[13px] mr-[10px]">
                        <img src={Icone.BankIcon} alt="" className="" />
                      </div>
                    )}
                    <p className="text-black font-[400] text-[16px]">
                      {accountDetail.data.account_name}
                    </p>
                  </div>

                  <div className="flex justify-center items-center">
                    {isLoading ? (
                      <Skeleton variant="text" height={26} width={150} />
                    ) : (
                      <>
                        <p className="text-[#9B9B9B] text-[16px] font-[400] mr-1">
                          {userData.country_details.currency_simbol}
                        </p>
                        <p className="text-[19px] font-[500]">
                          {/* {accountDetail?.data.balance */}
                          {AmountFormater(accountDetail?.data.balance) ||
                            "00.00"}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="w-[65%] grid grid-cols-4 gap-x-[20px] bg-white rounded-[9px] border-[#E4E4E4] border-[1px] px-[16px] py-[13px] mb-3">
                  <div>
                    <p className="text-[#9B9B9B] text-[13px] font-[500]">
                      Country
                    </p>
                    <p className="text-[16px] font-[500]">
                      {accountDetail.data.country.country_name}
                    </p>
                  </div>
                  {reducer.is_zakath && (
                    <div>
                      <p className="text-[#9B9B9B] text-[13px] font-[500]">
                        Zakah
                      </p>
                      <p className="text-[16px] font-[500]">
                        <span className="text-[#9B9B9B] text-[15px] font-[400]">
                          {userData.country_details.currency_simbol}
                        </span>{" "}
                        {AmountFormater(accountDetail.data.amount_details.total_zakath)}
                      </p>
                    </div>
                  )}
                  {reducer.is_interest && (
                    <div>
                      <p className="text-[#9B9B9B] text-[13px] font-[500]">
                        Interest
                      </p>
                      <p className="text-[16px] font-[500]">
                        <span className="text-[#9B9B9B] text-[15px] font-[400]">
                          {userData.country_details.currency_simbol}
                        </span>{" "}
                        {AmountFormater(accountDetail.data.amount_details.total_interest)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-[#9B9B9B] text-[13px] font-[500]">
                      Usable
                    </p>
                    <p className="text-[16px] font-[500]">
                      <span className="text-[#9B9B9B] text-[15px] font-[400]">
                        {userData.country_details.currency_simbol}
                      </span>{" "}
                      {AmountFormater(accountDetail.data.amount_details.usable)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center px-5 pb-5 border-b-[1px] border-[#DEDEDE]">
                <div className="flex items-center">
                  <p className="text-[16px] font-[400]">Transactions</p>
                  <NewEntry from_date={filterDate.from_date} to_date={filterDate.to_date} set_filterDate={setFilterDate} />
                </div>
                <div className="flex items-center">
                  {/* <p className="mr-[15px] text-[#868686] text-[13px] font-[400]">User role</p> */}
                  {
                    <>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        sx={{ color: "#3634A8" }}
                        onClick={() => {
                          editAccountDetails();
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        sx={{ color: "#3634A8" }}
                        onClick={() => {
                          deleteAccountfun.mutate({ id: paramValue });
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                  <ExportBtn JSONData={transData?.data} filename={accountDetail.data.account_name} />
                  <StyledButton
                    aria-describedby={id}
                    onClick={handleClickPoper}
                    startIcon={<AddRoundedIcon />}
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
                          <div className="bg-[#FFEEE8] p-[10px] rounded-[13px] mr-[10px]">
                            <img src={Icone.Transfer} alt="" />
                          </div>
                        }
                        sx={{
                          justifyContent: "flex-start",
                          textTransform: "none",
                          color: "#545454",
                          fontSize: "13px",
                          fontWeight: 400,
                        }}
                        onClick={() => handleOpenTransfer()}
                      >
                        Transfer
                      </Button>

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
                <div className="h-[67vh] overflow-y-scroll">
                  {!transationData.isLoading && (
                    <TransactionList
                      whoAmI={"AC"}
                      setIsEditExpenses={setIsEditExpenses}
                      setIsEditIncome={setIsEditIncome}
                      transData={transData?.data}
                      setTransactionData={setTransactionData}
                      setOpenIncome={setOpenIncome}
                      setOpenExpenses={setOpenExpenses}
                      setOpenTransfer={setOpenTransfer}
                      setIsEditTransfer={setIsEditTransfer}
                    />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center px-5 pb-5 border-b-[1px] border-[#DEDEDE]">
              <p className="text-[16px] font-[400]">Transactions</p>
            </div>
          )}
        </div>
      </div>

      {open && (
        <AddAccountModal
          open={open}
          handleClose={handleClose}
          edit={isEditAccount}
          accountDetail={accountDetail}
        />
      )}

      {openExpenses && (
        <TransactionModalEx
          transID={transactionData.id}
          open={openExpenses}
          edit={isEditExpenses}
          handleClose={handleCloseExpenses}
        />
      )}

      {openIncome && (
        <TransactionModal
          transID={transactionData.id}
          open={openIncome}
          edit={isEditIncome}
          handleClose={handleCloseIncome}
        />
      )}

      {openTransfer && (
        <TransferTransaction
          transID={transactionData.id}
          open={openTransfer}
          edit={isEditTransfer}
          handleClose={handleCloseTransfer}
        />
      )}
    </>
  );
};

export default Accounts;

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
