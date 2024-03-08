import React, { useEffect, useState } from "react";
import ZincoModal from "../../../Components/Component/ZincoModal";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
  styled,
} from "@mui/material";
// import  from "@emotion/styled";
import ZincoTextField from "../../../Components/Component/ZincoTextField";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  listUser,
  listUserType,
} from "../../../Api/Organizations/organizationsApi";
import { openSnackbar } from "../../../features/snackbar";
import { useDispatch } from "react-redux";
import ZincoSwitch from "../../../Components/Component/ZincoSwitch";

const AddUserModal = (props) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [userEmail, setUserName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [disable, setDisable] = useState(false)
  const [useTypeList, setUseTypeList] = useState([]);
  const [selectUserType, setSelectUserType] = useState({
    id: "",
    user_type_name: "",
  });

  const handleUserTypeChange = (e, value) => {
    setSelectUserType(value);
  };

  const submitUserType = (e) => {
    e.preventDefault();
    console.log(userEmail, selectUserType);
    let payload = {
      email: userEmail,
      user_type: selectUserType.id,
    };
    console.log(payload);
    if (props.is_edit) {
      payload.is_active = isActive ? 1 : 0;
      payload.id = props.selectedUser.id;
    }
    mutation.mutate(payload);
  };

  useQuery("listUserType", () => listUserType(), {
    onSuccess: (res) => {
      if (res.StatusCode === 6000) {
        setUseTypeList(res.data);

        let userty = res.data.filter((item) => item.user_type_id === 1)[0];
        console.log(userty);
        setSelectUserType(userty);
      }
    },
  });

  const mutation = useMutation({
    mutationFn: (newData) =>
      listUser({
        method: props.is_edit ? "put" : "post",
        data: newData,
      }),
    onSuccess: (res) => {
      console.log(res);
      if (res.StatusCode === 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: res.message || res.data,
            severity: "success",
          })
        );
        queryClient.invalidateQueries("listUsers");
        props.handleClose();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message:
              res.errors || res.message || res.error || "Ont updated yet",
            severity: "warning",
          })
        );
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    console.log(props.selectedUser);
    if (props.is_edit && props.selectedUser.user_type.user_type_id) {
      setUserName(props.selectedUser.email || "");
      let uerId = props.selectedUser.user_type.user_type_id;
      const usertype = useTypeList.filter((ul) => ul.user_type_id === uerId)[0];
      setSelectUserType(usertype);
      setIsActive(props.selectedUser.status === 1 ? true : false)
      setDisable(true)
    }
  }, [props.is_edit, props.selectedUser, useTypeList]);

  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <Box sx={style}>
        <div className="px-[26px] py-[21px]">
          <p className="text-[16px] font-[400] mb-5">Invite User</p>
          <form onSubmit={submitUserType}>
            <ZincoTextField
              required
              value={userEmail}
              disabled={disable}
              onChange={(e) => setUserName(e.target.value)}
              type="email"
              name="userType_name"
              label={"User Email"}
            />
            <p className="mr-[15px] text-[13px] font-[400]">User Type</p>
            <StyledAutocomplete
              color="red"
              funce="sound"
              popperprops={{
                style: popperStyle,
              }}
              placeholder="Select App"
              options={useTypeList}
              getOptionLabel={(option) => option.user_type_name}
              //   isOptionEqualToValue={(option, value) => option.id === value.id}
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
            {props.is_edit && (
              <>
                <p className="mr-[15px] text-[13px] font-[400]">
                  Is Active User
                </p>
                <ZincoSwitch
                  checked={isActive}
                  onChange={(e) => {
                    setIsActive(e.target.checked);
                  }}
                />
              </>
            )}

            <SaveButton disabled={mutation.isLoading} type="submit">
              {mutation.isLoading ? (
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
                props.is_edit ? "Edit User" : "Invite User"
              )}
            </SaveButton>
          </form>
        </div>
      </Box>
    </ZincoModal>
  );
};

export default AddUserModal;

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "background.paper",
  borderRadius: "22px",
  boxShadow: 24,
};

const popperStyle = {
  // Custom styles for the popper
  backgroundColor: "blue",
  borderRadius: "4px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  zIndex: (theme) => theme.zIndex.modal + 1, // Adjust the z-index as needed
};

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => {
  return {
    "& .MuiOutlinedInput-root": {
      // Styles for the input element
      //   backgroundColor: 'lightgray',
      //   width: "289px",
      borderRadius: "8px",
      border: "1px solid #E7E7E7",
      backgroundColor: "#FAFAFA",
      paddingTop: "0px",
      paddingBottom: "0px",
      marginBottom: "20px",
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
