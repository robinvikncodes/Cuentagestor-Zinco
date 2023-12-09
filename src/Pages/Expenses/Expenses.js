import styled from "@emotion/styled";
import { Button, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import { Icone } from "../../Assets/AssetsLog";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AddButton from "../../Components/Component/AddButton";
import AddExpenses from "./Components/AddExpenses";
import TransactionModal from "./Components/TransactionModal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  financeList,
  listAccountFinance,
  listFinanceTransaction,
} from "../../Api/Finance/FinanceApi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Link, useSearchParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteAccount } from "../../Api/Accounts/AccountsApi";
import { openSnackbar } from "../../features/snackbar";
import { useDispatch } from "react-redux";
import TransactionList from "../../Components/TransactionList/TransactionList";
import { AmountFormater } from "../../globalFunctions";
import NewEntry from "../../Components/Component/NewEntry";
import ExportBtn from "../../Components/Component/ExportBtn";

ChartJS.register(ArcElement, Tooltip, Legend);

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const col = [
  "rgba(255, 99, 132)",
  "rgba(54, 162, 235)",
  "rgba(255, 206, 86)",
  "rgba(75, 192, 192)",
  "rgba(153, 102, 255)",
  "rgba(255, 159, 64)",
];

const Expenses = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("id");

  const [open, setOpen] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [openTransition, setOpenTransition] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState({});
  const [accountSummary, setAccountSummary] = React.useState({
    id: paramValue,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    queryClient.invalidateQueries("Expenses-list");
    paramValue && queryClient.invalidateQueries("finance-expenses-transaction");
  };
  
  const handleOpenTransition = () => setOpenTransition(true);
  const handleCloseTransition = () => {
    setOpenTransition(false);
    setIsEdit(false);
    !paramValue && queryClient.invalidateQueries("expenses_transactions");
    paramValue && queryClient.invalidateQueries("finance-expenses-transaction");
  };

  const editAccountDetails = function () {
    setEdit(true);
    handleOpen();
  };

  const editTransaction = function (data) {
    setIsEdit(true);
    setTransactionData(data);
    handleOpenTransition();
  };

  const {
    isLoading: listIsLoading,
    error: listError,
    data: Expenseslist,
  } = useQuery("Expenses-list", () => {
    return financeList({ finance_type: 1 });
  });

  // This will call all the transasctions
  const { isLoading, data: financeListData } = useQuery(
    "expenses_transactions",
    () => {
      return listFinanceTransaction({
        finance_type: 1,
        from_date: "",
        to_date: "",
      });
    },
    {
      enabled: !paramValue,
      onSuccess: (res) => {
        console.log(res);
      },
    }
  );

  // This will call only the specfice transasctions
  const { isLoading: financeAccountLoading, data: financeAccount } = useQuery(
    ["finance-expenses-transaction", paramValue],
    () => {
      return listAccountFinance({
        account_id: paramValue,
        page_number: "",
        page_size: "",
        from_date: "",
        to_date: "",
      });
    },
    {
      enabled: !!paramValue,
      onSuccess: (data) => {
        if (data.StatusCode === 6000) {
          setAccountSummary(data.summary);
        }
      },
    }
  );

  const deleteAccountFun = useMutation({
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
      }
    },
  });

  return (
    <>
      <div className="flex h-[90%]">
        <div className="LeftContainer w-[29%] min-w-[400px] pl-[14px]">
          <div className="h-full w-full rounded-[15px] border-[1px] border-[#E7E7E7] bg-white p-[16px]">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <div className="bg-[#FFEBF0] p-[10px] rounded-[13px] mr-[10px]">
                  <img src={Icone.WalletAdd2Icon} alt="" />
                </div>
                <p className="text-[16px] font-[400]">Expenses</p>
              </div>

              <AddButton onClick={handleOpen} />
            </div>

            <div className="grid grid-cols-2 gap-x-2 mb-3">
              <div className="bg-white rounded-lg border-[1px] border-[#E8E5E5] px-[12px] py-[5px] ">
                <p className="text-[11px] text-[#8E8E8E] font-[400]">Total</p>
                <p className="text-[14px] font-[500]">
                  <span className="text-[11px] text-[#8E8E8E] font-[400] mr-1">
                    {userData.country_details.currency_simbol}
                  </span>
                  {AmountFormater(Expenseslist?.summary.total)}
                </p>
              </div>
              <div className="bg-white rounded-lg border-[1px] border-[#E8E5E5] px-[12px] py-[5px]  ">
                <p className="text-[11px] text-[#8E8E8E] font-[400]">
                  This Month
                </p>
                <p className="text-[14px] font-[500]">
                  <span className="text-[11px] text-[#8E8E8E] font-[400] mr-1">
                    {userData.country_details.currency_simbol}
                  </span>
                  {AmountFormater(Expenseslist?.summary.this_month)}
                </p>
              </div>
            </div>
            {/*  */}

            <div className="bg-[#F6F6F6] rounded-[15px] p-[10px] mb-3">
              <div className="flex items-center">
                {/* <p>July, 2023</p> */}
                {/* <NewEntry /> */}
              </div>
              <div className="flex ">
                <div className="w-[200px] h-[200px] mr-3">
                  <Doughnut
                    data={{
                      labels: [],
                      datasets: [
                        {
                          data: Expenseslist?.graph_data.map(
                            (data) => data.amount ?? data.balance
                          ),
                          backgroundColor: col,
                          borderJoinStyle: "bevel",
                        },
                      ],
                    }}
                  />
                </div>

                <div className="mt-3">
                  {Expenseslist?.graph_data.map((data, key) => (
                    <div key={key + 1} className="flex items-center">
                      <div
                        className="h-[11px] w-[11px] rounded-md mr-2"
                        style={{ backgroundColor: col[key] }}
                      />
                      <span className="text-[#858585] text-[14px] font-[400]">
                        {data.amount ?? data.balance} % {data.account_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-[48%] overflow-y-scroll">
              <div className="grid grid-cols-3 grid-rows-3 gap-2">
                {Expenseslist?.data.map((data, key) => (
                  <CardButton
                    key={key + 1}
                    component={Link}
                    to={`/expenses?id=${data.id}`}
                  >
                    <div className="flex flex-col justify-center items-center ">
                      {/* <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div> */}
                      <p className=" text-[10px] font-[400]">
                        {data.account_name}
                      </p>
                      <div className="bg-[#F54040] p-[10px] rounded-[13px] my-[10px] inline-block">
                        <img src={Icone.WalletAdd1Icon} alt="" className="" />
                      </div>
                      <p className=" text-[10px] font-[400]">
                        {userData.country_details.currency_simbol}
                        {"  "} {AmountFormater(data.balance)}
                      </p>
                    </div>
                  </CardButton>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="RightContainer w-[71%]">
          {/* */}
          <div className="flex justify-between items-center px-5 pb-5 border-b-[1px] border-[#DEDEDE]">
            <div className="flex items-center">
              <p className="text-[16px] font-[400]">
                {" "}
                {paramValue
                  ? financeAccount?.summary?.account_name
                  : "Transactions"}{" "}
              </p>
              <NewEntry />
            </div>
            <div className="flex items-center">
              {/* <p className="mr-[15px] text-[#868686] text-[13px] font-[400]">User role</p> */}
              {financeAccount && (
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
                      deleteAccountFun.mutate({ id: paramValue });
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
              <ExportBtn JSONData={financeAccount?.data || financeListData?.data} filename={financeAccount?.summary?.account_name || "Expenses"} />
              <StyledButton
                onClick={() => handleOpenTransition()}
                startIcon={<AddRoundedIcon />}
              >
                Transactions
              </StyledButton>
            </div>
          </div>

          <div className="p-[20px]">
            <div className="overflow-y-scroll h-[77vh]">
              {!isLoading &&
                !financeAccountLoading &&
                (financeAccount?.data || financeListData?.data) && (
                  <TransactionList
                    setIsEditExpenses={setIsEdit}
                    transData={financeAccount?.data || financeListData?.data}
                    setTransactionData={setTransactionData}
                    setOpenExpenses={setOpenTransition}
                  />
                )}
            </div>
          </div>
        </div>
      </div>
      {open && (
        <AddExpenses
          open={open}
          handleClose={handleClose}
          edit={edit}
          data={{
            accountName: financeAccount?.summary?.account_name || "",
            id: paramValue,
          }}
        />
      )}
      {openTransition && (
        <TransactionModal
          transID={transactionData.id}
          open={openTransition}
          edit={isEdit}
          handleClose={handleCloseTransition}
        />
      )}
    </>
  );
};

export default Expenses;

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
