import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { JamCard } from '../components/JamCard';
import './JamsPage.css';

export function JamsPage() {
  const { users, currentUser } = useAuth();
  const visibleUsers = users.filter((u) => u.jamEntry?.visible);
  const currentUserVisible = currentUser?.jamEntry?.visible;

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
