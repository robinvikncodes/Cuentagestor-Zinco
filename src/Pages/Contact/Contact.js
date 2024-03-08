import styled from "@emotion/styled";
import { Button, IconButton, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Icone } from "../../Assets/AssetsLog";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddButton from "../../Components/Component/AddButton";
import SearchField from "../../Components/Component/SearchField";
import AddTransactionsModal from "./Components/AddTransactionsModal";
import AddContactModal from "./Components/AddContactModal";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import {
  deleteContact,
  detailsContact,
  listContact,
} from "../../Api/Contact/ContactApi";
import { BaseUrl } from "../../globalVariable";
import {
  deleteTransaction,
  listAccountFinance,
} from "../../Api/Finance/FinanceApi";
import { openSnackbar } from "../../features/snackbar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AmountFormater } from "../../globalFunctions";
import NewEntry from "../../Components/Component/NewEntry";
import ExportBtn from "../../Components/Component/ExportBtn";
import ZincoDeleteIcon from "../../Components/Component/ZincoDeleteIcon";
import ZincoEditIcon from "../../Components/Component/ZincoEditIcon";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const Contact = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("id");
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const userRollReducer = useSelector((state) => state.userRole.state);
  const [openTransactions, setOpenTransactions] = useState(false);
  const [openContact, setOpenContact] = useState(false);
  const [enabled, setenabled] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditTrans, setIsEditTrans] = useState(false);
  const [transData, setTransData] = useState({});
  const [filterDate, setFilterDate] = useState({
    from_date: "",
    to_date: "",
  });

  const handleOpenTransactions = () => setOpenTransactions(true);
  const handleCloseTransactions = () => {
    setOpenTransactions(false);
    setIsEditTrans(false);
    // queryClient.invalidateQueries({  predicate: (query) => { ["contact_account_transaction", "contact-detail-transaction"]).includes(query.queryKey[0])},})
    // queryClient.invalidateQueries({
    //   predicate: (query) => {
    //     return ['contact_account_transaction', 'finance_account_details'].includes(query.queryKey[0]);
    //   },
    // })
    queryClient.invalidateQueries(["contact_account_transaction"]);
    queryClient.invalidateQueries(["contact-list"]);
    queryClient.invalidateQueries(["finance_account_details"]);
  };

  const handleOpenContact = () => setOpenContact(true);
  const handleCloseContact = () => {
    setOpenContact(false);
    setIsEdit(false);
  };

  const {
    isLoading: isLoadingList,
    error: errorList,
    data: dataList,
  } = useQuery("contact-list", () => {
    return listContact();
  });

  // const {
  //   mutate: mutateContact,
  //   isLoading: isLoadingContact,
  //   data: dataContact,
  // } = useMutation(detailsContact, {
  //   onSuccess: (data) => {
  //     setenabled(true);
  //     console.log(data);
  //   },
  //   onError: () => {
  //     setenabled(false);
  //   },
  //   // onSettled: () => {
  //   //   QueryClient.invalidateQueries('create');
  //   // }
  // });

  // const contactTransaction = useMutation({
  //   mutationFn: (newData) => listAccountFinance(newData),
  // });

  const { isLoading: isLoadingContact, data: dataContact } = useQuery(
    ["finance_account_details", paramValue],
    () => {
      return detailsContact({
        id: paramValue,
      });
    },
    {
      enabled: !!paramValue,
      onSuccess: (data) => {
        if (data.StatusCode === 6000) {
          // setAccountSummary(data.summary)
          setenabled(true);
        } else {
          navigate("/contact")
        }
      },
    }
  );

  const contactTransaction = useQuery(
    ["contact_account_transaction", paramValue],
    () => {
      return listAccountFinance({
        account_id: paramValue,
        finance_type: 1,
        is_contact: true,
        from_date: filterDate.from_date,
        to_date: filterDate.to_date,
      });
    },
    {
      enabled: !!paramValue,
      onSuccess: (data) => {
        if (data.StatusCode === 6000) {
          // setAccountSummary(data.summary)
          setenabled(true);
        }
      },
    }
  );

  const deleteAccount = useMutation({
    mutationFn: (newData) => deleteContact(newData),
    onSuccess: (data) => {
      if (data.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.data,
            severity: "success",
          })
        );
        queryClient.invalidateQueries("contact-list");
        setenabled(false);
        navigate("/contact");
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: data.errors,
            severity: "error",
          })
        );
      }
    },
  });

  const deleteTsaction = useMutation({
    mutationFn: (newData) => deleteTransaction({ ...newData }),
    onSuccess: (data) => {
      if (data.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.data,
            severity: "success",
          })
        );
        queryClient.invalidateQueries("contact_account_transaction");
        // setenabled(false);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: data.errors,
            severity: "error",
          })
        );
      }
    },
  });

  const updateContact = useMutation({
    mutationFn: (newData) => updateContact(newData),
    onSuccess: (data) => {
      if (data.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.data,
            severity: "success",
          })
        );
        queryClient.invalidateQueries("contact-list");
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: "some error occured",
            severity: "error",
          })
        );
      }
    },
  });

  const deleteContactFun = function () {
    deleteAccount.mutate({ id: dataContact.data.id });
  };

  const editContact = function () {
    // queryClient.invalidateQueries(['account-list'])
    // queryClient.invalidateQueries({
    //   predicate: (query) => {
    //     return ['contact_account_transaction', 'account-list', ].includes(query.queryKey[0]);
    //   },
    // })
    setIsEdit(true);
    handleOpenContact();
  };

  const editTransition = function (data) {
    console.log(data);
    setTransData(data);
    handleOpenTransactions();
    setIsEditTrans(true);
  };

  const deleteTransation = function (id) {
    console.log(id);
    deleteTsaction.mutate({ id });
  };

  const onSubmit = (id) => {
    navigate("/contact?id=" + id);
    setenabled(true);
  };

  useEffect(() => {
    // console.log(filterDate);
    if (filterDate.from_date && filterDate.to_date) {
      // refetchTransactions()
      contactTransaction.refetch();
    }
  }, [filterDate]);

  return (
    <>
      <div className="flex h-[90%]">
        <div className="LeftContainer w-[28%] min-w-[399px] pl-[14px]">
          <div className="h-full w-full rounded-[15px] border-[1px] border-[#E7E7E7] bg-white p-[16px]">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] mr-[10px]">
                  <img src={Icone.PersonalcardIcon} alt="" />
                </div>
                <p className="text-[16px] font-[400]">Contacts</p>
              </div>

              <AddButton name="contact" onClick={() => handleOpenContact()} />
            </div>

            <div className="grid grid-cols-2 gap-x-2 mb-[10px]">
              <div className=" bg-white rounded-[9px] border-[1px] border-[#E4E4E4] px-[16px] py-[14px]">
                <div className="flex items-center">
                  <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] mr-[10px] mb-[11px] inline-block">
                    <img src={Icone.DownloadIcon} alt="" className="" />
                  </div>
                  <p className="text-[16px] font-[400] mb-[7px]">Receive</p>
                </div>

                <p className="text-[16px] font-[400] text-[#9B9B9B]">
                  {userData.country_details.currency_simbol}
                  {"  "}
                </p>
                <p className="text-[17px] font-[500] ">
                  {!isLoadingList ? (
                    AmountFormater(dataList?.total_recievable)
                  ) : (
                    <Skeleton variant="text" />
                  )}
                </p>
              </div>

              <div className=" bg-white rounded-[9px] border-[1px] border-[#E4E4E4] px-[16px] py-[14px]">
                <div className="flex items-center">
                  <div className="bg-[#FFE9E9] p-[10px] rounded-[13px] mr-[10px] mb-[11px] inline-block">
                    <img src={Icone.UploadIcon} alt="" className="" />
                  </div>
                  <p className="text-[16px] font-[400] mb-[7px]">Payables</p>
                </div>
                <p className="text-[16px] font-[400] text-[#9B9B9B]">
                  {userData.country_details.currency_simbol}
                  {"  "}
                </p>
                <p className="text-[17px] font-[500] ">
                  {!isLoadingList ? (
                    AmountFormater(dataList?.total_payable)
                  ) : (
                    <Skeleton variant="text" />
                  )}
                </p>
              </div>
            </div>

            <SearchField placeholder={"search"} width={"100%"} />

            <div className="h-[63%] overflow-y-scroll">
              <div className="grid mt-3 grid-cols-3 grid-rows-3 gap-3 ">
                {!isLoadingList &&
                  dataList.data.map((data, key) => (
                    <div
                      key={key + 1}
                      className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] py-[15px] "
                      onClick={() => onSubmit(data.id)}
                    >
                      <p className="text-[10px] font-[400]">
                        {data.account_name}
                      </p>
                      {data.photo ? (
                        <div className="bg-[#E2EFFF] p-[10px] rounded-full my-[10px] inline-block w-[52px] h-[52px] ">
                          <img src={BaseUrl + data.photo} alt="" className="" />
                        </div>
                      ) : (
                        <div className=" flex items-center justify-center my-[10px] w-[52px] h-[52px] ">
                          <img
                            src={Icone.PersonalcardIcon}
                            alt=""
                            className=" w-[32px] h-[32px]"
                          />{" "}
                        </div>
                      )}
                      <p
                        className={`${
                          data.total_paid > data.total_received
                            ? "text-[#CD0A0A]"
                            : "text-[#15960A]"
                        } text-[#15960A] text-[10px] font-[400]`}
                      >
                        {userData.country_details.currency_simbol}
                        {"  "}{" "}
                        {AmountFormater(
                          data.total_paid > data.total_received
                            ? data.total_paid - data.total_received
                            : data.total_received - data.total_paid
                        )}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="RightContainer w-[72%]">
          {enabled ? (
            <>
              <div className="flex justify-between items-center px-5 pb-5 border-b-[1px] border-[#DEDEDE]">
                <div className="flex items-center">
                  <div className="flex w-[44px] h-[44px] rounded-full mr-[10px]">
                    {!isLoadingContact ? (
                      <img src={BaseUrl + dataContact?.data?.photo} alt="" />
                    ) : (
                      <Skeleton variant="circular" width={44} height={44} />
                    )}
                  </div>
                  <p className="text-[20px] font-[400]">
                    {!isLoadingContact ? (
                      dataContact?.data?.account_name
                    ) : (
                      <Skeleton fontSize={"14px"} variant="text" width={150} />
                    )}
                  </p>
                </div>
                <div className="flex">
                  <ZincoEditIcon
                    name="contact"
                    aria-label="delete"
                    color="error"
                    sx={{ color: "#3634A8" }}
                    onClick={() => editContact()}
                  />
                  {/* <EditIcon />
                  </IconButton> */}
                  <ZincoDeleteIcon
                    name="contact"
                    aria-label="delete"
                    color="error"
                    sx={{ color: "#3634A8" }}
                    onClick={() => deleteContactFun()}
                  />
                  {/* <DeleteIcon />
                  </ZincoDeleteIcon> */}
                </div>
              </div>

              <div className=" flex px-[20px]">
                <div className="w-[35%] bg-white rounded-[9px] border-[#E4E4E4] border-[1px] flex justify-between items-center px-[16px] py-[13px] my-3 mr-2">
                  <div className="flex justify-center items-center">
                    <div className="bg-[#E8F0FF] p-[10px] rounded-[13px] mr-[10px]">
                      <img src={Icone.PhoneCallIcon} alt="" />
                    </div>
                    <div>
                      <p className="text-[#707070] font-[400] text-[13px]">
                        Phone No
                      </p>
                      {isLoadingContact ? (
                        <Skeleton
                          fontSize={"14px"}
                          variant="text"
                          width={150}
                        />
                      ) : (
                        <p className="text-black font-[500] text-[14px]">
                          {dataContact?.data?.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-[65%] grid grid-cols-3 gap-x-[20px] bg-white rounded-[9px] border-[#E4E4E4] border-[1px] px-[16px] py-[13px] my-3">
                  <div>
                    <p className="text-[#9B9B9B] text-[13px] font-[400]">
                      Total Received
                    </p>
                    <p className="text-[14px] font-[500]">
                      {contactTransaction.isLoading ? (
                        <Skeleton variant="text" fontSize={"14px"} />
                      ) : (
                        <>
                          <span className=" text-[14px] font-[500]">
                            {userData?.country_details?.currency_simbol}
                          </span>
                          .
                          {AmountFormater(
                            contactTransaction?.data?.contact_summary
                              .total_recieved
                          )}
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#9B9B9B] text-[13px] font-[400]">
                      Total Paid
                    </p>
                    <p className="text-[14px] font-[500]">
                      {contactTransaction.isLoading ? (
                        <Skeleton variant="text" fontSize={"14px"} />
                      ) : (
                        <>
                          <span className=" text-[14px] font-[500]">
                            {userData?.country_details?.currency_simbol}
                          </span>
                          .
                          {AmountFormater(
                            contactTransaction?.data.contact_summary?.total_paid
                          )}
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`${
                        contactTransaction?.data?.contact_summary.total_paid >
                        contactTransaction?.data?.contact_summary.total_recieved
                          ? "text-[#15960A]"
                          : "text-[#CD0A0A]"
                      } text-[13px] font-[400]`}
                    >
                      {contactTransaction?.data?.contact_summary.total_paid >
                      contactTransaction?.data?.contact_summary.total_recieved
                        ? "Receivable"
                        : "Payable"}
                    </p>
                    <p
                      className={`${
                        contactTransaction?.data?.contact_summary
                          .total_recieved <
                        contactTransaction?.data?.contact_summary.total_paid
                          ? "text-[#15960A]"
                          : "text-[#CD0A0A]"
                      } text-[14px] font-[500] `}
                    >
                      {isLoadingContact ? (
                        <Skeleton variant="text" fontSize={"14px"} />
                      ) : (
                        <>
                          <span
                            className={`${
                              contactTransaction?.data?.contact_summary
                                .total_recieved <
                              contactTransaction?.data?.contact_summary
                                .total_paid
                                ? "text-[#15960A]"
                                : "text-[#CD0A0A]"
                            } text-[14px] font-[500]`}
                          >
                            {userData.country_details.currency_simbol}
                            {"  "} .
                          </span>{" "}
                          {AmountFormater(
                            contactTransaction?.data?.contact_summary
                              .total_recieved >
                              contactTransaction?.data?.contact_summary
                                .total_paid
                              ? contactTransaction?.data?.contact_summary
                                  .total_recieved -
                                  contactTransaction?.data?.contact_summary
                                    .total_paid
                              : dataContact.data.balance
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center px-5 pb-5 border-b-[1px] border-[#DEDEDE]">
                <div className="flex items-center">
                  <p className="text-[16px] font-[400]">Transactions</p>
                  <NewEntry
                    from_date={filterDate.from_date}
                    to_date={filterDate.to_date}
                    set_filterDate={setFilterDate}
                  />
                </div>
                <div className="flex items-center">
                  {/* <p className="mr-[15px] text-[#868686] text-[13px] font-[400]">User role</p> */}

                  <ExportBtn
                    JSONData={contactTransaction?.data?.data}
                    filename={dataContact?.data?.account_name}
                  />
                  {(
                    <StyledButton
                      disabled={!userRollReducer.contact.save_permission}
                      onClick={() => handleOpenTransactions()}
                      startIcon={<AddRoundedIcon />}
                    >
                      Transactions
                    </StyledButton>
                  )}
                </div>
              </div>

              <div className="p-[20px]">
                <div className="h-[59vh] overflow-y-scroll">
                  {!contactTransaction.isLoading &&
                    contactTransaction.data.data.map((obj, key) => (
                      <div key={key + 1}>
                        <div className="flex items-center mb-5">
                          <div className="p-[10px] bg-[#F1FFF0] mr-3 rounded-[13px]">
                            <img src={Icone.CalenderIcon} alt="" />
                          </div>
                          <p className="text-[16px] font-[400]">
                            {/* 15 September 2023 */}
                            {obj.date}
                          </p>
                        </div>

                        {obj.data.map((data, key) => (
                          <div
                            key={key + 1}
                            className="borderStyle p-[15px] rounded-[13px] flex justify-between items-center mb-2"
                            style={{
                              cursor:
                                data.from_account_type !== 5 &&
                                data.to_account_type !== 5 &&
                                userRollReducer.contact.edit_permission &&
                                "pointer",
                            }}
                          >
                            <div
                              className="flex justify-between w-[100%] "
                              onClick={() =>
                                data.from_account_type !== 5 &&
                                data.to_account_type !== 5 &&
                                userRollReducer.contact.edit_permission &&
                                editTransition(data)
                              }
                            >
                              <div className="flex items-center">
                                {data.from_account_name ===
                                dataContact?.data.account_name ? (
                                  <>
                                    <div className="flex justify-center items-center">
                                      {dataContact?.data.photo ? (
                                        <div className="flex w-[44px] h-[44px] rounded-full mr-[10px]">
                                          <img
                                            src={
                                              BaseUrl + dataContact?.data.photo
                                            }
                                            alt=""
                                          />
                                        </div>
                                      ) : (
                                        <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] mr-[10px]">
                                          <img
                                            src={Icone.PersonalcardIcon}
                                            alt=""
                                          />
                                        </div>
                                      )}
                                      <p className="text-black font-[400] text-[16px]">
                                        {data.from_account_name}
                                      </p>
                                    </div>

                                    <p className="mx-[28px] text-[16px] font-[600] text-[#7F52E8]">
                                      -
                                    </p>

                                    <div className="flex justify-center items-center">
                                      {data.to_account_type === 2 && (
                                        <div className="bg-[#E8F0FF] p-[10px] rounded-[13px] mr-[10px]">
                                          <img src={Icone.BankIcon} alt="" />
                                        </div>
                                      )}
                                      {data.to_account_type === 1 && (
                                        <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] mr-[10px]">
                                          <img
                                            src={Icone.WalletGreenIcon}
                                            alt=""
                                            className=""
                                          />
                                        </div>
                                      )}
                                      <p className="text-black font-[400] text-[16px]">
                                        {data.to_account_name}
                                      </p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex justify-center items-center">
                                      {data.from_account_type === 2 && (
                                        <div className="bg-[#E8F0FF] p-[10px] rounded-[13px] mr-[10px]">
                                          <img src={Icone.BankIcon} alt="" />
                                        </div>
                                      )}{" "}
                                      {data.from_account_type === 1 && (
                                        <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] mr-[10px]">
                                          <img
                                            src={Icone.WalletGreenIcon}
                                            alt=""
                                            className=""
                                          />
                                        </div>
                                      )}
                                      <p className="text-black font-[400] text-[16px]">
                                        {data.from_account_name}
                                      </p>
                                    </div>

                                    <p className="mx-[28px] text-[16px] font-[600] text-[#7F52E8]">
                                      -
                                    </p>

                                    <div className="flex justify-center items-center">
                                      {dataContact?.data.photo ? (
                                        <div className="flex w-[44px] h-[44px] rounded-full mr-[10px]">
                                          <img
                                            src={
                                              BaseUrl + dataContact?.data.photo
                                            }
                                            alt=""
                                          />
                                        </div>
                                      ) : (
                                        <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] mr-[10px]">
                                          <img
                                            src={Icone.PersonalcardIcon}
                                            alt=""
                                          />
                                        </div>
                                      )}
                                      <p className="text-black font-[400] text-[16px]">
                                        {data.to_account_name}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>

                              <div className="mr-3">
                                {data.from_account_type > 0 ? (
                                  <p className="text-[19px] font-[500] text-[#C90101] text-right">
                                    <span className="text-[#9B9B9B] text-[16px] font-[400] text-right">
                                      {userData.country_details.currency_simbol}
                                    </span>{" "}
                                    {AmountFormater(data.amount)}
                                  </p>
                                ) : (
                                  <p className="text-[19px] font-[500] text-[#15960A] text-right">
                                    <span className="text-[#9B9B9B] text-[16px] font-[400] text-right">
                                      {userData.country_details.currency_simbol}
                                    </span>{" "}
                                    {AmountFormater(data.amount)}
                                  </p>
                                )}
                                <p className="text-[#9B9B9B] text-[13px] font-[400] text-right">
                                  {data.description ? data.description : "Note"}
                                </p>
                              </div>
                            </div>
                            {data.from_account_type !== 5 &&
                              data.to_account_type !== 5 && (
                                <div>
                                  <ZincoDeleteIcon
                                    aria-label="delete"
                                    color="error"
                                    size="small"
                                    sx={{
                                      color: "white",
                                      fontSize: "10px",
                                      bgcolor: "#CD0A0A",
                                      "&:hover": {
                                        bgcolor: "#CD0A0A",
                                      },
                                    }}
                                    name="contact"
                                    onClick={() => deleteTransation(data.id)}
                                  />
                                    {/* <DeleteIcon sx={{ fontSize: "18px" }} />
                                  </ZincoDeleteIcon> */}

                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center px-5 pb-5 border-b-[1px] border-[#DEDEDE]">
              <div className="flex items-center">
                <div className="flex w-[44px] h-[44px] rounded-full mr-[10px]">
                  {/* <img src="" alt="" /> */}
                </div>
                <p className="text-[20px] font-[400]">Select Contact</p>
              </div>
              <div className="flex">
                {/* <IconButton
                  aria-label="delete"
                  color="error"
                  sx={{ color: "#3634A8" }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  color="error"
                  sx={{ color: "#3634A8" }}
                >
                  <DeleteIcon />
                </IconButton> */}
              </div>
            </div>
          )}
        </div>
      </div>
      {openContact && (
        <AddContactModal
          open={openContact}
          handleClose={handleCloseContact}
          edit={isEdit}
          contactData={dataContact?.data}
        />
      )}
      {openTransactions && (
        <AddTransactionsModal
          open={openTransactions}
          handleClose={handleCloseTransactions}
          edit={isEditTrans}
          contactDetail={dataContact}
          transData={transData}
        />
      )}
    </>
  );
};

export default Contact;

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
