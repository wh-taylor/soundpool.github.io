import type { User } from "../types";

const pairKey = (a: string, b: string) => `${a}\u0000${b}`;

export function getGenreSimilarities(users: User[]): Map<string, number> {
  const simdex: Map<string, number> = new Map();
  for (const user of users) {
    for (const genre1 of user.favoriteGenres) {
      for (const genre2 of user.favoriteGenres) {
        if (simdex.has(pairKey(genre1, genre2))) {
          simdex.set(pairKey(genre1, genre2), simdex.get(pairKey(genre1, genre2))! + 1);
          simdex.set(pairKey(genre2, genre1), simdex.get(pairKey(genre2, genre1))! + 1);
        } else {
          simdex.set(pairKey(genre1, genre2), 1);
          simdex.set(pairKey(genre2, genre1), 1);
        }
      }
    }
  }
  return simdex;
}

export function getArtistSimilarities(users: User[]): Map<string, number> {
  const simdex: Map<string, number> = new Map();
  for (const user of users) {
    for (const artist1 of user.favoriteArtists) {
      for (const artist2 of user.favoriteArtists) {
        if (simdex.has(pairKey(artist1, artist2))) {
          simdex.set(pairKey(artist1, artist2), simdex.get(pairKey(artist1, artist2))! + 1);
          simdex.set(pairKey(artist2, artist1), simdex.get(pairKey(artist2, artist1))! + 1);
        } else {
          simdex.set(pairKey(artist1, artist2), 1);
          simdex.set(pairKey(artist2, artist1), 1);
        }
      }
    }
  }
  return simdex;
}

export function getSimilarity(
  user1: User, user2: User,
  genreSimilarities: Map<string, number>,
  artistSimilarities: Map<string, number>
): number {
  if (
    user1.favoriteGenres.length == 0
    || user2.favoriteGenres.length == 0
    || user1.favoriteArtists.length == 0
    || user2.favoriteArtists.length == 0
  ) {
    return 0;
  }

  const genreIndex = user1.favoriteGenres
    .map((genre1) => user2.favoriteGenres
      .map((genre2) => genreSimilarities
        .get(pairKey(genre1, genre2)) ?? 0)
      .reduce((a, b) => a + b))
    .reduce((a, b) => a + b) / (user1.favoriteGenres.length * user2.favoriteGenres.length);
  
  const artistIndex = user1.favoriteArtists
    .map((artist1) => user2.favoriteArtists
      .map((artist2) => artistSimilarities
        .get(pairKey(artist1, artist2)) ?? 0)
      .reduce((a, b) => a + b))
    .reduce((a, b) => a + b) / (user1.favoriteArtists.length * user2.favoriteArtists.length);

  return genreIndex + 4 * artistIndex;
}