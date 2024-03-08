import styled from "@emotion/styled";
import { Button, Skeleton } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { Icone } from "../../../Assets/AssetsLog";
import AddButton from "../../../Components/Component/AddButton";
import SearchField from "../../../Components/Component/SearchField";
import ZincoModal from "../../../Components/Component/ZincoModal";
import ZincoTextField from "../../../Components/Component/ZincoTextField";
import AddExpenses from "../../Expenses/Components/AddExpenses";
import { useQuery, useQueryClient } from "react-query";
import { financeList } from "../../../Api/Finance/FinanceApi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { AmountFormater } from "../../../globalFunctions";
import { listAccount } from "../../../Api/Accounts/AccountsApi";

ChartJS.register(ArcElement, Tooltip, Legend);

const userData = JSON.parse(localStorage.getItem("UserCredentials"))

const col = [
  "rgba(255, 99, 132)",
  "rgba(54, 162, 235)",
  "rgba(255, 206, 86)",
  "rgba(75, 192, 192)",
  "rgba(153, 102, 255)",
  "rgba(255, 159, 64)",
];

const Expenses = () => {
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { isLoading, data,  } = useQuery(["Expenses-list"], () =>
    financeList({
      finance_type: 1,
      page_number: 1,
      page_size: 1,
    })
  );
  const {
    isLoading: isLoadingList,
    data: listData,
    refetch,
  } = useQuery("Expenses-list-only", () =>
    listAccount({
      account_type: [4],
      page_number: 1,
      page_size: 9,
      search: searchValue,
    })
  );

  return (
    <>
      <div className="borderStyle bg-[#F9F9F9] p-[15px] mb-[10px]  rounded-[22px]">
        <div className="flex justify-between mb-[20px]">
          <div className="flex items-center ">
            <div className="flex justify-center items-center mr-[10px]">
              <div className="bg-[#FFEBF0] p-[10px] rounded-[13px] mr-[10px]">
                <img src={Icone.WalletAdd2Icon} alt="" />
              </div>
              <p className="text-black font-[400] text-[16px]">Expenses</p>
            </div>
            <div className="bg-white rounded-lg border-[1px] border-[#E8E5E5] px-[12px] py-[5px] w-[161px] mr-2">
              <p className="text-[11px] text-[#8E8E8E] font-[400]">Total</p>
              <p className="text-[14px] font-[500]">
                <span className="text-[11px] text-[#8E8E8E] font-[400] mr-1">
                  {userData.country_details.currency_simbol}
                </span>
                {AmountFormater(data?.summary.total)}
              </p>
            </div>
            <div className="bg-white rounded-lg border-[1px] border-[#E8E5E5] px-[12px] py-[5px] w-[161px] mr-2">
              <p className="text-[11px] text-[#8E8E8E] font-[400]">
                This Month
              </p>
              <p className="text-[14px] font-[500]">
                <span className="text-[11px] text-[#8E8E8E] font-[400] mr-1">
                  {userData.country_details.currency_simbol}
                </span>
                {AmountFormater(data?.summary.this_month)}
              </p>
            </div>
            <SearchField
              width={"269px"}
              placeholder={"Search Expenses"}
              valuen={searchValue}
              onKeyDown={(e) => e.key === "Enter" && refetch()}
              onChange={(e) => setSearchValue(e.target.value)}
              onClickBTN={() => refetch()}
            />
          </div>

          <div className="flex items-center">
            <p className="text-[12px] font-[400] text-[#7F52E8] mr-2">
              Add Expenses
            </p>
            <AddButton name="expense" onClick={() => handleOpen()} />
          </div>
        </div>

        <div className="flex">
          <div className="bg-white rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] mr-[10px]">
            <div className="flex items-center">
              {/* <p>July, 2023</p> */}
              {/* <NewEntry /> */}
            </div>
            <div className="flex ">
              <div className="w-[200px] h-[200px] mr-3">
                <Doughnut
                  data={{
                    labels: [],
                    datasets: [
                      {
                        data: data?.graph_data.map(
                          (data) => data.amount ?? data.balance
                        ),
                        backgroundColor: col,
                        borderJoinStyle: "bevel",
                      },
                    ],
                  }}
                />
              </div>

              <div className="mt-3">
                {data?.graph_data.map((data, key) => (
                  <div className="flex items-center mb-2">
                    <div
                      className=" h-[11px] w-[11px] rounded-md mr-2"
                      style={{ backgroundColor: col[key] }}
                    />
                    <span className="text-[#858585] text-[14px] font-[400]">
                      {data.amount || data.balance} % {data.account_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-5 grid-rows-2 gap-[10px]">
            {isLoadingList
              ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i, key) => (
                  <div
                    key={key + 1}
                    className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px]"
                  >
                    <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div>
                    <p className="text-[10px] font-[400] w-3/4 ">
                      <Skeleton variant="text" />
                    </p>
                    <div className=" rounded-[13px] my-[10px] inline-block ">
                      {/* <img src={Icone.BankIcon} alt="" className="" /> */}
                      <Skeleton
                        variant="rounded"
                        width={"34px"}
                        height={"34px"}
                      />
                    </div>
                    <p className=" text-[#15960A] text-[10px] font-[400] w-full">
                      <Skeleton variant="text" width={"100%"} />
                    </p>
                  </div>
                ))
              : listData?.data.map((data, key) => (
                  <CardButton
                    key={key + 1}
                    component={Link}
                    to={`/expenses?id=${data.id}`}
                    draggable="true"
                  >
                    <div className=" flex flex-col justify-center items-center ">
                      <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div>
                      <p className=" text-[10px] font-[400]">
                        {data.account_name}
                      </p>
                      <div className="bg-[#F54040] p-[10px] rounded-[13px] my-[10px] inline-block">
                        <img src={Icone.WalletAdd1Icon} alt="" className="" />
                      </div>
                      <p className=" text-[10px] font-[400]">
                        {userData.country_details.currency_simbol}{" "}
                        {AmountFormater(data.balance)}
                      </p>
                    </div>
                  </CardButton>
                ))}

            {/* <div className="bg-[#EFE8FF] flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] w-[110px]">
          <p className="text-[13px] font-[400] text-[#7F52E8] ">
            View all
          </p>
        </div> */}
            {/* {isLoading && ( */}
            <StyledButton component={Link} to="/expenses">
              View all
            </StyledButton>
            {/* )} */}
          </div>
        </div>
      </div>

      <AddExpenses open={open} handleClose={handleClose} />
    </>
  );
};

export default Expenses;

const StyledButton = styled(Button)(() => ({
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#7F52E8",
  backgroundColor: "#EFE8FF",
  borderRadius: "15px",
  border: "1px solid #E4E4E4",
  textTransform: "none",
  height: "130px",
  width: "112px"
}));

const CardButton = styled(Button)(() => ({
  color: "black",
  backgroundColor: "white",
  borderRadius: "15px",
  border: "1px solid #E7E7E7",
  textTransform: "none",
  height: "130px",
  width: "112px",
  "&.:hover": {
    backgroundColor: "white",
  }
}));

//  w-[112px] h-[130px]