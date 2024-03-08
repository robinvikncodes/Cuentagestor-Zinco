// import  from "@emotion/styled";
import { Autocomplete, Button, IconButton, TextField, styled} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Icone } from "../../../Assets/AssetsLog";
import CreateUserTypeModal from "./CreateUserTypeModal";
import ZincoSwitch from "../../../Components/Component/ZincoSwitch";
import { openSnackbar } from "../../../features/snackbar";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { listUserType, userRoles } from "../../../Api/Organizations/organizationsApi";
import { useDispatch } from "react-redux";

const UserRole = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient();
  // const reduxUserType = useSelector(state => state.userType.state)
  // const reduxUserTypeList = useSelector(state => state.userTypeList.state)
  // const reduxUserRole = useSelector(state => state.userRole.state)
  // console.log(reduxState.userType);
  const [curmOpen, setCurmOpen] = useState(false);
  // const [selectUserType, setSelectUserType] = useState(reduxUserType)
  // const [useTypeList, setUseTypeList] = useState(reduxUserTypeList);
  // const [userRoleList, setUserRoleList] = useState(reduxUserRole);
  const [selectUserType, setSelectUserType] = useState({
    id: "",
    user_type_name: "",
    user_type_id: "",
  })
  const [useTypeList, setUseTypeList] = useState([]);
  const [userRoleList, setUserRoleList] = useState({
    transfer: {
      id: "",
      name: "transfer",
      view_permission: true,
      save_permission: true,
      edit_permission: true,
      delete_permission: true,
    },
    transaction_filter: {
      id: "",
      name: "transaction_filter",
      view_permission: true,
      save_permission: true,
      edit_permission: true,
      delete_permission: true,
    },
    report_export: {
      id: "",
      name: "report_export",
      view_permission: true,
      save_permission: true,
      edit_permission: true,
      delete_permission: true,
    },
    loan: {
      id: "",
      name: "loan",
      view_permission: true,
      save_permission: true,
      edit_permission: true,
      delete_permission: true,
    },
    income: {
      id: "",
      name: "income",
      view_permission: true,
      save_permission: true,
      edit_permission: true,
      delete_permission: true,
    },
    expense: {
      id: "",
      name: "expense",
      view_permission: true,
      save_permission: true,
      edit_permission: true,
      delete_permission: true,
    },
    create_accounts: {
      id: "",
      name: "create_accounts",
      view_permission: true,
      save_permission: true,
      edit_permission: true,
      delete_permission: true,
    },
    contact: {
      id: "",
      name: "contact",
      view_permission: true,
      save_permission: true,
      edit_permission: true,
      delete_permission: true,
    },
    asset: {
      id: "",
      name: "asset",
      view_permission: true,
      save_permission: true,
      edit_permission: true,
      delete_permission: true,
    },
    account_balance: {
      id: "",
      name: "account_balance",
      view_permission: true,
      save_permission: true,
      edit_permission: true,
      delete_permission: true,
    }});
  // const userRoleList = reduxRoll;

  
  //Component functions
  const curmHandleClose = () => setCurmOpen(false)

  const handleUserTypeChange = (e, value) => {
    console.log(value);
    setSelectUserType(value);
    // refetch()
    // queryClient.invalidateQueries(["userRolesList"])
    // dispatch(setUserType(value))
    // dispatch(callUserRoll(value.user_type_id))
    // setUserRoleList({})
    // console.log(value);
    // userRoles
  }

  useQuery(
    "listUserType",
    () => listUserType(),
    {
      onSuccess: res => {
        if (res.StatusCode === 6000) {
          setUseTypeList(res.data);

          if (selectUserType.id === ""){
            let userty = res.data.filter(item => item.user_type_id === 1)[0]
            console.log(userty);
            setSelectUserType(userty)
          } else {
            let array1 = res.data;
            let array2 = useTypeList
            let map = {};
            array2.forEach((item) => (map[item.id] = true)); // Create a hash map with "array2" ids
            let unmatched = array1.filter((item) => !map[item.id])[0]; // Filter out the items in "array1" that are not in the hash map
            setSelectUserType(unmatched)
            console.log(unmatched); // This will log the unmatched objects

          }
        }
      }
    }
  );
