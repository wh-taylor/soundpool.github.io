import { Link } from 'react-router-dom';
import { UserAvatar } from './UserAvatar';
import { FONT_OPTIONS } from '../data/fonts';
import type { User } from '../types';
import './JamCard.css';

interface JamCardProps {
  user: User;
}

export function JamCard({ user }: JamCardProps) {
  const accentColor = user.jamEntry?.customization?.accentColor ?? 'var(--accent-1)';
  const fontFamily = user.jamEntry?.customization?.fontFamily;
  const fontStack = FONT_OPTIONS.find((f) => f.value === fontFamily)?.stack ?? 'inherit';

  const customStyle = {
    '--card-accent': accentColor,
    '--card-font': fontStack,
    fontFamily: fontStack,
    borderColor: accentColor,
  } as React.CSSProperties;

  return (
    <article className="jam-card panel" style={customStyle}>
      <div className="jam-card__header">
        <span className="tag tag--jam">Jam</span>
        <span className="jam-card__location">{user.location}</span>
      </div>

      <div className="jam-card__author">
        <UserAvatar user={user} size="sm" />
        <div className="jam-card__author-info">
          <Link
            to={`/profile/${user.username}`}
            className="jam-card__username"
            style={{ color: accentColor }}
          >
            {user.username}
          </Link>
          {user.instagram && (
            <span className="jam-card__meta-item">@{user.instagram}</span>
          )}
        </div>
      </div>

      {user.jamEntry?.description && (
        <p className="jam-card__description">{user.jamEntry.description}</p>
      )}

      <div className="jam-card__tags">
        {user.instruments.map((inst) => (
          <span key={inst} className="tag tag--instrument">{inst}</span>
        ))}
        {user.favoriteGenres.map((g) => (
          <span key={g} className="tag tag--genre">{g}</span>
        ))}
      </div>
    </article>
  );
}
