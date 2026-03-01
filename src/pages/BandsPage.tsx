import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BandRow } from '../components/BandRow';
import { CreateBandModal } from '../components/CreateBandModal';
import './BandsPage.css';

export function BandsPage() {
  const { bands } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="page">
      <div className="bands-page__header">
        <h1 className="page-heading">Bands</h1>
        <button className="btn btn--cyan" onClick={() => setModalOpen(true)}>
          + Post Band
        </button>
      </div>
      <p className="bands-page__sub">Discover bands, join one, or post your own.</p>

      {bands.length === 0 ? (
        <div className="empty-state">No bands posted yet.</div>
      ) : (
        <div className="bands-page__list">
          {bands.map((band) => (
            <BandRow key={band.id} band={band} />
          ))}
        </div>
      )}

      {modalOpen && <CreateBandModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
