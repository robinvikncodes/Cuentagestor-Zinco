import React, { useEffect, useState } from "react";
import ZincoModal from "../../../Components/Component/ZincoModal";
import TextFieldCalculator from "../../../Components/TextFieldCalculator/TextFieldCalculator";
import SearchField from "../../../Components/Component/SearchField";
import SkletionCard from "../../../Components/Skletions/SkletionCard";
import { Icone } from "../../../Assets/AssetsLog";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { listAccount } from "../../../Api/Accounts/AccountsApi";
import styled from "@emotion/styled";
import CircleIcon from "@mui/icons-material/Circle";
import { Box, Button, IconButton, Modal } from "@mui/material";
import { createListTransaction } from "../../../Api/Finance/FinanceApi";
import { openSnackbar } from "../../../features/snackbar";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const PayLoanPaymentModal = (props) => {

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const reducer = useSelector(state => state.setting.settingDetails)
  const [calvalue, setCalvalue] = useState("");
  const [note, setNote] = useState("")
  const [openNote, setOpenNote] = useState(false);
  const [is_intrest, setIntrest] = useState(false);
  const [candbList, setCandbList] = useState([]);
  const [loanData, setLoanData] = useState({});
  const [selectAccount, setSelectAccount] = useState({});

  //Handle functions
  const handleCloseNote = () => {
    setOpenNote(false);
  };

  // Data Fetching
  const { isLoading: isLoadingCandB } = useQuery(
    "cash&bank_list",
    () => listAccount({ account_type: [1, 2] }),
    {
      onSuccess: (res) => {
        if (res.StatusCode === 6000) {
          setCandbList(res.data);
          setSelectAccount(res.data[0]); // Only set when edit is tru from the prop
        }
      },
    }
  );

  useEffect(() => {
    console.log(props.paymentData);
    setLoanData(props.paymentData);
    // setCalvalue(props.paymentData.amount)
  }, [props.paymentData]);

  // Mutate Data
  const loanMutate = useMutation({
    mutationFn: (newTodo) => {
      return createListTransaction({ ...newTodo });
    },
    onSuccess: (data) => {
      if (data.StatusCode !== 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: "some error occured",
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
        props.handleClose();
        queryClient.invalidateQueries("view_loan");
      }
    },
    onError: () => {
      dispatch(
        openSnackbar({
          open: true,
          message: "Some API Error Occured",
          severity: "error",
        })
      );
    }
  });

  const submitLoanPay = function () {
    //   is_initial: widget.isProcessingFee,
    // id: loanData.id,
    // time: "$formattedTime",
    console.log("I am under the water");
    console.log(loanData);

    let payload = {
      // loanData.accouxnt
      is_interest: is_intrest,
      date: loanData.date,
      from_account: selectAccount.id,
      to_account: loanData.account,
      description: "",
      finance_type: 1,
      asset_master_id: loanData.accouxnt,
      is_asset: false,
      is_reminder: false,
      is_initial: false,
      reminder_date: new Date().toJSON().slice(0, 10),
      time: moment().format('HH:mm:ss.SSS'),
      is_close_loan: loanData.is_close_loan,
    };

    if (loanData.payment_type === "0") {
      payload.amount = loanData.amount + calvalue
      payload.late_fee = calvalue || 0
      payload.is_initial = true
    } else {
        payload.amount = loanData.amount + calvalue
    }

    loanMutate.mutate(payload);
  };
  console.log(loanData,"outstanding_amountoutstanding_amount===>");
  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <div>
        <div className="py-[15px] px-3 bg-[#F6F6F6] rounded-t-[22px]">
          {!loanData.is_initial && (
            <TextFieldCalculator setCalvalue={setCalvalue} />
          )}
          <p className="text-[27px] font-[500] text-right">
            {loanData.amount + calvalue || "0.00"}
            <span className="ml-1 text-[15px] font-[400] text-[#6E88A6]">
              {userData.country_details.currency_simbol}
              {"  "}
            </span>
          </p>
          {loanData?.is_LateFee  && (
            <div className="flex justify-between">
              <p className="text-[12px] font-[400] text-[#6E88A6]">Late fee</p>
              <p className="text-[12px] font-[400] text-[#6E88A6]">
                {calvalue || "0.00"}
                {"  "}
                {userData.country_details.currency_simbol}
              </p>
            </div>
          )}
        </div>

        <div className="p-3">
          <SearchField />
          <div className="mt-3 grid grid-cols-4 grid-rows-2 gap-2 w-[472.5px] h-[244px]">
            {!isLoadingCandB ? (
              candbList.slice(0, 7).map((data, key) => (
                <div
                  key={key + 1}
                  className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] cursor-pointer"
                  style={{
                    backgroundColor: data.id === selectAccount.id && "#F6F6F6",
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
                        <img src={Icone.BankIcon} alt="" className="" />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-[#289c20] text-[10px] font-[400]">
                        {data.account_name}
                      </p>
                      <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] my-[5px] inline-block">
                        <img src={Icone.WalletGreenIcon} alt="" className="" />
                      </div>
                    </>
                  )}

                  <p className="text-[10px] font-[400]">
                    {userData.country_details.currency_simbol}
                    {"  "} {data.balance}
                  </p>
                </div>
              ))
            ) : (
              <SkletionCard />
            )}
          </div>
          {loanData.date && <div className="w-full flex justify-center py-3">
            <input
              type="date"
              className="border-[1px] px-[48px] py-[6px] rounded-full max-w-[220px]"
              value={loanData.date}
              onChange={e => setLoanData({...loanData, date: e.target.value})}
            />
          </div>}
        </div>

        <div className="flex justify-between">
          <StyledButton
            onClick={() => setOpenNote(true)}
            startIcon={<img src={Icone.NoteIcon} alt="" />}
          >
            Notes
          </StyledButton>

          {reducer.is_interest && <StyledButton
            onClick={() => setIntrest(true)}
            startIcon={
              is_intrest ? (
                <img src={Icone.CheckFillIcon} alt="" />
              ) : (
                <CircleIcon sx={{ color: "#999999", fontSize: "25px" }} />
              )
            }
          >
            Use Interest
          </StyledButton>}
        </div>

        <div className="flex justify-between items-center p-1">
          <IconButton onClick={() => props.handleClose()}>
            <img src={Icone.ClipIcon} alt="" />
          </IconButton>
          <div className="flex items-center">
            <p className="text-[16px] font-[500]">
              {selectAccount.account_name}
            </p>
            <span className="text-[18px] font-[500] mx-2">{">"}</span>
            <p className="text-[16px] font-[500]">{loanData.loan_name}</p>
          </div>
          <IconButton onClick={submitLoanPay}>
            <img src={Icone.CheckIcon} alt="" />
          </IconButton>
        </div>

        {/* <div className="h-5"></div> */}
      </div>

      <NotesModal setNote={setNote} note={note} open={openNote} handleClose={handleCloseNote} />
    </ZincoModal>
  );
};

