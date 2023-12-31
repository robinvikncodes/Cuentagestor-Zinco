import React, { useEffect, useState } from "react";
import SearchField from "../../../Components/Component/SearchField";
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
  styled,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import ZincoModal from "../../../Components/Component/ZincoModal";
import TextFieldCalculator from "../../../Components/TextFieldCalculator/TextFieldCalculator";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createListTransaction,
  detailFinance,
  updateListTransaction,
} from "../../../Api/Finance/FinanceApi";
import { openSnackbar } from "../../../features/snackbar";
import { listAccount } from "../../../Api/Accounts/AccountsApi";
import { Icone } from "../../../Assets/AssetsLog";
import { userCountryList } from "../../../Api/Countrys/countryesApi";
import { createTransfer, detailsTransfer, updateTransfer } from "../../../Api/Transfer/TransferApi";
import SkletionCard from "../../../Components/Skletions/SkletionCard";
import { log } from "mathjs";
import ToCalText from "./ToCalText";
import FromCalText from "./FromCalText";
import { AmountFormater } from "../../../globalFunctions";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const TransferTransaction = (props) => {
  const reducer = useSelector(state => state.setting.settingDetails )
  let now = new Date();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [value, setValue] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [accountList, setAccountList] = useState({
    fromAccountlist: [],
    toAccountlist: [],
  });
  const [selectedAccount, setSelectedAccount] = useState({
    fromAccount: {},
    toAccount: {},
  });
  const [selectCountry, setSelectCountry] = useState({
    fromCountry: {},
    toCountry: {},
  });
  const [isLoading, setIsLoading] = useState({
    from: false,
    to: false
  })
  const [countryList, setcountryList] = useState([]);
  const [fromCountry, setfromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [toggle, setToggle] = useState(true);
  // const [calvalue, setCalvalue] = useState({
  //   from: "",
  //   to: "",
  // });
  const [nowIam, setnowIam] = useState("from");
  const [calValueFrom, setCalValueFrom] = useState("");
  const [calValueTo, setCalValueTo] = useState("");

  const [openNote, setOpenNote] = useState(false);
  const [submitData, setSubmitData] = useState({
    is_interest: false,
    is_zakath: false,
    description: "",
    reminder_date: "",
  });
  const handleOpenNote = () => setOpenNote(true);
  const handleCloseNote = () => setOpenNote(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleCountry = (event) => {
    console.log(event.target.value);
    toggle
      ? setfromCountry(event.target.value)
      : setToCountry(event.target.value);
  };

  const countrySetFun = function (obj,name) {
    console.log(obj);
    callAccount(obj.id,name);
    toggle
      ? setSelectCountry({ ...selectCountry, fromCountry: obj })
      : setSelectCountry({ ...selectCountry, toCountry: obj });
    toggle ? setnowIam("from") : setnowIam("to");
    toggle ? setIsLoading({
      ...isLoading,
      from: false,
    }) : setIsLoading({
      ...isLoading,
      to: false
    })
    // queryClient.invalidateQueries("accountList_transfer");
    callAccount(obj.id);
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


  useQuery("userCountryList_transfer", () => userCountryList(), {
    onSuccess: (res) => {
      console.log(res.data);
      setcountryList(res.data);
      setSelectCountry({
        fromCountry: res.data[0],
        toCountry: res.data[0],
      });
      setfromCountry(res.data[0].country.country_code);
      setToCountry(res.data[0].country.country_code);
      console.log(res.data[0].country.country_code);
    },
  });

  const callAccount = async function (countryID,name) {
    if(!name){
      name = nowIam
    }
    console.log(countryID, "NOw i am ======================++++++++++++++++++");
    listAccount({
      account_type: [1, 2],
      // country: toggle
      //   ? selectCountry.fromCountry.id
      //   : selectCountry.toCountry.id,
      country: countryID
    }).then((res) => {
      // console.log(res);
      if (name === "from") {
        !props.edit && setSelectedAccount({
          ...selectedAccount,
          fromAccount: res.data[0],
        });
        setAccountList({
          ...accountList,
          fromAccountlist: res.data,
        });
        setIsLoading({
          ...isLoading,
          from: true,
        })
      } else if (name === "to") {
        console.log("toooooooooooooooooooooooooo");
        !props.edit && setSelectedAccount({
          ...selectedAccount,
          toAccount: res.data[1],
        });

        setAccountList({
          ...accountList,
          toAccountlist: res.data,
        });
        setIsLoading({
          ...isLoading,
          to: true
        })
      } else {
        !props.edit && setSelectedAccount({
          fromAccount: res.data[0],
          toAccount: res.data[1],
        });

        !props.edit && setAccountList({
          fromAccountlist: res.data,
          toAccountlist: res.data,
        });

        setIsLoading({
          from: true,
          to: true
        })
      }
    });
  };

  // useQuery(
  //   ["accountList_transfer"],
  //   () =>
  //     listAccount({
  //       account_type: [1, 2],
  //       country: toggle
  //         ? selectCountry.fromCountry.id
  //         : selectCountry.toCountry.id,
  //     }),
  //   {
  //     onSuccess: (res) => {
  //       // console.log(res);
  //       if (nowIam === "from") {
  //         setSelectedAccount({
  //           ...selectedAccount,
  //           fromAccount: res.data[0],
  //         });
  //         console.log(res.data,"res.datares.datares.data");
  //         console.log(accountList,"accountListaccountListaccountList");
  //         setAccountList({
  //           ...accountList,
  //           fromAccountlist: res.data,
  //         });
  //         console.log( selectCountry.fromCountry.id , "I am from country 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀");
  //       } else if (nowIam === "to") {
  //         setSelectedAccount({
  //           ...selectedAccount,
  //           toAccount: res.data[1],
  //         });

  //         setAccountList({
  //           ...accountList,
  //           toAccountlist: res.data,
  //         });
  //         console.log("I am to country  🚀🚀🚀🚀🚀🚀");
  //       } else {
  //         console.log("un wanted now,ccccccccccccccccc");
  //         setSelectedAccount({
  //           fromAccount: res.data[0],
  //           toAccount: res.data[1],
  //         });

  //         setAccountList({
  //           fromAccountlist: res.data,
  //           toAccountlist: res.data,
  //         });
  //       }
  //     },
  //   }
  // );


  useQuery(
    "detail-transaction-transfer",
    () => {
      return detailsTransfer({
        id: props.transID
      });
    },
    { 
      enabled: props.edit,
      onSuccess: res => {
        if (res.StatusCode === 6000) {
          setCalValueFrom(parseInt(res.data.from_amount))
          setCalValueTo(parseInt(res.data.to_amount))
          setDate(res.data.date)
          setfromCountry(res.data.from_country.country_code)
          setToCountry(res.data.to_country.country_code)
          setSelectedAccount({
            fromAccount: res.data.from_account,
            toAccount: res.data.to_account,
          })
          setSelectCountry({
            fromCountry: res.data.from_country,
            toCountry: res.data.to_country,
          });
          setSubmitData({
            ...submitData,
            is_zakath: res.data.is_zakath
          })
        }
      }
    }
  );

  useEffect(() => {
    if(props.edit===true){
      callAccount(toggle ? selectCountry.fromCountry.id : selectCountry.toCountry.id);
    }
  }, [props.edit]);

  const mutationTransation = useMutation({
    mutationFn: (newTodo) => {
      return props.edit
        ? updateTransfer({ ...newTodo })
        : createTransfer({ ...newTodo });
    },
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

        props.handleClose();
      }
    },
  });

  const submitTransaction = function () {
    let payload = {
      date: date,
      time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      from_account: selectedAccount.fromAccount.id,
      to_account: selectedAccount.toAccount.id,
      finance_type: "",
      description: "",
      from_country: selectCountry.fromCountry.id,
      from_amount: calValueFrom,
      to_country: selectCountry.toCountry.id,
      to_amount: calValueTo,
      is_zakath: submitData.is_zakath,
    };

    if (props.edit) payload.id = props.transID;
    calValueFrom && calValueTo && mutationTransation.mutate(payload);
  };

  console.log(calValueFrom, calValueTo, "jdffdsfsdff");

  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <div>
        <div className="py-[15px] px-3 bg-[#F6F6F6] rounded-t-[22px]">
          {toggle ? (
            <FromCalText
              value={calValueFrom}
              setCalvalue={setCalValueFrom}
            />
          ) : (
            <ToCalText
              value={calValueTo}
              setCalvalue={setCalValueTo}
            />
          )}
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
                setnowIam("from")
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
                setnowIam("to")
                console.log(selectCountry.toCountry,"selectCountry.toCountry");
                callAccount(selectCountry.toCountry.id,"to")
                // mutation.mutate({ account_type: [4] });
              }}
              sx={{ textTransform: "none" }}
              label="To"
            />
          </Tabs>
        </div>
        {/* <p>{!isLoading && data.data[0].account_name}</p> */}
        <div className="p-3">
          <div className="flex justify-between items-center">
            <div className="w-[70%]">
              <SearchField />
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
                      onClick={() => countrySetFun(obj,"to")}
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
                {toggle
                  ? isLoading.from ? accountList?.fromAccountlist
                      ?.slice(0, 8)
                      .map((data, key) => (
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
                            {selectCountry?.fromCountry?.country?.country_code || selectCountry?.fromCountry?.country_code}
                            {"  "}
                            {AmountFormater(data.balance)}
                          </p>
                        </div>
                      )) : <SkletionCard />
                  : isLoading.to ? accountList?.toAccountlist?.slice(0, 7).map((data, key) => (
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
                          {selectCountry?.toCountry?.country?.country_code || selectCountry?.toCountry?.country_code}
                          {"  "} {AmountFormater(data.balance)}
                        </p>
                      </div>
                    )) : <SkletionCard /> }
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
          {reducer.is_zakath && <StyledButton
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
          </StyledButton>}
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
            disabled={!calValueFrom && !calValueTo}
            onClick={submitTransaction}
          >
            <img src={Icone.CheckIcon} alt="" />
          </IconButton>
        </div>
        {/* <div className="h-5"></div> */}
      </div>

      <NotesModal open={openNote} handleClose={handleCloseNote} />
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
