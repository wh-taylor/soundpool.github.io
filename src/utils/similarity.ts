import { GENRES } from "../data/genres";
import type { User } from "../types";

const pairKey = (a: string, b: string) => `${a}\u0000${b}`;

export function getGenreSimilarities(users: User[]): Map<string, number> {
  const simIndex: Map<string, number> = new Map();
  for (const user of users) {
    for (const genre1 of user.favoriteGenres) {
      for (const genre2 of user.favoriteGenres) {
        if (!simIndex.has(pairKey(genre1, genre2))) {
          simIndex.set(pairKey(genre1, genre2), 0);
          simIndex.set(pairKey(genre2, genre1), 0);
        }
        if (genre1 == genre2) {
          simIndex.set(pairKey(genre1, genre1), simIndex.get(pairKey(genre1, genre1))! + 2);
          continue
        }
        simIndex.set(pairKey(genre1, genre2), simIndex.get(pairKey(genre1, genre2))! + 1);
        simIndex.set(pairKey(genre2, genre1), simIndex.get(pairKey(genre2, genre1))! + 1);
      }
    }
  }
  const simRate: Map<string, number> = new Map();
  for (const [key, value] of simIndex) {
    const keyInit = key.split('\u0000', 1)[0];
    simRate.set(key, value / simIndex.get(pairKey(keyInit, keyInit))!);
  }
  return simRate;
}

export function getArtistSimilarities(users: User[]): Map<string, number> {
  const simIndex: Map<string, number> = new Map();
  for (const user of users) {
    for (const artist1 of user.favoriteArtists) {
      for (const artist2 of user.favoriteArtists) {
        if (!simIndex.has(pairKey(artist1, artist2))) {
          simIndex.set(pairKey(artist1, artist2), 0);
          simIndex.set(pairKey(artist2, artist1), 0);
        }
        if (artist1 == artist2) {
          simIndex.set(pairKey(artist1, artist1), simIndex.get(pairKey(artist1, artist1))! + 2);
          continue
        }
        simIndex.set(pairKey(artist1, artist2), simIndex.get(pairKey(artist1, artist2))! + 1);
        simIndex.set(pairKey(artist2, artist1), simIndex.get(pairKey(artist2, artist1))! + 1);
      }
    }
  }
  const simRate: Map<string, number> = new Map();
  for (const [key, value] of simIndex) {
    const keyInit = key.split('\u0000', 1)[0];
    simRate.set(key, value / simIndex.get(pairKey(keyInit, keyInit))!);
  }
  return simRate;
}

function userGenreVector(user: User, allGenres: string[], simMap: Map<string, number>): number[] {
  return allGenres.map(g =>
    user.favoriteGenres.reduce((sum, userGenre) =>
      sum + (simMap.get(pairKey(userGenre, g)) ?? 0), 0)
  );
}

function userArtistVector(user: User, allArtists: string[], simMap: Map<string, number>): number[] {
  return allArtists.map(g =>
    user.favoriteArtists.reduce((sum, userGenre) =>
      sum + (simMap.get(pairKey(userGenre, g)) ?? 0), 0)
  );
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return (magA && magB) ? dot / (magA * magB) : 0;
}

export function getSimilarity(
  user1: User, user2: User,
  genreSimilarities: Map<string, number>,
  artistSimilarities: Map<string, number>,
  allArtists: string[]
): number {
  const g1 = userGenreVector(user1, GENRES, genreSimilarities);
  const g2 = userGenreVector(user2, GENRES, genreSimilarities);
  const genreScore = cosineSimilarity(g1, g2);

  const a1 = userArtistVector(user1, allArtists, artistSimilarities);
  const a2 = userArtistVector(user2, allArtists, artistSimilarities);
  const artistScore = cosineSimilarity(a1, a2);

  return (genreScore + 3 * artistScore) / 4;
}