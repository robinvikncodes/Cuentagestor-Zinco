import React, { useEffect, useState } from "react";
import ZincoModal from "../../../Components/Component/ZincoModal";
// import { Tabs } from '@mui/base'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  Modal,
  Select,
  Tab,
  Tabs,
  styled,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { MenuItem } from "@mui/base";
import { Icone } from "../../../Assets/AssetsLog";
import SearchField from "../../../Components/Component/SearchField";
import {
  createListTransaction,
  detailFinance,
  updateListTransaction,
} from "../../../Api/Finance/FinanceApi";
import { listAccount } from "../../../Api/Accounts/AccountsApi";
import TextFieldCalculator from "../../../Components/TextFieldCalculator/TextFieldCalculator";
import { closeSnackbar, openSnackbar } from "../../../features/snackbar";
import { useDispatch, useSelector } from "react-redux";
import SkletionCard from "../../../Components/Skletions/SkletionCard";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AmountFormater } from "../../../globalFunctions";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const TransactionModal = (props) => {
  let now = new Date();
  const reducer = useSelector((state) => state.setting.settingDetails);

  //State
  const userRollReducer = useSelector((state) => state.userRole.state);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [isLoading, setIsLoading] = useState({
    candb: true,
    expenses: true,
  });
  const [transaction, setTransaction] = useState({
    candb: [],
    expenses: [],
  });
  const [selected, setSelected] = useState({
    candb: { id: "" },
    expenses: { id: "" },
  });
  const [toggle, setToggle] = useState(true);
  const [buttonDisable, setButtonDisable] = useState(true);
  const [calvalue, setCalvalue] = useState("");
  const [openNote, setOpenNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [reminderDate, setReminderDate] = React.useState(null);
  const [submitData, setSubmitData] = useState({
    is_interest: false,
    is_zakath: false,
    description: "",
    reminder_date: "",
  });
  const [openReminder, setOpenReminder] = useState(false);
  const [searchValue, setSearchValue] = React.useState({
    from: null,
    to: null,
  });

  // Handle Functions
  const handleOpenNote = () => setOpenNote(true);
  const handleCloseNote = () => setOpenNote(false);
  const handleOpenReminder = () => setOpenReminder(true);
  const handleCloseReminder = () => setOpenReminder(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  // Data Fetching
  const { isLoading: isLoadingCandB, refetch: refetchAccount } = useQuery(
    "cash&bank_list",
    () => listAccount({ account_type: [1, 2], search: searchValue.to }),
    {
      onSuccess: (res) => {
        if (res.StatusCode === 6000 && res.data.length > 0 ) {
          setTransaction((prev) => ({ ...prev, candb: res.data }));
          !props.edit &&
            setSelected((prev) => ({ ...prev, candb: res.data[0] })); // Only set when edit is tru from the prop
        }
      },
    }
  );

  const { isLoading: isLoadingExpenses, refetch: refetchLedger } = useQuery(
    "expenses_list",
    () => listAccount({ account_type: [3], search: searchValue.from }),
    {
      onSuccess: (res) => {
        if (res.StatusCode === 6000 && res.data.length > 0) {
          setTransaction((prev) => ({ ...prev, expenses: res.data }));
          !props.edit &&
            setSelected((prev) => ({ ...prev, expenses: res.data[0] }));
        }
      },
    }
  );

  useQuery(
    "detail-transaction-income",
    () => {
      return detailFinance({
        id: props.transID,
      });
    },
    {
      enabled: props.edit,
      onSuccess: (data) => {
        if (data.StatusCode === 6000) {
          setCalvalue(parseFloat(data.data.amount).toFixed(2));
          setSubmitData({
            ...submitData,
            description: data.data.description,
            is_interest: data.data.is_interest,
            is_zakath: data.data.is_zakath,
            // reminder_date: data.datat.is_reminder
          });
          setDate(data.data.date);
          setSelected({
            expenses: data.data.from_account,
            candb: data.data.to_account,
          });
        }
      },
    }
  );

  const transactionMutate = useMutation({
    mutationFn: (newTodo) => {
      return props.edit
        ? updateListTransaction({ ...newTodo })
        : createListTransaction({ ...newTodo });
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
        setButtonDisable(false);
        queryClient.invalidateQueries("Incomes-list");
        queryClient.invalidateQueries("details-dashboard");
        props.handleClose();
      }
    },
  });

  const submitTransaction = function () {
    // console.log(selected);
    let payload = {
      organization: userData.organization,
      is_interest: submitData.is_interest,
      is_zakath: submitData.is_zakath,
      date: date,
      time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      from_account: selected.expenses.id,
      to_account: selected.candb.id,
      amount: calvalue,
      description: noteText,
      finance_type: 0,
      asset_master_id: props.asset_master_id || 0,
      is_asset: props.is_asset || false,
      is_reminder: false,
      reminder_date: new Date().toISOString().substr(0, 10),
    };

    if (reminderDate) {
      payload.reminder_date = reminderDate.format("YYYY-MM-DD");
      payload.is_reminder = true;
    }
    if (props.edit) {
      payload.id = props.transID;
    }

    if (calvalue <= 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: "Amount must be grater than 0",
          severity: "error",
        })
      );
    } else if (calvalue) {
      setButtonDisable(true);
      transactionMutate.mutate(payload);
    }
  };

  useEffect(() => {
    if (!props.edit) {
      setButtonDisable(false);
      setCalvalue(0);
      setSubmitData({
        is_interest: false,
        is_zakath: false,
        description: "",
        reminder_date: "",
      });
    }
  }, [props.edit]);

  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <div>
        <div className="py-[15px] px-3 bg-[#F6F6F6] rounded-t-[22px]">
          <TextFieldCalculator setCalvalue={setCalvalue} />
          <p className="text-[27px] font-[500] text-right">
            {calvalue || "0.00"}
            <span className="ml-1 text-[15px] font-[400] text-[#6E88A6]">
              {userData.country_details.currency_simbol}
              {"  "}
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
              onClick={() => {
                setToggle(true);
                // mutation.mutate({ account_type: [1, 2] });
              }}
              sx={{ textTransform: "none" }}
              label="From"
            />
            <Tab
              onClick={() => {
                setToggle(false);
                // mutation.mutate({ account_type: [4] });
              }}
              sx={{ textTransform: "none" }}
              label="To"
            />
          </Tabs>
        </div>

        <div className="p-3">
          
        <SearchField
            placeholder={"search"}
            width={"100%"}
            valuen={toggle ? searchValue.from : searchValue.to}
            onKeyDown={(e) =>{
             if(e.key === "Enter") { !toggle ? refetchAccount() : refetchLedger() }
            }}
            onChange={(e) =>
              toggle
                ? setSearchValue({ ...searchValue, from: e.target.value })
                : setSearchValue({ ...searchValue, to: e.target.value })
            }
            onClickBTN={() => (!toggle ? refetchAccount() : refetchLedger())}
          />

          {/* <div className="grid grid-cols-2 gap-x-3 my-3">
            <ToggleButton
              mbgcolor={toggle ? "#7F52E8" : "#F8F5FF"}
              mcolor={toggle ? "#FFFFFF" : "#7F52E8"}
              onClick={() => settoggle(true)}
            >
              Accounts
            </ToggleButton>
            <ToggleButton
              mbgcolor={toggle ? "#F8F5FF" : "#7F52E8"}
              mcolor={toggle ? "#7F52E8" : "#FFFFFF"}
              onClick={() => settoggle(false)}
            >
              Contact
            </ToggleButton>
          </div> */}
          <div className="mt-3 grid grid-cols-4 grid-rows-2 gap-2 w-[472.5px] h-[244px]">
            {toggle ? (
              !isLoadingExpenses ? (
                transaction.expenses.slice(0, 7).map((data, key) => (
                  <div
                    style={{
                      backgroundColor:
                        data.id === selected.expenses.id && "#F6F6F6",
                    }}
                    onClick={() => setSelected({ ...selected, expenses: data })}
                    className="bg-white  flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] py-4 cursor-pointer"
                  >
                    {/* <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div> */}
                    <p className=" text-[10px] font-[400]">
                      {data.account_name}
                    </p>
                    <div className="bg-[#0FD28C] p-[10px] rounded-[13px] my-[10px] inline-block">
                      <img src={Icone.WalletAdd3Icon} alt="" className="" />
                    </div>
                    <p className=" text-[10px] font-[400]">
                      {userData.country_details.currency_simbol}
                      {"  "} {AmountFormater(data.balance)}
                    </p>
                  </div>
                ))
              ) : (
                <SkletionCard />
              )
            ) : !isLoadingCandB ? (
              transaction?.candb.slice(0, 7).map((data, key) => (
                <div
                  key={key + 1}
                  className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] cursor-pointer"
                  style={{
                    backgroundColor: data.id === selected.candb.id && "#F6F6F6",
                  }}
                  onClick={() => setSelected({ ...selected, candb: data })}
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
                    {userRollReducer.account_balance.view_permission &&
                      userData.country_details.currency_simbol +
                        "  " +
                        AmountFormater(data.balance)}
                  </p>
                </div>
              ))
            ) : (
              <SkletionCard />
            )}
          </div>
          <div className="w-full flex justify-center py-3">
            <input
              type="date"
              className="border-[1px] px-[48px] py-[6px] rounded-full max-w-[220px]"
              value={date}
              onChange={handleDateChange}
            />
          </div>
        </div>

        <div className="flex justify-between">
          {reducer.is_interest && (
            <StyledButton
              onClick={() =>
                setSubmitData({
                  ...submitData,
                  is_interest: !submitData.is_interest,
                  is_zakath: false,
                })
              }
              startIcon={
                submitData.is_interest ? (
                  <img src={Icone.CheckFillIcon} alt="" />
                ) : (
                  <CircleIcon sx={{ color: "#999999", fontSize: "25px" }} />
                )
              }
            >
              Use Interest
            </StyledButton>
          )}
          {reducer.is_zakath && (
            <StyledButton
              onClick={() =>
                setSubmitData({
                  ...submitData,
                  is_zakath: !submitData.is_zakath,
                  is_interest: false,
                })
              }
              startIcon={
                submitData.is_zakath ? (
                  <img src={Icone.CheckFillIcon} alt="" />
                ) : (
                  <CircleIcon sx={{ color: "#999999", fontSize: "25px" }} />
                )
              }
            >
              Use Zakah
            </StyledButton>
          )}
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

        <div className="flex justify-between items-center p-1">
          <IconButton onClick={() => props.handleClose()}>
            <img src={Icone.ClipIcon} alt="" />
          </IconButton>
          <div className="flex items-center">
            <p className="text-[16px] font-[500]">
              {selected?.expenses?.account_name}
            </p>
            <span className="text-[18px] font-[500] mx-2">{">"}</span>
            <p className="text-[16px] font-[500]">
              {selected?.candb?.account_name}
            </p>
          </div>
          <IconButton
            disabled={buttonDisable && !calvalue}
            onClick={submitTransaction}
          >
            <img src={Icone.CheckIcon} alt="" />
          </IconButton>
        </div>

        {/* <div className="h-5"></div> */}
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

export default TransactionModal;

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

function NotesModal(props) {
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

function ReminderModal(props) {
  const SaveReminder = function () {
    // console.log(value);
    props.value && props.handleClose();
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
          <div className="w-[320px]">
            <p className="text-[16px] font-[400] mb-3">Set a reminder</p>
            <div>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateCalendar
                  disablePast
                  inputFormat="yyyy-MM-dd"
                  value={props.value}
                  onChange={(newValue) => props.setValue(newValue)}
                />
              </LocalizationProvider>
            </div>
            <div className="flex"></div>
            <SaveButton onClick={() => SaveReminder()}>Save</SaveButton>
            <CancelButton onClick={() => props.handleClose()}>
              Cancel
            </CancelButton>
          </div>
        </Box>
      </Modal>
    </>
  );
}

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

const StyledSelect = styled(Select)({
  width: 200,
  border: "1px solid gray",
  borderRadius: 4,
  paddingLeft: 15,
  "& .MuiSelect-select": {
    backgroundColor: "white",
  },
  "&:hover": {
    borderColor: "black",
  },
});

