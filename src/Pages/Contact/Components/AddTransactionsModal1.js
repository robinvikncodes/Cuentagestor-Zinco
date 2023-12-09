import React, { useEffect, useState } from "react";
import ZincoModal from "../../../Components/Component/ZincoModal";
import SearchField from "../../../Components/Component/SearchField";
import { Icone } from "../../../Assets/AssetsLog";
import { Button, IconButton, Tab, Tabs, styled } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { listAccount } from "../../../Api/Accounts/AccountsApi";
import { BaseUrl } from "../../../globalVariable";
import {
  createListTransaction,
  detailFinance,
  updateListTransaction,
} from "../../../Api/Finance/FinanceApi";
import { openSnackbar } from "../../../features/snackbar";
import { useDispatch } from "react-redux";
import TextFieldCalculator from "../../../Components/TextFieldCalculator/TextFieldCalculator";
import { AmountFormater } from "../../../globalFunctions";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const AddTransactionsModal = (props) => {
  let now = new Date();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [payloadID, setPayloadID] = useState({
    accountId: "",
    contactId: props.contactDetail?.data?.id,
  });
  const [selAccount, setSelAccount] = useState({});

  const [button, setbutton] = useState({
    from: true,
    to: false,
    account: true,
    contact: false,
  });

  const [calvalue, setCalvalue] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
  };

  const onButtonClick = function (e, name) {
    const newButton = {
      account: false,
      contact: false,
    };

    if (name === "to" || name === "from") {
      newButton.account = !button.account;
      newButton.contact = !button.contact;
    }

    if (name === "account") {
      newButton.account = true;
    }

    if (name === "contact") {
      newButton.contact = true;
    }

    if (button.to) {
      newButton.account = true;
      newButton.contact = false;
    }
    setbutton(newButton);
  };

  const { isLoading, error, data } = useQuery("account-list", async() => {
    return listAccount({
      account_type: [1, 2],
    }).then((res) => {
      if (res.StatusCode === 6000) {
        !props.edit && setSelAccount(res.data[0]);
        // setPayloadID({
        //   ...payloadID,
        //   accountId: res.data[0]
        // })
        return res;
      } else {
        // throw new Error('Unexpected status code');
        return [];
      }
    });
  });

  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return createListTransaction({ ...newTodo });
    },
    onSuccess: (data) => {
      console.log(data);
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
          predicate: (query) => {
            return ['contact_account_transaction', 'finance_account_details'].includes(query.queryKey[0]);
          },
        })

        props.handleClose();
      }
    },
  });

  const updateTransaction = useMutation({
    mutationFn: (newTodo) => {
      return updateListTransaction({ ...newTodo });
    },
    onSuccess: (data) => {
      console.log(data);
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

  // from_account: button.from && button.account ? selAccount.id : props.contactDetail?.data?.id,
  // to_account: button.to && button.contact ?  props.contactDetail?.data?.id : selAccount.id,
  // from_account: button.from && button.account ? props.contactDetail?.data?.id : selAccount.id,
  // to_account: button.to && button.contact ? selAccount.id : props.contactDetail?.data?.id,

  const submitTransaction = function () {
    let from_account, to_account, finance_type;
    if (button.from && button.account) {
      from_account = selAccount.id;
      to_account = props.contactDetail?.data?.id;
      finance_type = "1";
    } else {
      from_account = props.contactDetail?.data?.id;
      to_account = selAccount.id;
      finance_type = "0";
    }

    calvalue &&
      mutation.mutate({
        date: date,
        time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
        from_account,
        to_account,
        amount: calvalue,
        description: "",
        finance_type,
        asset_master_id: 0,
        is_asset: false,
        is_reminder: false,
        reminder_date: new Date().toISOString().substr(0, 10),
      });

    (props.edit && calvalue) && updateTransaction.mutate({
      id: props.transData.id,
      date: date,
      time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
      from_account,
      to_account,
      amount: calvalue,
      description: "",
      finance_type,
      asset_master_id: 0,
      is_asset: false,
      is_reminder: false,
      reminder_date: new Date().toISOString().substr(0, 10),
    })
  };

  useQuery(
    "contact-detail-transaction",
    () => {
      return detailFinance({
        id: props.transData.id,
      });
    },
    {
      enabled: props.edit,
      onSuccess: (data) => {
        if (data.StatusCode === 6000) {
          // setSubmitData({
          //   ...submitData,
          //   description: data.data.description,
          //   is_interest: data.data.is_interest,
          //   is_zakath: data.data.is_zakath,
          //   // reminder_date: data.datat.is_reminder
          // })

          setCalvalue(parseFloat(data.data.amount).toFixed(2));
          setPayloadID({
            accountId: data.data.from_account,
            contactId: data.data.to_account,
          });
          setDate(data.date);
          if (data.data.finance_type === "1") {
            setSelAccount({ ...selAccount, id: data.data.from_account.id });
            setbutton({
              account: true,
              contact: false,
              from: true,
              to: false,
            });
          } else {
            setSelAccount({ ...selAccount, id: data.data.to_account.id });
            setbutton({
              account: false,
              contact: true,
              from: true,
              to: false,
            });
          }
          // setSelAccount()
        }
      },
    }
  );

  // useEffect(() => {
  //   setCalvalue(props.transData.amount)
  //   if (props.edit && props.transData) {
  //     console.log(props.transData.amount);
  //   }
  // }, [props.transData])
  // console.log(props, "inside the modal");

  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <div>
        <div className="py-[15px] px-3 bg-[#F6F6F6] rounded-t-[22px]">
          {/* <p className="text-[#6E88A6] font-[400] text-[19px] text-right">
            1+3.5+5
          </p> */}
          <TextFieldCalculator setCalvalue={setCalvalue} />
          <p className="text-[27px] font-[500] text-right">
            {calvalue || "0.00"}
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
          <SearchField />
          <div className="grid grid-cols-2 gap-x-3 my-3">
            <ToggleButton
              mbgcolor={button.account ? "#7F52E8" : "#F8F5FF"}
              mcolor={button.account ? "#FFFFFF" : "#7F52E8"}
              onClick={(e) => onButtonClick(e, "account")}
            >
              Accounts
            </ToggleButton>
            <ToggleButton
              // mbgcolor={button.contact ? "#F8F5FF" : "#7F52E8"}
              // mcolor  ={button.contact ? "#7F52E8" : "#FFFFFF"}
              mbgcolor={button.contact ? "#7F52E8" : "#F8F5FF"}
              mcolor={button.contact ? "#FFFFFF" : "#7F52E8"}
              onClick={(e) => onButtonClick(e, "contact")}
            >
              Contact
            </ToggleButton>
          </div>
          <div className="max-h-[244px] overflow-y-auto w-[475px]">
          <div className=" grid grid-cols-4 grid-rows-2 gap-2 ">
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
                <p className=" text-[#15960A] text-[10px] font-[400]">
                  {userData.country_details.currency_simbol}{" "}
                  {parseFloat(props.contactDetail?.data?.balance).toFixed(2)}
                </p>
              </div>
            ) : (
              <>
                {!isLoading &&
                  data.data.map((data, key) => (
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
                          {/* <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div> */}
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
                            {userData.country_details.currency_simbol}
                            {"  "} {AmountFormater(data.balance)}
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
                            {userData.country_details.currency_simbol}{" "}
                            {data.balance}
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

        {/* <div className="flex justify-between">
          <StyledButton
            onClick={() =>
              setSubmitData({
                ...submitData,
                is_interest: !submitData.is_interest,
                is_zakath: false,
              })
            }
            startIcon={
              <img
                style={{ opacity: submitData.is_interest ? "1" : "0.5" }}
                src={Icone.CheckFillIcon}
                alt=""
              />
            }
          >
            Use Interest
          </StyledButton>
          <StyledButton
            onClick={() => 
              setSubmitData({
                ...submitData,
                is_zakath: !submitData.is_zakath  , 
                is_interest: false ,
              })
            }
            startIcon={
              <img
                style={{ opacity: submitData.is_zakath ? "1" : "0.5" }}
                src={Icone.CheckFillIcon}
                alt=""
              />
            }
          >
            Use Zakah
          </StyledButton>
        </div> */}

        <div className="flex justify-between items-center p-1 border-t-2">
          <IconButton onClick={() => props.handleClose()}>
            <img src={Icone.ClipIcon} alt="" />
          </IconButton>
          <div className="flex items-center">
            {/* <p className="text-[16px] font-[500]">SBI</p>
            <span className="text-[18px] font-[500] mx-2">{">"}</span> */}
            <p className="text-[16px] font-[500]">
              {selAccount.account_name || payloadID.accountId.account_name}
            </p>
          </div>
          <IconButton disabled={!calvalue} onClick={submitTransaction}>
            <img src={Icone.CheckIcon} alt="" />
          </IconButton>
        </div>

        {/* <div className="h-5"></div> */}
      </div>
    </ZincoModal>
  );
};

export default AddTransactionsModal;

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

// const AddNoteModal
