import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { listAccount } from "../../../Api/Accounts/AccountsApi";
import { useDispatch, useSelector } from "react-redux";
import {
  createListTransaction,
  detailFinance,
  updateListTransaction,
} from "../../../Api/Finance/FinanceApi";
import { openSnackbar } from "../../../features/snackbar";
import { Icone } from "../../../Assets/AssetsLog";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Tab,
  Tabs,
  TextField,
  styled,
} from "@mui/material";
import ZincoModal from "../../../Components/Component/ZincoModal";
import TextFieldCalculator from "../../../Components/TextFieldCalculator/TextFieldCalculator";
import SearchField from "../../../Components/Component/SearchField";
import { BaseUrl } from "../../../globalVariable";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  DateCalendar,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import moment from "moment";
import { AmountFormater } from "../../../globalFunctions";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const AddTransactionsModal = (props) => {
  let now = new Date();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // State Declarations 📦📦📦
  const userRollReducer = useSelector(state => state.userRole.state)
  const [value, setValue] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [openNote, setOpenNote] = useState(false);
  const [openReminder, setOpenReminder] = useState(false);
  const [reminderDate, setReminderDate] = React.useState(null);
  const [payloadID, setPayloadID] = useState({
    accountId: "",
    contactId: props.contactDetail?.data?.id,
  });

  const [selAccount, setSelAccount] = useState({});
  const [button, setButton] = useState({
    from: true,
    to: false,
    account: true,
    contact: false,
  });
  const [calValue, setCalValue] = useState("");
  const [noteText, setNoteText] = useState("");
  const [accountList, setAccountList] = useState({
    data: [],
  });
  const [searchValue, setSearchValue] = React.useState(null);

  // Event Handlers 🛠️🛠️🛠️
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleOpenNote = () => setOpenNote(true);
  const handleCloseNote = () => setOpenNote(false);

  const handleOpenReminder = () => setOpenReminder(true);
  const handleCloseReminder = () => setOpenReminder(false);

  // Button Clicking 🧩🧩🧩
  const onButtonClick = function (e, name) {
    let newButton = { ...button }; // copy the current state

    if (name === "to" || name === "from") {
      newButton = {
        ...newButton,
        to: name === "to",
        from: name === "from",
        account: button.account ? false : true,
        contact: button.contact ? false : true,
      };
    } else if (name === "account" || name === "contact") {
      newButton = {
        ...newButton,
        account: name === "account",
        contact: name === "contact",
      };
    }

    setButton(newButton);
  };

  // Data Fetching 🚀🚀🚀
  const { isLoading, refetch: refetchAccount } = useQuery(
    "account-list",
    () => listAccount({ account_type: [1, 2], search: searchValue }),
    {
      onSuccess: (res) => {
        if (res.StatusCode === 6000 && res.data.length > 0){
          !props.edit && setSelAccount(res.data[0]);
          console.log(res);
          setAccountList(res);
        }
      },
    }
  );

  useQuery(
    "contact-detail-transaction",
    () => detailFinance({ id: props.transData.id }),
    {
      enabled: props.edit,
      onSuccess: (res) => {
        if (res?.StatusCode === 6000) {
          setCalValue(parseFloat(res.data.amount).toFixed(2));
          setPayloadID({
            accountId: res.data.from_account,
            contactId: res.data.to_account,
          });
          setDate(res.data.date);
          // Dont Change this condition
          if (res.data.finance_type === "0") {
            setSelAccount({ ...selAccount, id: res.data.to_account.id });
            setButton({
              account: false,
              contact: true,
              from: true,
              to: false,
            });
          } else {
            setSelAccount({ ...selAccount, id: res.data.from_account.id });
            setButton({
              account: true,
              contact: false,
              from: true,
              to: false,
            });
          }
        }
      },
    }
  );

  // Data Submittion 📝📝📝
  const transactionMutation = useMutation({
    mutationFn: (newTodo) => {
      const mutationFunction = props.edit
        ? updateListTransaction
        : createListTransaction;
      return mutationFunction({ ...newTodo });
    },
    onSuccess: (res) => {
      console.log(res);
      if (res.StatusCode !== 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: res.errors,
            severity: "error",
          })
        );
        queryClient.invalidateQueries(["account-list"]);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: res.data,
            severity: "success",
          })
        );
        props.handleClose();
      }
    },
  });

  const submitTransaction = () => {
    let from_account, to_account, finance_type;

    if (button.from && button.account) {
      from_account = selAccount.id;
      to_account = props.contactDetail?.data?.id;
      finance_type = "1";
    }
    if (button.from && button.contact) {
      from_account = props.contactDetail?.data?.id;
      to_account = selAccount.id;
      finance_type = "0";
    }

    if (button.to && button.account) {
      from_account = props.contactDetail?.data?.id;
      to_account = selAccount.id;
      finance_type = "0";
    }

    if (button.to && button.contact) {
      from_account = selAccount.id;
      to_account = props.contactDetail?.data?.id;
      finance_type = "1";
    }
    // console.log(button);

    // console.log(date, "date");
    if (calValue <= 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: "Amount must be grater than 0",
          severity: "error",
        })
      );
    } else {
      const newTodo = {
        time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
        date: date,
        from_account,
        to_account,
        amount: calValue,
        description: noteText,
        finance_type,
        asset_master_id: 0,
        is_asset: false,
        is_reminder: false,
        reminder_date: new Date().toISOString().substr(0, 10),
      };

      if (reminderDate) {
        newTodo.reminder_date = reminderDate.format("YYYY-MM-DD");
        newTodo.is_reminder = true;
      }

      if (props.edit && calValue) {
        newTodo.id = props.transData.id;
      }

      if (from_account !== to_account && calValue) {
        transactionMutation.mutate(newTodo);
      }
    }
  };

  useEffect(() => {
    if (props.edit) {
      queryClient.invalidateQueries(["account-list"]);
      queryClient.invalidateQueries(["contact_account_transaction"]);
    } else {
    }
  }, [props.edit]);

  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <div>
        <div className="py-[15px] px-3 bg-[#F6F6F6] rounded-t-[22px]">
          <TextFieldCalculator setCalvalue={setCalValue} />
          <p className="text-[27px] font-[500] text-right">
            {calValue || "0.00"}
            <span className="ml-1 text-[15px] font-[400] text-[#6E88A6]">
              {userData.country_details.currency_simbol}
            </span>
          </p>
        </div>

        <div className="border-b-[1px]">
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="basic tabs example"
            sx={{
              color: "#000",
              "& .MuiTabs-indicator": {
                backgroundColor: "#3633A8",
                height: "5px",
              },
            }}
          >
            <Tab
              onClick={(e) => onButtonClick(e, "from")}
              sx={{ textTransform: "none" }}
              label="From"
            />
            <Tab
              onClick={(e) => onButtonClick(e, "to")}
              sx={{ textTransform: "none" }}
              label="To"
            />
          </Tabs>
        </div>

        <div className="p-3">
          {!button.contact && <SearchField 
            placeholder={"Search Account"}
            width={"100%"}
            valuen={searchValue}
            onKeyDown={(e) =>{
             if(e.key === "Enter") { refetchAccount() }
            }}
            onChange={(e) => setSearchValue( e.target.value )
            }
            onClickBTN={() =>  refetchAccount()}
          />}
          <div className="grid grid-cols-2 gap-x-3 my-3">
            <ToggleButton
              mbgcolor={button.account ? "#7F52E8" : "#F8F5FF"}
              mcolor={button.account ? "#FFFFFF" : "#7F52E8"}
              onClick={(e) => onButtonClick(e, "account")}
            >
              Accounts
            </ToggleButton>
            <ToggleButton
              mbgcolor={button.contact ? "#7F52E8" : "#F8F5FF"}
              mcolor={button.contact ? "#FFFFFF" : "#7F52E8"}
              onClick={(e) => onButtonClick(e, "contact")}
            >
              Contact
            </ToggleButton>
          </div>
          <div className="max-h-[244px] overflow-y-auto w-[475px]">
            <div className=" grid grid-cols-4 grid-rows-2 gap-2  ">
              {button.contact ? (
                <div
                  className="bg-[#F6F6F6] cursor-pointer flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] py-[15px] "
                  // onClick={() => onSubmit(data.id)}
                >
                  <p className="text-[10px] font-[400]">
                    {props.contactDetail?.data?.account_name}
                  </p>
                  <div className="bg-[#E2EFFF] p-[10px] rounded-full my-[10px] inline-block w-[52px] h-[52px] ">
                    <img
                      src={BaseUrl + props.contactDetail?.data?.photo}
                      alt=""
                      className=""
                    />
                  </div>
                  {/* text-[#15960A] */}
                  <p className=" text-[10px] font-[400]">
                    {userData.country_details.currency_simbol}{" "}
                    {Math.abs(
                      AmountFormater(props.contactDetail?.data?.balance)
                    )}
                  </p>
                </div>
              ) : (
                <>
                  {!isLoading &&
                    accountList.data.map((data, key) => (
                      <>
                        {data.account_type === "1" ? (
                          <div
                            style={{
                              backgroundColor:
                                selAccount.id === data.id ? "#F6F6F6" : "white",
                            }}
                            onClick={() => setSelAccount(data)}
                            className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] cursor-pointer"
                          >
                            <p className="text-[#15960A] text-[10px] font-[400]">
                              {data.account_name}
                            </p>
                            <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] my-[5px] inline-block">
                              <img
                                src={Icone.WalletGreenIcon}
                                alt=""
                                className=""
                              />
                            </div>
                            <p className="text-[10px] font-[400]">
                              {userRollReducer.account.view_permission && userData.country_details.currency_simbol +
                              "  " + AmountFormater(data.balance)}
                            </p>
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor:
                                selAccount.id === data.id ? "#F6F6F6" : "white",
                            }}
                            onClick={() => setSelAccount(data)}
                            className="bg-white cursor-pointer flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] py-4 "
                          >
                            <p className="text-[#0150B1] text-[10px] font-[400]">
                              {data.account_name}
                            </p>
                            <div className="bg-[#E2EFFF] p-[10px] rounded-[13px] my-[5px] inline-block">
                              <img src={Icone.BankIcon} alt="" className="" />
                            </div>
                            <p className="text-[10px] font-[400]">
                              {userRollReducer.account.view_permission && userData.country_details.currency_simbol + " " +
                              AmountFormater(data.balance)}
                            </p>
                          </div>
                        )}
                      </>
                    ))}
                </>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center py-3">
            <input
              type="date"
              className="border-[1px] px-[48px] py-[6px] rounded-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <StyledButton
            onClick={() => handleOpenNote()}
            startIcon={<img src={Icone.NoteIcon} alt="" />}
          >
            Notes
          </StyledButton>
          <StyledButton
            onClick={() => handleOpenReminder()}
            startIcon={<img src={Icone.TimeIcon} alt="" />}
          >
            Set Reminder
          </StyledButton>
        </div>

        <div className="flex justify-between items-center p-1 ">
          <IconButton onClick={() => props.handleClose()}>
            <img src={Icone.ClipIcon} alt="" />
          </IconButton>
          <div className="flex items-center">
            <p className="text-[16px] font-[500]">
              {selAccount?.account_name || payloadID?.accountId?.account_name}
            </p>
          </div>
          <IconButton disabled={!calValue} onClick={submitTransaction}>
            <img src={Icone.CheckIcon} alt="" />
          </IconButton>
        </div>
      </div>
      <NotesModal
        open={openNote}
        handleClose={handleCloseNote}
        noteText={noteText}
        setNoteText={setNoteText}
      />
      <ReminderModal
        open={openReminder}
        handleClose={handleCloseReminder}
        value={reminderDate}
        setValue={setReminderDate}
      />
    </ZincoModal>
  );
};

