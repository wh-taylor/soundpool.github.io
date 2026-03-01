export type UserRole =
  | 'Musician'
  | 'Booker'
  | 'Photographer/Videographer'
  | 'Artist'
  | 'Sound Engineer'
  | 'Fan';

export type AgeRestriction = '21+' | '18+' | 'All Ages';
export type MemberStatus = 'pending' | 'accepted';
export type FeedItemType = 'post' | 'jam' | 'band' | 'show';

export interface Customization {
  fontFamily?: string;
  accentColor?: string;
  textColor?: string;
  backgroundColor?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  roles: UserRole[];
  location: string;
  instagram?: string;
  spotify?: string;
  favoriteArtists: string[];
  favoriteGenres: string[];
  instruments: string[];
  profilePicture?: string;
  banner?: string;
  profileSongUrl?: string;
  profileSongData?: string; // base64 audio, max 2MB
  joinDate: string;
  lastActive: string;
  customization: Customization;
  profileComments: Comment[];
}

export interface FeedPost {
  id: string;
  authorId: string;
  content: string;
  videoUrl?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface JamPost {
  id: string;
  authorId: string;
  description: string;
  instruments: string[];
  genres: string[];
  imageUrl?: string;
  videoUrl?: string;
  customization?: Customization;
  createdAt: string;
}

export interface BandMember {
  userId: string;
  status: MemberStatus;
}

export interface Band {
  id: string;
  name: string;
  location: string;
  genres: string[];
  description: string;
  imageUrl: string;
  adminId: string;
  members: BandMember[];
  audioUrl?: string;
  audioData?: string; // base64 audio, max 2MB
  customization?: Customization;
  createdAt: string;
}

export interface Show {
  id: string;
  title: string;
  flyerUrl?: string;
  date: string;
  city: string;
  address: string | null;
  venueInstagram: string;
  ageRestriction: AgeRestriction;
  authorId: string;
  comments: Comment[];
  createdAt: string;
}

export interface VenuePost {
  id: string;
  authorId: string;
  venueName: string;
  city: string;
  instagram?: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
}

export interface PhotographerPost {
  id: string;
  authorId: string;
  images: string[];
  description: string;
  lookingForBands: boolean;
  createdAt: string;
}

export interface ArtistPost {
  id: string;
  authorId: string;
  artistName: string;
  city: string;
  genres: string[];
  description: string;
  imageUrl?: string;
  instagram?: string;
  spotify?: string;
  createdAt: string;
}

export type UnifiedFeedItem =
  | { type: 'post'; createdAt: string; data: FeedPost }
  | { type: 'jam'; createdAt: string; data: JamPost }
  | { type: 'band'; createdAt: string; data: Band }
  | { type: 'show'; createdAt: string; data: Show };
