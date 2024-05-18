import React, { useState } from "react";
import PropTypes from "prop-types";
import ZincoModal from "../../../../Components/Component/ZincoModal";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  styled,
} from "@mui/material";
import SearchField from "../../../../Components/Component/SearchField";
import { listContact } from "../../../../Api/Contact/ContactApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { BaseUrl } from "../../../../globalVariable";
import { Icone } from "../../../../Assets/AssetsLog";
import { AmountFormater } from "../../../../globalFunctions";
import { openSnackbar } from "../../../../features/snackbar";
import { useDispatch } from "react-redux";
import { createPartner, editPartner } from "../../../../Api/Assets/AssetsApi";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const PatnersAdd = ({ open, handleClose, edit, asset_master_id, }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch()
  const [type, settype] = React.useState("");
  const [alert, setAlert] = useState({
    account: false
  })
  const [share, setShare] = useState("")
  const [slider, setSlider] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [account, setAccount] = useState({
    photo: "",
    id: "",
    account_name: "",
    total_received: 0,
    total_paid: 0,
    phone: "",
  });
  const [accountData, setAccountData] = useState({
    StatusCode: 0,
    data: [],
  });
  const handleChangeType = (event) => {
    settype(event.target.value);
  };

  const submitTransaction = function (e) {
    e.preventDefault()
    if (account.id) {
      submitPartner();
      setAlert({ account: false })
    } else {
      setAlert({ account: true })
    }
  };

  const onSubmit = function (e) {
    setAccount(e);
    setAlert({ account: false })
  };

  const { isLoading: isLoadingList, refetch } = useQuery(
    ["contact-list-patners"],
    () => listContact({ page_number: 1, page_size: 7, search: searchValue }),
    {
      onSuccess: (res) => {
        // console.log(res);
        if (res.StatusCode === 6000) {
          setAccountData({
            ...accountData,
            data: res.data,
          });
        }
      },
    }
  );

  const partnerMutate = useMutation({
    mutationFn: (newData) =>
      edit ? editPartner(newData) : createPartner(newData),
    onSuccess: (data) => {
      if (data.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "success",
          })
        );
        queryClient.invalidateQueries(["list-patners"]);
        handleClose();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: data.errors || data.message,
            severity: "error",
          })
        );
      }
    },
  });

  const submitPartner = function () {
    const payload = {
      asset_master_id: asset_master_id,
      account_id: account.id,
      type: type,
      share: share,
    }
    partnerMutate.mutate(payload)
  }
  

  return (
    <ZincoModal open={open} handleClose={handleClose}>
      {!slider && (
        <div className="py-[15px] px-3 w-[450px]">
          <div>
            {/* <div className="flex items-center justify-between bg-[#F3F7FC] px-[18px] py-[14px] border border-[#ECECEC] rounded-[4px]"> */}
            <ProfilButton alert={alert.account} onClick={() => setSlider(true)}>
              <div className="flex items-center">
                {account.account_name && <Avatar alt={account.account_name} src={BaseUrl + account.photo} />}
                <p className="px-3 font-[16px]">{account.account_name || "Select Account"}</p>
              </div>
              <ArrowRightIcon sx={{ fontSize: "28px" }} />
            </ProfilButton>
            {/* </div> */}
            <form onSubmit={(e) => submitTransaction(e)}>
              <input
                required
                placeholder="Phone No"
                disabled
                value={account.phone}
                //   onChange={(e) => setData({ ...data, propertyName: e.target.value })}
                type="text"
                className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 w-full mb-3"
              />
              <FormControl fullWidth sx={{ mb: "15px" }} size="small">
                <InputLabel
                  sx={{ color: "black", "& .Mui-focused": { color: "black" } }}
                  id="demo-select-small-label"
                >
                  Type
                </InputLabel>
                <StyledSelect
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  label="Type"
                  value={type}
                  onChange={handleChangeType}
                  placeholder="- Share Holder/working partner"
                  required
                >
                  {/* <MenuItem value="">
                <em>- Share Holder/working partner</em>
              </MenuItem> */}
                  <MenuItem value={1}>Share Holder</MenuItem>
                  <MenuItem value={2}>Working Partner</MenuItem>
                </StyledSelect>
              </FormControl>
              <input
                required
                placeholder="Share %"
                  value={share}
                  onChange={(e) => setShare(e.target.value)}
                type="number"
                className="bg-[#F3F7FC] border border-[#D6D6D6] rounded text-[15px] p-2 mb-3 w-full"
              />
              <SaveButton
                type="submit"
                //   disabled={mutateAccount.isLoading}
              >
                {false ? (
                  //   mutateAccount.isLoading
                  <CircularProgress
                    sx={{
                      color: (theme) =>
                        theme.palette.grey[
                          theme.palette.mode === "light" ? 200 : 800
                        ],
                    }}
                    size={25}
                    thickness={4}
                    color="secondary"
                  />
                ) : (
                  "Save"
                )}
              </SaveButton>
            </form>
            <CancelButton onClick={() => handleClose()}>Cancel</CancelButton>
          </div>
        </div>
      )}

      {slider && (
        <div className="py-[10px] w-[450px]">
          <div className="flex py-[8px] px-2 border-b border-b-[#E9E9E9] mb-2">
            {/* <IconButton sx={{ height: "55px", width: "55px"}} > */}
            <ArrowBackIcon
              sx={{ mr: "15px", color: "#7F52E8", cursor: "pointer" }}
              onClick={() => setSlider(false)}
            />
            {/* </IconButton> */}

            <p className="font-normal text-[16px]">Contacts</p>
          </div>
          <div className="px-[15px]">
            <SearchField
              placeholder={"Search Account"}
              width={"100%"}
              //   valuen={searchValue}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  refetch();
                }
              }}
              onChange={(e) => setSearchValue(e.target.value)}
              onClickBTN={() => refetch()}
            />

            <div className="h-[255px] overflow-y-auto">
              <div className="mt-3 grid grid-cols-4 grid-rows-2 gap-2">
                {!isLoadingList &&
                  accountData.data.map((data, key) => (
                    <div
                      key={key + 1}
                      className="flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] py-[15px] cursor-pointer"
                      style={{ backgroundColor: data.id === account.id ? "#E2EFFF" : 'white'}}
                      onClick={() => onSubmit(data)}
                    >
                      <p className="text-[10px] font-[400]">
                        {data.account_name}
                      </p>
                      {data.photo ? (
                        <div className="bg-[#E2EFFF] p-[10px] rounded-full my-[1px] inline-block w-[52px] h-[52px] ">
                          <img src={BaseUrl + data.photo} alt="" className="" />
                        </div>
                      ) : (
                        <div className=" flex items-center justify-center my-[1px] w-[52px] h-[52px] ">
                          <img
                            src={Icone.PersonalcardIcon}
                            alt=""
                            className=" w-[32px] h-[32px]"
                          />{" "}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </ZincoModal>
  );
};

PatnersAdd.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  asset_master_id: PropTypes.string,
};

export default PatnersAdd;

const ProfilButton = styled(Button)(({ alert }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#F3F7FC",
  padding: "10px 13px",
  border: alert ? "1px solid #C91A52" : "1px solid #ECECEC",
  borderRadius: "4px",
  textTransform: "none",
  width: "100%",
  color: "black",
  marginBottom: "15px",
  "&:hover": {
    backgroundColor: "#F3F7FC",
  },
}));

const SaveButton = styled(Button)(() => ({
  width: "100%",
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#fff",
  backgroundColor: "#7F52E8",
  borderRadius: "8px",
  textTransform: "none",
  marginBottom: "12px",
  "&:hover": {
    backgroundColor: "#7F52E8",
  },
}));

const CancelButton = styled(Button)(() => ({
  width: "100%",
  paddingLeft: "18px",
  paddingRight: "18px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#7F52E8",
  backgroundColor: "#fff",
  borderRadius: "8px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#fff",
  },
  // marginBottom: "12px",
  // border: "1px solid #E4E4E4",
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#333333",
  // color :'black',
  // "& .MuiSelect-select": { padding: "5px" },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #D6D6D6",
    borderRadius: "6px",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #D6D6D6",
    borderRadius: "6px",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #D6D6D6",
    borderRadius: "6px",
  },
}));
