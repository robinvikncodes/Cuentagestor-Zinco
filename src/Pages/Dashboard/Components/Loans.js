import React, { useState } from "react";
import { Icone } from "../../../Assets/AssetsLog";
import AddButton from "../../../Components/Component/AddButton";
import { Button } from "@mui/material";
import styled from "@emotion/styled";
import SearchField from "../../../Components/Component/SearchField";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { listLoans } from "../../../Api/Loan/LoanApi";
import moment from "moment";
import AddLoan from "../../Loan/Components/AddLoanModal";
import { AmountFormater } from "../../../globalFunctions";
const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const Loans = () => {
  const [listLoan, setListLoan] = useState([]);
  const [openAddLoan, setOpenAddLoan] = useState(false);

  const handleCloseLoan = () => setOpenAddLoan(false);

  const { isLoading: loanListLoading } = useQuery(
    "lona_list_Dashboard",
    () => listLoans({ page_number: 1, page_size: 7 }),
    {
      onSuccess: (res) => {
        // console.log(res);
        // setSelectExpenses(res.data[0]);
        // setExpensesList(res.data);
        if (res.StatusCode === 6000) {
          setListLoan(res.data);
        }
      },
    }
  );

  return (
    <>
      <div className="borderStyle rounded-[22px] bg-[#F9F9F9] p-[15px] mb-[10px]">
        <div className="flex justify-between mb-[20px]">
          <div className="flex items-center ">
            <div className="flex justify-center items-center mr-[15px]">
              <div className="bg-[#E3F1FF] p-[10px] rounded-[13px] mr-[10px]">
                <img src={Icone.ArchiveIcon} alt="" />
              </div>
              <p className="text-black font-[400] text-[16px]">Loans</p>
            </div>

            <SearchField width={"269px"} placeholder={"Search Loans"} />
          </div>

          <div className="flex items-center">
            <p className="text-[12px] font-[400] text-[#7F52E8] mr-2">
              Add Loan
            </p>
            <AddButton onClick={() => setOpenAddLoan(true)} />
          </div>
        </div>
        <div className="grid grid-cols-8 gap-[10px]">
          {!loanListLoading &&
            listLoan.map((obj, i) => (
              <CardButton
                key={i + 1}
                component={Link}
                to={`/loan?id=${obj.id}`}
              >
                <div className="flex flex-col justify-center items-center ">
                  {/* <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div> */}
                  <p className=" text-[10px] font-[400]">
                    {obj.loan_name || "Loan Name"}
                  </p>
                  <p className=" text-[#888] text-[9px] font-[400]">
                    {moment(obj.date).calendar(null, {
                      sameDay: "[Today]",
                      nextDay: "[Tomorrow]",
                      nextWeek: "dddd",
                      lastDay: "[Yesterday]",
                      lastWeek: "[Last] dddd",
                      sameElse: "DD/MM/YYYY",
                    }) || "Day"}
                  </p>
                  <div className="bg-[#F54040] p-[10px] rounded-[13px] my-[10px] inline-block">
                    <img src={Icone.Archive2Icon} alt="" className="" />
                  </div>
                  <p className=" text-[10px] font-[400]">
                    {userData.country_details.currency_simbol}{" "}
                    {AmountFormater(obj.loan_amount) || "00.00"}
                  </p>
                  <p className="text-[#F2385E] text-[10px] font-[400]">
                    {userData.country_details.currency_simbol}{" "}
                    {AmountFormater(obj.outstanding_amount) || "00.00"}
                  </p>
                  {/* <p className="text-[#888] text-[10px] font-[400]">
                  {userData.country_details.currency_simbol} 4,000
                  </p> */}
                </div>
              </CardButton>
            ))}
          <StyledButton component={Link} to="/loan">
            View all
          </StyledButton>
        </div>
      </div>

       {openAddLoan && <AddLoan
        open={openAddLoan}
        handleClose={() => setOpenAddLoan(false)}
      />}
    </>
  );
};

export default Loans;

const StyledButton = styled(Button)(() => ({
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  height: "146.25px",
  width: "112px",
  color: "#7F52E8",
  backgroundColor: "#EFE8FF",
  borderRadius: "15px",
  border: "1px solid #E4E4E4",
  textTransform: "none",
}));

const CardButton = styled(Button)(() => ({
  color: "black",
  backgroundColor: "white",
  borderRadius: "15px",
  border: "1px solid #E7E7E7",
  textTransform: "none",
  marginRight: "5px",
  // height: "130px",
  // width: "112px",
  // paddingTop: 1,
  // paddingBottom: 1,
  "&.:hover": {
    backgroundColor: "white",
  },
}));
