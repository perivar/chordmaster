import { useState } from "react";

import { userSelector } from "../redux/slices/auth";
import {
  updateAppConfigReducer,
  updateUserAppConfigReducer,
} from "../redux/slices/config";
import {
  editPlaylistReducer,
  setArtists,
  setOrUpdatePlaylists,
  setOrUpdateSongs,
  setPlaylists,
  setSongs,
} from "../redux/slices/library";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import useFirestore from "./useFirestore";
import useIsMounted from "./useIsMounted";

export type UseFirestoreReduxMethodsHookResult = {
  isLoading: boolean;

  loadAppConfigData: (id: string) => Promise<void>;
  loadUserAppConfigData: () => Promise<void>;

  // instead of loading the artists, use the artists from the loaded songs instead
  loadArtistData: () => Promise<void>;

  loadUserSongData: () => Promise<void>;
  loadUserPlaylistData: () => Promise<void>;

  loadSongData: (songId: string) => Promise<void>;
  loadPlaylistData: (playlistId: string) => Promise<void>;

  hasPlaylistContainsSong: (playlistId: string, songId: string) => boolean;
  playlistAddSong: (playlistId: string, songId: string) => Promise<void>;
  playlistRemoveSong: (playlistId: string, songId: string) => Promise<void>;
};

export type UseFirestoreReduxMethodsHookArgs = {};

