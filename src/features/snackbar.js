import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    snackBarRedux: {
        open: false,
        message: "",
        severity: "success"
    }
}

export const snackbarSclicer = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        openSnackbar: (state, action) => {
            state.snackBarRedux.open = action.payload.open
            state.snackBarRedux.message = action.payload.message
            state.snackBarRedux.severity = action.payload.severity
        },
        closeSnackbar: (state, action) => {
            state.snackBarRedux.open = false
            state.snackBarRedux.message = ""
        }
    }
})

export const {openSnackbar, closeSnackbar} = snackbarSclicer.actions;
export default snackbarSclicer.reducer