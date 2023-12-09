import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userDetails: {
        email: "",
        newUser: false,
        resetPassword: false
    }
}

export const credentialSclicer = createSlice({
    name: 'credential',
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.userDetails = action.payload
        },
        removeUser: (state, action) => {
            state.userDetails = {}
        }
    }
})

export const {addUser, removeUser} = credentialSclicer.actions;
export default credentialSclicer.reducer