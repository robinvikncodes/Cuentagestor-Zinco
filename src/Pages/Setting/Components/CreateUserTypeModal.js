import React, { useState } from "react";
import ZincoModal from "../../../Components/Component/ZincoModal";
// import InputField from "../../UserCredentials/Components/InputField";
import { Box, Button, CircularProgress } from "@mui/material";
import styled from "@emotion/styled";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../../features/snackbar";
import { userRoles } from "../../../Api/Organizations/organizationsApi";
import ZincoTextField from "../../../Components/Component/ZincoTextField";
import { calluserTypeList } from "../../../features/userRoleSetting";
// import { useQueryClient } from "@tanstack/react-query";

const CreateUserTypeModal = (props) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [notes, setNotes] = useState("");

  const mutation = useMutation({
    mutationFn: (newData) => {
      return userRoles({ ...newData });
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.StatusCode !== 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.errors || data.message,
            severity: "error",
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: data.data || data.message,
            severity: "success",
          })
        );
        // Dispatch an action to update the userTypeListSclice state
        // dispatch(calluserTypeList());
        queryClient.invalidateQueries(["listUserType"]);
        props.handleClose();
      }
    },
  });

  const submitUserType = function (e) {
    e.preventDefault();

    let is_true = false;
    if (typeof userName === "string" && userName.trim().length > 3) {
      is_true = true;
    } else {
      is_true = false;
    }

    let payload = {
      user_type: "30f8c506-e27a-476c-8950-b40a6461bf61",
      type: "create",
      name: userName,
      notes: notes,
    };

    if (is_true) {
      mutation.mutate(payload);
      console.log(payload);
      // setErrorMsg("");
    } else {
      // setErrorMsg("This want to be same");
    }
  };

  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <Box sx={style}>
        <div className="px-[26px] py-[21px]">
          <form>
            {/* <InputField
              // icon={Icone.LockIcone}
              placeholder={"Password"}
              error={errorMsg}
              required
              ispassword={true}
              onChange={(e) => setUserName(e.target.value)}
            /> */}
            <p className="text-[16px] font-[400] mb-5">Add User Type </p>
            <ZincoTextField
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              name="userType_name"
              label={"User Type Name"}
            />
            <label htmlFor="usertype_notes" className="text-[12px] font-[400] mb-3">Note</label>
            <textarea
              className="border-[#E4E4E4] border-[1px] px-[11px] py-[9px] rounded-[8px] text-[11px] mb-3 w-full"
              name="income"
              id="usertype_notes"
              // cols="25"
              rows="6"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type here.."
            ></textarea>

            <SaveButton disabled={mutation.isLoading} type="submit" onClick={submitUserType}>
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
                "Add User Type"
              )}
            </SaveButton>
          </form>
        </div>
      </Box>
    </ZincoModal>
  );
};

export default CreateUserTypeModal;

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
