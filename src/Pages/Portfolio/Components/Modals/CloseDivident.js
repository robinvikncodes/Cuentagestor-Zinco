import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { listAccount } from '../../../../Api/Accounts/AccountsApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ZincoModal from '../../../../Components/Component/ZincoModal';
import SearchField from '../../../../Components/Component/SearchField';
import { Icone } from '../../../../Assets/AssetsLog';
import SkletionCard from '../../../../Components/Skletions/SkletionCard';
import { IconButton } from '@mui/material';
import { closeDividend } from '../../../../Api/Assets/AssetsApi';
import { openSnackbar } from '../../../../features/snackbar';
import moment from 'moment';

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const CloseDivident = ({open, singleDivident, handleClose, assetDetail }) => {

    // console.log(singleDivident, "Robin is not in the main");
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const [candb, setCandb] = useState([]);
    const [select, setSelect] = useState({});
    // const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
    const [searchValue, setSearchValue] = React.useState(null);


  //Data fetching
  const { isLoading: isLoadingCandB, refetch: refetchAccount } = useQuery(
    "cash&bank_list",
    () => listAccount({ account_type: [1, 2], search: searchValue }),
    {
      onSuccess: (res) => {
        if (res.StatusCode === 6000) {
          if (res.StatusCode === 6000 && res.data.length > 0) {
            setCandb(res.data);
            // !props.edit && setSelect(res.data[0]); // Only set when edit is tru from the prop
            // if (props.edit) {
            //   let account = res.data.filter(
            //     (item) => item.id === props.stockData.from_account
            //   );
            //   setSelect(account[0]);
            //   // console.log(account, res.data, props.stockData.id, ">>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<))(((((()00");
            // }
          }
        }
      },
    }
  );

  const closeDividendMutate = useMutation({
    mutationFn: newData => closeDividend(newData),
    onSuccess: res => {
        if (res.StatusCode === 6000) {
            dispatch(
                openSnackbar({
                  open: true,
                  message: res.message || res.data,
                  severity: "success",
                })
              );
              queryClient.invalidateQueries("list-divident");
              handleClose();
        } else {
            dispatch(
                openSnackbar({
                  open: true,
                  message: res.message || res.data,
                  severity: "warning",
                })
              );
              queryClient.invalidateQueries("list-divident");
              handleClose();
        }
    }
  })

  const submitTransaction = function () {
    let payload = {
        date: moment().format("YYYY-MM-DD"),
        time: moment().format('HH:mm:ss'),
        asset_master_id: assetDetail.id,
        from_account: select.id,
        id: singleDivident.id
    }

    closeDividendMutate.mutate(payload)
  }


  return (
    <ZincoModal open={open} handleClose={handleClose}>
      <div className="">
        <div className="p-3">
        <SearchField
          placeholder={"Search Account"}
          width={"100%"}
          valuen={searchValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              refetchAccount();
            }
          }}
          onChange={(e) => setSearchValue(e.target.value)}
          onClickBTN={() => refetchAccount()}
        />
        </div>

        <div className="p-2 pb-0">
        <div className=" w-[472.5px] h-[255px] overflow-y-auto mt-2">
          <div className="mt-3 grid grid-cols-4 grid-rows-2 gap-2 pb-2">
            {!isLoadingCandB ? (
              candb.map((data, key) => (
                <div
                  style={{
                    backgroundColor: data?.id === select?.id && "#F6F6F6",
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
        </div>

        {/* <div className="w-full flex justify-center py-3">
          <input
            type="date"
            className="border-[1px] px-[48px] py-[6px] rounded-full max-w-[220px]"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div> */}
      </div>

      <div className="flex justify-between items-center p-1 border-t">
        <IconButton onClick={() => handleClose()}>
          <img src={Icone.ClipIcon} alt="" />
        </IconButton>
        <div className="flex items-center">
          <p className="text-[16px] font-[500]">{select?.account_name}</p>
        </div>
        <IconButton onClick={submitTransaction}>
          <img src={Icone.CheckIcon} alt="" />
        </IconButton>
      </div>
    </ZincoModal>
  )
}

export default CloseDivident