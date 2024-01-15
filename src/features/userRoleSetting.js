import { UserData } from "../globalVariable";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { listUserType, userRoles } from "../Api/Organizations/organizationsApi";

const listUserTypeState = {state:[]}

let userTypeState = {state:{
    id: "000",
    user_type_name: "xyz"}
}

const userRoleState = {state:{
  transfer: {
    id: "",
    name: "transfer",
    view_permission: true,
    save_permission: true,
    edit_permission: true,
    delete_permission: true,
  },
  transaction_filter: {
    id: "",
    name: "transaction_filter",
    view_permission: true,
    save_permission: true,
    edit_permission: true,
    delete_permission: true,
  },
  report_export: {
    id: "",
    name: "report_export",
    view_permission: true,
    save_permission: true,
    edit_permission: true,
    delete_permission: true,
  },
  loan: {
    id: "",
    name: "loan",
    view_permission: true,
    save_permission: true,
    edit_permission: true,
    delete_permission: true,
  },
  income: {
    id: "",
    name: "income",
    view_permission: true,
    save_permission: true,
    edit_permission: true,
    delete_permission: true,
  },
  expense: {
    id: "",
    name: "expense",
    view_permission: true,
    save_permission: true,
    edit_permission: true,
    delete_permission: true,
  },
  account: {
    id: "",
    name: "account",
    view_permission: true,
    save_permission: true,
    edit_permission: true,
    delete_permission: true,
  },
  contact: {
    id: "",
    name: "contact",
    view_permission: true,
    save_permission: true,
    edit_permission: true,
    delete_permission: true,
  },
  asset: {
    id: "",
    name: "asset",
    view_permission: true,
    save_permission: true,
    edit_permission: true,
    delete_permission: true,
  },
  account_balance: {
    id: "",
    name: "account_balance",
    view_permission: true,
    save_permission: true,
    edit_permission: true,
    delete_permission: true,
  },
  isLoading: false,
}};

// export const calluserTypeList = createAsyncThunk("fetchUserTypeList", async () => {
//     const res = await listUserType();
//     console.log(res.data, "User list typ redux");
//     return res.data
// })

// export const callUserRoll = createAsyncThunk("fetchUserSettings", async () => {
//     // console.log(listUserTypeState, "user type id ");
//     const res = await userRoles({
//         user_type: "1eb23a5d-3d35-417a-9fc0-2098945205bd",
//         type: "list"
//     });
//     return res.data
// })

// export const calluserTypeList = createAsyncThunk("fetchUserTypeList", async (_, { dispatch }) => {
//     const res = await listUserType();
//     // console.log(res.data, "User list typ redux");
//     if (res.data && res.data.length > 0) {
//         dispatch(callUserRoll(res.data[0].user_type_id));
//         dispatch(userTypeSclice.actions.setUserType(res.data[0]));
//     }
//     return res.data;
// });

export const callUserRoll = createAsyncThunk("fetchUserSettings", async (userTypeId) => {
    const res = await userRoles({
        user_type_id: userTypeId,
        type: "list"
    });
    return res.data;
});

const userTypeSclice = createSlice({
    name: "userType",
    initialState: userTypeState,
    reducers: {
        setUserType: (state, action) => {
            // for (let prop in state) {
            //     if (state.hasOwnProperty(prop)) {
            //         delete state[prop];
            //     }
            // }

            // Assign the properties of obj to state
            // Object.assign(state, action.payload);
            // state = action.payload;

            state.state = action.payload;
        }
    }
})

// const userTypeListSclice = createSlice({
//     name: 'userTypelist',
//     initialState: listUserTypeState,
//     reducers: {
//         setUseTypeList: (state, action)=> {

//         }
//     },
//     extraReducers: builder => {
//         builder.addCase(calluserTypeList.pending, (state, action) => {
//             state = []
//         })
//         builder.addCase(calluserTypeList.fulfilled, (state, action) => {
//             // for (let prop in state) {
//             //     if (state.hasOwnProperty(prop)) {
//             //         delete state[prop];
//             //     }
//             // }

//             // Assign the properties of obj to state
//             // Object.assign(state, action.payload);
//             console.log(action.payload, "Api fome redux 🎉🎉🎉 📦📦📦 🎉🎉🎉");
//             state.state = action.payload;
//             console.log(state, "Api fome redux 🎉🎉🎉 📦📦📦 🎉🎉🎉");
//         })
//         builder.addCase(calluserTypeList.rejected, (state, action) => {
//             state = []
//         })
//     }
// })

const userRoleSclice = createSlice({
    name: "userRole",
    initialState: userRoleState,
    reducers: {
        setUserRole: (state, action) => {
            let obj = action.payload;
            let keys = Object.keys(obj)[0];
            state.state[keys] = obj[keys];
            // console.log('Payload:', obj, 'Keys:', keys);
        }
    },
    extraReducers: builder => {
        builder.addCase(callUserRoll.pending, (state, action) => {
            state.state.isLoading = true
            // console.log("Pending", "Api fome  🎉🎉🎉 🎉🎉🎉");
        })
        builder.addCase(callUserRoll.fulfilled, (state, action) => {
            console.log(action.payload, "Api fome redux 🎉🎉🎉 🎉🎉🎉");
            if (action.payload.length > 0) {
                let obj = action.payload.reduce((acc, cur) => {
                acc[cur.name] = cur;
                return acc;
                }, {});
                console.log(obj, "Api fome redux 🎉🎉🎉 🎉🎉🎉");
                state.state = obj;
                state.state.isLoading = false
                console.log(state, "Api fome redux 🎉🎉🎉 🎉🎉🎉");
            }
            

            // Clear the state object
            // for (let prop in state) {
            //     if (state.hasOwnProperty(prop)) {
            //         delete state[prop];
            //     }
            // }

            // Assign the properties of obj to state
            // Object.assign(state, obj);
            // state.isLoading = false
            
        })
        builder.addCase(callUserRoll.rejected, (state, action) => {
            // console.log("Rejected  ", "Api fome  🎉🎉🎉 🎉🎉🎉");
            state.state.isLoading = true
        })
    }
})

export const { setUserType } = userTypeSclice.actions;
// export const { setUseTypeList } = userTypeListSclice.actions;
export const { setUserRole } = userRoleSclice.actions;

// export const userTypeList = userTypeListSclice.reducer;
export const userType = userTypeSclice.reducer;
export const userRole = userRoleSclice.reducer;


// const userRollReducer = useSelector(state => state.userRole.state)
// userRollReducer.account_balance.view_permission
