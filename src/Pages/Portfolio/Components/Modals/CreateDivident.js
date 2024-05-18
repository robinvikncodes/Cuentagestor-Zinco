import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import { Box, Button, IconButton, Modal, Tab, Tabs } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ZincoModal from "../../../../Components/Component/ZincoModal";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Icone } from "../../../../Assets/AssetsLog";
import {
  createDividend,
  listDetailsPartner,
  updateDividend,
} from "../../../../Api/Assets/AssetsApi";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import TextFieldCalculator from "../../../../Components/TextFieldCalculator/TextFieldCalculator";
import { useDispatch, useSelector } from "react-redux";
import SearchField from "../../../../Components/Component/SearchField";
import { listAccount } from "../../../../Api/Accounts/AccountsApi";
import { AmountFormater } from "../../../../globalFunctions";
import SkletionCard from "../../../../Components/Skletions/SkletionCard";
import { listContact } from "../../../../Api/Contact/ContactApi";
import { BaseUrl } from "../../../../globalVariable";
import moment from "moment";
import { openSnackbar } from "../../../../features/snackbar";
// import { UserData } from "../../../../globalVariable";
const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const CreateDivident = ({ open, edit, handleClose, data, assetDetail, handleOpenDivident }) => {
  const reducer = useSelector((state) => state.setting.settingDetails);
  const userRollReducer = useSelector((state) => state.userRole.state);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // console.log(assetDetail);

  //State
  const [value, setValue] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [accounts, setAccounts] = useState([{
    photo: "",
    id: "",
    account_name: "",
    total_received: 0,
    total_paid: 0,
    phone: "",
  }]);
  const [transaction, setTransaction] = useState({
    candb: [],
    expenses: [],
  });
  const [selected, setSelected] = useState({
    candb: { id: "" },
    expenses: { id: "" },
  });
  const [swap, setSwap] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [accountData, setAccountData] = useState({
    StatusCode: 0,
    data: [],
  });
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
    contact: null
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

  const next = function () {
    setSwap();
  };
  console.log(accounts, "(((((((00009))))))");
  const submitTransaction = function () {
    let payload = {
      date: moment().format("YYYY-MM-DD"),
      time: moment().format('HH:mm:ss'),
      from_account: selected.expenses.id,
      to_account: selected.candb.id,
      amount: calvalue,
      description: submitData.description,
      finance_type: "1",
      is_zakath: submitData.is_zakath,
      is_interest: submitData.is_interest,
      is_reminder: reminderDate ? true : false,
      reminder_date: reminderDate?.format("YYYY-MM-DD") || moment().format("YYYY-MM-DD"),
      reminder_uid: "",
      parners_list: accounts.filter(e => e?.id).map(e => e?.id),
      asset_master_id: assetDetail.id,
      is_owner_include: false,
    }
    createDividentMutate.mutate(payload)
  };

  // const [userData, setUserData] = useState({
  //   account_type: 3,
  //   account_name: "",
  //   opening_balance: "0",
  // });

  const createDividentMutate = useMutation({
    mutationFn: (newData) => {
      return createDividend({ ...newData });
    },
    onSuccess: (res) => {
      if (res.StatusCode === 6001) {
        dispatch(
          openSnackbar({
            open: true,
            message: res?.message || res?.errors || res?.error,
            severity: "warning",
          })
        )
      } else {
        // queryClient.invalidateQueries("Incomes-list-only");
        dispatch(
          openSnackbar({
            open: true,
            message: res?.message || res?.data,
            severity: "success",
          })
        );
        handleClose();
        queryClient.invalidateQueries("list-divident");
      }
    },
  });

  const editAccount = useMutation({
    mutationFn: (newData) => updateDividend({ ...newData }),
    onSuccess: (res) => {
      if (res.StatusCode === 6001) {
        //   setStype("error");
        //   setErrorData(res.errors);
        //   setOpen(true);
      } else {
        //   setStype("success");
        //   setErrorData(res.data);
        //   setOpen(true);
        handleClose();

        //   setUserData({
        //     account_type: 3,
        //     account_name: "",
        //     opening_balance: "0",
        //   });
      }
    },
  });
  // console.log();

  const onSubmit = function (e, i) {

    let newData = accounts
    if (newData[i]?.id) {
        newData[i] = {}
        setAccounts([...newData]);
    } else {
        newData[i] = e
        setAccounts([...newData]);
    }
  };

//   console.log(accounts);

  // Data Fetching
  const { isLoading: isLoadingCandB, refetch: refetchAccount } = useQuery(
    "cash&bank_list",
    () => listAccount({ account_type: [1, 2], search: searchValue.to }),
    {
      onSuccess: (res) => {
        if (res.StatusCode === 6000 && res.data.length > 0) {
          setTransaction((prev) => ({ ...prev, candb: res.data }));
          !edit && setSelected((prev) => ({ ...prev, candb: res.data[0] })); // Only set when edit is tru from the prop
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
          !edit && setSelected((prev) => ({ ...prev, expenses: res.data[0] }));
        }
      },
    }
  );

  // console.log(assetDetail.data.id);

  const { isLoading: isLoadingList, refetch } = useQuery(
    ["list-patners-create"],
    () => listDetailsPartner({ 
      asset_master_id: assetDetail.id,
      type: [1,2],
		  search: "",   //only for list mode
      mode: "list",   //list or details
      is_dividend: true,  
     }),
    {
      onSuccess: (res) => {
        // console.log(res);
        if (res.StatusCode === 6000) {
          setAccountData({
            ...accountData,
            data: res.data,
          });
        }
      },
    }
  );

  // const { isLoading: isLoadingList } = 
  // useQuery(
  //   ["list-patners-create"],
  //   () => listDetailsPartner({ 
  //     asset_master_id: assetDetail.data.id,
  //     type: [1,2],
	// 	  search: "",   //only for list mode
  //     mode: "list",   //list or details
  //     is_dividend: true,  
  //    }),
  //   {
  //     onSuccess: (res) => {
  //       // console.log(res);
  //       if (res.StatusCode === 6000) {
  //         // setPartnerData({
  //         //   ...partnerData,
  //         //   data: res.data,
  //         // });
  //       }
  //     },
  //   }
  // );



  return (
    <>
      <ZincoModal open={open} handleClose={handleClose}>
        <div>
          {!swap && <>
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  !toggle ? refetchAccount() : refetchLedger();
                }
              }}
              onChange={(e) =>
                toggle
                  ? setSearchValue({ ...searchValue, from: e.target.value })
                  : setSearchValue({ ...searchValue, to: e.target.value })
              }
              onClickBTN={() => (!toggle ? refetchAccount() : refetchLedger())}
            />
            <div className="mt-3 grid grid-cols-4 grid-rows-2 gap-2 w-[472.5px] h-[244px]">
              {toggle ? (
                !isLoadingExpenses ? (
                  transaction.expenses.slice(0, 7).map((data, key) => (
                    <div
                      style={{
                        backgroundColor:
                          data.id === selected.expenses.id && "#F6F6F6",
                      }}
                      onClick={() =>
                        setSelected({ ...selected, expenses: data })
                      }
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
                      backgroundColor:
                        data.id === selected.candb.id && "#F6F6F6",
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
                          <img
                            src={Icone.WalletGreenIcon}
                            alt=""
                            className=""
                          />
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
          </>}

          {swap && <>
          <div className="py-[10px] w-[450px]">
          <div className="flex py-[8px] px-2 border-b border-b-[#E9E9E9] mb-2">
            {/* <IconButton sx={{ height: "55px", width: "55px"}} > */}
            <ArrowBackIcon
              sx={{ mr: "15px", color: "#7F52E8", cursor: "pointer" }}
              onClick={() => setSwap(false)}
            />
            {/* </IconButton> */}

            <p className="font-normal text-[16px]">Contacts</p>
          </div>
          <div className="px-[15px]">
            <SearchField
              placeholder={"Search Account"}
              width={"100%"}
              //   valuen={searchValue}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  refetch();
                }
              }}
              onChange={(e) => setSearchValue({ ...searchValue, contact: e.target.value})}
              onClickBTN={() => refetch()}
            />

            <div className="flex justify-between items-center py-[7px] border-b-slate-200">
                <p>Contacts</p>
                <SelectAllButton
                  onClick={() =>{
                    accountData.data.length === accounts.filter(e => e?.id)?.length ? setAccounts([]) : 
                    setAccounts([...accountData.data])
                    // console.log(accountData.data);
                }}
                endIcon={
                    accountData.data.length === accounts.filter(e => e?.id)?.length ? (
                    <img src={Icone.CheckFillIcon} alt="" />
                  ) : (
                    <CircleIcon sx={{ color: "#999999", fontSize: "25px" }} />
                  )
                }
                >
                  Select All
                </SelectAllButton>
            </div>

            <div className="h-[255px] overflow-y-auto">
            <table className="w-full">
                {!isLoadingList &&
                  accountData.data.map((data, key) => (
                  <tr key={key + 1} >
                      <td className="w-[65px]">
                          {data.photo ? (
                            <div className="bg-[#E2EFFF] p-[10px] rounded-full my-[1px] inline-block w-[52px] h-[52px] ">
                              <img src={BaseUrl + data.photo} alt="" className="" />
                            </div>
                          ) : (
                            <div className=" flex items-center justify-center my-[1px] w-[52px] h-[52px] ">
                              <img
                                src={Icone.PersonalcardIcon}
                                alt=""
                                className=" w-[32px] h-[32px]"
                              />{" "}
                            </div>
                          )}
                      </td>
                      <td>
                      {data.contact.name}
                      </td>
                      <td align="right">
                          <IconButton onClick={() => onSubmit(data, key)} >
                          {
                            accounts[key]?.id === data.id ? (
                              <img src={Icone.CheckFillIcon} alt="" />
                            ) : (
                              <CircleIcon sx={{ color: "#999999", fontSize: "25px" }} />
                            )
                          }
                          </IconButton>
                      </td>
                  </tr>
                  ))}
              </table>
            </div>
          </div>
        </div>
          </>}
          <div className="flex justify-between items-center p-1">
            <IconButton onClick={() => handleClose()}>
              <img src={Icone.ClipIcon} alt="" />
            </IconButton>
            <div className="flex items-center">
              {/* <p className="text-[16px] font-[500]">
              {selected?.expenses?.account_name}
            </p>
            <span className="text-[18px] font-[500] mx-2">{">"}</span>
            <p className="text-[16px] font-[500]">
              {selected?.candb?.account_name}
            </p> */}
              <p className="text-[16px] font-[500]">Divident</p>
            </div>
            {swap && (
              <IconButton
                disabled={buttonDisable && !calvalue}
                onClick={submitTransaction}
              >
                <img src={Icone.CheckIcon} alt="" />
              </IconButton>
            )}
            {!swap && (
              <IconButton
                // type="submit"
                disabled={false}
                onClick={() => setSwap(true)}
              >
                <img className="w-10" src={Icone.NextIcon} alt="" />
              </IconButton>
            )}
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
    </>
  );
};

CreateDivident.propTypes = {
  open: PropTypes.bool,
  edit: PropTypes.bool,
  handleClose: PropTypes.func,
  data: PropTypes.array,
  assetDetail: PropTypes.object,
};

export default CreateDivident;

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

const SelectAllButton = styled(Button)(() => ({
    // width: "100%",
    paddingLeft: "18px",
    paddingRight: "18px",
    fontSize: "15px",
    fontWeight: "500",
    color: "#000",
    // backgroundColor: "#7F52E8",
    borderRadius: "8px",
    textTransform: "none",
    marginBottom: "12px",
    // border: "1px solid #E4E4E4",
    "&:hover": {
    //   backgroundColor: "#7F52E8",
    },
  }));

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
  marginBottom: "12px",
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
