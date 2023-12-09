import styled from "@emotion/styled";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import { Icone } from "../../Assets/AssetsLog";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddButton from "../../Components/Component/AddButton";
import SearchField from "../../Components/Component/SearchField";
import AddLoan from "./Components/AddLoanModal";
import { useQuery, useQueryClient, useInfiniteQuery, useMutation } from "react-query";
import { deleteLoans, listLoans, viewLoans } from "../../Api/Loan/LoanApi";
import moment from "moment";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import PayLoanPaymentModal from "./Components/PayLoanPaymentModal";
import { openSnackbar } from "../../features/snackbar";
import { AmountFormater } from "../../globalFunctions";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const Loan = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("id");

  const [openAddLoan, setOpenAddLoan] = useState(false);
  const [listLoan, setListLoan] = useState([]);
  const [loanSingle, setloanSingle] = useState({});
  const [toggleBtn, setToggleBtn] = useState(true);
  const [openPayLoan, setopenPayLoan] = useState(false);
  const [is_edit, setIs_edit] = useState(false);
  const [payloanData, setpayLoanData] = useState({});

  const handleCloseLoan = () => {
    setOpenAddLoan(false);
    setIs_edit(false);
  };
  const handleClosePayLoan = () => setopenPayLoan(false);
  const editLoan = function () {
    setloanSingle(loanData.data);
    setIs_edit(true);
    setOpenAddLoan(true);
  };

  const payLoanFun = function (data) {
    let setdata = data;
    setdata.accouxnt = loanData.data.id;
    setdata.loan_name = loanData.data.loan_name;
    setdata.payment_type = loanData.data.payment_type;
    setdata.account = loanData.data.account
    setpayLoanData(setdata);
    setopenPayLoan(true);
  };

  const { isLoading: loanListLoading } = useQuery(
    "lona_list",
    () => listLoans({ page_number: 1, page_size: 20 }),
    {
      onSuccess: (res) => {
        // console.log(res);
        // setSelectExpenses(res.data[0]);
        // setExpensesList(res.data);
        if (res.StatusCode === 6000) {
          setListLoan(res.data);
        }
      },
    }
  );

  const { isLoading: singleLoanLoading, data: loanData } = useQuery(
    ["view_loan", paramValue],
    () => viewLoans({ id: paramValue }),
    {
      enabled: !!paramValue,
      onSuccess: (res) => {
        // console.log(res);
        // setSelectExpenses(res.data[0]);
        // setExpensesList(res.data);
        // if (res.StatusCode === 6000) {
        //   setListAccount(res.data);
        // }
      },
    }
  );

  const deleteLoan = useMutation({
    mutationFn: (newTodo) => {
      return deleteLoans({ ...newTodo });
    },
    onSuccess: (data) => {
      if (data.StatusCode !== 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "error",
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "success",
          })
        );
        queryClient.invalidateQueries("lona_list")
        navigate('/loan')
      }
    },
  });

  const loanDelFun = function() {
    deleteLoan.mutate({ id: paramValue})
  }

  return (
    <>
      <div className="flex h-[90%]">
        <div className="LeftContainer w-[28%] min-w-[399px] pl-[14px]">
          <div className="h-full w-full rounded-[15px] border-[1px] border-[#E7E7E7] bg-white p-[16px]">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <div className="bg-[#E3F1FF] p-[10px] rounded-[13px] mr-[10px]">
                  <img src={Icone.ArchiveIcon} alt="" />
                </div>
                <p className="text-[16px] font-[400]">Loans</p>
              </div>
              <div className="flex">
                {/* <div className="mr-2">
                  <p className=" text-[#7F52E8] text-[13px] font-[400] text-right">
                    12 Assets
                  </p>
                  <p className=" text-[14px] font-[400]">
                    <span className=" text-[#9B9B9B] text-[12px] font-[400] mr-1">
                      {userData.country_details.currency_simbol}
                    </span>
                    10,00.000.00
                  </p>
                </div> */}
                <AddButton onClick={() => setOpenAddLoan(true)} />
              </div>
            </div>

            {/*  */}

            <SearchField placeholder={"search"} width={"100%"} />

            <div className="overflow-y-scroll h-[85%]">
              <div className="grid mt-3 grid-cols-3 grid-rows-3 gap-3">
                {!loanListLoading &&
                  listLoan.map((obj, i) => (
                    <CardButton
                      key={i + 1}
                      component={Link}
                      to={`/loan?id=${obj.id}`}
                    >
                      <div className="flex flex-col justify-center items-center ">
                        {/* <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div> */}
                        <p className=" text-[10px] font-[400]">
                          {obj.loan_name || "Loan Name"}
                        </p>
                        <p className=" text-[#888] text-[9px] font-[400]">
                          {moment(obj.date).calendar(null, {
                            sameDay: "[Today]",
                            nextDay: "[Tomorrow]",
                            nextWeek: "dddd",
                            lastDay: "[Yesterday]",
                            lastWeek: "[Last] dddd",
                            sameElse: "DD/MM/YYYY",
                          }) || "Day"}
                        </p>
                        <div className="bg-[#F54040] p-[10px] rounded-[13px] my-[10px] inline-block">
                          <img src={Icone.Archive2Icon} alt="" className="" />
                        </div>
                        <p className=" text-[10px] font-[400]">
                          {userData.country_details.currency_simbol}{" "}
                          {AmountFormater(obj.loan_amount) || "00.00"}
                        </p>
                        <p className="text-[#F2385E] text-[10px] font-[400]">
                          {userData.country_details.currency_simbol}{" "}
                          {AmountFormater(obj.outstanding_amount) ||
                            "00.00"}
                        </p>
                        {/* <p className="text-[#888] text-[10px] font-[400]">
                  {userData.country_details.currency_simbol} 4,000
                  </p> */}
                      </div>
                    </CardButton>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="RightContainer w-[72%]">
          {loanData && (
            <>
              <div className="flex justify-between items-center px-5 pb-5 border-b-[1px] border-[#DEDEDE]">
                <div className="flex items-center">
                  {/* <div className="flex w-[44px] h-[44px] bg-slate-400 rounded-full mr-[10px]">
              <img src="" alt="" />
            </div> */}
                  <p className="text-[20px] font-[400]">
                    {loanData.data.loan_name}
                  </p>
                </div>
                {loanData.data.duration - loanData.data.pending_emi !== parseInt(loanData.data.duration) && 
                <div className="flex">
                  <IconButton
                    aria-label="delete"
                    color="error"
                    sx={{ color: "#3634A8" }}
                    onClick={() => editLoan()}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    color="error"
                    sx={{ color: "#3634A8" }}
                    onClick={() => loanDelFun()}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>}
              </div>

              <div className=" flex px-[20px]">
                <div className="w-[40%] bg-white rounded-[9px] border-[#E4E4E4] border-[1px] flex justify-between px-[16px] py-[13px] my-3 mr-2">
                  <div>
                    <p className="text-[#D10707] font-[500] text-[15px]">
                      Took
                    </p>
                    <p className="text-[#D10707] font-[700] text-[15px]">
                      {userData.country_details.currency_simbol}.{" "}
                      {AmountFormater(loanData.data.loan_amount)}
                    </p>

                    <p className=" text-[#9B9B9B] text-[14px] font-[400] mb-1">
                      <span className=" text-[#7F52E8] text-[13px] font-[500] mr-1">
                        @{AmountFormater(loanData.data.interest)}%
                      </span>
                      {loanData.data.payment_type === "0"
                        ? "For " + loanData.data.duration
                        : "Till " +
                          moment(loanData.data.payment_date).format(" Do ")}
                    </p>

                    {loanData.data.payment_type === "0" && (
                      <p className=" text-[#9B9B9B] text-[12px] font-[400]">
                        Paid Monthly{" "}
                        <span className=" text-[#7F52E8] text-[12px] font-[400] mr-1">
                          On every
                        </span>
                        <span className=" text-black text-[12px] font-[500] ">
                          {moment(loanData?.schedule[1]?.date || loanData?.schedule[0]?.date).format("Do")}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="">
                    <p className="text-[#9B9B9B] text-[14px] font-[400] text-right mb-3">
                      {moment(loanData.data.date).format("DD[/]MM[/]YYYY")}
                    </p>
                    {/* {loanData.data.duration - loanData.data.pending_emi !==  parseInt(loanData.data.duration) && <Button
                      sx={{
                        borderRadius: "15px",
                        backgroundColor: "#3633A8",
                        textTransform: "none",
                        fontSize: "12px",
                        fontWeight: "400",
                        color: "white",
                        minWidth: "110px",
                        "&:hover": {
                          backgroundColor: "#3633A8",
                        },
                      }}
                      onClick={() =>
                        payLoanFun({
                          amount:
                            loanData.data.payment_type === "0"
                              ? loanData.data.outstanding_amount
                              : parseInt(loanData.data.loan_amount),
                          is_close_loan: true,
                          date: loanData.data.date,
                        })
                      }
                    >
                      Close Loan
                    </Button>} */}
                    {loanData.data.loan_status !== "1" ? <Button
                      sx={{
                        borderRadius: "15px",
                        backgroundColor: "#3633A8",
                        textTransform: "none",
                        fontSize: "12px",
                        fontWeight: "400",
                        color: "white",
                        minWidth: "110px",
                        "&:hover": {
                          backgroundColor: "#3633A8",
                        },
                      }}
                      onClick={() =>
                        payLoanFun({
                          amount:
                            loanData.data.payment_type === "0"
                              ? loanData.data.outstanding_amount
                              : parseInt(loanData.data.loan_amount),
                          is_close_loan: true,
                          date: loanData.data.date,
                          is_LateFee: false
                        })
                      }
                    >
                      Close Loan
                    </Button> : 
                    <Button
                    disabled 
                      sx={{
                        borderRadius: "15px",
                        backgroundColor: "#15960A",
                        textTransform: "none",
                        fontSize: "12px",
                        fontWeight: "400",
                        color: "white",
                        minWidth: "110px",
                        "&:hover": {
                          backgroundColor: "#15960A",
                        },
                        "&.Mui-disabled": {
                          color: "white",
                        }
                      }}
                    >
                      Loan Closed
                    </Button>}
                  </div>
                </div>

                {loanData.data.payment_type === "0" ? (
                  <div className="w-[60%] flex justify-between bg-white rounded-[9px] border-[#E4E4E4] border-[1px] px-[16px] py-[13px] my-3">
                    <div>
                      <div className="mb-2">
                        <p className="text-[#9B9B9B] text-[13px] font-[400]">
                          Total Interest
                        </p>
                        <p className="text-[14px] font-[500]">
                          <span className=" text-[14px] font-[500]">
                            {userData.country_details.currency_simbol}
                          </span>
                          .{loanData.data.total_interest}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#9B9B9B] text-[13px] font-[400]">
                          Amount with Interest
                        </p>
                        <p className="text-[14px] font-[500]">
                          <span className=" text-[14px] font-[500]">
                            {userData.country_details.currency_simbol}
                          </span>
                          .{"  "}{AmountFormater(parseInt(loanData.data.loan_amount) + parseInt(loanData.data.total_interest))}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2">
                        <p className="text-[#9B9B9B] text-[13px] font-[400] text-right mr-1">
                          Next Payment
                        </p>
                        <p className="text-[#9B9B9B] text-[12px] font-[500] text-right">
                          <span className="text-[#CD0A0A] text-[14px] font-[700] text-right mr-1">
                            {userData.country_details.currency_simbol}. {"   "}
                            {loanData.data.next_payment}
                          </span>
                          {/* In 123 Days */}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#9B9B9B] text-[13px] font-[400] text-right">
                          Pending Tenture
                        </p>
                        <p className="text-[14px] font-[700] text-right">
                          {loanData.data.pending_emi}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-[60%] flex justify-between bg-white rounded-[9px] border-[#E4E4E4] border-[1px] px-[16px] py-[13px] my-3">
                    <div>
                      <div className="mb-2">
                        <p className="text-[#9B9B9B] text-[13px] font-[400]">
                          Amount Paid
                        </p>
                        <p className="text-[14px] font-[500]">
                          <span className=" text-[14px] font-[500]">
                            {userData.country_details.currency_simbol}
                          </span>
                          .{AmountFormater(loanData.data.amount_paid)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#9B9B9B] text-[13px] font-[400]">
                          Intrest Paid
                        </p>
                        <p className="text-[14px] font-[500]">
                          <span className=" text-[14px] font-[500]">
                            {userData.country_details.currency_simbol}
                          </span>
                          .{AmountFormater(loanData.data.interest_paid)}
                        </p>
                      </div>
                    </div>
                    {loanData.data.loan_status !== "1" && <BlueButton
                      onClick={() =>
                        payLoanFun({
                          amount: "",
                          is_close_loan: false,
                          payment_type: "1",
                          date: loanData.data.date,
                          is_LateFee: false
                        })
                      }
                    >
                      Pay to Loan
                    </BlueButton>}
                  </div>
                )}
              </div>

              {loanData.data.payment_type === "0" && (
                <div className="bg-white rounded-[9px] border-[#E4E4E4] border-[1px] mx-[20px] px-[16px] py-[13px] mb-4">
                  <div className="flex justify-between mb-1">
                    <p className="text-[#F95500] text-[16px] font-[500] text-left">
                      {userData.country_details.currency_simbol}.{" "}
                      {loanData.data.outstanding_amount}
                    </p>
                    <p className="text-[#9B9B9B] text-[13px] font-[400] text-right">
                      {loanData.data.duration - loanData.data.pending_emi} /{" "}
                      {parseInt(loanData.data.duration)}
                    </p>
                  </div>
                  <div className="rounded-full h-1 w-full bg-[#E4E4E4]">
                    <div
                    style={{ width : ((loanData.data.duration - loanData.data.pending_emi) / parseInt(loanData.data.duration)) * 100 > 0 ? ((loanData.data.duration - loanData.data.pending_emi) / parseInt(loanData.data.duration)) * 100 + "%" : "0px"}}
                      className={`rounded-full bg-[#3633A8] h-full z-10`}
                    ></div>
                  </div>
                </div>
              )}

              {loanData.data.payment_type === "0" && (
                <div className="flex justify-between items-center px-5 pb-5 border-b-[1px] border-[#DEDEDE]">
                  <div className="flex justify-between items-center">
                    <StyledToggleButton
                      onClick={() => setToggleBtn(true)}
                      active={toggleBtn}
                    >
                      Schedule
                    </StyledToggleButton>
                    <div className="mr-3"></div>
                    <StyledToggleButton
                      onClick={() => setToggleBtn(false)}
                      active={!toggleBtn}
                    >
                      History
                    </StyledToggleButton>
                  </div>
                  {/* <StyledButton startIcon={<AddRoundedIcon />}>
                    Export
                  </StyledButton> */}
                </div>
              )}

              <div className="p-[20px]  h-[54%] overflow-y-scroll">
                {toggleBtn && loanData.data.payment_type === "0" ? (
                  <div className="">
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableBody>
                          {loanData.schedule.map((row, i) => (
                            <TableRow
                              key={row.id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                                backgroundColor: true ? "white" : "#F6F6F6",
                              }}
                            >
                              <TableCell
                                sx={{ fontWeight: "bold", fontSize: "14px" }}
                                component="th"
                                scope="row"
                              >
                                {loanData.schedule[0].is_initial ? i : i + 1}
                              </TableCell>
                              <TableCell align="left">
                                <p className=" text-[#9B9B9B] text-[12px] font-[400]">
                                  {moment(row.date).format("DD[/]MM[/]YYYY")}
                                </p>
                                <p className="text-[#D10707] font-[700] text-[14px]">
                                  {userData.country_details.currency_simbol}
                                  {"  "}
                                  {/* {loanData.schedule[0].is_initial ? i : i + 1} */}
                                  {row.amount}
                                </p>
                              </TableCell>
                              <TableCell align="right">
                                <p className=" text-[#9B9B9B] text-[12px] font-[400]">
                                  {/* 15000 */}
                                </p>
                                {/* <p className=" font-[500] text-[12px]">Took</p> */}
                              </TableCell>
                              <TableCell align="center">
                                {row.down_payment && <> <p className=" text-[#9B9B9B] text-[12px] font-[400]">
                                  Down payment: 
                                </p>
                                <p className="text-[#D10707] font-[500] text-[12px]">
                                  {row.down_payment}
                                </p></>}
                              </TableCell>
                              <TableCell align="right">
                                {!row.status ? (
                                  <BlueButton
                                    disabled={i === 0 ? false : loanData.schedule[i - 1]?.status === true
                                      ? false
                                      : !row?.status && !row?.is_initial}
                                    act={
                                      i === 0 ? false : loanData.schedule[i - 1]?.status === true
                                        ? false
                                        : !row?.status && !row?.is_initial
                                    }
                                    onClick={() =>
                                      payLoanFun({
                                        ...row,
                                        is_close_loan: false,
                                        is_LateFee: true
                                      })
                                    }
                                  >
                                    Pay
                                  </BlueButton>
                                ) : (
                                  <>
                                    <p className=" text-[#9B9B9B] text-[12px] font-[400]">
                                      {row?.is_initial
                                        ? "Processing fee"
                                        : "Late fee"}
                                    </p>
                                    <p
                                      className=" font-[500] text-[12px]"
                                      style={{
                                        color: row?.is_initial
                                          ? "black"
                                          : "#D10707",
                                      }}
                                    >
                                      {row?.is_initial
                                        ? row?.amount - row?.down_payment
                                        : row?.add_amount}
                                    </p>
                                  </>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                ) : (
                  <div className="">
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableBody>
                          {loanData.history.map((row, i) => (
                            <TableRow
                              key={row.id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell align="left">
                                <p className=" text-[#9B9B9B] text-[12px] font-[400]">
                                  {moment(row.date).format("DD[/]MM[/]YYYY")}
                                </p>
                                <p className=" font-[400] text-[12px]">
                                  {row.from_account_name}
                                </p>
                              </TableCell>
                              <TableCell align="right">
                                {/* <p className=" text-[#9B9B9B] text-[12px] font-[400]">
                                  15000
                                </p> */}
                                <p className="text-[#D10707] font-[700] text-[13px]">
                                  {userData.country_details.currency_simbol}
                                  {"  "}
                                  {AmountFormater(row.amount)}
                                </p>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <PayLoanPaymentModal
        paymentData={payloanData}
        open={openPayLoan}
        handleClose={handleClosePayLoan}
      />

      {openAddLoan && <AddLoan
        loanSingle={loanSingle}
        edit={is_edit}
        open={openAddLoan}
        handleClose={handleCloseLoan}
      />}
    </>
  );
};

export default Loan;

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

const BlueButton = styled(Button)(({ act }) => ({
  borderRadius: "15px",
  backgroundColor: !act ? "#3633A8" : "gray",
  textTransform: "none",
  fontSize: "12px",
  fontWeight: "400",
  color: "white",
  minWidth: "110px",
  "&:hover": {
    backgroundColor: !act ? "#3633A8" : "gray",
  },
}));

const StyledToggleButton = styled(Button)((props) => ({
  // border: "1px solid #E4E4E4",
  // width: "100%",
  justifyContent: "space-between",
  paddingLeft: "42px",
  paddingRight: "42px",
  fontSize: "15px",
  fontWeight: "500",
  color: props.active ? "#FFF" : "#7F52E8",
  backgroundColor: props.active ? "#7F52E8" : "#F8F5FF",
  borderRadius: "8px",
  textTransform: "none",
  "&:hover": {
    color: props.active ? "#FFF" : "#7F52E8",
    backgroundColor: props.active ? "#7F52E8" : "#F8F5FF",
  },
}));

const CardButton = styled(Button)(() => ({
  color: "black",
  backgroundColor: "white",
  borderRadius: "15px",
  border: "1px solid #E7E7E7",
  textTransform: "none",
  width: "112px",
  "&.:hover": {
    backgroundColor: "white",
  },
}));

// height: "130px",
// paddingTop: 1,
// paddingBottom: 1,