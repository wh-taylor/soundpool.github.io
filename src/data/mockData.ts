import type {
  User,
  FeedPost,
  Band,
  Show,
  VenuePost,
  PhotographerPost,
  ArtistPost,
} from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    username: 'axiom_rez',
    email: 'rez@soundpool.io',
    password: 'demo1234',
    roles: ['Musician', 'Artist'],
    location: 'Austin, TX',
    instagram: 'axiom_rez',
    spotify: 'https://open.spotify.com/artist/example',
    favoriteArtists: ['Radiohead', 'Death Grips', 'Aphex Twin', 'JPEGMAFIA'],
    favoriteGenres: ['Experimental', 'Noise', 'Hip-Hop / Rap', 'Shoegaze'],
    instruments: ['Electric Guitar', 'Synthesizer', 'Drums / Percussion'],
    joinDate: '2025-01-15T00:00:00.000Z',
    lastActive: new Date().toISOString(),
    customization: { accentColor: '#ff6b35' },
    jamEntry: {
      visible: true,
      description: 'looking for a bassist and second guitarist for experimental/noise rock jams. no genre police, bring weird sounds.',
      customization: { accentColor: '#ff6b35' },
    },
  },
  {
    id: 'user-2',
    username: 'velvet_drum',
    email: 'velvet@soundpool.io',
    password: 'demo1234',
    roles: ['Musician', 'Photographer/Videographer'],
    location: 'Nashville, TN',
    instagram: 'velvetdrum',
    favoriteArtists: ['Billie Eilish', 'FKA Twigs', 'James Blake'],
    favoriteGenres: ['Indie Pop', 'Ambient', 'Lo-Fi'],
    instruments: ['Drums / Percussion', 'Keys / Piano'],
    joinDate: '2025-02-20T00:00:00.000Z',
    lastActive: new Date().toISOString(),
    customization: { accentColor: '#00d4ff' },
    jamEntry: {
      visible: true,
      description: 'drummer available for session work and live gigs. experienced in jazz, funk, and indie. dm for rates.',
      customization: { accentColor: '#00d4ff' },
    },
  },
  {
    id: 'user-3',
    username: 'static_bloom',
    email: 'bloom@soundpool.io',
    password: 'demo1234',
    roles: ['Booker', 'Fan'],
    location: 'Chicago, IL',
    instagram: 'staticbloom',
    favoriteArtists: ['Idles', 'Parquet Courts', 'Big Thief', 'Hand Habits'],
    favoriteGenres: ['Indie Rock', 'Post-Punk', 'Folk'],
    instruments: [],
    joinDate: '2025-03-01T00:00:00.000Z',
    lastActive: new Date().toISOString(),
    customization: { accentColor: '#c8ff00' },
  },
];

export const MOCK_FEED_POSTS: FeedPost[] = [
  {
    id: 'post-1',
    authorId: 'user-1',
    content: 'just finished tracking the new record. 11 songs, recorded entirely in a shed. posting teasers all week.',
    comments: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-2',
    authorId: 'user-3',
    content: 'PSA: the Mohawk has shows every weekend through October. support your local venues — they keep the scene alive.',
    comments: [],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-3',
    authorId: 'user-2',
    content: 'new photography set from last night\'s show at Exit/In. low light, high energy. drop a comment if you want prints.',
    comments: [],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_BANDS: Band[] = [
  {
    id: 'band-1',
    name: 'Pale Machine',
    location: 'Austin, TX',
    genres: ['Shoegaze', 'Post-Rock', 'Experimental'],
    description: 'four-piece from austin making loud, slow, textured music. influenced by my bloody valentine, godspeed, and yr local feedback loop.',
    imageUrl: '',
    adminId: 'user-1',
    members: [
      { userId: 'user-1', status: 'accepted' },
      { userId: 'user-2', status: 'pending' },
    ],
    customization: { accentColor: '#b44dff' },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_SHOWS: Show[] = [
  {
    id: 'show-1',
    title: 'Pale Machine + Guests',
    date: '2026-03-15',
    city: 'Austin, TX',
    address: '912 Red River St',
    venueInstagram: 'mohawkaustin',
    ageRestriction: 'All Ages',
    authorId: 'user-1',
    comments: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'show-2',
    title: 'Static Bloom Presents: Night Market Vol. 3',
    date: '2026-04-02',
    city: 'Chicago, IL',
    address: null,
    venueInstagram: 'emptybottlechi',
    ageRestriction: '21+',
    authorId: 'user-3',
    comments: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_VENUE_POSTS: VenuePost[] = [
  {
    id: 'venue-1',
    authorId: 'user-3',
    venueName: 'The Hollow Room',
    city: 'Chicago, IL',
    instagram: 'thehollowroom',
    description: 'intimate 150-cap listening room in wicker park. hosting indie, folk, and experimental acts. DMs open for bookings.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_PHOTOGRAPHER_POSTS: PhotographerPost[] = [
  {
    id: 'photo-1',
    authorId: 'user-2',
    images: [],
    description: 'live music photographer based in nashville. shooting concerts, press shots, and music videos. available for touring.',
    lookingForBands: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_ARTIST_POSTS: ArtistPost[] = [
  {
    id: 'artist-1',
    authorId: 'user-1',
    artistName: 'Vessel Dye',
    city: 'Austin, TX',
    mediums: ['Illustration', 'Digital Art', 'Collage'],
    description: 'album artwork, gig posters, and merch design. influenced by underground zine culture and sci-fi paperback covers.',
    instagram: 'axiom_rez',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
