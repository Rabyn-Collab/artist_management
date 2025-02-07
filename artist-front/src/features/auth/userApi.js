import { mainApi } from '../../app/mainApi';



export const userApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({


    userLogin: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),


    userRegister: builder.mutation({
      query: (credentials) => ({
        url: '/users/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),


    getAllUsers: builder.query({
      query: (q) => ({
        url: '/users',
        method: 'GET',
        headers: {
          Authorization: q
        }
      }),
      providesTags: ['User'],
    }),


    updateUser: builder.mutation({
      query: (q) => ({
        url: `/users/${q.id}`,
        method: 'PATCH',
        body: q.body,
        headers: {
          Authorization: q.token
        }
      }),
      invalidatesTags: ['User'],
    }),

    getUserById: builder.query({
      query: (q) => ({
        url: `/users/${q.id}`,
        method: 'GET',
        headers: {
          Authorization: q.token
        }
      }),
      providesTags: ['User'],
    }),

    getAllAritstsUsers: builder.query({
      query: (q) => ({
        url: `/users/artists`,
        method: 'GET',
        headers: {
          Authorization: q
        }
      }),
      providesTags: ['User', 'Artist'],
    }),

    removeUser: builder.mutation({
      query: (q) => ({
        url: `/users/${q.id}`,
        method: 'DELETE',
        headers: {
          Authorization: q.token
        }
      }),
      invalidatesTags: ['User'],
    })




  }),


});


export const { useUserLoginMutation, useUserRegisterMutation, useGetAllUsersQuery, useUpdateUserMutation, useGetUserByIdQuery, useGetAllAritstsUsersQuery, useRemoveUserMutation } = userApi;

