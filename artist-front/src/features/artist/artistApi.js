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
    getArtistByManager: builder.query({
      query: (id) => ({
        url: `/artists/get-artist/${id}`,
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


    importCsv: builder.mutation({
      query: (q) => ({
        url: '/artists/export',
        method: 'GET',
        headers: {
          Authorization: q,
          'Accept': 'text/csv',  // Specify that the server will return a CSV file
        },
        responseHandler: (response) => response.text(), // Ensure response is handled as text
      }),
      invalidatesTags: ['Artist'],
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


export const { useGetAllArtistsQuery, useCreateArtistMutation, useGetArtistByIdQuery, useRemoveArtistMutation, useUploadCsvMutation, useUpdateArtistMutation, useImportCsvMutation, useGetArtistByManagerQuery } = artistApi;

