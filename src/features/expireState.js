import { createSlice } from "@reduxjs/toolkit";

// let isActive = JSON.parse(localStorage.getItem("isUserActivate"))

const initialState = {
    userDetails: {
        isUserExpired: false,
        date: ""
    }
}

export const userStateSclicer = createSlice({
    name: 'credential',
    initialState,
    reducers: {
        isActivateUser: (state, action) => {
            state.userDetails = action.payload
        }
    }
})

export const {isActivateUser} = userStateSclicer.actions;
export default userStateSclicer.reducer