export default AddTransactionsModal;

const ToggleButton = styled(Button)((props) => ({
  padding: "10px",
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: props.mcolor,
  backgroundColor: props.mbgcolor,
  borderRadius: "12px",
  textTransform: "none",
  // border: "1px solid #E4E4E4",
  "&.MuiButtonBase-root:hover": {
    backgroundColor: props.mbgcolor,
  },
}));

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
  const saveNote = function () {
    props.noteText && props.handleClose();
  };

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
              value={props.noteText}
              onChange={(e) => props.setNoteText(e.target.value)}
              placeholder="Type here.."
            ></textarea>
            <SaveButton onClick={() => saveNote()}>Save</SaveButton>
            <CancelButton onClick={() => props.handleClose()}>
              Cancel
            </CancelButton>
          </div>
        </Box>
      </Modal>
    </>
  );
}

function ReminderModal({ open, handleClose, value, setValue }) {
  // const [value, setValue] = React.useState(moment());

  const SaveReminder = function () {
    console.log(value);
    value && handleClose();
  };

  return (
    <>
      {/* <Button onClick={handleOpen}>Open Child Modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <div className="w-[320px]">
            <p className="text-[16px] font-[400] mb-3">Set a reminder</p>
            <div>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateCalendar
                  disablePast
                  inputFormat="yyyy-MM-dd"
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                />
              </LocalizationProvider>
            </div>
            <div className="flex"></div>
            <SaveButton onClick={() => SaveReminder()}>Save</SaveButton>
            <CancelButton onClick={() => handleClose()}>Cancel</CancelButton>
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
