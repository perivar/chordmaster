import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import useFirestore, { IArtist, IPlaylist, ISong } from "@/hooks/useFirestore";

export interface ILibraryState {
  songs: ISong[];
  artists: IArtist[];
  playlists: IPlaylist[];
  isLoading: boolean;
  error: unknown;
}

const initialState: ILibraryState = {
  songs: [],
  artists: [],
  playlists: [],
  isLoading: false,
  error: undefined,
};

// Use like this:
// dispatch(readAllSongs());
export const readAllSongs = createAsyncThunk<ISong[]>(
  "readAllSongs",
  async (_, { rejectWithValue }) => {
    try {
      const { getAllSongs } = useFirestore();
      const response = await getAllSongs();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const librarySlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    // Song Reducers
    setSongs(state, action: PayloadAction<ISong[]>) {
      state.songs = action.payload;
    },
    setOrUpdateSongs(state, action: PayloadAction<ISong[]>) {
      action.payload.forEach(element => {
        // add or update
        const songIndex = state.songs.findIndex(song => song.id === element.id);
        if (songIndex !== -1) {
          // update
          state.songs[songIndex] = {
            ...state.songs[songIndex],
            ...element,
          };
        } else {
          // add
          state.songs.push(element);
        }
      });
    },
    newSongReducer(state, action: PayloadAction<ISong>) {
      state.songs.push(action.payload);
    },
    addOrUpdateSongReducer(state, action: PayloadAction<ISong>) {
      // add or update
      const songIndex = state.songs.findIndex(
        song => song.id === action.payload.id
      );
      if (songIndex !== -1) {
        // update
        state.songs[songIndex] = {
          ...state.songs[songIndex],
          ...action.payload,
        };
      } else {
        // add
        state.songs.push(action.payload);
      }
    },
    editSongReducer(state, action: PayloadAction<ISong>) {
      // edit the songs
      const songIndex = state.songs.findIndex(
        song => song.id === action.payload.id
      );
      if (songIndex !== -1) {
        state.songs[songIndex] = {
          ...state.songs[songIndex],
          ...action.payload,
        };
      }
    },
    deleteSongReducer(state, action: PayloadAction<string>) {
      state.songs = state.songs.filter(arrow => arrow.id !== action.payload);
    },

    // Artist Reducers
    setArtists(state, action: PayloadAction<IArtist[]>) {
      state.artists = action.payload;
    },
    setOrUpdateArtists(state, action: PayloadAction<IArtist[]>) {
      action.payload.forEach(element => {
        // add or update
        const artistIndex = state.artists.findIndex(
          artist => artist.id === element.id
        );
        if (artistIndex !== -1) {
          // update
          state.artists[artistIndex] = {
            ...state.artists[artistIndex],
            ...element,
          };
        } else {
          // add
          state.artists.push(element);
        }
      });
    },
    newArtistReducer(state, action: PayloadAction<IArtist>) {
      state.artists.push(action.payload);
    },
    addOrUpdateArtistReducer(state, action: PayloadAction<IArtist>) {
      // add or update
      const artistIndex = state.artists.findIndex(
        artist => artist.id === action.payload.id
      );
      if (artistIndex !== -1) {
        // update
        state.artists[artistIndex] = {
          ...state.artists[artistIndex],
          ...action.payload,
        };
      } else {
        // add
        state.artists.push(action.payload);
      }
    },
    editArtistReducer(state, action: PayloadAction<IArtist>) {
      // edit the artists
      const artistIndex = state.artists.findIndex(
        artist => artist.id === action.payload.id
      );
      if (artistIndex !== -1) {
        state.artists[artistIndex] = {
          ...state.artists[artistIndex],
          ...action.payload,
        };
      }
    },
    deleteArtistReducer(state, action: PayloadAction<string>) {
      state.artists = state.artists.filter(
        arrow => arrow.id !== action.payload
      );
    },

    // Playlist Reducers
    setPlaylists(state, action: PayloadAction<IPlaylist[]>) {
      state.playlists = action.payload;
    },
    setOrUpdatePlaylists(state, action: PayloadAction<IPlaylist[]>) {
      action.payload.forEach(element => {
        // add or update
        const playlistIndex = state.playlists.findIndex(
          playlist => playlist.id === element.id
        );
        if (playlistIndex !== -1) {
          // update
          state.playlists[playlistIndex] = {
            ...state.playlists[playlistIndex],
            ...element,
          };
        } else {
          // add
          state.playlists.push(element);
        }
      });
    },
    newPlaylistReducer(state, action: PayloadAction<IPlaylist>) {
      state.playlists.push(action.payload);
    },
    addOrUpdatePlaylistReducer(state, action: PayloadAction<IPlaylist>) {
      // add or update
      const playlistIndex = state.playlists.findIndex(
        playlist => playlist.id === action.payload.id
      );
      if (playlistIndex !== -1) {
        // update
        state.playlists[playlistIndex] = {
          ...state.playlists[playlistIndex],
          ...action.payload,
        };
      } else {
        // add
        state.playlists.push(action.payload);
      }
    },
    editPlaylistReducer(state, action: PayloadAction<IPlaylist>) {
      // edit the playlists
      const playlistIndex = state.playlists.findIndex(
        playlist => playlist.id === action.payload.id
      );
      if (playlistIndex !== -1) {
        state.playlists[playlistIndex] = {
          ...state.playlists[playlistIndex],
          ...action.payload,
        };
      }
    },
    deletePlaylistReducer(state, action: PayloadAction<string>) {
      state.playlists = state.playlists.filter(
        arrow => arrow.id !== action.payload
      );
    },
  },
  extraReducers: builder => {
    // Note! to use the async methods, you can use the read methods like this
    // dispatch(readAllSongs());
    // And to use the parameters, you can use the useAppSelector like thi:
    // const loading = useAppSelector(state => state.songs.isLoading);
    // const error = useAppSelector(state => state.songs.error);

    // readAllSongs
    builder.addCase(readAllSongs.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(readAllSongs.fulfilled, (state, action) => {
      state.songs = action.payload;
      state.isLoading = false;
    });
    builder.addCase(readAllSongs.rejected, (state, action) => {
      if (action.payload) {
        state.error = action.error;
      } else {
        state.error = "reading songs failed";
      }
      state.isLoading = false;
    });
  },
});

// Actions generated from the slice
export const {
  setSongs,
  setOrUpdateSongs,
  newSongReducer,
  editSongReducer,
  deleteSongReducer,
  addOrUpdateSongReducer,

  setArtists,
  setOrUpdateArtists,
  newArtistReducer,
  editArtistReducer,
  deleteArtistReducer,
  addOrUpdateArtistReducer,

  setPlaylists,
  setOrUpdatePlaylists,
  newPlaylistReducer,
  editPlaylistReducer,
  deletePlaylistReducer,
  addOrUpdatePlaylistReducer,
} = librarySlice.actions;

// export the reducer
const libraryReducer = librarySlice.reducer;
export default libraryReducer;
