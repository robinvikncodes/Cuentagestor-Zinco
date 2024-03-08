import React, { useEffect, useState } from "react";
import ZincoModal from "../../Component/ZincoModal";
import AddButton from "../../Component/AddButton";
import { useMutation, useQuery } from "react-query";
import { listOrginization } from "../../../Api/Organizations/organizationsApi";
import { openSnackbar } from "../../../features/snackbar";
import { useDispatch, useSelector } from "react-redux";
import { UserData } from "../../../globalVariable";

const CompanyModal = (props) => {
  const dispatch = useDispatch();
  const [orginizationList, setOrginizationList] = useState([]);
  // const [selectedOrg, setSelectedOrg] = useState({});

  useQuery("list-orginization", () => listOrginization({ method: "get" }), {
    onSuccess: (res) => {
      if (res?.StatusCode === 6000) {
        setOrginizationList(res.data);
        // let org = res.data.filter(org => UserData.organization === org.organization)[0]
        // setSelectedOrg(org)
        console.log(res.data);
      }
    },
  });
  console.log(orginizationList);

  const mutate = useMutation({
    mutationFn: (newData) => listOrginization(newData),
    onSuccess: (res) => {
      if (res.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: res.message || "Company Switch Successfully",
            severity: "success",
          })
        );
        let storageData = JSON.stringify({
          ...UserData,
          organization: res.data.id,
          country_details: res.data.country_details,
        });
        localStorage.setItem("UserCredentials", storageData);
        window.location.reload();
        // console.log(res.data.id);
      }
    },
  });

  const changeOrg = function (org) {
    // setSelectedOrg(org)
    let payload = {
      data: { id: org.organization },
      method: "post",
    };
    mutate.mutate(payload);
  };

  // useEffect(() => {
  //   changeOrg()
  // }, [selectedOrg])

  return (
    <ZincoModal
      // key={"Soman"}
      open={props.open}
      handleClose={props.handleClose}
      {...props}
    >
      <div className="min-h-[34rem]">
        <div className="flex justify-between items-center px-[26px] py-[21px]">
          <p className="text-[16px] font-[400]">Companies</p>
          {<AddButton name={"companies"} addbgcolor={"white"} />}
        </div>
        <div className="">
          <input
            type="text"
            placeholder="Search"
            className="px-6 py-4 w-full bg-[#EEEEEE]"
          />
          {orginizationList?.map((country, key) => (
            <p
              key={key + 1}
              style={{
                backgroundColor:
                  UserData.organization === country.organization
                    ? "#f0f8ff"
                    : "",
              }}
              className="px-6 py-4 bg-white border-b-[1px] text-[14px] text-[#737373] font-[400] cursor-pointer hover:bg-slate-200"
              onClick={() => changeOrg(country)}
            >
              {country.organization_name}
            </p>
          ))}
        </div>
        <div className="h-7"></div>
      </div>
    </ZincoModal>
  );
};

export default CompanyModal;
