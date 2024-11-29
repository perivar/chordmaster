import admin from "firebase-admin";

export interface IUser {
  uid: string;
  email?: string;
  displayName?: string;
}

export interface IArtist {
  id?: string;
  name: string;

  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}

export interface ISong {
  id?: string;

  user?: IUser;

  artist: IArtist;
  title: string;
  content: string;

  transposeAmount?: number;
  fontSize?: number;
  showTablature?: boolean;
  published?: boolean;

  external: {
    id: string; //
    url: string; //
    source: string; //
  };

  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}
