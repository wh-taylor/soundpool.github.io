import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { JamCard } from '../components/JamCard';
import { CreateJamModal } from '../components/CreateJamModal';
import './JamsPage.css';

export function JamsPage() {
  const { jamPosts } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="page">
      <div className="jams-page__header">
        <h1 className="page-heading">Jams</h1>
        <button className="btn" onClick={() => setModalOpen(true)}>
          + Post Jam
        </button>
      </div>
      <p className="jams-page__sub">
        Find musicians to jam with, or let people know you're available.
      </p>

      {jamPosts.length === 0 ? (
        <div className="empty-state">No jams posted yet. Be the first!</div>
      ) : (
        <div className="jams-page__grid">
          {jamPosts.map((jam) => (
            <JamCard key={jam.id} jam={jam} />
          ))}
        </div>
      )}

      {modalOpen && <CreateJamModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
