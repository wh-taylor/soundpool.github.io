import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AudioPlayer } from './AudioPlayer';
import { FONT_OPTIONS } from '../data/fonts';
import { timeAgo } from '../utils/dateUtils';
import type { Band } from '../types';
import './BandRow.css';

interface BandRowProps {
  band: Band;
}

export function BandRow({ band }: BandRowProps) {
  const { getUserById } = useAuth();

  const [isHovered, setIsHovered] = useState(false);

  const accentColor = band.customization?.accentColor ?? 'var(--accent-2)';
  const fontFamily = band.customization?.fontFamily;
  const fontStack = FONT_OPTIONS.find((f) => f.value === fontFamily)?.stack ?? 'inherit';
  const staticImage = band.imageUrl; 
  const animatedGif = band.gifUrl; // You'll need to add this to your mock data
  const audioSrc = band.audioData ?? band.audioUrl;

  const customStyle = {
    '--band-accent': accentColor,
    '--band-font': fontStack,
    fontFamily: fontStack,
  } as React.CSSProperties;

  return (
  <div 
    className="band-row panel" 
    style={customStyle}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <div className="band-row__main">
      {band.imageUrl ? (
        <img 
          src={isHovered && animatedGif ? animatedGif : staticImage} 
          alt={band.name} 
          className="band-row__image" 
        />
      ) : (
        <div className="band-row__image-placeholder">
          <span>♪</span>
        </div>
      )}

        <div className="band-row__info">
          <div className="band-row__name-row">
            <h3 className="band-row__name" style={{ color: accentColor }}>
              {band.instagram ? (
                <a
                  href={`https://instagram.com/${band.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="band-row__name-link"
                  style={{ color: accentColor }}
                >
                  {band.name}
                </a>
              ) : (
                band.name
              )}
            </h3>
            <span className="tag tag--band">Band</span>
          </div>

          <div className="band-row__meta">
            <span className="band-row__location">{band.location}</span>
            <span className="band-row__sep">·</span>
            <span className="band-row__time">{timeAgo(band.createdAt)}</span>
          </div>

          <div className="band-row__genres">
            {band.genres.map((g) => (
              <span key={g} className="tag tag--genre">{g}</span>
            ))}
          </div>

          <p className="band-row__description">{band.description}</p>

          {audioSrc && (
            <AudioPlayer src={audioSrc} label="Listen" />
          )}
        </div>

        <div className="band-row__sidebar">
          <div className="band-row__posted-by">
            {(() => {
              const admin = getUserById(band.adminId);
              return admin ? (
                <Link to={`/profile/${admin.username}`} className="band-row__admin-link">
                  posted by {admin.username}
                </Link>
              ) : null;
            })()}
          </div>

          <div className="band-row__member-count">
            <span className="band-row__member-label">Members</span>
            <span className="band-row__member-num">
              {band.members.filter((m) => m.status === 'accepted').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
