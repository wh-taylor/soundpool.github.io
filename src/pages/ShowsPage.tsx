import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShowCard } from '../components/ShowCard';
import { CreateShowModal } from '../components/CreateShowModal';
import './ShowsPage.css';

export function ShowsPage() {
  const { shows } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const sorted = [...shows].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="page">
      <div className="shows-page__header">
        <h1 className="page-heading">Shows</h1>
        <button className="btn btn--lime" onClick={() => setModalOpen(true)}>
          + Post Show
        </button>
      </div>
      <p className="shows-page__sub">Upcoming shows and events in the scene.</p>

      {sorted.length === 0 ? (
        <div className="empty-state">No shows posted yet.</div>
      ) : (
        <div className="shows-page__grid">
          {sorted.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      )}

      {modalOpen && <CreateShowModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
