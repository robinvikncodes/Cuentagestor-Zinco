import React from "react";
import SearchField from "../../../Components/Component/SearchField";
import { listAssets } from "../../../Api/Assets/AssetsApi";
import { Icone, Images } from "../../../Assets/AssetsLog";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { Button, Skeleton } from "@mui/material";
import { BaseUrl } from "../../../globalVariable";
import styled from "@emotion/styled";
const userData = JSON.parse(localStorage.getItem("UserCredentials"));
const Portfolio = () => {
  const navigate = useNavigate();


  const returnType = function(type) {
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
  }

  const { isLoading, error, data } = useQuery("assets-list", () => {
    return listAssets({ page_number: 1, page_size: 8 });
  });

  return (
    <div className="border-[1px] rounded-[22px] border-[#E4E4E4] p-[12px] h-full">
      <div className="flex justify-between mb-[10px] w-[80%]">
        <div className="flex justify-center items-center">
          <div className="bg-[#FFF8E8] p-[10px] rounded-[13px] mr-[10px]">
            <img src={Icone.Bag2Icon} alt="" />
          </div>
          <p className="text-black font-[400] text-[16px]">Portfolio</p>
        </div>
        <div>
          <p className="text-[13px] font-[400] text-[#7F52E8] text-right">
            {!isLoading && data.summary.count + " Assets"}
          </p>
          <p className="text-[14px] font-[500]">
            <span className="text-[12px] font-[400] text-[#9B9B9B] mr-1">
              {userData.country_details.currency_simbol}
            </span>
            {!isLoading && data.summary.total_value}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <SearchField placeholder={"Search Portfolio"} />
        <p
          className="text-[12px] font-[400] text-[#7F52E8] cursor-pointer"
          onClick={() => navigate("/portfolio")}
        >
          View all
        </p>
      </div>

      <div className="h-[80%] overflow-y-auto">
        <div className="grid grid-cols-3 gap-[10px]">
          {isLoading ? (
            <div className="bg-[#F6F6F6] rounded-[14px] px-[5px] py-[10px] flex flex-col justify-center items-center">
              <p className="text-[10px] font-[400] w-full">
                <Skeleton variant="text" width={"100%"} fontSize={10} />
              </p>
              <Skeleton
                variant="rounded"
                height={80}
                width={80}
                className="w-[80px] h-[80px] rounded-[3px] my-1"
              />
              <p className="text-[10px] font-[400] text-[#7F52E8]">Type</p>
            </div>
          ) : (
            data?.data.map((data, key) => (
              <CardButton
                key={key + 1}
                component={Link}
                to={`/portfolio?id=${data.id}`}
              >
                <div
                  className="rounded-[14px] p-[2px] flex flex-col justify-center items-center"
                >
                  <p className="text-[10px] font-[400]">{data.asset_name}</p>
                  <img
                    src={data.photo ? BaseUrl + data.photo: Images.AssetImage}
                    alt=""
                    className="w-[80px] h-[80px] rounded-[3px] my-1"
                  />
                  <p className="text-[10px] font-[400] text-[#7F52E8]">
                    {returnType(parseInt(data.asset_type))}
                  </p>
                </div>
              </CardButton>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default Portfolio;

const CardButton = styled(Button)(() => ({
  color: "black",
  // backgroundColor: "white",
  borderRadius: "15px",
  border: "1px solid #E7E7E7",
  textTransform: "none",
  // height: "130px",
  // width: "112px",
  // paddingTop: 1,
  // paddingBottom: 1,
  "&.:hover": {
    backgroundColor: "white",
  },
}));
