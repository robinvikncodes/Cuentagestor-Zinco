import { Icone } from "../../Assets/AssetsLog";
import Loans from "./Components/Loans";
import Incomes from "./Components/Incomes";
import Expenses from "./Components/Expenses";
import Contact from "./Components/Contact";
import Portfolio from "./Components/Portfolio";
import Accounts from "./Components/Accounts";
import { useQuery } from "react-query";
import { dashboardDetails } from "../../Api/Dashboard/DashboardApi";
import { Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AmountFormater } from "../../globalFunctions";
import { isActivateUser } from "../../features/expireState";
import moment from "moment";

const userData = JSON.parse(localStorage.getItem("UserCredentials"))

const Dashboard = () => {
  const dispatch = useDispatch()
  const reducer = useSelector(state => state.setting.settingDetails )
  // console.log(reducer);
  const { isLoading, error, data } = useQuery("details-dashboard", () => {
    return dashboardDetails();
  }, {
    onSuccess: res => {
      let date = res.data.expiry_date
      let today = moment(); // get today's date
      let compareDate = moment(date); // the date you want to compare
      let isExpired = today.isBefore(compareDate)
      console.log(isExpired, date, "HHHHHHHHHHHHHHHHHHHHHHHHHHHH");
      dispatch(
        isActivateUser({
          isUserExpired: isExpired,
          date: res.data.expiry_date
        })
      )
      localStorage.setItem("isUserActivate", JSON.stringify({isUserExpired: isExpired, date: res.data.expiry_date}))
    }
  });

  return (
    <>
      {/* First Section */}
      <section className="w-full flex justify-between px-3 mb-3">
        <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-x-1.5 gap-y-1.5 mr-[7px]">
          <div className="w-full bg-white rounded-[9px] border-[#E4E4E4] border-[1px] flex justify-between items-center px-[16px] ">
            <div className="flex justify-center items-center">
              <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] mr-[10px]">
                <img src={Icone.WalletGreenIcon} alt="" />
              </div>
              <p className="text-black font-[400] text-[16px]">Cash</p>
            </div>

            <div className="flex justify-center items-center">
              {isLoading ? (
                <Skeleton variant="text" height={26} width={150} />
              ) : (
                <>
                  <p className="text-[#9B9B9B] text-[16px] font-[400] mr-1">
                    {userData.country_details.currency_simbol}
                  </p>
                  <p className="text-[19px] font-[500]">
                    {AmountFormater(data?.data?.total_cash_balance) || "00.00"}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="w-full bg-white rounded-[9px] border-[#E4E4E4] border-[1px] flex justify-between items-center px-[16px] ">
            <div className="flex justify-center items-center">
              <div className="bg-[#E8F0FF] p-[10px] rounded-[13px] mr-[10px]">
                <img src={Icone.MoneyBagIcon} alt="" />
              </div>
              <div>
                <p className="text-black font-[400] text-[16px]">Income</p>
                <p className="text-[#8E8E8E] text-[12px] font-[400]">
                  This Month
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center">
              {isLoading ? (
                <Skeleton variant="text" height={26} width={150} />
              ) : <>
              <p className="text-[#9B9B9B] text-[16px] font-[400] mr-1">
                {userData.country_details.currency_simbol}
              </p>
              <p className="text-[19px] font-[500]">
                {data?.data?.month_income !== isNaN ? "00.00" : AmountFormater(data?.data?.month_income)}
              </p></>}
            </div>
          </div>

          <div className="w-full bg-white rounded-[9px] border-[#E4E4E4] border-[1px] flex justify-between items-center px-[16px] ">
            <div className="flex justify-center items-center">
              <div className="bg-[#E8F0FF] p-[10px] rounded-[13px] mr-[10px]">
                <img src={Icone.BankIcon} alt="" />
              </div>
              <p className="text-black font-[400] text-[16px]">Bank</p>
            </div>

            <div className="flex justify-center items-center">
              {isLoading ? (
                <Skeleton variant="text" height={26} width={150} />
              ) : <><p className="text-[#9B9B9B] text-[16px] font-[400] mr-1">
                {userData.country_details.currency_simbol}
              </p>
              <p className="text-[19px] font-[500]">
                {AmountFormater(data?.data?.total_bank_balance) || "00.00"}
              </p></>}
            </div>
          </div>

          <div className="w-full bg-white rounded-[9px] border-[#E4E4E4] border-[1px] flex justify-between items-center px-[16px] ">
            <div className="flex justify-center items-center">
              <div className="bg-[#FFE9E9] p-[10px] rounded-[13px] mr-[10px]">
                <img src={Icone.WalletRedIcon} alt="" />
              </div>
              <div>
                <p className="text-black font-[400] text-[16px]">Expenses</p>
                <p className="text-[#8E8E8E] text-[12px] font-[400]">
                  This month
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center">
              {isLoading ? (
                <Skeleton variant="text" height={26} width={150} />
              ) : <><p className="text-[#9B9B9B] text-[16px] font-[400] mr-1">
                {userData.country_details.currency_simbol}
              </p>
              <p className="text-[19px] font-[500]">
                {AmountFormater(data?.data?.month_expense) || "00.00"}
              </p></>}
            </div>
          </div>
        </div>

        <div className="w-1/2 grid grid-cols-4 grid-rows-1 gap-2">
          {reducer.is_zakath &&
          <div className=" bg-white rounded-[9px] border-[1px] border-[#E4E4E4] px-[16px] py-[14px]">
            <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] mr-[10px] mb-[11px] inline-block">
              <img src={Icone.HelpHandicon} alt="" />
            </div>
            <p className="text-[16px] font-[400] mb-[7px]">Zakah</p>
            <p className="text-[16px] font-[400] text-[#9B9B9B]">{userData.country_details.currency_simbol}</p>
            <p className="text-[17px] font-[500] ">
              {isLoading ? (
                <Skeleton variant="text" height={26} width={100} />
              ) : AmountFormater(data?.data?.total_zakath) || "00.00"}
            </p>
          </div>}

          {reducer.is_interest && 
          <div className=" bg-white rounded-[9px] border-[1px] border-[#E4E4E4] px-[16px] py-[14px]">
            <div className="bg-[#FFE9E9] p-[10px] rounded-[13px] mr-[10px] mb-[11px] inline-block">
              <img src={Icone.PercentageIcon} alt="" className="" />
            </div>
            <p className="text-[16px] font-[400] mb-[7px]">Interest</p>
            <p className="text-[16px] font-[400] text-[#9B9B9B]">{userData.country_details.currency_simbol}</p>
            <p className="text-[17px] font-[500] ">
              {isLoading ? (
                <Skeleton variant="text" height={26} width={100} />
              ) : AmountFormater(data?.data?.total_interest) || "00.00"}
            </p>
          </div>}

          <div className=" bg-white rounded-[9px] border-[1px] border-[#E4E4E4] px-[16px] py-[14px]">
            <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] mr-[10px] mb-[11px] inline-block">
              <img src={Icone.DownloadIcon} alt="" className="" />
            </div>
            <p className="text-[16px] font-[400] mb-[7px]">Receivables</p>
            <p className="text-[16px] font-[400] text-[#9B9B9B]">{userData.country_details.currency_simbol}</p>
            <p className="text-[17px] font-[500] ">
              {isLoading ? (
                <Skeleton variant="text" height={26} width={100} />
              ) : AmountFormater(data?.data?.total_recievable) || "00.00" }
            </p>
          </div>

          <div className=" bg-white rounded-[9px] border-[1px] border-[#E4E4E4] px-[16px] py-[14px]">
            <div className="bg-[#FFE9E9] p-[10px] rounded-[13px] mr-[10px] mb-[11px] inline-block">
              <img src={Icone.UploadIcon} alt="" className="" />
            </div>
            <p className="text-[16px] font-[400] mb-[7px]">Payables</p>
            <p className="text-[16px] font-[400] text-[#9B9B9B]">{userData.country_details.currency_simbol}</p>
            <p className="text-[17px] font-[500] ">
              {isLoading ? (
                <Skeleton variant="text" height={26} width={100} />
              ) : AmountFormater(data?.data?.total_payable) || "00.00"}
            </p>
          </div>
        </div>
      </section>

      {/* Second Section */}
      <section className="bg-white p-[12px] flex justify-between overflow-hidden">
        <div className="LeftSide w-[75%] mr-2 overflow-y-scroll">
          <Accounts
            accountList={data?.data?.accounts_list}
            isLoading={isLoading}
          />

          <Contact />

          <Expenses />

          <Incomes />

          <Loans />
        </div>

        <div className="RightSide w-[25%]">
          <Portfolio />
        </div>
      </section>
    </>
  );
};

export default Dashboard;
