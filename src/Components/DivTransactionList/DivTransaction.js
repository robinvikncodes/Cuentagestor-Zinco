import { Icone } from "../../Assets/AssetsLog";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import { AmountFormater } from "../../globalFunctions";
import { Button, Collapse, IconButton, styled } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
// import { Button } from "@mui/base";
import ZincoEditIcon from "../Component/ZincoEditIcon";
import { useState } from "react";
import { UserData } from "../../globalVariable";
import moment from "moment";
import { deleteDividend } from "../../Api/Assets/AssetsApi";
import { openSnackbar } from "../../features/snackbar";
import { useDispatch } from "react-redux";

const DivTransaction = ({ transData, handleOpenDivident, setSingleDivident, editDividentFun }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  // let mainData = "";
  // let switchDel = true;
  // const dispatch = useDispatch();
  // const queryClient = useQueryClient();
  const [checked, setChecked] = useState({});

  const handleChange = (id) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !checked[id]
    }));
  };

  const returnLogo = function (type) {
    // mainData = type;
    switch (type) {
      case 0:
        // contact
        return (
          <div className="bg-[#D5FBDD] p-[10px] rounded-[13px] mr-[10px]">
            <img src={Icone.PersonalcardIcon} alt="" />
          </div>
        );

      case 1:
        // cash
        return (
          <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] mr-[10px] ">
            <img src={Icone.WalletGreenIcon} alt="" className="" />
          </div>
        );

      case 2:
        // Bank
        return (
          <div className="bg-[#E8F0FF] p-[10px] rounded-[13px] mr-[10px]">
            <img src={Icone.BankIcon} alt="" />
          </div>
        );

      case 3:
        // Income
        return (
          <div className="bg-[#E0FFF6] p-[10px] rounded-[13px] mr-[10px]">
            <img src={Icone.WalletAddIcon} alt="" />
          </div>
        );

      case 4:
        // Expenses
        return (
          <div className="bg-[#FFEBF0] p-[10px] rounded-[13px] mr-[10px]">
            <img src={Icone.WalletAdd2Icon} alt="" />
          </div>
        );
      case 8:
        // Transfer
        return (
          <div className="bg-[#E3F1FF] p-[10px] rounded-[13px] mr-[10px]">
            <img src={Icone.ArchiveIcon} alt="" />
          </div>
        );

      default:
        break;
    }
  };

  const deleteDividentMutate = useMutation({
    mutationFn: (newData) =>  deleteDividend(newData),
    onSuccess: (data) => {
      if (data.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.message || data.data,
            severity: "success",
          })
        );
        // handleClose();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: data.errors || data.data || data.error || data.message,
            severity: "error",
          })
        );
      }
      queryClient.invalidateQueries("list-divident");
    },
  });

  const deleteDivident = function(id) {
    const payload = {
      id: id
    }
    deleteDividentMutate.mutate(payload)
  }

  const handleCloseBTN = function(data) {
    handleOpenDivident()
    setSingleDivident(data)
  }

  return (
    <div className="p-3">

      {transData?.map((list, key) => ( 
        <div key={key + 1}>
          <div className="flex items-center mt-4 mb-1">
            <div className="p-[10px]   mr-3 rounded-[13px]">
              <img src={Icone.CalenderIcon} alt="" />
            </div>
            <p className="text-[16px] font-[400]">
              {moment(list.date, "YYYY-MM-DD").format("D MMMM YYYY")}
            </p>
          </div>
        <div className={`borderStyle rounded-[13px] mb-2`}>
      
        <div className="flex justify-between items-center p-[15px] ">
          <div
            className="flex justify-between w-[100%] mr-2 cursor-pointer"
            onClick={() => handleChange(list.id)}
          >
            <div className="flex items-center">
              <div className="flex justify-center items-center">
                {returnLogo(3)}
                <p className="text-black font-[400] text-[16px]">
                  Income Account
                </p>
              </div>
              <p className="mx-[28px] text-[16px] font-[600] text-[#7F52E8]">
                -
              </p>
              <div className="flex justify-center items-center">
                {returnLogo(2)}
                <p className="text-black font-[400] text-[16px]">Bank Name</p>
              </div>
            </div>
            <div>
              <p className={`text-[19px] font-[500] text-[#119D5A] text-right`}>
                <span className="text-[#9B9B9B] text-[16px] font-[400]">
                  {UserData.country_details.currency_simbol}
                </span>{" "}
                {AmountFormater(list.amount)}
                {/* 10,000.00 */}
              </p>
              <p className="text-[#9B9B9B] text-[13px] font-[400] text-right">
                {/* {data?.description || "Note"} */}
                Notes
              </p>
            </div>
          </div>

          <div className="flex items-center">
            {/* {showTransactionRoll(data.voucher_type).delete &&  */}
            {!list.is_closed && <StyledToggleButton onClick={() => handleCloseBTN(list)}>Close</StyledToggleButton>}
            {!list.is_closed && <ZincoEditIcon
              name="asset"
              aria-label="delete"
              color="error"
              sx={{ color: "#3634A8" }}
              onClick={() => editDividentFun()}
            />}
            <IconButton
              aria-label="delete"
              color="error"
              // size="small"
              sx={{ color: "white" }}
              onClick={() => deleteDivident(list.id)}
            >
              <DeleteIcon sx={{ color: "#3634A8" }} />
            </IconButton>
          </div>
          {/* } */}
        </div>

        <Collapse in={checked[list.id]}>
          {list.details.map((data, key) => (<div className="flex justify-between items-center bg-[#F8F8F8] p-[15px] border border-b-[#DEDEDE] ">
            <p className="text-black font-[400] text-[16px]">
              {} 
              <span>{data.from_account === "You" ? UserData.username : data.from_account}</span> {" "}
              {data.from_account === "You" && <span className="text-[#7F52E8] font-[15px]">(You)</span>} {" "}
               <span>- {AmountFormater(data.share)}%</span> </p>
            <p className={`text-[19px] font-[500] text-right`}>
              <span className="text-[#9B9B9B] text-[16px] font-[400] ">
                {UserData.country_details.currency_simbol}
              </span>{" "}
              {AmountFormater(data?.amount)}
              {/* 10,000.00 */}
            </p>
          </div>))}
        </Collapse>
        </div>
      </div>
      ))}
    </div>
  );
};

DivTransaction.propTypes = {
  transData: PropTypes.array,
  // handleClose: PropTypes.func,
  // asset_master_id: PropTypes.string,
};

export default DivTransaction;

const StyledToggleButton = styled(Button)(() => ({
  // border: "1px solid #E4E4E4",
  // width: "100%",
  // justifyContent: "space-between",
  paddingLeft: "30px",
  paddingRight: "30px",
  paddingTop: "10px",
  paddingBottom: "10px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#FFF",
  backgroundColor: "#7F52E8",
  borderRadius: "8px",
  textTransform: "none",
  marginLeft: "10px",
  marginRight: "10px",
  "&:hover": {
    backgroundColor: "#7F52E8",
  },
}));
