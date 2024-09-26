import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8001/api/v1/users',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include', // This is similar to withCredentials: true in Axios
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  try {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      // Try to get a new token
      const refreshResult = await baseQuery(
        { url: '/refreshToken', method: 'POST' },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Store the new token
        const { accessToken } = refreshResult.data;
        localStorage.setItem('jwt', accessToken);

        // Retry the original query with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Optionally handle refresh token failure (e.g., redirect to login)
        localStorage.removeItem('jwt');
      }
    }

    return result;
  } catch (error) {
    console.error('Error in baseQueryWithReauth:', error);
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: '/login',
        method: 'POST',
        body: userData,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/forgotPassword',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ data, token }) => ({
        url: `/resetPassword/${token}`,
        method: 'POST',
        body: data,
      }),
    }),
    jsonData: builder.query({
      query: () => 'https://mocki.io/v1/4ef316c4-00d2-409a-82aa-1478d6f9dd8e',
    }),
    getCurrentUser: builder.query({
      query: () => '/getCurrentUser',
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: '/updatePassword',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useGetCurrentUserQuery,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useJsonDataQuery,
  useUpdatePasswordMutation
} = apiSlice;