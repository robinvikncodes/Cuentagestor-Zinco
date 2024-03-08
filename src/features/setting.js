import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { detailSettings } from "../Api/Setting/SettingApi";
import { callUserRoll } from "./userRoleSetting";
import moment from "moment";

const initialState = {
    settingDetails: {
        isLoading: false,
        is_reminder: false,
        is_zakath: false,
        is_interest: false,
        rounding: 2,
        currency: 1,
        reminder_day: 1,
        photo: null,
        email: "",
        name: "",
        user_type: 1,
        expiry_date: "",
        isExpired: true,
        image: null,
    }
}

// You want to dispatch this function in the App component
export const callSettings = createAsyncThunk("fetchSettings", async (_, { dispatch }) => {
    const res = await detailSettings();
    // console.log("Settings is caling &&&&&&&&&&&&&*&&&&&&&&&&&&&&&&&&&&*&&*&*&**&8");
    dispatch(callUserRoll(res.data.user_type));
    return res.data
})

const settingSclicer = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettings: (state, action) => {
            Object.keys(action.payload).forEach(key => {
                state.settingDetails[key] = action.payload[key];
            });
        }
    },
    extraReducers: builder => {
        builder.addCase(callSettings.pending, (state, action) => {
            state.settingDetails.isLoading = true
        })
        builder.addCase(callSettings.fulfilled, (state, action) => {
            state.settingDetails.isLoading = false
            state.settingDetails.is_reminder = action.payload.is_reminder
            state.settingDetails.is_zakath = action.payload.is_zakath
            state.settingDetails.is_interest = action.payload.is_interest
            state.settingDetails.rounding = action.payload.rounding
            state.settingDetails.user_type = action.payload.user_type 
            state.settingDetails.image = action.payload.logo 
            state.settingDetails.expiry_date = action.payload.expiry_date 
            state.settingDetails.reminder_day = action.payload.reminder_day
            state.settingDetails.photo = action.payload.profiles.photo
            state.settingDetails.email = action.payload.profiles.email
            state.settingDetails.name = action.payload.profiles.first_name 
            state.settingDetails.isExpired = moment().isBefore(moment(action.payload.expiry_date));
            // state.settingDetails.currency = action.payload.currency
            // let today = moment(); // get today's date
            // let compareDate = moment(action.payload.expiry_date ); // the date you want to compare
            // let isExpired = today.isBefore(compareDate);
        })
        builder.addCase(callSettings.rejected, (state, action) => {
            state.settingDetails.isLoading = true
        })
    }
})

export const { setSettings } = settingSclicer.actions;
export default settingSclicer.reducer