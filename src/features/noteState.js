import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userDetails: {
        note: "",
        date: "",
        boolean: false
    }
}

export const noteSclicer = createSlice({
    name: 'credential',
    initialState,
    reducers: {
        addnotes: (state, action) => {
            state.userDetails = action.payload
        },
        removeNotes: (state, action) => {
            state.userDetails = {}
        }
    }
})

export const {addUser, removeUser} = noteSclicer.actions;
export default noteSclicer.reducer