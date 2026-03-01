import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { CustomizationPanel } from './CustomizationPanel';
import { compressImage } from '../utils/imageUtils';
import { GENRES } from '../data/genres';
import { INSTRUMENTS } from '../data/instruments';
import type { JamPost, Customization } from '../types';

interface CreateJamModalProps {
  onClose: () => void;
}

export function CreateJamModal({ onClose }: CreateJamModalProps) {
  const { currentUser } = useAuth();
  const { addJamPost } = useApp();
  const [description, setDescription] = useState('');
  const [instruments, setInstruments] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [imageData, setImageData] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [customization, setCustomization] = useState<Customization>({});
  const [error, setError] = useState('');

  function toggle(arr: string[], val: string, set: (a: string[]) => void) {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const c = await compressImage(file, 800, 0.8);
      setImageData(c);
      setImagePreview(c);
    } catch {
      setError('Failed to process image.');
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;
    if (!description.trim()) { setError('Description is required.'); return; }
    if (instruments.length === 0) { setError('Select at least one instrument.'); return; }

    const jam: JamPost = {
      id: crypto.randomUUID(),
      authorId: currentUser.id,
      description: description.trim(),
      instruments,
      genres,
      videoUrl: videoUrl.trim() || undefined,
      imageUrl: imageData || undefined,
      customization: Object.keys(customization).length ? customization : undefined,
      createdAt: new Date().toISOString(),
    };
    addJamPost(jam);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-box__title">Post a Jam</div>
        <button className="modal-box__close" onClick={onClose}>✕</button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell people what you're looking for..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Your Instruments</label>
            <div className="toggle-grid">
              {INSTRUMENTS.map((inst) => (
                <button
                  key={inst}
                  type="button"
                  className={`toggle-btn ${instruments.includes(inst) ? 'active' : ''}`}
                  onClick={() => toggle(instruments, inst, setInstruments)}
                >
                  {inst}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Genres</label>
            <div className="toggle-grid">
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`toggle-btn ${genres.includes(g) ? 'active' : ''}`}
                  onClick={() => toggle(genres, g, setGenres)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Image (optional)</label>
            {imagePreview && (
              <img src={imagePreview} alt="" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', marginBottom: 8 }} />
            )}
            <input type="file" accept="image/*" onChange={handleImage} />
          </div>

          <div className="form-group">
            <label>Video URL (YouTube/Vimeo, optional — plays on hover)</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </div>

          <CustomizationPanel value={customization} onChange={setCustomization} />

          {error && <p className="form-error" style={{ marginTop: 12 }}>{error}</p>}
          <div className="form-actions">
            <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn">Post Jam</button>
          </div>
        </form>
      </div>
    </div>
  );
}
