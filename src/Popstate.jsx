import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./Notificationslice";
import profileReducer from "./Profileslice";
import searchReducer from "./Searchslice";
import imageReducer from "./Imageslice";
import friendReducer from "./Friendslice";
import recieveReducer from "./RecieveSlice";

export const store = configureStore({
  reducer: {
    notificate: notificationReducer,
    profile: profileReducer,
    search: searchReducer,
    image: imageReducer,
    friend: friendReducer,
    recieve: recieveReducer,
  },
});
