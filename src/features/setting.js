import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { detailSettings } from "../Api/Setting/SettingApi";

const initialState = {
    settingDetails: {
        is_reminder: false,
        is_zakath: false,
        is_interest: false,
        rounding: 2,
        currency: 2,
    }
}

export const callSettings = createAsyncThunk("fetchSettings", async () => {
    const res = await detailSettings();
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

            // state.settingDetails.is_interest = action.payload.is_interest
            // state.settingDetails.is_zakath = action.payload.is_zakath
            // state.settingDetails.rounding = action.payload.rounding
        }
    },
    extraReducers: builder => {
        builder.addCase(callSettings.pending, (state, action) => {
            
        })
        builder.addCase(callSettings.fulfilled, (state, action) => {
            state.settingDetails.is_reminder = action.payload.is_reminder
            state.settingDetails.is_zakath = action.payload.is_zakath
            state.settingDetails.is_interest = action.payload.is_interest
            state.settingDetails.rounding= action.payload.rounding
            state.settingDetails.currency= 2
        })
        builder.addCase(callSettings.rejected, (state, action) => {

        })
    }
})

export const { setSettings } = settingSclicer.actions;
export default settingSclicer.reducer