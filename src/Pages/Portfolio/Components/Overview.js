import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { Icone } from "../../../Assets/AssetsLog";
import { IconButton, Snackbar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddButton from "../../../Components/Component/AddButton";
import { BaseUrl } from "../../../globalVariable";
import StockAdd from "./Modals/StockAdd";
import PropertyAdd from "./Modals/PropertyAdd";
import {
  addDocument,
  deleteDocument,
  deleteProperty,
  deleteStock,
} from "../../../Api/Assets/AssetsApi";
import { openSnackbar } from "../../../features/snackbar";
import { Doughnut } from "react-chartjs-2";
import AssetGraph from "./AssetGraph";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const Overview = (props) => {
  const [boolean, setBoolean] = useState(true);

  // props.assetData(data => {
  // })
  console.log(props.assetData);
  return (
    <div>
      <div className="flex justify-between items-center px-5 pb-2 border-b-[1px] border-[#DEDEDE]">
        <div className="flex items-center">
          {!boolean && (
            <IconButton
              aria-label="delete"
              color="error"
              sx={{ color: "#3634A8" }}
              onClick={() => setBoolean(true)}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <p className="text-[20px] font-[400]">
            {props.assetDetail?.data?.asset_name}
          </p>
        </div>
        <div className="flex">
          <IconButton
            aria-label="delete"
            color="error"
            sx={{ color: "#3634A8" }}
            onClick={() => props.editFun()}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            color="error"
            sx={{ color: "#3634A8" }}
            onClick={() => props.deletFun()}
          >
            <DeleteIcon />
          </IconButton>
          {boolean && (
            <IconButton
              aria-label="delete"
              color="error"
              sx={{ color: "#3634A8" }}
              onClick={() => setBoolean(false)}
            >
              <InfoIcon />
            </IconButton>
          )}
        </div>
      </div>

      {boolean
        ? !props.assetLoading && (
            <ManinOverview
              assetData={props.assetData}
              assetDetail={props.assetDetail.data}
            />
          )
        : !props.assetDetailLoading && (
            <InfoOverview assetDetail={props.assetDetail} />
          )}
    </div>
  );
};


const ManinOverview = function (props) {
  console.log(props.assetDetail);
  return (
    <>
      <div className=" grid grid-cols-3 px-[20px] gap-x-2 mb-5 mt-[10px]">
        <div className="w-full bg-white rounded-[9px] border-[#E4E4E4] border-[1px] flex justify-between items-center p-[16px] ">
          <div className="flex justify-center items-center">
            <div>
              <p className="text-[#8E8E8E] text-[12px] font-[400]">Share%</p>
              <p className="text-black font-[400] text-[16px]">
                {props.assetDetail?.asset_details &&
                props.assetDetail?.asset_details?.length < 1
                  ? parseFloat(
                      props.assetDetail.asset_details[0].share
                    ).toFixed(2) + "  "
                  : parseFloat(props.assetData?.summary?.total_share).toFixed(
                      2
                    ) + "  "}
                %
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <p className="text-[#9B9B9B] text-[16px] font-[400] mr-1">
              {userData.country_details.currency_simbol}
              {"  "}
            </p>
            <p className="text-[19px] font-[500]">
              {props.assetDetail?.data?.asset_details?.length > 1 || true
                ? parseFloat(props.assetData?.summary?.total_value).toFixed(2) +
                  "  "
                : parseFloat(props.assetDetail?.asset_details[0].value).toFixed(
                    2
                  ) + "  "}
            </p>
          </div>
        </div>

        <div className="w-full bg-white rounded-[9px] border-[#E4E4E4] border-[1px] flex justify-between items-center p-[16px] ">
          <div className="flex justify-center items-center">
            <div className="bg-[#E8F0FF] p-[10px] rounded-[13px] mr-[10px]">
              <img src={Icone.MoneyBagIcon} alt="" />
            </div>
            <div>
              <p className="text-[#8E8E8E] text-[12px] font-[400]">Total</p>
              <p className="text-black font-[400] text-[16px]">Income</p>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <p className="text-[#9B9B9B] text-[16px] font-[400] mr-1">
              {userData.country_details.currency_simbol}
              {"  "}
            </p>
            <p className="text-[19px] font-[500]">
              {props.assetData?.summary?.total_income}
            </p>
          </div>
        </div>

        <div className="w-full bg-white rounded-[9px] border-[#E4E4E4] border-[1px] flex justify-between items-center p-[16px] ">
          <div className="flex justify-center items-center">
            <div className="bg-[#FFE9E9] p-[10px] rounded-[13px] mr-[10px]">
              <img src={Icone.WalletRedIcon} alt="" />
            </div>
            <div>
              <p className="text-[#8E8E8E] text-[12px] font-[400]">Total</p>
              <p className="text-black font-[400] text-[16px]">Expenses</p>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <p className="text-[#9B9B9B] text-[16px] font-[400] mr-1">
              {userData.country_details.currency_simbol}
              {"  "}
            </p>
            <p className="text-[19px] font-[500]">
              {props.assetData?.summary?.total_expense}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[9px] border-[#E4E4E4] border-[1px] mx-[20px] px-[16px] py-[13px] mb-4">
        <AssetGraph assetData={props.assetData} />
      </div>

      <div className=" mx-[20px] px-[16px] pt-[13px] mb-4">
        <div className="flex items-center mb-5">
          <div className="bg-[#FFEBF0] p-[10px] rounded-[13px] mr-[10px]">
            <img src={Icone.WalletAdd2Icon} alt="" />
          </div>
          <p className="text-[16px] font-[400]">Expenses</p>
        </div>
        <div className="grid grid-cols-8 gap-x-2">
          {props.assetData?.expense_account_list?.map((data, key) => (
            <div
              key={key + 1}
              className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px]"
            >
              {/* <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div> */}
              <p className=" text-[10px] font-[400]">{data.account_name}</p>
              <div className="bg-[#F54040] p-[10px] rounded-[13px] my-[10px] inline-block">
                <img src={Icone.WalletAdd1Icon} alt="" className="" />
              </div>
              <p className=" text-[10px] font-[400]">
                {userData.country_details.currency_simbol}
                {"  "} {data.balance}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className=" mx-[20px] px-[16px] pt-[13px] mb-4">
        <div className="flex items-center mb-5">
          <div className="bg-[#E0FFF6] p-[10px] rounded-[13px] mr-[10px]">
            <img src={Icone.WalletAddIcon} alt="" />
          </div>
          <p className="text-[16px] font-[400]">Incomes</p>
        </div>
        <div className="grid grid-cols-8 gap-x-2">
          {props.assetData?.income_account_list?.map((data, key) => (
            <div
              key={key + 1}
              className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px]"
            >
              {/* <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div> */}
              <p className=" text-[10px] font-[400]">{data.account_name}</p>
              <div className="bg-[#0FD28C] p-[10px] rounded-[13px] my-[10px] inline-block">
                <img src={Icone.WalletAdd3Icon} alt="" className="" />
              </div>
              <p className=" text-[10px] font-[400]">{data.balance}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const InfoOverview = function ({ assetDetail }) {
  console.log(assetDetail);
  let file;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [openStock, setOpenStock] = useState(false);
  const [editStock, setEditStock] = useState(false);
  const [openProperty, setOpenProperty] = useState(false);
  const [addressDetail, setAddressDetail] = useState([]);
  const [selectStockData, setSelectStockData] = useState({});

  const handleCloseStock = () => {
    setOpenStock(false);
    queryClient.invalidateQueries(["show_Asset_data", assetDetail.data.id]);
  };
  const handleCloseProperty = () => {
    setOpenProperty(false);
    queryClient.invalidateQueries(["show_Asset_data", assetDetail.data.id]);
  };
  const addFile = () => {
    const input = document.getElementById("fileInput");
    input.click();
  };

  const handleFileChange = function (e) {
    file = e.target.files[0];
    if (file) {
      let payload = {
        documents: file,
        asset_master_id: assetDetail.data.id,
      };

      fileUpload.mutate(payload);
    }
  };

  const handleEditstock = function (i) {
    // Snackbar(open, handleCloseSnack)
    setSelectStockData(i);
    setEditStock(true);
    setOpenStock(true);
  };
  const handleDeleteStock = function (id) {
    stockDeleteMutate.mutate({ asset_detail_id: id });
  };

  const handleDeleteProperty = function (id) {
    propertyDeleteMutate.mutate({ property_id: id });
  };

  const documentDeleteProperty = function (id) {
    documentDeleteMutate.mutate({ document_id: id });
  };

  const fileUpload = useMutation({
    mutationFn: (newData) => addDocument(newData),
    onSuccess: (data) => {
      if (data.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "success",
          })
        );
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
    onError: (data) => {
      console.log(data);
      dispatch(
        openSnackbar({
          open: true,
          message: "Some error occure in API",
          severity: "error",
        })
      );
    },
  });

  const stockDeleteMutate = useMutation({
    mutationFn: (newData) => deleteStock(newData),
    onSuccess: (data) => {
      if (data.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "success",
          })
        );
        queryClient.invalidateQueries(["show_Asset_data", assetDetail.data.id]);
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

  const propertyDeleteMutate = useMutation({
    mutationFn: (newData) => deleteProperty(newData),
    onSuccess: (data) => {
      if (data.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "success",
          })
        );
        queryClient.invalidateQueries(["show_Asset_data", assetDetail.data.id]);
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

  const documentDeleteMutate = useMutation({
    mutationFn: (newData) => deleteDocument(newData),
    onSuccess: (data) => {
      if (data.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "success",
          })
        );
        queryClient.invalidateQueries(["show_Asset_data", assetDetail.data.id]);
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

  useEffect(() => {
    assetDetail.data.address.map((data, key) =>
      setAddressDetail([
        {
          building_name: data.building_name,
          land_mark: data.land_mark,
          address_name: data.address_name,
          state: data.state,
          country: data.country,
          pin_code: data.pin_code,
        },
        ...addressDetail,
      ])
    );
  }, []);

  return (
    <>
      <div className="h-[76vh] overflow-y-scroll">
        <div className="grid grid-cols-7 gap-x-3 px-5 mt-4 mb-5">
          {/* <div className="h-[140px] bg-[#EAEAEA] rounded-lg "></div>
        <div className="h-[140px] bg-[#EAEAEA] rounded-lg "></div> */}
          {assetDetail.data?.images?.map((data, key) => (
            <img
              key={data.id}
              src={BaseUrl + data.image}
              alt="assetimage"
              className="h-[140px] bg-[#EAEAEA] rounded-lg "
            />
          ))}
        </div>

        {assetDetail.data.address === null ? (
          <div>
            <div className="bg-white px-9 py-4 border-[1px]">
              <p className="text-[16px] font-[500] ml-8 my-3">No Address</p>
            </div>
          </div>
        ) : (
          addressDetail.map((data, key) => (
            <div key={key + 1}>
              <p className="text-[16px] font-[500] ml-8 my-3">Address </p>
              <div
                className="bg-white px-9 py-4 border-[1px]"
                // onClick={() => setAddressDetail([{ ...addressDetail[key], name: false }, ...addressDetail])}
              >
                <p className="text-[13px] font-[400] text-[#7B849F]">
                  Building No/Name
                </p>
                <input
                  className="text-[16px] font-[400]"
                  type="text"
                  value={data.building_name}
                  onChange={(e) => {
                    const newAddressDetail = [...addressDetail];
                    newAddressDetail[key] = {
                      ...newAddressDetail[key],
                      building_name: e.target.value,
                    };
                    setAddressDetail(newAddressDetail);
                  }}
                  onBlur={() => {
                    console.log(addressDetail);
                  }}
                />
              </div>
              <div className="bg-white px-9 py-4 border-[1px]">
                <p className="text-[13px] font-[400] text-[#7B849F]">
                  Landmark
                </p>
                <input
                  className="text-[16px] font-[400]"
                  type="text"
                  value={data.land_mark}
                  onChange={(e) => {
                    const newAddressDetail = [...addressDetail];
                    newAddressDetail[key] = {
                      ...newAddressDetail[key],
                      building_name: e.target.value,
                    };
                    setAddressDetail(newAddressDetail);
                  }}
                  onBlur={() => {
                    console.log(addressDetail);
                  }}
                />
              </div>
              <div className="bg-white px-9 py-4 border-[1px]">
                <p className="text-[13px] font-[400] text-[#7B849F]">City</p>
                <input
                  className="text-[16px] font-[400]"
                  type="text"
                  value={data.address_name}
                  onChange={(e) => {
                    const newAddressDetail = [...addressDetail];
                    newAddressDetail[key] = {
                      ...newAddressDetail[key],
                      address_name: e.target.value,
                    };
                    setAddressDetail(newAddressDetail);
                  }}
                  onBlur={() => {
                    console.log(addressDetail);
                  }}
                />
              </div>
              <div className="bg-white px-9 py-4 border-[1px]">
                <p className="text-[13px] font-[400] text-[#7B849F]">
                  State/Province
                </p>
                <input
                  className="text-[16px] font-[400]"
                  type="text"
                  value={data.state}
                  onChange={(e) => {
                    const newAddressDetail = [...addressDetail];
                    newAddressDetail[key] = {
                      ...newAddressDetail[key],
                      state: e.target.value,
                    };
                    setAddressDetail(newAddressDetail);
                  }}
                  onBlur={() => {
                    console.log(addressDetail);
                  }}
                />
              </div>
              <div className="bg-white px-9 py-4 border-[1px]">
                <p className="text-[13px] font-[400] text-[#7B849F]">Country</p>
                <input
                  className="text-[16px] font-[400] bg-white"
                  type="text"
                  value={data?.country?.country_name}
                  disabled={true}
                  // onChange={(e) => {
                  //   const newAddressDetail = [...addressDetail];
                  //   newAddressDetail[key] = { ...newAddressDetail[key], country_name: e.target.value };
                  //   setAddressDetail(newAddressDetail);
                  // }}
                  // onBlur={() => {
                  //   console.log(addressDetail);
                  // }}
                />
              </div>
              <div className="bg-white px-9 py-4 border-[1px]">
                <p className="text-[13px] font-[400] text-[#7B849F]">
                  Postal code
                </p>
                <input
                  className="text-[16px] font-[400]"
                  type="number"
                  value={data.pin_code}
                  onChange={(e) => {
                    const newAddressDetail = [...addressDetail];
                    newAddressDetail[key] = {
                      ...newAddressDetail[key],
                      pin_code: e.target.value,
                    };
                    setAddressDetail(newAddressDetail);
                  }}
                  onBlur={() => {
                    console.log(addressDetail);
                  }}
                />
              </div>
            </div>
          ))
        )}

        <div>
          <div className="flex justify-between">
            <p className="text-[16px] font-[500] ml-8 my-3">Stock</p>
            <div>
              <AddButton
                addbgcolor={"#EEE"}
                onClick={() => setOpenStock(true)}
              />
            </div>
          </div>
          {assetDetail.data.asset_details === null ? (
            <div>
              <div
                // key={data.id}
                className="bg-white px-9 py-4 border-[1px] flex items-center"
              >
                <p className="w-5 h-5 mx-auto text-center">No Details</p>
              </div>
            </div>
          ) : (
            assetDetail.data.asset_details.map((data, i) => (
              <div
                key={data.id}
                className="bg-white px-9 py-4 border-[1px] flex items-center justify-between"
              >
                <div
                  className="flex"
                  style={{ cursor: i !== 0 ? "pointer" : "auto" }}
                  onClick={() => handleEditstock(data)}
                >
                  <div className="rounded-full bg-[#F3F7FC] p-2 mr-6 w-9 h-9">
                    <p className=" mx-auto text-center">{i + 1}</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-[400] text-[#7B849F]">
                      {data.as_on_date}
                      {/* 21 Feb 2023 */}
                    </p>
                    <div className="flex justify-between w-[350px]">
                      <p className="text-[15px] font-[400] ">
                        <span className="text-[#785ED7] text-[15px] font-[400] ">
                          Share :
                        </span>
                        {"  "}
                        {parseFloat(data.share).toFixed(2)} %
                      </p>
                      <p className="text-[15px] font-[400] ">
                        <span className="text-[#785ED7] text-[15px] font-[400] ">
                          Value :
                        </span>
                        {"  "}
                        {parseFloat(data.value).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {i !== 0 && (
                  <IconButton
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
                    onClick={() => handleDeleteStock(data.id)}
                  >
                    <DeleteIcon sx={{ fontSize: "18px" }} />
                  </IconButton>
                )}
              </div>
            ))
          )}
        </div>

        <div>
          <div className="flex justify-between">
            <p className="text-[16px] font-[500] ml-8 my-3">Properties</p>
            <div>
              <AddButton
                addbgcolor={"#EEE"}
                onClick={() => setOpenProperty(true)}
              />
            </div>
          </div>
          {assetDetail.data.custom_properties === null ? (
            <div>
              <div
                // key={data.id}
                className="bg-white px-9 py-4 border-[1px] flex items-center"
              >
                <p className="mx-auto text-center">No Properties</p>
              </div>
            </div>
          ) : (
            assetDetail.data.custom_properties.map((data) => (
              <div
                key={data.id}
                className="bg-white px-9 py-4 border-[1px] flex items-center justify-between"
              >
                <div className="flex justify-between w-[300px]">
                  <p className="text-[14px] font-[400] text-[#785ED7]">
                    {data.property_name}
                  </p>
                  <p className="text-[15px] font-[400] ">
                    {data.property_value}
                  </p>
                </div>

                <IconButton
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
                  onClick={() => handleDeleteProperty(data.id)}
                >
                  <DeleteIcon sx={{ fontSize: "18px" }} />
                </IconButton>
              </div>
            ))
          )}
        </div>

        <div>
          <div className="flex justify-between">
            <p className="text-[16px] font-[500] ml-8 my-3">Documents</p>
            <div>
              <AddButton addbgcolor={"#EEE"} onClick={addFile} />
              <input
                style={{ display: "none" }}
                accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                type="file"
                name="files"
                id="fileInput"
                onClick={handleFileChange}
              />
            </div>
          </div>
          {assetDetail.data.documents === null ? (
            <div>
              <div
                // key={data.id}
                className="bg-white px-9 py-4 border-[1px] flex items-center"
              >
                <p className="mx-auto text-center">No Documents</p>
              </div>
            </div>
          ) : (
            assetDetail.data.documents.map((data) => (
              <div
                key={data.id}
                className="bg-white px-9 py-4 border-[1px] flex items-center justify-between"
              >
                <p className="text-[15px] font-[400] ">
                  {data.file.split("/").pop()}
                </p>

                <IconButton
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
                  onClick={() => documentDeleteProperty(data.id)}
                >
                  <DeleteIcon sx={{ fontSize: "18px" }} />
                </IconButton>
              </div>
            ))
          )}
        </div>
      </div>
      {openStock && (
        <StockAdd
          edit={editStock}
          stockData={selectStockData}
          open={openStock}
          asset_id={assetDetail.data.id}
          handleClose={handleCloseStock}
        />
      )}
      {openProperty && (
        <PropertyAdd
          open={openProperty}
          account={assetDetail.data.id}
          handleClose={handleCloseProperty}
        />
      )}
    </>
  );
};

export default Overview;
