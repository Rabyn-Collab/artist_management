import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://artist-management-a3zi.onrender.com/api',
    // baseUrl: 'http://192.168.1.73:5000/api',
    credentials: 'include',
  }),
  endpoints: (builder) => ({})
})