export default PayLoanPaymentModal;

const StyledButton = styled(Button)(() => ({
  paddingLeft: "18px",
  paddingRight: "18px",
  paddingTop: "8px",
  paddingBottom: "8px",
  width: "100%",
  fontSize: "15px",
  fontWeight: "400",
  color: "#000",
  // backgroundColor: "#EFE8FF",
  borderRadius: "0px",
  border: "1px solid #E4E4E4",
  textTransform: "none",
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // minWidth: 400,
  backgroundColor: "background.paper",
  borderRadius: "22px",
  boxShadow: 24,
  padding: "20px",
};

function NotesModal(props) {
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => {
  //   setOpen(true);
  // };
  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <>
      {/* <Button onClick={handleOpen}>Open Child Modal</Button> */}
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          {/* <h2 id="child-modal-title">Text in a child modal</h2>
            <p id="child-modal-description">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </p>
            <Button onClick={props.handleClose}>Close Child Modal</Button> */}
          <div className="w-[320px]">
            <p className="text-[16px] font-[400] mb-3">Add a note</p>
            <textarea
              className="border-[#E4E4E4] border-[1px] px-[11px] py-[9px] rounded-[8px] text-[11px] mb-3 w-full"
              name="income"
              id="incomeField"
              // cols="25"
              rows="6"
              placeholder="Type here.."
              value={props.note}
              onChange={e => props.setNote(e.target.value)}
            ></textarea>
            <SaveButton>Save</SaveButton>
            <CancelButton onClick={() => props.handleClose()}>
              Cancel
            </CancelButton>
          </div>
        </Box>
      </Modal>
    </>
  );
}

const SaveButton = styled(Button)(() => ({
  width: "100%",
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#fff",
  backgroundColor: "#7F52E8",
  borderRadius: "8px",
  textTransform: "none",
  marginBottom: "2px",
  // border: "1px solid #E4E4E4",
  "&:hover": {
    backgroundColor: "#7F52E8",
  },
}));

const CancelButton = styled(Button)(() => ({
  width: "100%",
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#7F52E8",
  backgroundColor: "#fff",
  borderRadius: "8px",
  textTransform: "none",
  // marginBottom: "12px",
  // border: "1px solid #E4E4E4",
  "&:hover": {
    backgroundColor: "#fff",
  },
}));
