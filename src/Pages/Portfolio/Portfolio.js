import styled from "@emotion/styled";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { Icone, Images } from "../../Assets/AssetsLog";
import AddButton from "../../Components/Component/AddButton";
import SearchField from "../../Components/Component/SearchField";
import Overview from "./Components/Overview";
import Transactions from "./Components/Transactions";
import AddAssetsModal from "./Components/AddAssetsModal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteAssets,
  detailAssets,
  listAssets,
  viewAssets,
} from "../../Api/Assets/AssetsApi";
import { BaseUrl } from "../../globalVariable";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { openSnackbar } from "../../features/snackbar";
import { useDispatch, useSelector } from "react-redux";
import { AmountFormater } from "../../globalFunctions";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const Portfolio = () => {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("id");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRollReducer = useSelector((state) => state.userRole.state);

  const [boolean, setBoolean] = useState(true);
  const [edit, setEdit] = useState(false);
  const [isetPage, setIsetPage] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [assetDataState, setAssetDataState] = useState({});
  const [assetDetails, setAssetDetails] = useState({});
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEdit(false);
  };

  const { isLoading, error, data } = useQuery("assets-list", () => {
    return listAssets();
  });

  // const showAssetData = useMutation({
  //   mutationFn: (newTodo) => {
  //     return viewAssets({ ...newTodo });
  //   },
  //   onSuccess: (data) => {
  //     if (data.StatusCode === 6000) {
  //       setAssetDataState(data);
  //     }
  //   },
  // });

  // const showAssetDetail = useMutation({
  //   mutationFn: (newTodo) => {
  //     return detailAssets({ ...newTodo });
  //   },
  //   onSuccess: (data) => {
  //     if (data.StatusCode === 6000) {
  //       setAssetDetails(data);
  //     }
  //   },
  // });

  const editAsset = function () {
    setEdit(true);
    setOpen(true);
  };

  const returnType = function (type) {
    switch (type) {
      case 0:
        return "Organization";
      case 1:
        return "Building";
      case 2:
        return "Land";
      case 3:
        return "Share Market";
      case 4:
        return "Rental building";

      default:
        return "Type";
    }
  };

  const viewDetails = useQuery(
    ["view_Asset_data", paramValue],
    () => viewAssets({ asset_id: paramValue, filter_by: 0 }),
    {
      enabled: !!paramValue,
      onSuccess: (data) => {
        if (data.StatusCode === 6000) {
          setAssetDataState(data);
          // setIsetPage(true);
        }
      },
    }
  );

  const showAsset = useQuery(
    ["show_Asset_data", paramValue],
    () => detailAssets({ asset_id: paramValue }),
    {
      enabled: !!paramValue,
      onSuccess: (data) => {
        if (data.StatusCode === 6000) {
          setAssetDetails(data);
          setIsetPage(true);
        }
      },
    }
  );

  const deleteAssetMutate = useMutation({
    mutationFn: (newData) => deleteAssets(newData),
    onSuccess: (data) => {
      if (data.StatusCode !== 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.errors || data.message,
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
        setIsetPage(false);
        queryClient.invalidateQueries("assets-list")
        navigate("/portfolio");
      }
    },
  });

  const deleteAssetFun = function () {
    deleteAssetMutate.mutate({ id: paramValue });
  };
  // const showAsset = (id) => {
  //   setIsetPage(true);
  //   // e.preventDefault();
  //   showAssetData.mutate({ asset_id: id, filter_by: 0 });
  //   showAssetDetail.mutate({ asset_id: id });
  // };

  return (
    <>
      <div className="flex">
        <div className="LeftContainer w-[28%] min-w-[399px] pl-[14px]">
          <div className="h-full w-full rounded-[15px] border-[1px] border-[#E7E7E7] bg-white p-[16px]">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <div className="bg-[#FFF8E8] p-[10px] rounded-[13px] mr-[10px]">
                  <img src={Icone.Bag2Icon} alt="" />
                </div>
                <p className="text-[16px] font-[400]">Portfolio</p>
              </div>

              <div className="flex">
                <div className="mr-2">
                  <p className=" text-[#7F52E8] text-[13px] font-[400] text-right">
                    {data?.summary?.count} Assets
                  </p>
                  <p className=" text-[14px] font-[400]">
                    <span className=" text-[#9B9B9B] text-[12px] font-[400] mr-1">
                      {userData.country_details.currency_simbol}
                    </span>
                    {AmountFormater(data?.summary?.total_value)}
                  </p>
                </div>
                <AddButton name="asset" onClick={() => handleOpen()} />
              </div>
            </div>

            <SearchField placeholder={"search"} width={"100%"} />

            <div className="h-[72vh] overflow-y-auto mt-2">
              <div className="grid mt-3 grid-cols-3 grid-rows-3 gap-3">
                {!isLoading &&
                  data?.data.map((data, key) => (
                    <CardButton
                      key={key + 1}
                      component={Link}
                      to={`/portfolio?id=${data.id}`}
                    >
                      <div
                        // onClick={() => showAsset(data.id)}
                        className="bg-[#F6F6F6] rounded-[14px] flex flex-col justify-center items-center cursor-pointer"
                      >
                        <p className="text-[10px] font-[400] text-center">
                          {data.asset_name}
                        </p>
                        {data.photo ? (
                          <img
                            src={BaseUrl + data.photo}
                            alt=""
                            className="w-[80px] h-[80px] rounded-[3px] my-1"
                          />
                        ) : (
                          <div className="w-[80px] h-[80px] flex justify-center items-center">
                          <div className=" p-[10px] rounded-[13px] ">
                            <img src={Images.AssetImage} alt="" />
                          </div>
                          </div>
                        )}
                        <p className="text-[10px] font-[400] text-[#7F52E8]">
                          {returnType(parseInt(data.asset_type))}
                        </p>
                      </div>
                    </CardButton>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {isetPage && (
          <div className="RightContainer w-[72%]">
            <div className="flex items-center px-5 mb-5">
              <StyledToggleButton
                active={boolean}
                onClick={() => setBoolean(true)}
              >
                Overview
              </StyledToggleButton>
              <div className="mr-3"></div>
              <StyledToggleButton
                // disabled={userRollReducer?.asset.save_permission}
                active={!boolean}
                onClick={() => setBoolean(false)}
              >
                Transactions
              </StyledToggleButton>
            </div>

            {boolean ? (
              <Overview
                editFun={editAsset}
                deletFun={deleteAssetFun}
                assetData={assetDataState}
                assetLoading={viewDetails.isLoading}
                assetDetail={assetDetails}
                assetDetailLoading={showAsset.isLoading}
              />
            ) : (
              <Transactions
                assetDetail={assetDetails.data}
                paramValue={paramValue}
              />
            )}
          </div>
        )}
      </div>
      {open && <AddAssetsModal
        open={open}
        edit={edit}
        assetData={assetDetails}
        handleClose={handleClose}
      />}
    </>
  );
};

export default Portfolio;

const StyledToggleButton = styled(Button)((props) => ({
  // border: "1px solid #E4E4E4",
  // width: "100%",
  justifyContent: "space-between",
  paddingLeft: "42px",
  paddingRight: "42px",
  fontSize: "15px",
  fontWeight: "500",
  color: props.active ? "#FFF" : "#7F52E8",
  backgroundColor: props.active ? "#7F52E8" : "#F8F5FF",
  borderRadius: "8px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: props.active ? "#7F52E8" : "#F8F5FF",
  },
}));

const CardButton = styled(Button)(() => ({
  color: "black",
  backgroundColor: "#F6F6F6",
  borderRadius: "15px",
  border: "1px solid #E7E7E7",
  textTransform: "none",
  // height: "130px",
  // width: "112px",
  // paddingTop: 1,
  // paddingBottom: 1,
  "&.:hover": {
    backgroundColor: "#F6F6F6",
  },
}));
