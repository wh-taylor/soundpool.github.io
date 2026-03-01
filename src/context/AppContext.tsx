import { createContext, useContext, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  FeedPost,
  JamPost,
  Band,
  Show,
  VenuePost,
  PhotographerPost,
  ArtistPost,
  Comment,
} from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../data/storageKeys';
import {
  MOCK_FEED_POSTS,
  MOCK_JAM_POSTS,
  MOCK_BANDS,
  MOCK_SHOWS,
  MOCK_VENUE_POSTS,
  MOCK_PHOTOGRAPHER_POSTS,
  MOCK_ARTIST_POSTS,
} from '../data/mockData';

interface AppContextValue {
  feedPosts: FeedPost[];
  jamPosts: JamPost[];
  bands: Band[];
  shows: Show[];
  venuePosts: VenuePost[];
  photographerPosts: PhotographerPost[];
  artistPosts: ArtistPost[];

  addFeedPost: (post: FeedPost) => void;
  addJamPost: (jam: JamPost) => void;
  addBand: (band: Band) => void;
  updateBand: (id: string, patch: Partial<Band>) => void;
  addShow: (show: Show) => void;
  addCommentToShow: (showId: string, comment: Comment) => void;
  addVenuePost: (post: VenuePost) => void;
  addPhotographerPost: (post: PhotographerPost) => void;
  addArtistPost: (post: ArtistPost) => void;
  inviteUserToBand: (bandId: string, userId: string) => void;
  acceptBandInvite: (bandId: string, userId: string) => void;
  declineBandInvite: (bandId: string, userId: string) => void;
  getPendingBandInvites: (userId: string) => Band[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [feedPosts, setFeedPosts] = useLocalStorage<FeedPost[]>(STORAGE_KEYS.FEED_POSTS, []);
  const [jamPosts, setJamPosts] = useLocalStorage<JamPost[]>(STORAGE_KEYS.JAM_POSTS, []);
  const [bands, setBands] = useLocalStorage<Band[]>(STORAGE_KEYS.BANDS, []);
  const [shows, setShows] = useLocalStorage<Show[]>(STORAGE_KEYS.SHOWS, []);
  const [venuePosts, setVenuePosts] = useLocalStorage<VenuePost[]>(STORAGE_KEYS.VENUE_POSTS, []);
  const [photographerPosts, setPhotographerPosts] = useLocalStorage<PhotographerPost[]>(
    STORAGE_KEYS.PHOTOGRAPHER_POSTS,
    []
  );
  const [artistPosts, setArtistPosts] = useLocalStorage<ArtistPost[]>(
    STORAGE_KEYS.ARTIST_POSTS,
    []
  );

  // Seed mock data on first load
  useEffect(() => {
    const seeded = localStorage.getItem(STORAGE_KEYS.SEED_DONE);
    if (!seeded) {
      setFeedPosts(MOCK_FEED_POSTS);
      setJamPosts(MOCK_JAM_POSTS);
      setBands(MOCK_BANDS);
      setShows(MOCK_SHOWS);
      setVenuePosts(MOCK_VENUE_POSTS);
      setPhotographerPosts(MOCK_PHOTOGRAPHER_POSTS);
      setArtistPosts(MOCK_ARTIST_POSTS);
      localStorage.setItem(STORAGE_KEYS.SEED_DONE, 'true');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFeedPost = useCallback(
    (post: FeedPost) => setFeedPosts((prev) => [post, ...prev]),
    [setFeedPosts]
  );

  const addJamPost = useCallback(
    (jam: JamPost) => setJamPosts((prev) => [jam, ...prev]),
    [setJamPosts]
  );

  const addBand = useCallback(
    (band: Band) => setBands((prev) => [band, ...prev]),
    [setBands]
  );

  const updateBand = useCallback(
    (id: string, patch: Partial<Band>) =>
      setBands((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b))),
    [setBands]
  );

  const addShow = useCallback(
    (show: Show) => setShows((prev) => [show, ...prev]),
    [setShows]
  );

  const addCommentToShow = useCallback(
    (showId: string, comment: Comment) =>
      setShows((prev) =>
        prev.map((s) =>
          s.id === showId ? { ...s, comments: [...s.comments, comment] } : s
        )
      ),
    [setShows]
  );

  const addVenuePost = useCallback(
    (post: VenuePost) => setVenuePosts((prev) => [post, ...prev]),
    [setVenuePosts]
  );

  const addPhotographerPost = useCallback(
    (post: PhotographerPost) => setPhotographerPosts((prev) => [post, ...prev]),
    [setPhotographerPosts]
  );

  const addArtistPost = useCallback(
    (post: ArtistPost) => setArtistPosts((prev) => [post, ...prev]),
    [setArtistPosts]
  );

  const inviteUserToBand = useCallback(
    (bandId: string, userId: string) => {
      setBands((prev) =>
        prev.map((b) => {
          if (b.id !== bandId) return b;
          const alreadyMember = b.members.some((m) => m.userId === userId);
          if (alreadyMember) return b;
          return { ...b, members: [...b.members, { userId, status: 'pending' }] };
        })
      );
    },
    [setBands]
  );

  const acceptBandInvite = useCallback(
    (bandId: string, userId: string) => {
      setBands((prev) =>
        prev.map((b) =>
          b.id !== bandId
            ? b
            : {
                ...b,
                members: b.members.map((m) =>
                  m.userId === userId ? { ...m, status: 'accepted' } : m
                ),
              }
        )
      );
    },
    [setBands]
  );

  const declineBandInvite = useCallback(
    (bandId: string, userId: string) => {
      setBands((prev) =>
        prev.map((b) =>
          b.id !== bandId
            ? b
            : { ...b, members: b.members.filter((m) => m.userId !== userId) }
        )
      );
    },
    [setBands]
  );

  const getPendingBandInvites = useCallback(
    (userId: string): Band[] =>
      bands.filter((b) =>
        b.members.some((m) => m.userId === userId && m.status === 'pending')
      ),
    [bands]
  );

  return (
    <AppContext.Provider
      value={{
        feedPosts,
        jamPosts,
        bands,
        shows,
        venuePosts,
        photographerPosts,
        artistPosts,
        addFeedPost,
        addJamPost,
        addBand,
        updateBand,
        addShow,
        addCommentToShow,
        addVenuePost,
        addPhotographerPost,
        addArtistPost,
        inviteUserToBand,
        acceptBandInvite,
        declineBandInvite,
        getPendingBandInvites,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
