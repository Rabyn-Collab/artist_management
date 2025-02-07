import { mainApi } from "../../app/mainApi";


export const artistApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({





    getAllArtists: builder.query({
      query: (q) => ({
        url: '/artists',
        method: 'GET',
        headers: {
          Authorization: q
        }
      }),
      providesTags: ['Artist'],
    }),

    getArtistById: builder.query({
      query: (id) => ({
        url: `/artists/${id}`,
        method: 'GET',
      }),
      providesTags: ['Artist'],
    }),


    createArtist: builder.mutation({
      query: (q) => ({
        url: '/artists',
        method: 'POST',
        body: q.body,
        headers: {
          Authorization: q.token
        }

      }),
      invalidatesTags: ['Artist', 'User'],
    }),
    updateArtist: builder.mutation({
      query: (q) => ({
        url: `/artists/${q.id}`,
        method: 'PATCH',
        body: q.body,
        headers: {
          Authorization: q.token
        }
      }),
      invalidatesTags: ['Artist', 'User'],
    }),

    uploadCsv: builder.mutation({
      query: (q) => ({
        url: '/artists/upload-csv',
        method: 'POST',
        body: q.body,
        headers: {
          Authorization: q.token
        }
      }),
      invalidatesTags: ['Artist', 'User'],
    }),

    removeArtist: builder.mutation({
      query: (q) => ({
        url: `/artists/${q.id}`,
        method: 'DELETE',
        headers: {
          Authorization: q.token
        }
      }),
      invalidatesTags: ['Artist'],
    }),






  }),


});


export const { useGetAllArtistsQuery, useCreateArtistMutation, useGetArtistByIdQuery, useRemoveArtistMutation, useUploadCsvMutation, useUpdateArtistMutation } = artistApi;

