import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { JamCard } from '../components/JamCard';
import './JamsPage.css';
import { getArtistSimilarities, getGenreSimilarities, getSimilarity } from '../utils/similarity';

export function JamsPage() {
  const { users, currentUser } = useAuth();
  const genreSimilarity = getGenreSimilarities(users);
  const artistSimilarity = getArtistSimilarities(users);
  const visibleUsers = users.filter((u) => u.jamEntry?.visible)
    .sort((u1, u2) => getSimilarity(currentUser!, u2, genreSimilarity, artistSimilarity) - getSimilarity(currentUser!, u1, genreSimilarity, artistSimilarity));
  const currentUserVisible = currentUser?.jamEntry?.visible;
  console.log(visibleUsers.map((u) => getSimilarity(currentUser!, u, genreSimilarity, artistSimilarity)));

  return (
    <div className="page">
      <h1 className="page-heading">Jams</h1>
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

      {visibleUsers.length === 0 ? (
        <div className="empty-state">No jam entries yet. Enable yours from your profile!</div>
      ) : (
        <div className="jams-page__grid">
          {visibleUsers.map((u) => (
            <JamCard key={u.id} user={u} />
          ))}
        </div>
      )}
    </div>
  );
}
