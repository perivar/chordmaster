export interface ArtistDoc {
  user: string;
  name: string;
  path: string;
  type: "artist";
}

export interface SongDoc {
  user: string;
  title: string;
  artist: string;
  path: string;
  type: "song";
}

export type Doc = ArtistDoc | SongDoc;

export abstract class BaseService {
  name!: string;
  baseUrl!: string;
  searchUrl!: string;
  constructor() {}
  abstract getSearch(query: string): Promise<Doc[]>;
  abstract getArtistSongs(path: string): Promise<SongDoc[]>;
  abstract getChordProSong(path: string): Promise<string>;
}
