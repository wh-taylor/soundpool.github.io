import type { User } from '../types';
import './UserAvatar.css';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const initial = user.username.charAt(0).toUpperCase();
  const accentColor = user.customization.accentColor ?? 'var(--accent-1)';

  if (user.profilePicture) {
    return (
      <img
        className={`user-avatar user-avatar--${size}`}
        src={user.profilePicture}
        alt={user.username}
      />
    );
  }

  return (
    <div
      className={`user-avatar user-avatar--${size} user-avatar--monogram`}
      style={{ borderColor: accentColor, color: accentColor }}
      aria-label={user.username}
    >
      {initial}
    </div>
  );
}
