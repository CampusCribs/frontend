import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PostData = {
  title: string;
  description: string;
  price: number;
  roommates: number;
};

const initialState: PostData = {
  title: "",
  description: "",
  price: 0,
  roommates: 0,
};

const PostDataSlice = createSlice({
  name: "postdata",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<PostData>) {
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.price = action.payload.price;
      state.roommates = action.payload.roommates;
    },
    removeUser(state) {
      state.title = "";
      state.description = "";
      state.price = 0;
      state.roommates = 0;
    },
  },
});

export default PostDataSlice.reducer;
