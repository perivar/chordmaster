import chalk from "chalk";
import admin from "firebase-admin";

import { db } from "./firebaseService";
import { IArtist, ISong, IUser } from "./types";

// const errorStyle = chalk.bold.red;
// const warningStyle = chalk.keyword('orange').bold;
const successStyle = chalk.bold.green;

export const addSong = async (
  user: IUser,

  title: string,
  artist: string,
  content: string,

  isVerbose: boolean,

  externalId?: string,
  externalUrl?: string,
  externalSource?: string,

  published?: boolean
) => {
  if (title.trim() === "") throw new Error("invalid_title");
  if (artist.trim() === "") throw new Error("invalid_artist");
  if (content.trim() === "") throw new Error("invalid_content");

  const artistName = artist.trim();
  const songTitle = title.trim();
  const chordPro = content;

  try {
    let artistDb: IArtist;
    const artists = await getArtistsByName(artistName);
    if (artists && artists.length > 0) {
      artistDb = artists[0];
      if (isVerbose)
        console.log(`Found artist with name '${artistName}':`, artistDb.id);
    } else {
      artistDb = await addNewArtist(artistName);
    }

    const newSong = await addNewSong(
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
      {
        id: artistDb.id,
        name: artistDb.name,
      },
      songTitle,
      chordPro,

      isVerbose,

      externalId,
      externalUrl,
      externalSource,

      published
    );

    if (isVerbose) {
      // console.info(
      //   successStyle(
      //     'Successfully added song: ',
      //     JSON.stringify(newSong, null, 2)
      //   )
      // );
    }

    return newSong;
  } catch (e) {
    throw e;
  }
};

const addNewSong = async (
  user: IUser,

  artist: IArtist,
  title: string,
  content: string,

  isVerbose: boolean,

  externalId?: string,
  externalUrl?: string,
  externalSource?: string,

  published?: boolean
) => {
  try {
    const now = admin.firestore.Timestamp.now();

    const newSong: ISong = {
      user,

      artist,
      title,
      content,

      published,

      external: {
        id: externalId ?? "",
        url: externalUrl ?? "",
        source: externalSource ?? "",
      },

      createdAt: now,
    };

    const responseSong: ISong = {
      ...newSong,
    };

    const songRefNew = db.collection("songs").doc(); // automatically assign

    // overwrite if already exist
    await songRefNew.set(newSong);

    const songId = songRefNew.id;

    responseSong.id = songId;

    if (isVerbose) {
      console.log(successStyle(`Song ${songId} added successfully`));
    }

    return responseSong;
  } catch (error) {
    throw new Error(`Failed adding song. ` + error);
  }
};

const getArtistsByName = async (name: string) => {
  try {
    const artists: IArtist[] = [];

    const artistQuery = db.collection("artists").where("name", "==", name);

    const artistsSnapshots = await artistQuery.get();

    artistsSnapshots.forEach(artistSnapshot => {
      const data = artistSnapshot.data() as IArtist;
      artists.push({
        id: artistSnapshot.id,

        name: data.name,

        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return artists;
  } catch (error) {
    throw new Error(`Get artist using name: ${name} failed` + error);
  }
};

const addNewArtist = async (name: string) => {
  try {
    const now = admin.firestore.Timestamp.now();

    const newArtist: IArtist = {
      name,

      createdAt: now,
    };

    const responseArtist: IArtist = {
      ...newArtist,
    };

    const artistRefNew = db.collection("artists").doc(); // automatically assign

    // overwrite if already exist
    await artistRefNew.set(newArtist);

    const artistId = artistRefNew.id;

    responseArtist.id = artistId;

    console.log(
      successStyle(`Artist '${name}' with id '${artistId}' added successfully`)
    );

    return responseArtist;
  } catch (error) {
    throw new Error(`Failed adding artist. ` + error);
  }
};

export const listSongs = async (
  externalSource: string,
  nameQuery: string | undefined,
  isVerbose: boolean
) => {
  if (externalSource.trim() === "") throw new Error("invalid_external_source");

  let songsQuery = db
    .collection("songs")
    .where("external.source", "==", externalSource);

  if (isVerbose) {
    console.log(`'Limiting query to external.source == '${externalSource}'`);
  }

  if (nameQuery && nameQuery !== "") {
    songsQuery = songsQuery
      .where("title", ">=", nameQuery)
      .where("title", "<=", nameQuery + "\uf8ff");
  }

  const songsSnapshots = await songsQuery.get();

  if (songsSnapshots.size > 0) {
    console.log(successStyle(`Found ${songsSnapshots.size} Songs ...`));

    songsSnapshots.forEach(songsSnapshot => {
      const data = songsSnapshot.data() as ISong;

      console.log(successStyle(`Found song with title "${data.title}" ...`));
    });

    return `Successfully listed songs with external.source '${externalSource}'`;
  } else {
    throw new Error(
      `No songs to list found with external.source '${externalSource}'.`
    );
  }
};

export const removeSongs = async (
  externalSource: string,
  nameQuery: string | undefined,
  isVerbose: boolean
) => {
  if (externalSource.trim() === "") throw new Error("invalid_external_source");

  let songsQuery = db
    .collection("songs")
    .where("external.source", "==", externalSource);

  if (isVerbose) {
    console.log(`'Limiting query to external.source == '${externalSource}'`);
  }

  if (nameQuery && nameQuery !== "") {
    songsQuery = songsQuery
      .where("title", ">=", nameQuery)
      .where("title", "<=", nameQuery + "\uf8ff");
  }

  const songsSnapshots = await songsQuery.get();

  if (songsSnapshots.size > 0) {
    console.log(
      successStyle(`Found ${songsSnapshots.size} Songs to remove ...`)
    );

    songsSnapshots.forEach(songsSnapshot => {
      const data = songsSnapshot.data() as ISong;

      songsSnapshot.ref.delete();

      console.log(successStyle(`Deleted song with title "${data.title}" ...`));
    });

    return `Successfully removed songs with external.source '${externalSource}'`;
  } else {
    throw new Error(
      `No songs to delete found with external.source '${externalSource}'.`
    );
  }
};
