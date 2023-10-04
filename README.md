# Dependencies

- Node 16.18.1: I recommend using [nvm](https://github.com/nvm-sh/nvm) to manage multiple versions of Node.

# Installation

- On the root of the project, run `npm install`.
- Then run `npm install -g.` to make the `playlist-fixer` command available at your terminal.

# Usage

- Run `playlist-fixer <input-file> <changes-file> <output-file>`.
- All files should be JSON files.

# Changes file format

```
{
  "add_songs_to_playlist": [
    {
      "playlist_id": <existing-playlist-id>,
      "song_id": <existing-song-id>
    },
    ...
  ],
  "new_playlists": [
    {
      "owner_id": <existing-user-id>,
      "song_ids": [<existing-song-id>]
    },
  ],
  "deleted_playlists": {
    <playlist-id>: true
  }
}

```

# Supported types of changes

- Add an existing song to an existing playlist.
- Add a new playlist for an existing user; the playlist should contain at least one existing song.
- Remove an existing playlist.

# Scaling Thoughts

- As it is right now, we are traversing the input twice, one to create the indexes and one to remove them. I think it would be ideal to change the input format so it includes the indexes because we need to search for the data by id, therefore arrays might not be the best data structure to use (we don't reference the list by the index).

- We are traversing the song additions once because I took from the enunciation that we should add one song at a time, meaning the if I want to add two songs to a playlist I should perform two different changes. If we group those changes we could index the changes by the playlist ID.

- I don't love the data structure I'm using for deleting playlists in the changes file as it is too verbose (`[playlist-id]: true`), but I think the playlist id index win is worth it. Hopefully, we can find a more elegant way to handle it tho.

# Thoughts

- Right now, there is a mix of cammelCase (most commonly used in JS) and snakeCase (coming from the input file). Ideally, I would standardize the input and output and use only CammelCase in the program. I didn't for time and complexity sakes.

# Completion time

- On Tuesday, I worked on setting up the project from 5:45 p.m. until 6:34 p.m.
- On Wednesday, I worked on the core of the problem from 7:30 a.m. until 8:30 a.m.
- Then I took around 2 hours to work on documents, improvements, clean-up, etc.
