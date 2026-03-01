import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserAvatar } from '../components/UserAvatar';
import { AudioPlayer } from '../components/AudioPlayer';
import { CommentSection } from '../components/CommentSection';
import { CustomizationPanel } from '../components/CustomizationPanel';
import { JamCard } from '../components/JamCard';
import { FeedPostCard } from '../components/FeedPostCard';
import { compressImage, fileToBase64 } from '../utils/imageUtils';
import { CITIES } from '../data/cities';
import { GENRES } from '../data/genres';
import { INSTRUMENTS } from '../data/instruments';
import { FONT_OPTIONS } from '../data/fonts';
import { loadGoogleFont } from '../utils/fontUtils';
import { formatDate, timeAgo } from '../utils/dateUtils';
import type { Comment, Customization } from '../types';
import './ProfilePage.css';

const AUDIO_MAX_BYTES = 2 * 1024 * 1024;

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { currentUser, getUserByUsername, updateUser } = useAuth();
  const { feedPosts, jamPosts } = useApp();

  const profileUser = getUserByUsername(username ?? '');
  const isOwnProfile = currentUser?.id === profileUser?.id;

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  // Edit form state mirrors the user object
  const [editInstagram, setEditInstagram] = useState('');
  const [editSpotify, setEditSpotify] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editGenres, setEditGenres] = useState<string[]>([]);
  const [editInstruments, setEditInstruments] = useState<string[]>([]);
  const [editArtists, setEditArtists] = useState<string[]>(['']);
  const [editSongUrl, setEditSongUrl] = useState('');
  const [editSongData, setEditSongData] = useState('');
  const [editCustomization, setEditCustomization] = useState<Customization>({});
  const [editAvatar, setEditAvatar] = useState('');
  const [editBanner, setEditBanner] = useState('');

  if (!profileUser) {
    return (
      <div className="page">
        <div className="empty-state">User not found.</div>
      </div>
    );
  }

  const accentColor = profileUser.customization.accentColor ?? 'var(--accent-1)';
  const fontFamily = profileUser.customization.fontFamily;
  const fontStack = FONT_OPTIONS.find((f) => f.value === fontFamily)?.stack ?? 'inherit';
  if (fontFamily) loadGoogleFont(fontFamily);

  const customStyle = {
    '--profile-accent': accentColor,
    '--profile-font': fontStack,
    fontFamily: fontStack,
    color: profileUser.customization.textColor ?? 'var(--text-primary)',
    backgroundColor: profileUser.customization.backgroundColor ?? undefined,
  } as React.CSSProperties;

  const userFeedPosts = feedPosts.filter((p) => p.authorId === profileUser.id);
  const userJamPosts = jamPosts.filter((j) => j.authorId === profileUser.id);
  const audioSrc = profileUser.profileSongData ?? profileUser.profileSongUrl;

  function startEditing() {
    setEditInstagram(profileUser!.instagram ?? '');
    setEditSpotify(profileUser!.spotify ?? '');
    setEditLocation(profileUser!.location);
    setEditGenres([...profileUser!.favoriteGenres]);
    setEditInstruments([...profileUser!.instruments]);
    setEditArtists(profileUser!.favoriteArtists.length ? [...profileUser!.favoriteArtists] : ['']);
    setEditSongUrl(profileUser!.profileSongUrl ?? '');
    setEditSongData(profileUser!.profileSongData ?? '');
    setEditCustomization({ ...profileUser!.customization });
    setEditAvatar(profileUser!.profilePicture ?? '');
    setEditBanner(profileUser!.banner ?? '');
    setEditing(true);
    setError('');
  }

  function toggleGenre(g: string) {
    setEditGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  }
  function toggleInstrument(i: string) {
    setEditInstruments((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  }
  function updateArtist(idx: number, val: string) {
    setEditArtists((prev) => prev.map((a, i) => (i === idx ? val : a)));
  }
  function addArtist() {
    if (editArtists.length < 10) setEditArtists((p) => [...p, '']);
  }
  function removeArtist(idx: number) {
    setEditArtists((p) => p.filter((_, i) => i !== idx));
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const c = await compressImage(file, 400, 0.8);
    setEditAvatar(c);
  }

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const c = await compressImage(file, 1200, 0.7);
    setEditBanner(c);
  }

  async function handleSongUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > AUDIO_MAX_BYTES) {
      setError('Audio file must be under 2MB. Paste a URL instead.');
      e.target.value = '';
      return;
    }
    const data = await fileToBase64(file);
    setEditSongData(data);
  }

  function saveProfile() {
    if (!currentUser) return;
    updateUser({
      instagram: editInstagram.trim() || undefined,
      spotify: editSpotify.trim() || undefined,
      location: editLocation,
      favoriteGenres: editGenres,
      instruments: editInstruments,
      favoriteArtists: editArtists.filter((a) => a.trim()),
      profileSongUrl: editSongUrl.trim() || undefined,
      profileSongData: editSongData || undefined,
      customization: editCustomization,
      profilePicture: editAvatar || undefined,
      banner: editBanner || undefined,
    });
    setEditing(false);
  }

  function handleAddProfileComment(content: string) {
    if (!currentUser) return;
    const comment: Comment = {
      id: crypto.randomUUID(),
      authorId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
    };
    // Update profile user's comments
    // We need access to updateUser for the profile user — only possible for own profile
    // For viewing others' profiles, comments go to the viewed user's profileComments
    // Since we only have updateUser for currentUser, we update the viewed user via Auth context
    // The AuthContext updateUser only updates the current user, so for profile comments on others'
    // profiles, we'd need a separate function. For now, only allow comments if viewing own profile
    // or if the auth context is extended. We'll store on currentUser's profile if own, else skip.
    // HACK: using updateUser means it only saves on own profile. Cross-user comments need backend.
    if (isOwnProfile && profileUser) {
      updateUser({
        profileComments: [...profileUser.profileComments, comment],
      });
    }
  }

  return (
    <div className="profile-page" style={customStyle}>
      {/* Banner */}
      <div
        className="profile-page__banner"
        style={{
          backgroundImage: profileUser.banner ? `url(${profileUser.banner})` : undefined,
          borderColor: accentColor,
        }}
      >
        {!profileUser.banner && (
          <div className="profile-page__banner-default" style={{ borderBottomColor: accentColor }} />
        )}
      </div>

      <div className="page">
        {/* Header row */}
        <div className="profile-page__header">
          <div className="profile-page__avatar-wrap">
            <UserAvatar user={profileUser} size="xl" />
          </div>
          <div className="profile-page__identity">
            <h1 className="profile-page__username" style={{ color: accentColor }}>
              {profileUser.username}
            </h1>
            <div className="profile-page__roles">
              {profileUser.roles.map((r) => (
                <span key={r} className="tag tag--role">{r}</span>
              ))}
            </div>
            <div className="profile-page__location">
              {profileUser.location}
            </div>
            <div className="profile-page__links">
              {profileUser.instagram && (
                <a
                  href={`https://instagram.com/${profileUser.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-page__social-link"
                  style={{ color: accentColor }}
                >
                  IG @{profileUser.instagram}
                </a>
              )}
              {profileUser.spotify && (
                <a
                  href={profileUser.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-page__social-link"
                  style={{ color: 'var(--accent-3)' }}
                >
                  Spotify ↗
                </a>
              )}
            </div>
            <div className="profile-page__dates">
              <span>Joined {formatDate(profileUser.joinDate)}</span>
              <span className="profile-page__sep">·</span>
              <span>Active {timeAgo(profileUser.lastActive)}</span>
            </div>
          </div>

          {isOwnProfile && !editing && (
            <button className="btn btn--secondary btn--sm" onClick={startEditing}>
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile song */}
        {audioSrc && !editing && (
          <div className="profile-page__song">
            <AudioPlayer src={audioSrc} label="Profile Song" />
          </div>
        )}

        {/* Genres + Instruments + Artists */}
        {!editing && (
          <div className="profile-page__prefs">
            {profileUser.favoriteGenres.length > 0 && (
              <div className="profile-page__pref-block">
                <div className="section-label">Genres</div>
                <div className="profile-page__tags">
                  {profileUser.favoriteGenres.map((g) => (
                    <span key={g} className="tag tag--genre">{g}</span>
                  ))}
                </div>
              </div>
            )}
            {profileUser.instruments.length > 0 && (
              <div className="profile-page__pref-block">
                <div className="section-label">Instruments</div>
                <div className="profile-page__tags">
                  {profileUser.instruments.map((i) => (
                    <span key={i} className="tag tag--instrument">{i}</span>
                  ))}
                </div>
              </div>
            )}
            {profileUser.favoriteArtists.length > 0 && (
              <div className="profile-page__pref-block">
                <div className="section-label">Favorite Artists</div>
                <div className="profile-page__artists">
                  {profileUser.favoriteArtists.map((a, i) => (
                    <span key={i} className="profile-page__artist">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Edit form */}
        {editing && isOwnProfile && (
          <div className="profile-page__edit-form panel">
            <div className="modal-box__title" style={{ color: accentColor }}>Edit Profile</div>

            <div className="form-group">
              <label>Instagram Handle</label>
              <input type="text" value={editInstagram} onChange={(e) => setEditInstagram(e.target.value)} placeholder="yourhandle" />
            </div>
            <div className="form-group">
              <label>Spotify URL</label>
              <input type="url" value={editSpotify} onChange={(e) => setEditSpotify(e.target.value)} placeholder="https://open.spotify.com/..." />
            </div>
            <div className="form-group">
              <label>City</label>
              <select value={editLocation} onChange={(e) => setEditLocation(e.target.value)}>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Favorite Artists (up to 10)</label>
              {editArtists.map((a, idx) => (
                <div key={idx} className="profile-page__artist-row">
                  <input type="text" value={a} onChange={(e) => updateArtist(idx, e.target.value)} placeholder={`Artist ${idx + 1}`} />
                  {editArtists.length > 1 && (
                    <button type="button" className="profile-page__remove-btn" onClick={() => removeArtist(idx)}>✕</button>
                  )}
                </div>
              ))}
              {editArtists.length < 10 && (
                <button type="button" className="btn btn--secondary btn--sm" onClick={addArtist} style={{ marginTop: 8 }}>
                  + Add Artist
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Genres</label>
              <div className="toggle-grid">
                {GENRES.map((g) => (
                  <button key={g} type="button" className={`toggle-btn ${editGenres.includes(g) ? 'active' : ''}`} onClick={() => toggleGenre(g)}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Instruments</label>
              <div className="toggle-grid">
                {INSTRUMENTS.map((i) => (
                  <button key={i} type="button" className={`toggle-btn ${editInstruments.includes(i) ? 'active' : ''}`} onClick={() => toggleInstrument(i)}>
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Profile Song — URL (SoundCloud, .mp3, etc.)</label>
              <input type="url" value={editSongUrl} onChange={(e) => setEditSongUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Profile Song — Upload (max 2MB)</label>
              {editSongData && <span className="form-hint">File uploaded ✓</span>}
              <input type="file" accept="audio/*" onChange={handleSongUpload} />
            </div>

            <div className="form-group">
              <label>Profile Picture</label>
              {editAvatar && <img src={editAvatar} alt="" style={{ width: 80, height: 80, objectFit: 'cover', marginBottom: 8 }} />}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} />
            </div>
            <div className="form-group">
              <label>Banner</label>
              {editBanner && <img src={editBanner} alt="" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', marginBottom: 8 }} />}
              <input type="file" accept="image/*" onChange={handleBannerUpload} />
            </div>

            <CustomizationPanel value={editCustomization} onChange={setEditCustomization} />

            {error && <p className="form-error">{error}</p>}

            <div className="form-actions">
              <button type="button" className="btn btn--secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button type="button" className="btn" onClick={saveProfile}>Save</button>
            </div>
          </div>
        )}

        {/* User's posts */}
        {userFeedPosts.length > 0 && (
          <div className="profile-page__posts">
            <div className="section-label">Posts</div>
            {userFeedPosts.map((p) => (
              <FeedPostCard key={p.id} post={p} />
            ))}
          </div>
        )}

        {userJamPosts.length > 0 && (
          <div className="profile-page__posts">
            <div className="section-label">Jams</div>
            <div className="jams-grid">
              {userJamPosts.map((j) => (
                <JamCard key={j.id} jam={j} />
              ))}
            </div>
          </div>
        )}

        {/* Profile comments (own profile only for now) */}
        {isOwnProfile && (
          <CommentSection
            comments={profileUser.profileComments}
            onAddComment={handleAddProfileComment}
          />
        )}
      </div>
    </div>
  );
}
