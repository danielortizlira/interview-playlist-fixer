#!/usr/bin/env node

const fs = require("fs-extra");

const argv = require("yargs")(process.argv.slice(2))
  .usage("playlist-fixer <input-file> <changes-file> <output-file>")
  .help(true)
  .demandCommand(3).argv;

const [inputFilePath, changesFilePath, outputFilePath] = argv._;

const handleInvalidInput = (filePath) => {
  console.log(`Sorry, we couldn't find the ${filePath} file.`);
  process.exit(1);
};

const handleNotFound = (subject, context) => {
  console.log(
    `We couldn't find the ${subject} when ${context}. The change won't have any effect`
  );
};

if (!fs.pathExistsSync(inputFilePath)) {
  handleInvalidInput(inputFilePath);
}

if (!fs.pathExistsSync(changesFilePath)) {
  handleInvalidInput(changesFilePath);
}

const indexerReducer = (acc, { id, ...rest }) => ({ ...acc, [id]: rest });

const { users, playlists, songs } = fs.readJSONSync(inputFilePath);
const { add_songs_to_playlist, new_playlists, deleted_playlists } =
  fs.readJSONSync(changesFilePath);

// We traverse the objects once to add the id as an index.
// This way we only need to traverse them once.
const indexedSongs = songs.reduce(indexerReducer, {});
const indexedUsers = users.reduce(indexerReducer, {});

// Delete playlists
const indexedPlaylists = playlists.reduce((acc, { id, ...rest }) => {
  return deleted_playlists[id] === true ? acc : { ...acc, [id]: rest };
}, {});

// Add songs to playlists
for (const { playlist_id, song_id } of add_songs_to_playlist) {
  const errorContext = `adding the song ${song_id} to the playlist ${playlist_id}`;

  if (!indexedPlaylists[playlist_id]) {
    handleNotFound(`playlist ${playlist_id}`, errorContext);
    continue;
  }

  if (!indexedSongs[song_id]) {
    handleNotFound(`song ${song_id}`, errorContext);
    continue;
  }

  indexedPlaylists[playlist_id] = {
    ...indexedPlaylists[playlist_id],
    song_ids: [...indexedPlaylists[playlist_id]["song_ids"], song_id],
  };
}

// Remove the indexes to get the expected output format
const updatedPlaylist = Object.keys(indexedPlaylists).map((id) => ({
  id,
  ...indexedPlaylists[id],
}));

