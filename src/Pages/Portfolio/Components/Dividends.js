import React, { useState } from "react";
import { Box, Button, Modal, styled } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import NewEntry from "../../../Components/Component/NewEntry";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import ExportBtn from "../../../Components/Component/ExportBtn";
import DivTransaction from "../../../Components/DivTransactionList/DivTransaction";
import { listDetailsDividend } from "../../../Api/Assets/AssetsApi";
import CreateDivident from "./Modals/CreateDivident";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import CloseDivident from "./Modals/CloseDivident";

const Dividends = ({ assetDetail }) => {
  // const queryClient = useQueryClient();
  const userRollReducer = useSelector((state) => state.userRole.state);

  const [openModal, setOpenModal] = useState(false)
  const [closeDividend, setCloseDividend] = useState(false)
  const [editDivident, setEditDivident] = useState(false)
  const [singleDivident, setSingleDivident] = useState({})

  const [filterDate, setFilterDate] = useState({
    from_date: "",
    to_date: "",
  });

  const [dividentData, setdividentData] = useState({
    data: [],
  })

  const handleCloseModal = function() {
    setOpenModal(false)
  }
  const handleOpenDivident = function() {
    setCloseDividend(true)
  }

  const handleCloseDivident = function() {
    setCloseDividend(false)
  }

  const editDividentFun = function() {
    setOpenModal(true)

  }

  useQuery("list-divident", () => listDetailsDividend({ asset_master_id: assetDetail.id }), {
    onSuccess: (res) => {
      if (res?.StatusCode === 6000) {
        setdividentData({data: res.data});
        // let org = res.data.filter(org => UserData.organization === org.organization)[0]
        // console.log(res.data);
        // setSelectedOrg(org)
      }
    },
  });

  return (
    <>
      <div>
        <div className="">
          <div className="flex justify-between items-center px-5 pb-5 border-b-[1px] border-[#DEDEDE]">
            <div className="flex items-center">
              <p className="text-[16px] font-[400] mr-2">{assetDetail.asset_name}</p>
              <li className="text-[16px] font-[400] text-[#7F52E8]">Dividends</li>
              <NewEntry
                from_date={filterDate.from_date}
                to_date={filterDate.to_date}
                set_filterDate={setFilterDate}
              />
            </div>
            <div className="flex items-center">
              {/* <p className="mr-[15px] text-[#868686] text-[13px] font-[400]">User role</p> */}
              <ExportBtn
                // JSONData={transData?.data}
                // filename={accountDetail.data.account_name}
              />
              <StyledButton
                disabled={!userRollReducer.asset.save_permission}
                startIcon={<AddRoundedIcon />}
                  onClick={() => setOpenModal(true)}
              >
                Dividend
              </StyledButton>
            </div>
          </div>
          <div className="h-[74vh] overflow-y-scroll"> 
            <DivTransaction 
              transData={dividentData.data} 
              setEditDivident={setEditDivident} 
              editDividentFun={editDividentFun} 
              handleOpenDivident={handleOpenDivident} 
            /> 
          </div>
        </div> 
      </div> 

      <CreateDivident 
        open={openModal} 
        handleClose={handleCloseModal} 
        edit={editDivident} 
        assetDetail={assetDetail}
        handleOpenDivident={handleOpenDivident}
      />
      <CloseDivident 
        open={closeDividend} 
        singleDivident={singleDivident}
        assetDetail={assetDetail}
        handleClose={handleCloseDivident} 
      />
    </>
  );
};

export default Dividends;

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
