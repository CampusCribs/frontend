import { combineReducers, configureStore } from "@reduxjs/toolkit";
import PostDataSlice from "./slices/Post";
import { postApiSlice } from "./api/postsApiSlice";
import { getsApiSlice } from "./api/getsApiSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const persist = combineReducers({
  PostData: PostDataSlice,
});

const persistedReducer = persistReducer(persistConfig, persist);

export const store = configureStore({
  reducer: {
    persistedReducer,
    [getsApiSlice.reducerPath]: getsApiSlice.reducer,
    [postApiSlice.reducerPath]: postApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(getsApiSlice.middleware, postApiSlice.middleware),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
