import React, { useEffect, useState } from "react";
import { listAccount } from "../../../Api/Accounts/AccountsApi";
import {
  createTransfer,
  detailsTransfer,
  updateTransfer,
} from "../../../Api/Transfer/TransferApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ZincoModal from "../../../Components/Component/ZincoModal";
import { userCountryList } from "../../../Api/Countrys/countryesApi";
import { Icone } from "../../../Assets/AssetsLog";
import { openSnackbar } from "../../../features/snackbar";
import { useDispatch, useSelector } from "react-redux";
import FromCalText from "./FromCalText";
import ToCalText from "./ToCalText";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import SkletionCard from "../../../Components/Skletions/SkletionCard";
import SearchField from "../../../Components/Component/SearchField";
import styled from "@emotion/styled";
import CircleIcon from "@mui/icons-material/Circle";
import { AmountFormater } from "../../../globalFunctions";

let now = new Date();
const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const TransferTransaction = (props) => {
  const reducer = useSelector((state) => state.setting.settingDetails);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  //States
  const [note, setNote] = useState("");
  const [toggle, setToggle] = useState(true);
  const [calValueFrom, setCalValueFrom] = useState("");
  const [calValueTo, setCalValueTo] = useState("");
  const [fromCountry, setfromCountry] = useState("");
  const [buttonDisable, setButtonDisable] = useState(true);
  const [toCountry, setToCountry] = useState("");
  const [countryList, setcountryList] = useState([]);
  const [openNote, setOpenNote] = useState(false);
  const [value, setValue] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [accountList, setAccountList] = useState({
    fromAccountlist: [],
    toAccountlist: [],
  });
  const [selectCountry, setSelectCountry] = useState({
    fromCountry: {},
    toCountry: {},
  });
  const [selectedAccount, setSelectedAccount] = useState({
    fromAccount: {},
    toAccount: {},
  });
  const [submitData, setSubmitData] = useState({
    is_interest: false,
    is_zakath: false,
    description: "",
    reminder_date: "",
  });
  const [isLoading, setIsLoading] = useState({
    from: false,
    to: false,
  });
  const [searchValue, setSearchValue] = React.useState({
    from: null,
    to: null,
  });

  const [countryId, setCountryId] = useState({
    from: "",
    to: "",
  })

  //Handle Functions
  const handleOpenNote = () => setOpenNote(true);
  const handleCloseNote = () => setOpenNote(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleCountry = (event, value) => {
    console.log(value);
    toggle
      ? setfromCountry(event.target.value)
      : setToCountry(event.target.value);
  };

  const countrySetFun = function (obj, name) {
    // console.log(obj);
    // callAccount(obj.id, name);
    // setIs_First(false)
    toggle
      ? setSelectCountry({ ...selectCountry, fromCountry: obj })
      : setSelectCountry({ ...selectCountry, toCountry: obj });
    toggle ? callFromAccount(obj.id) : callToAccount(obj.id);
    toggle ? setCountryId({...countryId, from: obj.id }) : setCountryId({...countryId, to: obj.id})
  };

  const returnLogo = function (type) {
    switch (type) {
      case "1":
        // cash
        return (
          <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] my-[5px] ">
            <img src={Icone.WalletGreenIcon} alt="" className="" />
          </div>
        );

      case "2":
        // Bank
        return (
          <div className="bg-[#E8F0FF] p-[10px] rounded-[13px] my-[5px]">
            <img src={Icone.BankIcon} alt="" />
          </div>
        );

      default:
        break;
    }
  };

  //Data Fetching
  // const callAccount = async function () {
  //   // console.log("NOw i am ======================++++++++++++++++++");
  //   listAccount({
  //     account_type: [1, 2],
  //     country: toggle
  //       ? selectCountry.fromCountry.id
  //       : selectCountry.toCountry.id,
  //   }).then((res) => {
  //     if (toggle) {
  //       is_First &&
  //         setSelectedAccount({
  //           ...selectedAccount,
  //           fromAccount: res.data[0],
  //         });
  //       setAccountList({
  //         ...accountList,
  //         fromAccountlist: res.data,
  //       });
  //       setIsLoading({
  //         ...isLoading,
  //         from: true,
  //       });
  //     } else {
  //       is_First &&
  //         setSelectedAccount({
  //           ...selectedAccount,
  //           toAccount: res.data[1],
  //         });

  //       setAccountList({
  //         ...accountList,
  //         toAccountlist: res.data,
  //       });
  //       setIsLoading({
  //         ...isLoading,
  //         to: true,
  //       });
  //     }
  //   });
  // };

  const callFromAccount = async function (id) {
    // console.log("NOw i am ======================++++++++++++++++++");
    setIsLoading({
      ...isLoading,
      from: false,
    });
    listAccount({
      account_type: [1, 2],
      country: id,
      search: searchValue.from
    }).then((res) => {
      if (res.StatusCode === 6000 && res.data.length > 0){
      !props.edit &&
        setSelectedAccount({
          ...selectedAccount,
          fromAccount: res.data[0],
        });

      setAccountList((prev) => ({
        ...prev,
        fromAccountlist: res.data,
      }));      
    }
    setIsLoading({
      ...isLoading,
      from: true,
    });
    });
    
  };

  const callToAccount = async function (id) {
    // console.log("NOw i am ======================++++++++++++++++++");
    setIsLoading({
      ...isLoading,
      to: false,
    });
    listAccount({
      account_type: [1, 2],
      country: id,
      search: searchValue.to
    }).then((res) => {
      if (res.StatusCode === 6000 && res.data.length > 0){
      !props.edit &&
        setSelectedAccount((prev) => ({
          ...prev,
          toAccount: res.data[1],
        }));
      setAccountList((prev) => ({
        ...prev,
        toAccountlist: res.data,
      }));
      }
      setIsLoading({
        ...isLoading,
        to: true,
      });
    });
  };

  useQuery(
    "detail-transaction-transfer",
    () => {
      return detailsTransfer({
        id: props.transID,
      });
    },
    {
      enabled: props.edit,
      onSuccess: (res) => {
        if (res.StatusCode === 6000) {
          setCalValueFrom(parseInt(res.data.from_amount));
          setCalValueTo(parseInt(res.data.to_amount));
          setDate(res.data.date);
          setfromCountry(res.data.from_country.country_code);
          setToCountry(res.data.to_country.country_code);
          setSelectedAccount({
            fromAccount: res.data.from_account,
            toAccount: res.data.to_account,
          });
          setNote(res.data.description);
          // callToAccount();
          setSelectCountry({
            fromCountry: res.data.from_country,
            toCountry: res.data.to_country,
          });
          callFromAccount(res.data.from_country.id);
          callToAccount(res.data.to_country.id);
          setSubmitData({
            ...submitData,
            is_zakath: res.data.is_zakath,
          });
        }
      },
    }
  );

  useQuery("userCountryList_transfer", () => userCountryList(), {
    onSuccess: (res) => {
      console.log(res.data);
      setcountryList(res.data);

      let firstCountry = res.data.filter(
        (obj) => obj.id === userData.country_details.id
      );
      console.log(firstCountry);
      !props.edit && callFromAccount(firstCountry[0].id);
      !props.edit && callToAccount(firstCountry[0].id);
      !props.edit &&
        setSelectCountry({
          fromCountry: userData.country_details,
          toCountry: userData.country_details,
        });
      !props.edit && setfromCountry(userData.country_details.country_code);
      !props.edit && setToCountry(userData.country_details.country_code);
    },
  });

  const mutationTransation = useMutation({
    mutationFn: (newTodo) => {
      return props.edit
        ? updateTransfer({ ...newTodo })
        : createTransfer({ ...newTodo });
    },
    onSuccess: (data) => {
      setButtonDisable(true);
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
        queryClient.invalidateQueries("details-dashboard");
        props.handleClose();
      }
    },
  });

  const submitTransaction = function () {
    console.log(selectCountry.fromCountry.id , selectCountry.toCountry.id);
    if (selectedAccount.fromAccount.id === selectedAccount.toAccount.id) {
      dispatch(
        openSnackbar({
          open: true,
          message: "You cant transfer to same account",
          severity: "error",
        })
      );
    } else if (calValueTo <= 0 || calValueFrom <= 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: "Amount must be grater than 0",
          severity: "error",
        })
      );
    } else {
      let payload = {
        date: date,
        time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
        from_account: selectedAccount.fromAccount.id,
        to_account: selectedAccount.toAccount.id,
        finance_type: "",
        description: note,
        from_country: selectCountry.fromCountry.id,
        from_amount: calValueFrom,
        to_country: selectCountry.toCountry.id,
        to_amount: calValueTo,
        is_zakath: submitData.is_zakath,
      };

      if (props.edit) payload.id = props.transID;
      setButtonDisable(false);
      calValueFrom && calValueTo && mutationTransation.mutate(payload);
    }
  };

  const [expressionFrom, setExpressionFrom] = useState("");
  const [expressionTo, setExpressionTo] = useState("");

  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <div>
        <div className="py-[15px] px-3 bg-[#F6F6F6] rounded-t-[22px]">
          {/* {toggle ? (
            <FromCalText value={calValueFrom} setCalvalue={setCalValueFrom}
             expression={expressionFrom}
             setExpression={setExpressionFrom} />
          ) : (
            <ToCalText value={calValueTo} setCalvalue={setCalValueTo} 
            expression={expressionTo}
            setExpression={setExpressionTo}
            />
          )} */}
          <div style={{ display: toggle ? "block" : "none" }}>
            <FromCalText
              value={calValueFrom}
              setCalvalue={setCalValueFrom}
              expression={expressionFrom}
              setExpression={setExpressionFrom}
            />
          </div>

          <div style={{ display: !toggle ? "block" : "none" }}>
            <ToCalText
              value={calValueTo}
              setCalvalue={setCalValueTo}
              expression={expressionTo}
              setExpression={setExpressionTo}
            />
          </div>
          <p className="text-[27px] font-[500] text-right">
            {toggle ? calValueFrom || "0.00" : calValueTo || "0.00"}
            <span className="ml-1 text-[15px] font-[400] text-[#6E88A6]">
              {/* {userData.country_details.currency_simbol} */}
              {toggle
                ? selectCountry.fromCountry.country_code
                : selectCountry.toCountry.country_code}
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
                // setnowIam("from")
                console.log(selectCountry.fromCountry);
                // mutation.mutate({ account_type: [1, 2] });
                // callAccount(selectCountry.fromCountry.id,"from")
              }}
              sx={{ textTransform: "none" }}
              label="From"
            />
            <Tab
              onClick={() => {
                setToggle(false);
                // setnowIam("to")
                console.log(selectCountry.toCountry, "selectCountry.toCountry");
                // callAccount(selectCountry.toCountry.id,"to")
                // mutation.mutate({ account_type: [4] });
              }}
              sx={{ textTransform: "none" }}
              label="To"
            />
          </Tabs>
        </div>

        <div className="p-3">
          <div className="flex justify-between items-center">
            <div className="w-[70%]">
              <SearchField             
              placeholder={"search"}
              width={"100%"}
              valuen={toggle ? searchValue.from : searchValue.to}
              onKeyDown={(e) => { if(e.key === "Enter") {toggle ? callFromAccount(countryId.from) : callToAccount(countryId.to)}}}
              onChange={(e) =>
                toggle
                  ? setSearchValue({ ...searchValue, from: e.target.value })
                  : setSearchValue({ ...searchValue, to: e.target.value })
              }
              onClickBTN={() => (!toggle ? callFromAccount(countryId.from) : callToAccount(countryId.to))} 
            />
            </div>
            {toggle && (
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-from"
                  value={fromCountry}
                  label="country"
                  onChange={handleCountry}
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
                  {countryList.map((obj, key) => (
                    <MenuItem
                      value={obj.country.country_code}
                      onClick={() => countrySetFun(obj, "form")}
                    >
                      {obj.country.country_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {!toggle && (
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-to"
                  value={toCountry}
                  label="country"
                  onChange={handleCountry}
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
                  {countryList.map((obj, key) => (
                    <MenuItem
                      onClick={() => countrySetFun(obj, "to")}
                      value={obj.country.country_code}
                    >
                      {obj.country.country_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>

          <div className="w-[472.5px] h-[244px]  overflow-y-auto">
            <div className="mt-3 grid grid-cols-4 grid-rows-2 gap-2 ">
              <>
                {toggle ? (
                  // isLoading.from ? (
                  accountList?.fromAccountlist?.map((data, key) => (
                    <div
                      style={{
                        backgroundColor:
                          selectedAccount?.toAccount?.id !== data.id &&
                          data.id === selectedAccount?.fromAccount?.id &&
                          "#F6F6F6",
                        cursor:
                          selectedAccount?.toAccount?.id !== data.id &&
                          "pointer",
                      }}
                      onClick={() =>
                        selectedAccount?.toAccount?.id !== data.id &&
                        setSelectedAccount({
                          ...selectedAccount,
                          fromAccount: data,
                        })
                      }
                      className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] py-4"
                    >
                      <p className=" text-[10px] font-[400]">
                        {data.account_name}
                      </p>
                      {returnLogo(data.account_type)}
                      <p className="text-[10px] font-[400]">
                        {/* {userData.country_details.currency_simbol} */}
                        {selectCountry?.fromCountry?.country?.country_code ||
                          selectCountry?.fromCountry?.country_code}
                        {"  "}
                        {AmountFormater(data.balance)}
                      </p>
                    </div>
                  ))
                ) : // )
                // : (
                //   <SkletionCard />
                // )
                isLoading.to ? (
                  accountList?.toAccountlist?.map((data, key) => (
                    <div
                      key={key + 1}
                      className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] "
                      style={{
                        backgroundColor:
                          selectedAccount?.fromAccount?.id !== data.id &&
                          data.id === selectedAccount?.toAccount?.id &&
                          "#F6F6F6",
                        cursor:
                          selectedAccount?.fromAccount?.id !== data.id &&
                          "pointer",
                      }}
                      onClick={() =>
                        selectedAccount?.fromAccount?.id !== data.id &&
                        setSelectedAccount({
                          ...selectedAccount,
                          toAccount: data,
                        })
                      }
                    >
                      <p className=" text-[10px] font-[400]">
                        {data.account_name}
                      </p>
                      {returnLogo(data.account_type)}
                      <p className=" text-[10px] font-[400]">
                        {/* {userData.country_details.currency_simbol} */}
                        {selectCountry?.toCountry?.country?.country_code ||
                          selectCountry?.toCountry?.country_code}
                        {"  "} {AmountFormater(data.balance)}
                      </p>
                    </div>
                  ))
                ) : (
                  <SkletionCard />
                )}
              </>
            </div>
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
          <StyledButton
            onClick={() => handleOpenNote()}
            startIcon={<img src={Icone.NoteIcon} alt="" />}
          >
            Notes
          </StyledButton>
        </div>

        <div className="flex justify-between items-center p-1">
          <IconButton onClick={() => props.handleClose()}>
            <img src={Icone.ClipIcon} alt="" />
          </IconButton>
          <div className="flex items-center">
            <p className="text-[16px] font-[500]">
              {selectedAccount?.fromAccount?.account_name}
            </p>
            <span className="text-[18px] font-[500] mx-2">{">"}</span>
            <p className="text-[16px] font-[500]">
              {selectedAccount?.toAccount?.account_name}
            </p>
          </div>
          <IconButton
            disabled={buttonDisable && !calValueFrom && !calValueTo}
            onClick={submitTransaction}
          >
            <img src={Icone.CheckIcon} alt="" />
          </IconButton>
        </div>
      </div>
      <NotesModal
        open={openNote}
        handleClose={handleCloseNote}
        value={note}
        changeNote={setNote}
      />
    </ZincoModal>
  );
};

export default TransferTransaction;

const StyledButton = styled(Button)(() => ({
  paddingLeft: "18px",
  paddingRight: "18px",
  paddingTop: "8px",
  paddingBottom: "8px",
  width: "100%",
  fontSize: "15px",
  fontWeight: "400",
  color: "#000",
  borderRadius: "0px",
  border: "1px solid #E4E4E4",
  textTransform: "none",
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "background.paper",
  borderRadius: "22px",
  boxShadow: 24,
  padding: "20px",
};

function NotesModal(props) {
  const saveNote = function () {
    props.value && props.handleClose();
  };
  return (
    <>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <div className="w-[320px]">
            <p className="text-[16px] font-[400] mb-3">Add a note</p>
            <textarea
              className="border-[#E4E4E4] border-[1px] px-[11px] py-[9px] rounded-[8px] text-[11px] mb-3 w-full"
              name="income"
              id="incomeField"
              // cols="25"
              rows="6"
              placeholder="Type here.."
              value={props.value}
              onChange={(e) => props.changeNote(e.target.value)}
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
