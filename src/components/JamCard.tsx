import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from './UserAvatar';
import { timeAgo } from '../utils/dateUtils';
import { getEmbedUrl } from '../utils/videoUtils';
import { FONT_OPTIONS } from '../data/fonts';
import type { JamPost } from '../types';
import './JamCard.css';

interface JamCardProps {
  jam: JamPost;
}

export function JamCard({ jam }: JamCardProps) {
  const { getUserById } = useAuth();
  const [hovered, setHovered] = useState(false);
  const author = getUserById(jam.authorId);
  const embedUrl = jam.videoUrl ? getEmbedUrl(jam.videoUrl) : null;

  const accentColor = jam.customization?.accentColor ?? 'var(--accent-1)';
  const fontFamily = jam.customization?.fontFamily;
  const fontStack = FONT_OPTIONS.find((f) => f.value === fontFamily)?.stack ?? 'inherit';

  const customStyle = {
    '--card-accent': accentColor,
    '--card-font': fontStack,
    fontFamily: fontStack,
    borderColor: accentColor,
  } as React.CSSProperties;

  return (
    <article
      className="jam-card panel"
      style={customStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="jam-card__type-row">
        <span className="tag tag--jam">Jam</span>
        <span className="jam-card__time" style={{ color: 'var(--text-muted)' }}>
          {timeAgo(jam.createdAt)}
        </span>
      </div>

      {jam.imageUrl && !hovered && (
        <img src={jam.imageUrl} alt="Jam" className="jam-card__image" />
      )}

      {hovered && embedUrl && (
        <div className="jam-card__video">
          <iframe
            src={embedUrl + '&autoplay=1&mute=1'}
            title="Jam video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      )}

      {author && (
        <div className="jam-card__author">
          <UserAvatar user={author} size="sm" />
          <div className="jam-card__author-info">
            <Link
              to={`/profile/${author.username}`}
              className="jam-card__username"
              style={{ color: accentColor }}
            >
              {author.username}
            </Link>
            <div className="jam-card__meta-row">
              {author.instagram && (
                <span className="jam-card__meta-item">@{author.instagram}</span>
              )}
              <span className="jam-card__meta-item">{author.location}</span>
            </div>
          </div>
        </div>
      )}

      <p className="jam-card__description">{jam.description}</p>

      <div className="jam-card__tags">
        {jam.instruments.map((inst) => (
          <span key={inst} className="tag tag--instrument">{inst}</span>
        ))}
        {jam.genres.map((g) => (
          <span key={g} className="tag tag--genre">{g}</span>
        ))}
      </div>
    </article>
  );
}
