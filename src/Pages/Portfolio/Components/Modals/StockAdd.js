import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import SearchField from "../../../../Components/Component/SearchField";
import { Icone } from "../../../../Assets/AssetsLog";
import { listAccount } from "../../../../Api/Accounts/AccountsApi";
import ZincoModal from "../../../../Components/Component/ZincoModal";
import SkletionCard from "../../../../Components/Skletions/SkletionCard";
import { addStock, editStock } from "../../../../Api/Assets/AssetsApi";
import { openSnackbar } from "../../../../features/snackbar";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const StockAdd = (props) => {
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    share: "",
    value: "",
  });
  const [candb, setCandb] = useState([]);
  const [select, setSelect] = useState({});
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));

  //Data fetching
  const { isLoading: isLoadingCandB } = useQuery(
    "cash&bank_list",
    () => listAccount({ account_type: [1, 2] }),
    {
      onSuccess: (res) => {
        if (res.StatusCode === 6000) {
          setCandb(res.data);
          !props.edit && setSelect(res.data[0]); // Only set when edit is tru from the prop
          if (props.edit) {
            let account = res.data.filter(item => item.id === props.stockData.from_account)
            setSelect(account[0])
            // console.log(account, res.data, props.stockData.id, ">>>>>>>>>>>>>><<<<<<<<<<<<<<<<<))(((((()00");
          }
        }
      },
    }
  );

  const stockMutate = useMutation({
    mutationFn: (newData) => props.edit ? editStock(newData) : addStock(newData),
    onSuccess: (data) => {
      if (data.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "success",
          })
        );
        props.handleClose();
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

  const submitTransaction = function () {
    let now = new Date();
    let payload = {
      
      share: values.share,
      value: values.value,
      pre_owned: false,
      as_on_date: new Date().toISOString().substr(0, 10),
      account_id: select.id,
    };

    if (props.edit) {
      payload.asset_detail_id = props.stockData.id
      payload.pre_owned = props.stockData.pre_owned
      payload.as_on_date = props.stockData.as_on_date
      payload.account_id = select.id
    } else {
      payload.asset_id= props.asset_id
    }
    stockMutate.mutate(payload);
  };

  useEffect(() => {
    console.log(props.stockData);
    if (props.edit) {
      setValues({
        value: parseInt(props.stockData.value),
        share: parseInt(props.stockData.share),
      });
      setSelect({ id: props.stockData.from_account });
    } else {
      setValues({ value: "", share: "" });
    }
  }, []);

  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <div className="p-3">
        <div className="flex justify-between mb-2 w-[475px]">
          <input
            type="number"
            className="border bg-[#F3F7FC] p-[8px] text-[12px] rounded-md w-1/2 mr-1"
            placeholder="Share %"
            value={values.share}
            onChange={(e) => e.target.value <= 100 && setValues({ ...values, share: e.target.value })}
          />
          <input
            type="number"
            className="border bg-[#F3F7FC] p-[8px] text-[12px] rounded-md w-1/2 ml-1"
            placeholder="Value"
            value={values.value}
            onChange={(e) => setValues({ ...values, value: e.target.value })}
          />
        </div>
        <SearchField />
        <div className=" w-[472.5px] h-[255px] overflow-y-auto mt-2">
          <div className="mt-3 grid grid-cols-4 grid-rows-2 gap-2">
            {!isLoadingCandB ? (
              candb.map((data, key) => (
                <div
                  style={{
                    backgroundColor: data.id === select.id && "#F6F6F6",
                  }}
                  onClick={() => setSelect(data)}
                  className="bg-white  flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] py-4 cursor-pointer"
                >
                  {/* <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div> */}
                  {data.account_type === "2" ? (
                    <>
                      <p className="text-[#0150B1] text-[10px] font-[400]">
                        {data.account_name}
                      </p>
                      <div className="bg-[#E2EFFF] p-[10px] rounded-[13px] my-[5px] inline-block">
                        <img src={Icone.BankIcon} alt="" className="" />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-[#289c20] text-[10px] font-[400]">
                        {data.account_name}
                      </p>
                      <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] my-[5px] inline-block">
                        <img src={Icone.WalletGreenIcon} alt="" className="" />
                      </div>
                    </>
                  )}
                  <p className="text-[10px] font-[400]">
                    {userData.country_details.currency_simbol}
                    {"  "} {data.balance}
                  </p>
                </div>
              ))
            ) : (
              <SkletionCard />
            )}
          </div>
        </div>

        <div className="w-full flex justify-center py-3">
          <input
            type="date"
            className="border-[1px] px-[48px] py-[6px] rounded-full max-w-[220px]"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-center p-1">
        <IconButton onClick={() => props.handleClose()}>
          <img src={Icone.ClipIcon} alt="" />
        </IconButton>
        <div className="flex items-center">
            <p className="text-[16px] font-[500]">
              {select?.account_name}
            </p>
          </div>
        <IconButton onClick={submitTransaction}>
          <img src={Icone.CheckIcon} alt="" />
        </IconButton>
      </div>
    </ZincoModal>
  );
};

export default StockAdd;
