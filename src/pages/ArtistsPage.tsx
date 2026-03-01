import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { compressImage } from '../utils/imageUtils';
import { CITIES } from '../data/cities';
import { GENRES } from '../data/genres';
import { timeAgo } from '../utils/dateUtils';
import type { ArtistPost } from '../types';
import './ArtistsPage.css';

export function ArtistsPage() {
  const { currentUser } = useAuth();
  const { artistPosts, addArtistPost } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [artistName, setArtistName] = useState('');
  const [city, setCity] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [spotify, setSpotify] = useState('');
  const [imageData, setImageData] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  function toggleGenre(g: string) {
    setGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const c = await compressImage(file, 800, 0.8);
    setImageData(c);
    setImagePreview(c);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
    if (!artistName.trim()) { setError('Artist name is required.'); return; }
    if (!city) { setError('City is required.'); return; }
    if (!description.trim()) { setError('Description is required.'); return; }

    const post: ArtistPost = {
      id: crypto.randomUUID(),
      authorId: currentUser.id,
      artistName: artistName.trim(),
      city,
      genres,
      description: description.trim(),
      imageUrl: imageData || undefined,
      instagram: instagram.trim() || undefined,
      spotify: spotify.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    addArtistPost(post);
    setModalOpen(false);
    setArtistName(''); setCity(''); setGenres([]); setDescription(''); setInstagram(''); setSpotify(''); setImageData(''); setImagePreview('');
  }

  return (
    <div className="page">
      <div className="artists-page__header">
        <h1 className="page-heading">Artists</h1>
        <button className="btn" onClick={() => setModalOpen(true)}>+ Post Artist</button>
      </div>
      <p className="artists-page__sub">Solo artists and projects looking to connect.</p>

      {artistPosts.length === 0 ? (
        <div className="empty-state">No artists posted yet.</div>
      ) : (
        <div className="artists-page__grid">
          {artistPosts.map((a) => (
            <div key={a.id} className="artist-card panel">
              {a.imageUrl && <img src={a.imageUrl} alt={a.artistName} className="artist-card__image" />}
              <div className="artist-card__body">
                <div className="artist-card__header">
                  <h3 className="artist-card__name">{a.artistName}</h3>
                  <span className="tag tag--post">{timeAgo(a.createdAt)}</span>
                </div>
                <div className="artist-card__meta">
                  <span>{a.city}</span>
                  {a.instagram && (
                    <a href={`https://instagram.com/${a.instagram}`} target="_blank" rel="noopener noreferrer" className="artist-card__link">
                      @{a.instagram}
                    </a>
                  )}
                  {a.spotify && (
                    <a href={a.spotify} target="_blank" rel="noopener noreferrer" className="artist-card__link artist-card__link--spotify">
                      Spotify
                    </a>
                  )}
                </div>
                <div className="artist-card__genres">
                  {a.genres.map((g) => <span key={g} className="tag tag--genre">{g}</span>)}
                </div>
                <p className="artist-card__desc">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal-box">
            <div className="modal-box__title">Post Artist</div>
            <button className="modal-box__close" onClick={() => setModalOpen(false)}>✕</button>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Artist / Project Name *</label><input type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)} /></div>
              <div className="form-group">
                <label>City *</label>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Select city...</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Description *</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
              <div className="form-group">
                <label>Genres</label>
                <div className="toggle-grid">
                  {GENRES.map((g) => (
                    <button key={g} type="button" className={`toggle-btn ${genres.includes(g) ? 'active' : ''}`} onClick={() => toggleGenre(g)}>{g}</button>
                  ))}
                </div>
              </div>
              <div className="form-group"><label>Instagram Handle</label><input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@handle" /></div>
              <div className="form-group"><label>Spotify URL</label><input type="url" value={spotify} onChange={(e) => setSpotify(e.target.value)} placeholder="https://open.spotify.com/..." /></div>
              <div className="form-group">
                <label>Image</label>
                {imagePreview && <img src={imagePreview} alt="" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', marginBottom: 8 }} />}
                <input type="file" accept="image/*" onChange={handleImage} />
              </div>
              {error && <p className="form-error">{error}</p>}
              <div className="form-actions">
                <button type="button" className="btn btn--secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn">Post Artist</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
