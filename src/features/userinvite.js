import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInviteRedux: {
        open: false,
        message: "",
    }
}

export const inviteUserSclicer = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        openSuccessModal: (state, action) => {
            state.userInviteRedux.open = true
            state.userInviteRedux.message = action.payload.message
        },
        closeSuccessModal: (state, action) => {
            state.userInviteRedux.open = false
            state.userInviteRedux.message = ""
        }
    }
})

export const {openSuccessModal, closeSuccessModal} = inviteUserSclicer.actions;
export default inviteUserSclicer.reducer