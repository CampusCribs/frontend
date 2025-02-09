import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApiSlice = createApi({
  reducerPath: "posts",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    prepareHeaders: (headers) => {
      // Ensure the Content-Type is set to 'application/json'
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      getTotal: builder.mutation<number, string[]>({
        query: (ids: string[]) => ({
          url: "/computepayment",
          method: "POST",
          body: JSON.stringify( ids ),
        })}),
    };
  },
});

export const { useGetTotalMutation } = postApiSlice;
