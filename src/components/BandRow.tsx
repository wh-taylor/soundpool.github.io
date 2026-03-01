import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { AudioPlayer } from './AudioPlayer';
import { FONT_OPTIONS } from '../data/fonts';
import { timeAgo } from '../utils/dateUtils';
import type { Band } from '../types';
import './BandRow.css';

interface BandRowProps {
  band: Band;
}

export function BandRow({ band }: BandRowProps) {
  const { currentUser, getUserById, getUserByUsername } = useAuth();
  const { inviteUserToBand } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteError, setInviteError] = useState('');

  const isAdmin = currentUser?.id === band.adminId;
  const accentColor = band.customization?.accentColor ?? 'var(--accent-2)';
  const fontFamily = band.customization?.fontFamily;
  const fontStack = FONT_OPTIONS.find((f) => f.value === fontFamily)?.stack ?? 'inherit';

  const audioSrc = band.audioData ?? band.audioUrl;

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteError('');
    const target = getUserByUsername(inviteUsername.trim());
    if (!target) {
      setInviteError('User not found.');
      return;
    }
    if (target.id === band.adminId) {
      setInviteError('Admin is already a member.');
      return;
    }
    inviteUserToBand(band.id, target.id);
    setInviteUsername('');
  }

  const customStyle = {
    '--band-accent': accentColor,
    '--band-font': fontStack,
    fontFamily: fontStack,
  } as React.CSSProperties;

  return (
    <div className="band-row panel" style={customStyle}>
      <div className="band-row__main">
        {band.imageUrl ? (
          <img src={band.imageUrl} alt={band.name} className="band-row__image" />
        ) : (
          <div className="band-row__image-placeholder">
            <span>♪</span>
          </div>
        )}

        <div className="band-row__info">
          <div className="band-row__name-row">
            <h3 className="band-row__name" style={{ color: accentColor }}>
              {band.name}
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

          <button
            className="btn btn--secondary btn--sm"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="band-row__expanded">
          <div className="band-row__members-list">
            <div className="section-label">Members</div>
            {band.members.map((m) => {
              const user = getUserById(m.userId);
              return (
                <div key={m.userId} className="band-row__member-item">
                  {user ? (
                    <Link to={`/profile/${user.username}`} className="band-row__member-name">
                      {user.username}
                    </Link>
                  ) : (
                    <span className="band-row__member-name">unknown</span>
                  )}
                  <span className={`tag tag--${m.status}`}>{m.status}</span>
                </div>
              );
            })}
          </div>

          {isAdmin && (
            <form onSubmit={handleInvite} className="band-row__invite-form">
              <div className="section-label">Invite Member</div>
              <div className="band-row__invite-row">
                <input
                  type="text"
                  className="band-row__invite-input"
                  placeholder="Enter username..."
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                />
                <button type="submit" className="btn btn--sm btn--cyan">
                  Invite
                </button>
              </div>
              {inviteError && <p className="form-error">{inviteError}</p>}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
