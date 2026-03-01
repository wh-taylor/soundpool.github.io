import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CITIES } from '../../data/cities';
import { GENRES } from '../../data/genres';
import { INSTRUMENTS } from '../../data/instruments';
import { compressImage } from '../../utils/imageUtils';
import type { UserRole, Customization } from '../../types';
import './SignupPage.css';

const ALL_ROLES: UserRole[] = [
  'Musician',
  'Booker',
  'Photographer/Videographer',
  'Artist',
  'Sound Engineer',
  'Fan',
];

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1 — Credentials
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2 — Role + Location
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [location, setLocation] = useState('');

  // Step 3 — Social
  const [instagram, setInstagram] = useState('');
  const [spotify, setSpotify] = useState('');

  // Step 4 — Music prefs
  const [favoriteArtists, setFavoriteArtists] = useState<string[]>(['']);
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [instruments, setInstruments] = useState<string[]>([]);

  // Step 5 — Avatar + Banner
  const [profilePicture, setProfilePicture] = useState<string | undefined>();
  const [banner, setBanner] = useState<string | undefined>();
  const [avatarPreview, setAvatarPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');

  function toggleRole(role: UserRole) {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  function toggleGenre(genre: string) {
    setFavoriteGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  }

  function toggleInstrument(inst: string) {
    setInstruments((prev) =>
      prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst]
    );
  }

  function addArtistField() {
    if (favoriteArtists.length < 10) setFavoriteArtists((prev) => [...prev, '']);
  }

  function removeArtistField(idx: number) {
    setFavoriteArtists((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateArtist(idx: number, val: string) {
    setFavoriteArtists((prev) => prev.map((a, i) => (i === idx ? val : a)));
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 400, 0.8);
      setProfilePicture(compressed);
      setAvatarPreview(compressed);
    } catch {
      setError('Failed to process profile picture.');
    }
  }

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 1200, 0.7);
      setBanner(compressed);
      setBannerPreview(compressed);
    } catch {
      setError('Failed to process banner image.');
    }
  }

  function validateStep(): string {
    if (step === 1) {
      if (!username.trim()) return 'Username is required.';
      if (username.trim().length < 3) return 'Username must be at least 3 characters.';
      if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) return 'Username: letters, numbers, underscores only.';
      if (!email.trim()) return 'Email is required.';
      if (!password) return 'Password is required.';
      if (password.length < 6) return 'Password must be at least 6 characters.';
    }
    if (step === 2) {
      if (roles.length === 0) return 'Select at least one role.';
      if (!location) return 'Select your location.';
    }
    return '';
  }

  function nextStep() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep((s) => s + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanArtists = favoriteArtists.filter((a) => a.trim() !== '');
    const customization: Customization = {};

    const success = signup({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      roles,
      location,
      instagram: instagram.trim() || undefined,
      spotify: spotify.trim() || undefined,
      favoriteArtists: cleanArtists,
      favoriteGenres,
      instruments,
      profilePicture,
      banner,
      customization,
    });

    setLoading(false);
    if (success) {
      navigate('/feed');
    } else {
      setError('Username or email already taken.');
      setStep(1);
    }
  }

  const totalSteps = 5;

  return (
    <div className="signup-page">
      <div className="signup-page__box panel">
        <div className="signup-page__logo">
          <span>Sound</span><span className="signup-page__logo-accent">Pool</span>
        </div>

        {/* Progress */}
        <div className="signup-page__progress">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`signup-page__progress-dot ${i + 1 <= step ? 'active' : ''}`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Credentials */}
          {step === 1 && (
            <div className="signup-page__step">
              <div className="section-label">Account</div>
              <div className="form-group">
                <label htmlFor="su-username">Username</label>
                <input
                  id="su-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_handle"
                  autoComplete="username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="su-email">Email</label>
                <input
                  id="su-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="su-password">Password</label>
                <input
                  id="su-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="min. 6 characters"
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          {/* Step 2: Role + Location */}
          {step === 2 && (
            <div className="signup-page__step">
              <div className="section-label">Role &amp; Location</div>
              <div className="form-group">
                <label>I am a... (select all that apply)</label>
                <div className="toggle-grid">
                  {ALL_ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      className={`toggle-btn ${roles.includes(role) ? 'active' : ''}`}
                      onClick={() => toggleRole(role)}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="su-location">City</label>
                <select
                  id="su-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Select your city...</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Social */}
          {step === 3 && (
            <div className="signup-page__step">
              <div className="section-label">Social Links (optional)</div>
              <div className="form-group">
                <label htmlFor="su-instagram">Instagram Handle</label>
                <input
                  id="su-instagram"
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="yourhandle (no @)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="su-spotify">Spotify URL</label>
                <input
                  id="su-spotify"
                  type="url"
                  value={spotify}
                  onChange={(e) => setSpotify(e.target.value)}
                  placeholder="https://open.spotify.com/artist/..."
                />
              </div>
            </div>
          )}

          {/* Step 4: Music Preferences */}
          {step === 4 && (
            <div className="signup-page__step">
              <div className="section-label">Music Preferences</div>

              <div className="form-group">
                <label>Favorite Artists (up to 10)</label>
                {favoriteArtists.map((artist, idx) => (
                  <div key={idx} className="signup-page__artist-row">
                    <input
                      type="text"
                      value={artist}
                      onChange={(e) => updateArtist(idx, e.target.value)}
                      placeholder={`Artist ${idx + 1}`}
                    />
                    {favoriteArtists.length > 1 && (
                      <button
                        type="button"
                        className="signup-page__remove-btn"
                        onClick={() => removeArtistField(idx)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                {favoriteArtists.length < 10 && (
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={addArtistField}
                    style={{ marginTop: '8px' }}
                  >
                    + Add Artist
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Favorite Genres (select all that apply)</label>
                <div className="toggle-grid">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`toggle-btn ${favoriteGenres.includes(g) ? 'active' : ''}`}
                      onClick={() => toggleGenre(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {roles.includes('Musician') && (
                <div className="form-group">
                  <label>Instruments</label>
                  <div className="toggle-grid">
                    {INSTRUMENTS.map((inst) => (
                      <button
                        key={inst}
                        type="button"
                        className={`toggle-btn ${instruments.includes(inst) ? 'active' : ''}`}
                        onClick={() => toggleInstrument(inst)}
                      >
                        {inst}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Profile picture + banner */}
          {step === 5 && (
            <div className="signup-page__step">
              <div className="section-label">Profile Media (optional)</div>

              <div className="form-group">
                <label htmlFor="su-avatar">Profile Picture (image or GIF)</label>
                {avatarPreview && (
                  <img src={avatarPreview} alt="Preview" className="signup-page__img-preview signup-page__img-preview--avatar" />
                )}
                <input
                  id="su-avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </div>

              <div className="form-group">
                <label htmlFor="su-banner">Banner Image (optional)</label>
                {bannerPreview && (
                  <img src={bannerPreview} alt="Banner preview" className="signup-page__img-preview signup-page__img-preview--banner" />
                )}
                <input
                  id="su-banner"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                />
                <span className="form-hint">Recommended: 1200×300px or wider</span>
              </div>
            </div>
          )}

          {error && <p className="form-error" style={{ marginBottom: '12px' }}>{error}</p>}

          {/* Nav buttons */}
          <div className="signup-page__nav">
            {step > 1 && (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => { setError(''); setStep((s) => s - 1); }}
              >
                Back
              </button>
            )}
            {step < totalSteps ? (
              <button type="button" className="btn" onClick={nextStep}>
                Continue
              </button>
            ) : (
              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            )}
          </div>
        </form>

        <div className="signup-page__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
