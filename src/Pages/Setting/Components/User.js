// import styled from "@emotion/styled";
import { styled } from "@mui/material/styles";
import { Autocomplete, Button, Chip, IconButton, TextField } from "@mui/material";
import React, { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ZincoSwitch from "../../../Components/Component/ZincoSwitch";
import AddUserModal from "./AddUserModal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { listUser } from "../../../Api/Organizations/organizationsApi";
import { openSnackbar } from "../../../features/snackbar";
import { Icone } from "../../../Assets/AssetsLog";

const User = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [openAU, setOpenAU] = useState(false);
  const [is_edit, setIs_edit] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [listUsers, setListUsers] = useState([]);

  //
  const handleOpenAU = () => setOpenAU(true);
  const handleCloseAU = () => {
    setOpenAU(false);
    setIs_edit(false);
  };
  const handleEdit = (user) => {
    setIs_edit(true);
    setOpenAU(true);
    setSelectedUser(user);
  };

  useQuery(
    "listUsers",
    () =>
      listUser({
        method: "get",
      }),
    {
      onSuccess: (res) => {
        if (res.StatusCode === 6000) {
          setListUsers(res.data);
        }
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const mutation = useMutation({
    mutationFn: (newData) =>
      listUser({
        method: "delete",
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

  const handleDelete = (id) => {
    mutation.mutate({ id });
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center px-5 pb-5 border-b-[1px] border-[#DEDEDE]">
          <p className="text-[16px] font-[400]">User</p>
          <div className="flex items-center">
            {/* <p className="mr-[15px] text-[#868686] text-[13px] font-[400]">User role</p> */}

            <StyledButton onClick={handleOpenAU} startIcon={<AddRoundedIcon />}>
              Add User
            </StyledButton>
          </div>
        </div>

        <div className="p-5">
          {listUsers.map((user) => (
            <div
              key={user.id}
              className="flex justify-between p-3 borderStyle rounded-[12px] mb-2"
            >
              <div className="flex">
                <div className="bg-[#DFFFEA] p-[10px] rounded-full mr-3">
                  <img src={Icone.PersonIcon} alt="" />
                </div>
                <div>
                  <p className="text-[16px] font-[400]">{user.username}</p>
                  <p className="text-[#868686] text-[13px] font-[400]">
                    {user.user_type.user_type_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                {user.is_owner ? (
                  <Chip color="info" label="Owner" />
                ) : (
                  <Chip
                    color={
                      user.status === 1
                        ? "success"
                        : user.status === 0
                        ? "error"
                        : "warning"
                    }
                    label={
                      user.status === 1
                        ? "Active"
                        : user.status === 0
                        ? "Inactive"
                        : "Pending"
                    }
                    size="small"
                  />
                )}
                {!user.is_owner && (
                  <>
                    {user.status !== 2 && (
                      <IconButton
                        aria-label="delete"
                        color="error"
                        sx={{ color: "#3634A8" }}
                        onClick={() => handleEdit(user)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton
                      aria-label="delete"
                      color="error"
                      sx={{ color: "#3634A8" }}
                      onClick={() => handleDelete(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {openAU && (
        <AddUserModal
          open={openAU}
          handleClose={handleCloseAU}
          is_edit={is_edit}
          selectedUser={selectedUser}
        />
      )}
    </>
  );
};

export default User;

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
