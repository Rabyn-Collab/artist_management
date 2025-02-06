import { mainApi } from "../../app/mainApi";



export const songApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({

    getSongById: builder.query({
      query: (id) => ({
        url: `/songs/${id}`,
        method: 'GET',
      }),
      providesTags: ['Song'],
    }),
    updateSong: builder.mutation({
      query: (q) => ({
        url: `/songs/${q.id}`,
        method: 'PATCH',
        body: q.body,
        headers: {
          Authorization: q.token
        }
      }),
      invalidatesTags: ['Song'],
    }),

    createSong: builder.mutation({
      query: (q) => ({
        url: '/songs',
        method: 'POST',
        body: q.body,
        headers: {
          Authorization: q.token
        }
      }),
      invalidatesTags: ['Song'],
    }),

    getArtistsSongs: builder.query({
      query: (id) => ({
        url: `/songs/artists/${id}`,
        method: 'GET',
      }),
      providesTags: ['Song'],
    }),

    removeSong: builder.mutation({
      query: (q) => ({
        url: `/songs/${q.id}`,
        method: 'DELETE',
        headers: {
          Authorization: q.token
        }
      }),
      invalidatesTags: ['Song'],
    })


  })


});


export const { useGetArtistsSongsQuery, useCreateSongMutation, useUpdateSongMutation, useGetSongByIdQuery, useRemoveSongMutation } = songApi;