// console.log(useTypeList);
  let { refetch: refetchUserRoles } = useQuery(
    "userRolesList",
    () => userRoles({
      type: "list",
      user_type_id: selectUserType.user_type_id,
    }),
    {
      enabled: selectUserType.id ? true : false,
      onSuccess: (res) => {
        if (res.StatusCode === 6000) {
          // setUseTypeList(res.data);
          if (res.data.length > 0) {
            let obj = res.data.reduce((acc, cur) => {
            acc[cur.name] = cur;
            return acc;
          }, {});
          // console.log(JSON.stringify(obj));
          setUserRoleList(obj)
          }
        }else {

        }
      },
    }
  );

  const userRoleMutate = useMutation({
    mutationFn: newData => userRoles({...newData}),
    onSuccess: res => {
      if (res.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: res.message || res.data,
            severity: "success",
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: res.errors || res.message || res.error || "Ont updated yet",
            severity: "warning",
          })
        );
      }
    },
    onError: err => {
      dispatch(
        openSnackbar({
          open: true,
          message: "Some error occured in the api",
          severity: "error",
        })
      );
    }
  })

  const changeUserRole = function(e, userRole) {
    console.log(userRole);
    setUserRoleList({
      ...userRoleList,
      [userRole.name]: {
        ...userRoleList[userRole.name],
        [e.target.name]: !userRole[e.target.name],
      },
    });
    // dispatch(setUserRole({
    //   [userRole.name]: {
    //     ...userRoleList[userRole.name],
    //     [e.target.name]: !userRole[e.target.name],
    //   }
    // }))
    let payload = {
      // user_type: selectUserType.id,
      type: "update",
      id: userRole.id,
      permission_name: e.target.name,
      value: !userRole[e.target.name],
    };
    userRoleMutate.mutate(payload)
    // console.log(payload);
  }

  useEffect(() => {
    selectUserType.id && refetchUserRoles()
}, [selectUserType]);

  return (
    <>
    <div>
      <div className="flex justify-between items-center px-5 pb-5 border-b-[1px] border-[#DEDEDE]">
        <p className="text-[16px] font-[400]">User roles</p>
        <div className="flex items-center">
          <p className="mr-[15px] text-[#868686] text-[13px] font-[400]">User type</p>
          <StyledAutocomplete
            color="red"
            funce="sound"
            popperprops={{
              style: popperStyle,
            }}
            placeholder="Select App"
            options={useTypeList}
            getOptionLabel={option => option.user_type_name}
            disableClearable
            // isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectUserType}
            onChange={(e, value) => handleUserTypeChange(e, value)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                // placeholder={"placeholder"}
                fullWidth
              />
            )}
          />
          <StyledButton onClick={() => setCurmOpen(true)} startIcon={<AddRoundedIcon />}>Add User Type</StyledButton>
        </div>
      </div>
      <div className="p-[21px]">
        <div className="borderStyle rounded-[22px]">
        <table className="w-full">
            <thead>
                <tr>
                    <th className="px-[25px] py-[15px] border-[#E0E0E0] text-left text-[16px] font-[400] ">Section</th>
                    <th className="px-[25px] py-[15px] border-[#E0E0E0] text-left text-[16px] font-[400] w-[13%]">View</th>
                    <th className="px-[25px] py-[15px] border-[#E0E0E0] text-left text-[16px] font-[400] w-[13%]">Create</th>
                    <th className="px-[25px] py-[15px] border-[#E0E0E0] text-left text-[16px] font-[400] w-[13%]">Edit</th>
                    <th className="px-[25px] py-[15px] border-[#E0E0E0] text-left text-[16px] font-[400] w-[13%]">delete</th>
                </tr>
            </thead>
            <tbody>
              {Object.keys(userRoleList).map((role, index) => (
                <tr key={index}>
                  <td className="px-[25px] py-[7px] border-t-[1px] border-[#E0E0E0] text-[#868686] text-[14px] font-[400]">{role.charAt(0).toUpperCase() + role.slice(1)}</td>
                  <td className="px-[25px] py-[7px] border-t-[1px] border-[#E0E0E0]"><ZincoSwitch name="view_permission"   checked={userRoleList[role].view_permission}   onChange={e => changeUserRole(e, userRoleList[role])}/></td>
                  <td className="px-[25px] py-[7px] border-t-[1px] border-[#E0E0E0]"><ZincoSwitch name="save_permission"   checked={!(role === "transaction_filter" || role === "report_export" || role === "account_balance") && userRoleList[role].save_permission}   onChange={e => changeUserRole(e, userRoleList[role])} disabled={role === "transaction_filter" || role === "report_export" || role === "account_balance"}/></td>
                  <td className="px-[25px] py-[7px] border-t-[1px] border-[#E0E0E0]"><ZincoSwitch name="edit_permission"   checked={!(role === "transaction_filter" || role === "report_export" || role === "account_balance") && userRoleList[role].edit_permission}   onChange={e => changeUserRole(e, userRoleList[role])} disabled={role === "transaction_filter" || role === "report_export" || role === "account_balance"}/></td>
                  <td className="px-[25px] py-[7px] border-t-[1px] border-[#E0E0E0]"><ZincoSwitch name="delete_permission" checked={!(role === "transaction_filter" || role === "report_export" || role === "account_balance") && userRoleList[role].delete_permission} onChange={e => changeUserRole(e, userRoleList[role])} disabled={role === "transaction_filter" || role === "report_export" || role === "account_balance"}/></td>
                </tr>
              ))}
                {/* <tr>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0] text-[#868686] text-[14px] font-[400]" >Contacts</td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]" > <ZincoSwitch name="view_permission" checked={userRoleList.contact.view_permission}   onChange={e => changeUserRole(e, userRoleList.contact)}/> </td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]" > <ZincoSwitch name="save_permission" checked={userRoleList.contact.save_permission}   onChange={e => changeUserRole(e, userRoleList.contact)}/> </td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]" > <ZincoSwitch name="edit_permission" checked={userRoleList.contact.edit_permission}   onChange={e => changeUserRole(e, userRoleList.contact)}/> </td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]" > <ZincoSwitch name="delete_permission" checked={userRoleList.contact.delete_permission} onChange={e => changeUserRole(e, userRoleList.contact)}/> </td>
                </tr>
                <tr>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0] text-[#868686] text-[14px] font-[400]">Incomes</td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch name="view_permission" checked={userRoleList.income.view_permission} onChange={e => changeUserRole(e, userRoleList.income)}/></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch name="save_permission" checked={userRoleList.income.save_permission} onChange={e => changeUserRole(e, userRoleList.income)}/></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch name="edit_permission" checked={userRoleList.income.edit_permission} onChange={e => changeUserRole(e, userRoleList.income)}/></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch name="delete_permission" checked={userRoleList.income.delete_permission} onChange={e => changeUserRole(e, userRoleList.income)}/></td>
                </tr>
                <tr>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0] text-[#868686] text-[14px] font-[400]">Expenses</td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch name="view_permission" checked={userRoleList.expense.view_permission}   onChange={e => changeUserRole(e, userRoleList.expense)} /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch name="save_permission" checked={userRoleList.expense.save_permission}   onChange={e => changeUserRole(e, userRoleList.expense)} /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch name="edit_permission" checked={userRoleList.expense.edit_permission}   onChange={e => changeUserRole(e, userRoleList.expense)} /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch name="delete_permission" checked={userRoleList.expense.delete_permission} onChange={e => changeUserRole(e, userRoleList.expense)} /></td>
                </tr>
                <tr>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0] text-[#868686] text-[14px] font-[400]">Loans</td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch name="view_permission" checked={userRoleList.loan.view_permission}     onChange={e => changeUserRole(e, userRoleList.loan)} /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch name="save_permission" checked={userRoleList.loan.save_permission}     onChange={e => changeUserRole(e, userRoleList.loan)} /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch name="edit_permission" checked={userRoleList.loan.edit_permission}     onChange={e => changeUserRole(e, userRoleList.loan)} /></td>
                    <td className="px-[25px] py-[7px] border-b-[1px] border-[#E0E0E0]"><ZincoSwitch name="delete_permission" checked={userRoleList.loan.delete_permission} onChange={e => changeUserRole(e, userRoleList.loan)} /></td>
                </tr>
                <tr>
                    <td className="px-[25px] py-[7px] text-[#868686] text-[14px] font-[400]">Transfers</td>
                    <td className="px-[25px] py-[7px]"><ZincoSwitch name="view_permission" checked={userRoleList.transfer.view_permission}     onChange={e => changeUserRole(e, userRoleList.transfer)} /></td>
                    <td className="px-[25px] py-[7px]"><ZincoSwitch name="save_permission" checked={userRoleList.transfer.save_permission}     onChange={e => changeUserRole(e, userRoleList.transfer)} /></td>
                    <td className="px-[25px] py-[7px]"><ZincoSwitch name="edit_permission" checked={userRoleList.transfer.edit_permission}     onChange={e => changeUserRole(e, userRoleList.transfer)} /></td>
                    <td className="px-[25px] py-[7px]"><ZincoSwitch name="delete_permission" checked={userRoleList.transfer.delete_permission} onChange={e => changeUserRole(e, userRoleList.transfer)} /></td>
                </tr> */}
            </tbody>
        </table>
        </div>
      </div>
    </div>
    <CreateUserTypeModal open={curmOpen} handleClose={curmHandleClose}/>
    </>
  );
};

export default UserRole;

const popperStyle = {
  // Custom styles for the popper
  backgroundColor: "blue",
  borderRadius: "4px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  zIndex: (theme) => theme.zIndex.modal + 1, // Adjust the z-index as needed
};

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

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => {
  return {
    "& .MuiOutlinedInput-root": {
      // Styles for the input element
      //   backgroundColor: 'lightgray',
      width: "289px",
      borderRadius: "8px",
      border: "1px solid #E7E7E7",
      backgroundColor: "#FAFAFA",
      paddingTop: "0px",
      paddingBottom: "0px",
      marginRight: "25px"
    },
    "& .MuiInputLabel-root": {
      // Styles for the label element
      color: "blue",
      fontSize: "14px",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      // Styles for the focused outline of the outlined variant
      // borderColor: 'green',
      border: "none",
    },
    "& .MuiAutocomplete-option": {
      // Styles for each option in the dropdown men

      padding: theme.spacing(1),
      backgroundColor: "white",
      "&:hover": {
        backgroundColor: "lightblue",
      },
    },
    "& .MuiSvgIcon-root": {
      color: "black",
    },
  };
});
