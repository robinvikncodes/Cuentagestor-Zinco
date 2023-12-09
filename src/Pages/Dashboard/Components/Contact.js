import styled from "@emotion/styled";
import { Button, Skeleton } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { Icone } from "../../../Assets/AssetsLog";
import AddButton from "../../../Components/Component/AddButton";
import SearchField from "../../../Components/Component/SearchField";
import AddContactModal from "../../Contact/Components/AddContactModal";
import { useQuery } from "react-query";
import { listContact } from "../../../Api/Contact/ContactApi";
import { BaseUrl } from "../../../globalVariable";
import { AmountFormater } from "../../../globalFunctions";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const Contact = () => {
  const [openContact, setOpenContact] = React.useState(false);
  const handleOpenContact = () => setOpenContact(true);
  const handleCloseContact = () => setOpenContact(false);

  const {
    isLoading: isLoadingList,
    error: errorList,
    data: dataList,
  } = useQuery("contact-list", () => {
    return listContact({ page_number: 1, page_size: 7 });
  });

  return (
    <>
      <div className="borderStyle bg-white p-[15px] mb-2 rounded-[22px]">
        <div className="flex justify-between mb-[20px]">
          <div className="flex items-center ">
            <div className="flex justify-center items-center mr-[10px]">
              <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] mr-[10px]">
                <img src={Icone.PersonalcardIcon} alt="" />
              </div>
              <p className="text-black font-[400] text-[16px]">Contact</p>
            </div>
            <SearchField width={"269px"} placeholder={"Search Contact"} />
          </div>

          <div className="flex items-center">
            <p className="text-[12px] font-[400] text-[#7F52E8] mr-2">
              Add contact
            </p>
            <AddButton onClick={() => handleOpenContact()} />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-3">
          {isLoadingList ? (
            <div className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] ">
              <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div>
              <p className="text-[10px] font-[400] w-3/4 ">
                <Skeleton variant="text" />
              </p>
              <div className=" rounded-[13px] my-[10px] inline-block ">
                {/* <img src={Icone.BankIcon} alt="" className="" /> */}
                <Skeleton variant="rounded" width={"34px"} height={"34px"} />
              </div>
              <p className=" text-[#15960A] text-[10px] font-[400] w-full">
                <Skeleton variant="text" width={"100%"} />
              </p>
            </div>
          ) : (
            dataList.data.map((jet, key) => (
              <CardButton
                key={key + 1}
                component={Link}
                to={`/contact?id=${jet.id}`}
              >
                <div className=" flex flex-col justify-center items-center ">
                  <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div>
                  <p className="text-[10px] font-[400] w-10/12  text-center">
                    {jet.account_name}
                  </p>
                  {!jet.photo === null ? (
                    <div className="bg-[#E2EFFF] p-[10px] rounded-[13px] my-[10px] inline-block w-[34px] h-[34px]">
                      {/* <Skeleton variant='rectangular' /> */}
                    </div>
                  ) : (
                    <img
                      src={BaseUrl + jet.photo}
                      alt=""
                      className="h-11 w-11 my-1"
                    />
                  )}
                  <p
                    className={`${
                      jet.total_received > jet.total_paid
                        ? "text-[#15960A]"
                        : "text-[#CD0A0A]"
                    } text-[10px] font-[400] w-full text-center`}
                  >
                    {userData.country_details.currency_simbol}
                    {"  "}
                    {AmountFormater(jet.total_received > jet.total_paid
                      ? jet.total_received - jet.total_paid
                      : jet.total_paid - jet.total_received)}
                      {/* {jet.total_received - jet.total_paid * -1} */}
                  </p>
                </div>
              </CardButton>
            ))
          )}

          {/* <div className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px]">
            <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div>
            <p className=" text-[10px] font-[400]">Contact Name</p>
            <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] my-[10px] inline-block">
              <img src={Icone.WalletGreenIcon} alt="" className="" />
            </div>
            <p className="text-[#8B0000] text-[10px] font-[400]">
              SAR 400,00,000,00
            </p>
          </div> */}

          {/* <div className="bg-[#EFE8FF] flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] ">
        <p className="text-[13px] font-[400] text-[#7F52E8] ">
          View all
        </p>
      </div> */}
          <StyledButton component={Link} to="/contact">
            View all
          </StyledButton>
        </div>
      </div>
      <AddContactModal open={openContact} handleClose={handleCloseContact} />
    </>
  );
};

export default Contact;

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
  height: "136px",
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
  },
}));
