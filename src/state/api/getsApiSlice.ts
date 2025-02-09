import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const getsApiSlice = createApi({
  reducerPath: "getsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
  }),
  endpoints: (builder) => {
    return {
      getTees: builder.query({
        query: () => "/tees",
      }),
      getTeeById: builder.query({
        query: (id: string) => `/tees/${id}`,
      }),
      getHoodies: builder.query({
        query: () => "/hoodies",
      }),
      getTop: builder.query({
        query: () => "/top",
      }),
    };
  },
});

export const {
  useGetTeesQuery,
  useGetHoodiesQuery,
  useGetTopQuery,
  useGetTeeByIdQuery,
} = getsApiSlice;
