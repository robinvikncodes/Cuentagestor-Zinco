import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { Icone } from "../../../Assets/AssetsLog";
import ZincoModal from "../../../Components/Component/ZincoModal";
import SearchField from "../../../Components/Component/SearchField";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { listAccount } from "../../../Api/Accounts/AccountsApi";
import { openSnackbar } from "../../../features/snackbar";
import { useDispatch } from "react-redux";
import {
  createLoans,
  updateLoans,
} from "../../../Api/Loan/LoanApi";
import { AmountFormater } from "../../../globalFunctions";
import moment from "moment";

const myDate = new Date();

const AddLoan = (props) => {
  const queryClient = useQueryClient();
  const userData = JSON.parse(localStorage.getItem("UserCredentials"));
  const dispatch = useDispatch();

  const [swap, setSwap] = useState({
    prev: false,
    next: true,
  });
  // const [myDate, setMyDate] = useState(new Date());
  const [reqiredField, setReqiredField] = useState({
    name: false,
    amount: false,
    intrest: false,
    dueMonth: false,
    downPayment: false,
  });

  const [submitData, setSubmitData] = useState({
    loanDate: new Date().toJSON().slice(0, 10),
    loan_name: "",
    loan_amount: "",
    intrest: "",
    is_intallment: true,
    is_amount: false,
    down_payment: "",
    durationMonth: "",
    duration: "",
    durationDate: new Date(),
    durationDay: "",
    processing_fee: "",
    is_IncludeLoan: false,
    is_includeEMI: false,
    is_ExistingLoan: false,
    is_Purchase: false,
    downPaymet: "",
    fixedAmount: true,
    customEMI: false,
    emiAmount: "",
  });

  const [emiData, setemiData] = useState([]);
  const [day, setDay] = useState(1);
  const [selectAccount, setSelectAccount] = useState({
    to_account: "",
    account_name: ""
  });
  const [accountList, setAccountList] = useState([]);
  const [selectExpenses, setSelectExpenses] = useState({
    to_account: "",
    account_name: ""
  });
  const [expensesList, setExpensesList] = useState([]);

  const handleDays = function (event) {
    setDay(event.target.value);
    setSubmitData({
      ...submitData,
      durationDay: event.target.value,
    });
  };

  useQuery(
    "accountList_loan_account",
    () => listAccount({ account_type: [1, 2], page_number: 1, page_size: 8 }),
    {
      onSuccess: (res) => {
        // console.log(res.data[0]);
        if(props.edit &&  !submitData.is_Purchase && !submitData.is_ExistingLoan){
          let account = res.data.filter(item => item.id === props.loanSingle.to_account)
          setSelectAccount(account[0]);
        } else {
          setSelectAccount(res.data[0])
        }
        setAccountList(res.data);
      },
    }
  );

  useQuery(
    "accountList_loan_expenses",
    () => listAccount({ account_type: [4] }),
    {
      onSuccess: (res) => {
        // console.log(res);
        if (props.edit && !submitData.is_ExistingLoan && submitData.is_Purchase) {
          let account = res.data.filter(item => item.id === props.loanSingle.to_account)
          setSelectExpenses(account[0]);
        } else {
          setSelectExpenses(res.data[0]);
        }
        setExpensesList(res.data);
      },
    }
  );

  useEffect(() => {
    const updateEMIData = function () {
      let eata = [];
      let temp = 1;

      for (let i = 0; i < parseInt(submitData.durationMonth) + temp; i++) {
        let newDate = new Date(
          `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${ day > 8 ? day : day + 1}`
        );
        newDate.setMonth(newDate.getMonth() + i);

        // if (
        //   myDate.getMonth() === newDate.getMonth() &&
        //   day < myDate.getDate()
        // ) {
        //   temp = 1;
        //   continue;
        // } else {
          eata[i - temp] = {
            date: newDate.toJSON().slice(0, 10),
            amount: 0,
            status: false,
          };
        // }
      }
      setemiData(eata);
    };

    !props.edit && updateEMIData();
  }, [submitData.durationMonth, day]);

  const mutateLoan = useMutation({
    mutationFn: (newTodo) => {
      return props.edit
        ? updateLoans({ ...newTodo })
        : createLoans({ ...newTodo })
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
        props.handleClose();
        queryClient.invalidateQueries(["view_loan", props.loanSingle.id]);
        queryClient.invalidateQueries("lona_list");
        setSwap({ prev: false, next: true })
      }
    },
  });

  const passLoan = function (whichButton) {
    let is_PurchaseVal = false
    let newReqiredField = { ...reqiredField };

    if (submitData.loan_name === "") {
      newReqiredField.name = true;
    }

    if (submitData.loan_amount === "" || submitData.loan_amount <= 0) {
      newReqiredField.amount = true;
    }

    if (submitData.intrest === "" || submitData.intrest <= 0) {
      newReqiredField.intrest = true;
    }

    if (!submitData.is_amount && (submitData.durationMonth === "" || submitData.durationMonth <=  0)) {
      newReqiredField.dueMonth = true;
    }
    // console.log(reqiredField.downPayment,"ttttttt---->" )

    // console.log(submitData.down_payment,"is_PurchaseVal===>");
    if (submitData.is_Purchase && submitData?.down_payment === "")  {
      // console.log(submitData.down_payment,"111111222222is_PurchaseVal===>");

      newReqiredField.downPayment = true;
      is_PurchaseVal=true
    }
    // console.log(newReqiredField, " new data field 👍👍👍 👍👍👍");
    setReqiredField(newReqiredField);
    // const totalAmount = emiData.reduce((total, count) => {
    //   console.log(total, count.amount);
    //   return total + count.amount;
    // })

    if (
      !newReqiredField.amount &&
      !newReqiredField.dueMonth &&
      !newReqiredField.intrest &&
      !newReqiredField.name &&
      !is_PurchaseVal
    ) {
      if (whichButton === "submit") {


        // console.log(totalAmount);
        if (!submitData.is_amount) {
          let totalAmount = emiData.reduce(function (total, item) {
            return total + parseInt(item.amount);
          }, 0);
          if (totalAmount >= submitData.loan_amount) {
            submitLoan();
          } else {
            dispatch(
              openSnackbar({
                open: true,
                message: `Total EMI Amount is ${totalAmount} must be grater than loan amount ${submitData.loan_amount}`,
                severity: "warning",
              })
            );
          }
        } else {
          submitLoan();
        }
      } else if (whichButton === "next") {
        setSwap({ prev: true, next: false });
      }
    }
  };

  const submitLoan = function () {
    let payload = {
      loan_name: submitData.loan_name,
      date: submitData.loanDate,
      payment_type: submitData.is_intallment ? 0 : 1, //:0=EMI, 1=Pay to amt
      loan_amount: submitData.loan_amount || 0,
      interest: submitData.intrest || 0,
      payment_date: submitData.durationDate,
      processing_fee: submitData.processing_fee || 0,
      is_fee_include_loan: submitData.is_IncludeLoan,
      is_fee_include_emi: submitData.is_includeEMI,
      is_purchase: submitData.is_Purchase,
      is_existing: submitData.is_ExistingLoan,
      down_payment: submitData.down_payment || 0,
      duration: submitData.durationMonth,
      to_account: "",
      // to_account: props.loanSingle.account,
      emi_data: emiData, //[{'date':'2023-05-06','amount':1560,'status':True}]
    };

    if (props?.loanSingle?.duration === "0") {
      payload.emi_data = []
    }
    if (submitData.is_intallment && !submitData.is_Purchase) {
      payload.to_account = selectAccount.id;
      payload.duration = submitData.durationMonth;
    }

    if (submitData.is_amount) {
      payload.to_account = selectAccount.id;
      payload.duration = 0
    }

    if (submitData.is_Purchase) {
      payload.to_account = selectExpenses.id;
      payload.duration = submitData.durationMonth;
    }

    if (props.edit) {
      payload.loan_uuid = props.loanSingle.id
    }

    mutateLoan.mutate(payload);
  };

  useEffect(() => {
    console.log("Open loan Sammm is hear", props.loanSingle);
    if (props.edit) {
      setemiData(props.loanSingle.reminder);
      setDay(props.loanSingle.duration !== "0" ? moment(props.loanSingle.reminder[0].date).date() : "")
      setSubmitData({
        loanDate: props.loanSingle.date,
        loan_name: props.loanSingle.loan_name,
        loan_amount: AmountFormater(props.loanSingle.loan_amount),
        intrest: parseInt(props.loanSingle.interest),
        is_intallment: props.loanSingle.duration !== "0",
        is_amount: props.loanSingle.duration === "0",
        durationMonth: props.loanSingle.duration,
        duration: "",
        durationDate: props.loanSingle.payment_date,
        durationDay: props.loanSingle.duration !== "0" ? moment(props.loanSingle.reminder[0].date).date() : "",
        processing_fee: parseInt(props.loanSingle.processing_fee),
        is_IncludeLoan: props.loanSingle.is_fee_include_loan,
        is_includeEMI: props.loanSingle.is_fee_include_emi,
        is_ExistingLoan: props.loanSingle.is_existing,
        is_Purchase: props.loanSingle.is_purchase,
        down_payment: parseInt(props.loanSingle.down_payment),
        fixedAmount: true,
        customEMI: false,
        emiAmount: "",
      });
      // !submitData.is_Purchase && !submitData.is_ExistingLoan && setSelectAccount({...selectAccount, id: props.loanSingle.to_account})
      // !submitData.is_ExistingLoan && submitData.is_Purchase && setSelectAccount({...selectAccount, id: props.loanSingle.to_account})

      // console.log(props.loanSingle.reminder);
    } else {
      setSubmitData({
        loanDate: new Date().toJSON().slice(0, 10),
        loan_name: "",
        loan_amount: "",
        intrest: "",
        is_intallment: true,
        is_amount: false,
        durationMonth: "",
        duration: "",
        durationDate: new Date().toJSON().slice(0, 10),
        durationDay: "",
        processing_fee: "",
        is_IncludeLoan: false,
        is_includeEMI: false,
        is_ExistingLoan: false,
        is_Purchase: false,
        downPaymet: "",
        down_payment: "",
        fixedAmount: true,
        customEMI: false,
        emiAmount: "",
      });
      setSwap({ prev: false, next: true })
      setemiData([]);
    }
  }, []);

  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <div className="pt-[21px] w-[472.5px] ">
        <div className="px-[26px] pb-2 border-b">
          <p className="text-[16px] font-[400] ">{props.edit ? " Edit Loan" :"Add a Loan"}</p>
        </div>
        <div className="px-[16px] h-[75vh] overflow-y-scroll">
          {swap.next ? (
            <>
              <div className="flex justify-between items-center my-2 ">
                <p className="text-[16px] font-[400]">Loan Date :</p>
                <input
                  type="date"
                  value={submitData.loanDate}
                  onChange={(e) =>
                    setSubmitData({
                      ...submitData,
                      loanDate: e.target.value,
                    })
                  }
                  className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 w-[50%] mb-2"
                />
              </div>

              <input
                type="text"
                required={true}
                value={submitData.loan_name}
                onChange={(e) => {
                  setSubmitData({
                    ...submitData,
                    loan_name: e.target.value,
                  });
                  setReqiredField({
                    ...reqiredField,
                    name: false,
                  });
                }}
                placeholder="Loan Name"
                className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 w-full "
              />
              {reqiredField.name && (
                <label className="text-[10px] text-red-500">
                  * Loan Name is required
                </label>
              )}
              <div className="flex mt-2 w-full mb-2">
                <div className="w-1/2 mr-2">
                  <input
                    placeholder="Loan Amount"
                    type="number"
                    value={submitData.loan_amount}
                    onChange={(e) => {
                      setSubmitData({
                        ...submitData,
                        loan_amount: e.target.value >= 0 ? e.target.value : submitData.loan_amount,
                      });
                      setReqiredField({
                        ...reqiredField,
                        amount: false,
                      });
                    }}
                    className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 w-full"
                  />
                  {reqiredField.amount && (
                    <label className="text-[10px] w-full text-red-500">
                      * Loan amount is required
                    </label>
                  )}
                </div>

                <div className="w-1/2">
                  <input
                    type="number"
                    placeholder="Interest %"
                    required={true}
                    min="1"
                    max="100"
                    value={submitData.intrest}
                    onChange={(e) => {
                      setSubmitData({
                        ...submitData,
                        intrest: e.target.value >= 0 ? e.target.value : submitData.intrest,
                      });
                      setReqiredField({
                        ...reqiredField,
                        intrest: false,
                      });
                    }}
                    className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 w-full"
                  />
                  {reqiredField.intrest && (
                    <label className="text-[10px] w-full text-red-500">
                      * Interest is required
                    </label>
                  )}
                </div>
              </div>

              <div className="flex justify-between mb-2 border rounded">
                <StyledButton
                  onClick={() =>
                    setSubmitData({
                      ...submitData,
                      is_intallment: !submitData.is_intallment,
                      is_amount: !submitData.is_amount,
                    })
                  }
                  startIcon={
                    submitData.is_intallment ? (
                      <img src={Icone.CheckFillIcon} alt="" />
                    ) : (
                      <CircleIcon sx={{ color: "#999999", fontSize: "25px" }} />
                    )
                  }
                >
                  Pay in instalments
                </StyledButton>
                <StyledButton
                  onClick={() =>
                    setSubmitData({
                      ...submitData,
                      is_intallment: !submitData.is_intallment,
                      is_amount: !submitData.is_amount,
                    })
                  }
                  startIcon={
                    submitData.is_amount ? (
                      <img src={Icone.CheckFillIcon} alt="" />
                    ) : (
                      <CircleIcon sx={{ color: "#999999", fontSize: "25px" }} />
                    )
                  }
                >
                  Pay to Amount
                </StyledButton>
              </div>

              <div className="flex mb-2 justify-between items-center">
                {submitData.is_amount && (
                  <p className="text-[16px] font-[400]">Due Date:</p>
                )}

                {submitData.is_amount && (
                  <input
                    type="date"
                    className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 w-[50%] ml-2"
                    value={submitData.durationDate}
                    onChange={(e) =>
                      setSubmitData({
                        ...submitData,
                        durationDate: new Date(e.target.value).toJSON().slice(0, 10),
                      })
                    }
                  />
                )}

                {!submitData.is_amount && (
                  <div className="w-1/2">
                    <input
                      type="number"
                      placeholder="Duration in months"
                      className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 w-full block"
                      disabled={props.edit}
                      value={submitData.durationMonth}
                      onChange={(e) => {
                        setSubmitData({
                          ...submitData,
                          durationMonth: e.target.value >= 0 ? e.target.value :submitData.durationMonth,
                        });
                        setReqiredField({
                          ...reqiredField,
                          dueMonth: false,
                        });
                      }}
                    />
                    {reqiredField.dueMonth && (
                      <label className="text-[10px] w-full text-red-500">
                        * Duration Months is required
                      </label>
                    )}
                  </div>
                )}

                {!submitData.is_amount && (
                  <FormControl>
                    {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={day}
                      label="Age"
                      onChange={handleDays}
                      disabled={props.edit}
                      sx={{
                        bgcolor: "#F8F5FF",
                        color: "#7F52E8",
                        fontWeight: 400,
                        fontSize: "14px",
                        border: "none",
                        // py: 0, // decrease padding in y-axis
                        "& .MuiSelect-select": {
                          // px: 0, // decrease padding in x-axis
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        },
                      }}
                    >
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(
                        (i, key) => (
                          <MenuItem key={key + 1} value={key + 1}>
                            {i}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                )}
              </div>
              <input
                type="text"
                placeholder="Processing fee"
                className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 w-[100%]"
                value={submitData.processing_fee}
                onChange={(e) =>
                  setSubmitData({
                    ...submitData,
                    processing_fee: e.target.value,
                  })
                }
              />
              <div className="flex mb-2 w-full">
                <StyledButton
                  disabled={!submitData.processing_fee}
                  onClick={() =>
                    setSubmitData({
                      ...submitData,
                      is_IncludeLoan: !submitData.is_IncludeLoan,
                      is_includeEMI: false,
                    })
                  }
                  startIcon={
                    submitData.is_IncludeLoan ? (
                      <img src={Icone.CheckFillIcon} alt="" />
                    ) : (
                      <CircleIcon sx={{ color: "#999999", fontSize: "25px" }} />
                    )
                  }
                >
                  Include in Loan
                </StyledButton>

                <StyledButton
                  disabled={!submitData.processing_fee}
                  onClick={() =>
                    setSubmitData({
                      ...submitData,
                      is_includeEMI: !submitData.is_includeEMI,
                      is_IncludeLoan: false,
                    })
                  }
                  startIcon={
                    submitData.is_includeEMI ? (
                      <img src={Icone.CheckFillIcon} alt="" />
                    ) : (
                      <CircleIcon sx={{ color: "#999999", fontSize: "25px" }} />
                    )
                  }
                >
                  Include in EMI
                </StyledButton>
              </div>

              <div className="flex justify-between mb-2">
                <StyledButton
                  onClick={() =>
                    setSubmitData({
                      ...submitData,
                      is_ExistingLoan: !submitData.is_ExistingLoan,
                    })
                  }
                  startIcon={
                    submitData.is_ExistingLoan ? (
                      <img src={Icone.CheckFillIcon} alt="" />
                    ) : (
                      <CircleIcon sx={{ color: "#999999", fontSize: "25px" }} />
                    )
                  }
                >
                  Existing
                </StyledButton>
                {!submitData.is_amount && (
                  <StyledButton
                    onClick={() =>
                      setSubmitData({
                        ...submitData,
                        is_Purchase: !submitData.is_Purchase,
                      })
                    }
                    startIcon={
                      submitData.is_Purchase ? (
                        <img src={Icone.CheckFillIcon} alt="" />
                      ) : (
                        <CircleIcon
                          sx={{ color: "#999999", fontSize: "25px" }}
                        />
                      )
                    }
                  >
                    Purchase
                  </StyledButton>
                )}
              </div>

              {submitData.is_Purchase && (
                <>
                  <input
                    type="text"
                    placeholder="Down payment"
                    className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 w-full"
                    value={submitData.down_payment}
                    onChange={(e) => {
                      let value = e.target.value?e.target.value:""
                      setSubmitData({
                        ...submitData,
                        down_payment: value,
                      });
                      setReqiredField({
                        ...reqiredField,
                        downPayment: false,
                      });
                    }}
                  />
                  {reqiredField.downPayment && (
                    <label className="text-[10px] text-red-500">
                      * Down Payment is required
                    </label>
                  )}
                </>
              )}

              {submitData.is_amount && submitData.is_ExistingLoan && (
                <input
                  type="text"
                  placeholder="Amount paid"
                  className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 w-full"
                  onChange={(e) =>
                    setSubmitData({
                      ...submitData,
                      downPaymet: e.target.value,
                    })
                  }
                />
              )}

              {!submitData.is_ExistingLoan && (
                <>
                  {!submitData.is_Purchase ? (
                    <p className="my-2">Receiving Account</p>
                  ) : (
                    <p className="my-2">Expenses Account</p>
                  )}

                  <SearchField />
                  <div className="my-2 grid grid-cols-3 gap-2">
                    {!submitData.is_Purchase
                      ? accountList?.slice(0, 7).map((data, key) => (
                          <div
                            key={key + 1}
                            className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] cursor-pointer"
                            style={{
                              backgroundColor:
                                data.id === selectAccount?.id && "#F6F6F6",
                            }}
                            onClick={() => setSelectAccount(data)}
                          >
                            {/* <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div> */}

                            {data.account_type === "2" ? (
                              <>
                                <p className="text-[#0150B1] text-[10px] font-[400]">
                                  {data.account_name}
                                </p>
                                <div className="bg-[#E2EFFF] p-[10px] rounded-[13px] my-[5px] inline-block">
                                  <img
                                    src={Icone.BankIcon}
                                    alt=""
                                    className=""
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <p className="text-[#289c20] text-[10px] font-[400]">
                                  {data.account_name}
                                </p>
                                <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] my-[5px] inline-block">
                                  <img
                                    src={Icone.WalletGreenIcon}
                                    alt=""
                                    className=""
                                  />
                                </div>
                              </>
                            )}

                            <p className="text-[10px] font-[400]">
                              {userData.country_details.currency_simbol}
                              {"  "} {AmountFormater(data.balance)}
                            </p>
                          </div>
                        ))
                      : expensesList?.slice(0, 7).map((data, key) => (
                          <div
                            key={key + 1}
                            className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] cursor-pointer"
                            style={{
                              backgroundColor:
                                data.id === selectExpenses.id && "#F6F6F6",
                            }}
                            onClick={() => setSelectExpenses(data)}
                          >
                            {/* <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div> */}

                            <>
                              <p className=" text-[10px] font-[400]">
                                {data.account_name}
                              </p>
                              <div className="bg-[#F54040] p-[10px] rounded-[13px] my-[10px] inline-block">
                                <img
                                  src={Icone.WalletAdd1Icon}
                                  alt=""
                                  className=""
                                />
                              </div>
                            </>

                            <p className="text-[10px] font-[400]">
                              {userData.country_details.currency_simbol}
                              {"  "} {AmountFormater(data.balance)}
                            </p>
                          </div>
                        ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="py-2 flex justify-between">
                <p className="text-[17px] font-[500] ">Set Payment Schedule</p>
              </div>

              <div className="flex justify-between mb-2 border rounded">
                <StyledButton
                  onClick={() =>
                    setSubmitData({
                      ...submitData,
                      fixedAmount: !submitData.fixedAmount,
                      customEMI: !submitData.customEMI,
                    })
                  }
                  startIcon={
                    submitData.fixedAmount ? (
                      <img src={Icone.CheckFillIcon} alt="" />
                    ) : (
                      <CircleIcon sx={{ color: "#999999", fontSize: "25px" }} />
                    )
                  }
                >
                  Fixed amount
                </StyledButton>
                <StyledButton
                  onClick={() =>
                    setSubmitData({
                      ...submitData,
                      customEMI: !submitData.customEMI,
                      fixedAmount: !submitData.fixedAmount,
                    })
                  }
                  startIcon={
                    submitData.customEMI ? (
                      <img src={Icone.CheckFillIcon} alt="" />
                    ) : (
                      <CircleIcon sx={{ color: "#999999", fontSize: "25px" }} />
                    )
                  }
                >
                  Custom EMI
                </StyledButton>
              </div>
              <div className="px-2">
                <div className="flex justify-center">
                  <p className="text-[15px] text-[#778EB8] font-[400] text-center w-[300px] my-3">
                    {" "}
                    You can mark the payments you've already made.
                  </p>
                </div>

                {!submitData.customEMI && (
                  <input
                    disabled={submitData.customEMI}
                    name="emiAmount"
                    placeholder="EMI Amount"
                    type="number"
                    className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 w-full mb-2"
                    value={submitData.emiAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSubmitData((prevData) => ({
                        ...prevData,
                        emiAmount: value,
                      }));

                      setemiData((prevData) =>
                        prevData.map((item, index) =>
                          index < value ? { ...item, amount: value } : item
                        )
                      );
                    }}
                  />
                )}

                <div>
                  {emiData &&
                    emiData?.map((i, index) => (
                      // let newDate = new Date(
                      //   `${myDate.getFullYear()}-${myDate.getMonth()}-${day + 1}`
                      // );
                      // newDate.setMonth(newDate.getMonth() + i);
                      // setemiData([{ ...emiData[i], amount: submitData.emiAmount }, ...emiData]);
                      <div className="flex justify-between items-center my-2">
                        <div className="flex items-center">
                          {/* {setemiData([{ ...emiData[i], amount: submitData.emiAmount }, ...emiData])} */}
                          {submitData.is_ExistingLoan && (
                            <IconButton
                              onClick={(e) => {
                                setemiData((prevData) =>
                                  prevData.map((item, idx) =>
                                    idx === index
                                      ? {
                                          ...item,
                                          status: !emiData[index].status,
                                        }
                                      : item
                                  )
                                );
                              }}
                            >
                              {emiData[index].status ? (
                                <img src={Icone.CheckFillIcon} alt="" />
                              ) : (
                                <CircleIcon
                                  sx={{ color: "#999999", fontSize: "22.1px" }}
                                />
                              )}
                            </IconButton>
                          )}

                          <p className="text-[15px] font-[400] mx-1 mr-3">
                            {index + 1}.
                          </p>
                          <input
                            value={i.date}
                            className="text-[15px] text-[#778EB8] font-[400] bg-white"
                            type="date"
                            disabled={true}
                          />
                        </div>
                        {/* <p className="text-[15px] font-[400]">
                          {submitData.emiAmount || "00.00"}
                        </p> */}
                        <input
                          disabled={!submitData.customEMI}
                          className="text-[15px] font-[400] bg-[#ebeff5] w-40 p-1 rounded text-right"
                          type="number"
                          onChange={(e) => {
                            const value = e.target.value;
                            setemiData((prevData) =>
                              prevData.map((item, idx) =>
                                idx === index
                                  ? { ...item, amount: value }
                                  : item
                              )
                            );
                          }}
                          value={parseInt(i.amount) || "00.00"}
                        />
                      </div>
                    ))}
                  {/* {Array.from({ length: submitData.durationMonth }, (_, i) => i + 1).map((i, key) => (
                    <div className="flex justify-between items-center my-2">
                      <div className="flex items-center">
                        <IconButton>
                          {submitData.is_zakath ? (
                            <img src={Icone.CheckFillIcon} alt="" />
                          ) : (
                            <CircleIcon
                              sx={{ color: "#999999", fontSize: "25px" }}
                            />
                          )}
                        </IconButton>

                        <p className="text-[15px] font-[400] mx-1 mr-3">{i}.</p>
                        { 
                          <input value={myDate} className="text-[15px] text-[#778EB8] font-[400] bg-white" type="date" disabled={true} />}
                          {setMyDate(myDate.setDate(myDate.getDay() + (i + 1)))}
                      </div>
                      <p className="text-[15px] font-[400]">{submitData.emiAmount || "00.00"}</p>

                    </div>
                  ))} */}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between items-center p-1 border-t">
          <IconButton onClick={() => props.handleClose()}>
            <img src={Icone.ClipIcon} alt="" />
          </IconButton>

          {!submitData.is_Purchase && !submitData.is_ExistingLoan && <div className="flex items-center">
            <p className="text-[16px] font-[500]">
              {selectAccount?.account_name}
            </p>
          </div>}

          {!submitData.is_ExistingLoan && submitData.is_Purchase && 
          <div className="flex items-center">
            <p className="text-[16px] font-[500]">
              {selectExpenses?.account_name}
            </p>
          </div>}
          <div className="flex">
            {swap.prev && (
              <IconButton
                disabled={false}
                onClick={() => setSwap({ next: true, prev: false })}
              >
                <img src={Icone.PreviousIcone} alt="" />
              </IconButton>
            )}

            {(swap.prev || submitData.is_amount) && (
              <IconButton disabled={false} onClick={() => passLoan("submit")}>
                <img src={Icone.CheckIcon} alt="" />
              </IconButton>
            )}

            {swap.next && !submitData.is_amount && (
              <IconButton
                // type="submit"
                disabled={false}
                onClick={() => passLoan("next")}
              >
                <img className="w-10" src={Icone.NextIcon} alt="" />
              </IconButton>
            )}
          </div>
        </div>
      </div>
    </ZincoModal>
  );
};

export default AddLoan;

const StyledButton = styled(Button)(() => ({
  paddingLeft: "18px",
  paddingRight: "18px",
  paddingTop: "8px",
  paddingBottom: "8px",
  width: "50%",
  fontSize: "15px",
  fontWeight: "400",
  color: "#000",
  // backgroundColor: "#EFE8FF",
  borderRadius: "0px",
  // border: "1px solid #E4E4E4",
  textTransform: "none",
  justifyContent: "flex-start",
}));
