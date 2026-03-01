import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import './NotificationBell.css';

export function NotificationBell() {
  const { currentUser } = useAuth();
  const { getPendingBandInvites, acceptBandInvite, declineBandInvite } = useApp();
  const [open, setOpen] = useState(false);

  if (!currentUser) return null;

  const pendingInvites = getPendingBandInvites(currentUser.id);

  return (
    <div className="notif-bell">
      <button
        className="notif-bell__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        <span className="notif-bell__icon">◈</span>
        {pendingInvites.length > 0 && (
          <span className="notif-bell__badge">{pendingInvites.length}</span>
        )}
      </button>

      {open && (
        <div className="notif-bell__dropdown">
          <div className="notif-bell__header">Notifications</div>
          {pendingInvites.length === 0 ? (
            <div className="notif-bell__empty">No new notifications</div>
          ) : (
            pendingInvites.map((band) => (
              <div key={band.id} className="notif-bell__item">
                <div className="notif-bell__item-text">
                  Band invite: <strong>{band.name}</strong>
                </div>
                <div className="notif-bell__item-actions">
                  <button
                    className="btn btn--sm btn--lime"
                    onClick={() => {
                      acceptBandInvite(band.id, currentUser.id);
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn--sm btn--danger"
                    onClick={() => {
                      declineBandInvite(band.id, currentUser.id);
                    }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
