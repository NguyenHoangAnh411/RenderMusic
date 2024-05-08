// api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const songsApi = createApi({
  reducerPath: 'songsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5012/api/' }),
  endpoints: (builder) => ({
    getSongById: builder.query({
      query: (songId) => `songs/${songId}`,
    }),
  }),
});

export const { useGetSongByIdQuery } = songsApi;