import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notificate",
  initialState: {
    notification: false,
  },
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    setNotN: (state) => {
      state.notification = !state.notification;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setNotification, setNotN } = notificationSlice.actions;

export default notificationSlice.reducer;
