import { createSlice } from "@reduxjs/toolkit";

export const recieveSlice = createSlice({
  name: "recieve",
  initialState: {
    recieve: [],
  },
  reducers: {
    setRecieve: (state, action) => {
      state.recieve = action.payload;
    },
  },
});

export const { setRecieve } = recieveSlice.actions;

export default recieveSlice.reducer;
