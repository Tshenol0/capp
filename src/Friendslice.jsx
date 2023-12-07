import { createSlice } from "@reduxjs/toolkit";

export const friendSlice = createSlice({
  name: "friend",
  initialState: {
    friend: "",
  },
  reducers: {
    setFriend: (state, action) => {
      state.friend = action.payload;
    },
  },
});

export const { setFriend } = friendSlice.actions;

export default friendSlice.reducer;
