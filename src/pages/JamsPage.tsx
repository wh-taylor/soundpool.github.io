import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { JamCard } from '../components/JamCard';
import { CITIES } from '../data/cities';
import { GENRES } from '../data/genres';
import './JamsPage.css';
import { getArtistSimilarities, getGenreSimilarities, getSimilarity } from '../utils/similarity';

export function JamsPage() {
  const { users, currentUser } = useAuth();
  const visibleUsers = users.filter((u) => u.jamEntry?.visible);
  const currentUserVisible = currentUser?.jamEntry?.visible;

  return (
    <div className="page">
      <div className="jams-page__header">
        <h1 className="page-heading">Jams</h1>
      </div>
      <p className="jams-page__sub">
        Musicians available to connect — enable yours from your profile.
      </p>

      {!currentUserVisible && currentUser && (
        <div className="jams-page__banner">
          Your jam entry is hidden.{' '}
          <Link to={`/profile/${currentUser.username}`} className="jams-page__banner-link">
            Enable it on your profile →
          </Link>
        </div>
      )}

      <div className="page-filters">
        <select
          className="page-filter-select"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="">All Locations</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {locationFilter && locationFilter !== currentUser?.location && (
          <button className="btn btn--secondary btn--sm" onClick={() => setLocationFilter(currentUser?.location ?? '')}>
            My City
          </button>
        )}
        {locationFilter && (
          <button className="btn btn--secondary btn--sm" onClick={() => setLocationFilter('')}>
            Clear Location
          </button>
        )}
      </div>

      <div className="page-filter-genre" style={{ marginBottom: 'var(--sp-xl)' }}>
        {GENRES.map((g) => (
          <button
            key={g}
            className={`page-filter-chip ${genreFilters.includes(g) ? 'active' : ''}`}
            onClick={() => toggleGenre(g)}
          >
            {g}
          </button>
        ))}
        {genreFilters.length > 0 && (
          <button className="btn btn--secondary btn--sm" onClick={() => setGenreFilters([])}>
            Clear Genres
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No jam entries match your filters.</div>
      ) : (
        <div className="jams-page__grid">
          {filtered.map((u) => (
            <JamCard key={u.id} user={u} />
          ))}
        </div>
      )}
    </div>
  );
}
