import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: false,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setNotP: (state) => {
      state.profile = !state.profile;
    },
  },
});

export const { setProfile, setNotP } = profileSlice.actions;

export default profileSlice.reducer;