// to have optional default props in a hook, use Partial like this
const useFirestoreReduxMethods =
  ({}: Partial<UseFirestoreReduxMethodsHookArgs> = {}): UseFirestoreReduxMethodsHookResult => {
    const isMounted = useIsMounted();

    // should only be used when the calling screen only use ONE method
    // otherwise the screen should implement these on their own
    // Note! very often when also using refreshing, it makes most sense
    // to implement both isLoading and isRefreshing in your method, instead of using this
    // i.e. both
    // const [isLoading, setIsLoading] = useState<boolean>(false);
    // const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
      getAppConfig,
      getUserAppConfig,
      getSongsByUserId,
      getSongById,
      getPlaylistsByUserId,
      getPlaylistById,
      getAllArtists,
      addSongToPlaylist,
      removeSongFromPlaylist,
    } = useFirestore();

    const dispatch = useAppDispatch();
    const user = useAppSelector(userSelector);
    const allSongs = useAppSelector(state => state.library.songs);
    const allPlaylists = useAppSelector(state => state.library.playlists);

    const loadAppConfigData = async (id: string) => {
      setIsLoading(true);
      // only run if we are logged in, even if we are not using the userId
      // but rather the documentId
      // this can e.g. be found using the extra section in app.config.ts
      // import Constants from 'expo-constants';
      // loadAppConfigData(Constants.expoConfig.extra.appConfigDocId);
      if (user && user.uid) {
        const config = await getAppConfig(id);
        if (isMounted()) {
          dispatch(updateAppConfigReducer(config));
        }
      }
      setIsLoading(false);
    };

    const loadUserAppConfigData = async () => {
      setIsLoading(true);
      if (user && user.uid) {
        const config = await getUserAppConfig(user.uid);
        if (isMounted()) {
          dispatch(updateUserAppConfigReducer(config));
        }
      }
      setIsLoading(false);
    };

    const loadArtistData = async () => {
      setIsLoading(true);

      const a = await getAllArtists();
      if (isMounted()) {
        dispatch(setArtists(a));
      }

      setIsLoading(false);
    };

    const loadUserSongData = async () => {
      setIsLoading(true);
      if (user && user.uid) {
        const s = await getSongsByUserId(user.uid);

        if (isMounted()) {
          // instead of loading the artists, use the artists from the loaded songs instead
          // get all artist (can include duplicates)
          const artistsWithDuplicates = s.songs.map(song => {
            return song.artist;
          });

          // filter out the duplicates
          const artistsUnsorted = artistsWithDuplicates.filter(
            (artist, i, arr) => arr.findIndex(t => t.id === artist.id) === i
          );

          // and sort artists
          const artists = artistsUnsorted.sort((x, y) => {
            if (x.name < y.name) {
              return -1;
            }
            if (x.name > y.name) {
              return 1;
            }
            return 0;
          });

          // and sort songs
          const songsUnsorted = s.songs;
          const songs = songsUnsorted.sort((x, y) => {
            if (x.title < y.title) {
              return -1;
            }
            if (x.title > y.title) {
              return 1;
            }
            return 0;
          });

          dispatch(setSongs(songs));

          // also set artist from the loaded song
          dispatch(setArtists(artists));
        }
      }
      setIsLoading(false);
    };

    const loadUserPlaylistData = async () => {
      setIsLoading(true);
      if (user && user.uid) {
        const p = await getPlaylistsByUserId(user.uid);
        if (isMounted()) {
          const playlistsUnsorted = p.playlists;

          // and sort
          const playlists = playlistsUnsorted.sort((x, y) => {
            if (x.name < y.name) {
              return -1;
            }
            if (x.name > y.name) {
              return 1;
            }
            return 0;
          });

          dispatch(setPlaylists(playlists));
        }
      }
      setIsLoading(false);
    };

    const loadSongData = async (songId: string) => {
      setIsLoading(true);
      if (songId) {
        const songFound = await getSongById(songId);
        dispatch(setOrUpdateSongs([songFound]));
      }
      setIsLoading(false);
    };

    const loadPlaylistData = async (playlistId: string) => {
      setIsLoading(true);
      if (playlistId) {
        const playlistFound = await getPlaylistById(playlistId);
        dispatch(setOrUpdatePlaylists([playlistFound]));
      }
      setIsLoading(false);
    };

    const hasPlaylistContainsSong = (playlistId: string, songId: string) => {
      if (allPlaylists && allSongs) {
        const foundPlaylist = allPlaylists.find(a => a.id === playlistId);
        const foundSong = allSongs.find(s => s.id === songId);

        if (foundPlaylist && foundSong) {
          if (
            foundPlaylist.songIds &&
            foundPlaylist.songIds.length > 0 &&
            foundPlaylist.songIds.includes(songId)
          ) {
            return true;
          }
        }
      }
      return false;
    };

    const playlistAddSong = async (playlistId: string, songId: string) => {
      if (allPlaylists && allSongs) {
        const foundPlaylist = allPlaylists.find(a => a.id === playlistId);
        const foundSong = allSongs.find(s => s.id === songId);

        if (foundPlaylist && foundPlaylist.id && foundSong && foundSong.id) {
          await addSongToPlaylist(foundPlaylist.id, foundSong.id);

          const newPlaylist = { ...foundPlaylist };
          newPlaylist.songIds = [...newPlaylist.songIds, foundSong.id];
          dispatch(editPlaylistReducer(newPlaylist));
        }
      } else {
        throw new Error(
          "Could not add song to playlist. Missing playlists or songs"
        );
      }
    };

    const playlistRemoveSong = async (playlistId: string, songId: string) => {
      if (allPlaylists && allSongs) {
        const foundPlaylist = allPlaylists.find(a => a.id === playlistId);
        const foundSong = allSongs.find(s => s.id === songId);

        if (foundPlaylist && foundPlaylist.id && foundSong && foundSong.id) {
          await removeSongFromPlaylist(foundPlaylist.id, foundSong.id);

          const newPlaylist = { ...foundPlaylist };
          newPlaylist.songIds = newPlaylist.songIds.filter(
            s => s !== foundSong.id
          );
          dispatch(editPlaylistReducer(newPlaylist));
        }
      } else {
        throw new Error(
          "Could not remove song from playlist. Missing playlists or songs"
        );
      }
    };

    return {
      isLoading,

      loadAppConfigData,
      loadUserAppConfigData,

      loadArtistData,

      loadUserSongData,
      loadUserPlaylistData,

      loadSongData,
      loadPlaylistData,

      hasPlaylistContainsSong,
      playlistAddSong,
      playlistRemoveSong,
    };
  };

export default useFirestoreReduxMethods;
