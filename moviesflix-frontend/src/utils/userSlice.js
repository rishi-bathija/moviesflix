import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        addUser: (state, action) => {
            return action.payload;
        },
        removeUser: (state, action) => {
            return null;
        }
    }
})

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;


// 4 Steps to redux:-
// 1) Create a store (appStore)
// 2) Create a slice (userSlice)
// 3) Add the slice reducer onto the store
// 4) Provide the store


// As soon as a user sign in/ sign up, i have to add the userinfo to the userSlice