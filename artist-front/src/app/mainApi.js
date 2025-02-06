import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.1.73:5000/api',
    credentials: 'include',
  }),
  endpoints: (builder) => ({})
})