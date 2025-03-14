import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PostData = {
  title: string;
  description: string;
  price: number;
  roommates: number;
  BeginDate: string;
  EndDate: string;
};

const initialState: PostData = {
  title: "",
  description: "",
  price: 0,
  roommates: 0,
  BeginDate: new Date().toISOString(),
  EndDate: new Date().toISOString(),
};

const PostDataSlice = createSlice({
  name: "postdata",
  initialState,
  reducers: {
    setPostData(state, action: PayloadAction<PostData>) {
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.price = action.payload.price;
      state.roommates = action.payload.roommates;
      state.BeginDate = action.payload.BeginDate;
      state.EndDate = action.payload.EndDate;
    },
    removePostData(state) {
      state.title = "";
      state.description = "";
      state.price = 0;
      state.roommates = 0;
      state.BeginDate = new Date().toISOString();
      state.EndDate = new Date().toISOString();
    },
  },
});
export const { setPostData, removePostData } = PostDataSlice.actions;
export default PostDataSlice.reducer;
