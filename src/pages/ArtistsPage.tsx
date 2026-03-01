import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { compressImage } from '../utils/imageUtils';
import { CITIES } from '../data/cities';
import { ART_MEDIUMS } from '../data/artMediums';
import { timeAgo } from '../utils/dateUtils';
import type { ArtistPost } from '../types';
import './ArtistsPage.css';

export function ArtistsPage() {
  const { currentUser } = useAuth();
  const { artistPosts, addArtistPost } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [artistName, setArtistName] = useState('');
  const [city, setCity] = useState('');
  const [mediums, setMediums] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [website, setWebsite] = useState('');
  const [imageData, setImageData] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  function toggleMedium(m: string) {
    setMediums((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
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
    if (!artistName.trim()) { setError('Name is required.'); return; }
    if (!city) { setError('City is required.'); return; }
    if (!description.trim()) { setError('Description is required.'); return; }

    const post: ArtistPost = {
      id: crypto.randomUUID(),
      authorId: currentUser.id,
      artistName: artistName.trim(),
      city,
      mediums,
      description: description.trim(),
      imageUrl: imageData || undefined,
      instagram: instagram.trim() || undefined,
      website: website.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    addArtistPost(post);
    setModalOpen(false);
    setArtistName(''); setCity(''); setMediums([]); setDescription(''); setInstagram(''); setWebsite(''); setImageData(''); setImagePreview('');
  }

  return (
    <div className="page">
      <div className="artists-page__header">
        <h1 className="page-heading">Visual Artists</h1>
        <button className="btn" onClick={() => setModalOpen(true)}>+ Post</button>
      </div>
      <p className="artists-page__sub">Visual artists — painters, illustrators, designers, and more.</p>

      {artistPosts.length === 0 ? (
        <div className="empty-state">No visual artists posted yet.</div>
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
                  {a.website && (
                    <a href={a.website} target="_blank" rel="noopener noreferrer" className="artist-card__link artist-card__link--website">
                      Portfolio
                    </a>
                  )}
                </div>
                <div className="artist-card__genres">
                  {a.mediums.map((m) => <span key={m} className="tag tag--genre">{m}</span>)}
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
            <div className="modal-box__title">Post Visual Artist</div>
            <button className="modal-box__close" onClick={() => setModalOpen(false)}>✕</button>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Name / Handle *</label><input type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)} /></div>
              <div className="form-group">
                <label>City *</label>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Select city...</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label>About your work *</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
              <div className="form-group">
                <label>Mediums</label>
                <div className="toggle-grid">
                  {ART_MEDIUMS.map((m) => (
                    <button key={m} type="button" className={`toggle-btn ${mediums.includes(m) ? 'active' : ''}`} onClick={() => toggleMedium(m)}>{m}</button>
                  ))}
                </div>
              </div>
              <div className="form-group"><label>Instagram Handle</label><input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@handle" /></div>
              <div className="form-group"><label>Website / Portfolio URL</label><input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." /></div>
              <div className="form-group">
                <label>Image</label>
                {imagePreview && <img src={imagePreview} alt="" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', marginBottom: 8 }} />}
                <input type="file" accept="image/*" onChange={handleImage} />
              </div>
              {error && <p className="form-error">{error}</p>}
              <div className="form-actions">
                <button type="button" className="btn btn--secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn">Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
