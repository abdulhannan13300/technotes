import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";

export const apiSlice = createApi({
   baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
   tagTypes: ["note", "User"],
   endpoints: (builder) => ({}),
});
