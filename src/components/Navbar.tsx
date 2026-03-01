import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from './UserAvatar';
import { NotificationBell } from './NotificationBell';
import './Navbar.css';

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/feed" className="navbar__logo">
          <span className="navbar__logo-text">Sound</span>
          <span className="navbar__logo-accent">Pool</span>
        </Link>

        {/* Main nav */}
        {currentUser && (
          <div className="navbar__links">
            <NavLink to="/jams" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
              Jams
            </NavLink>
            <NavLink to="/bands" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
              Bands
            </NavLink>
            <NavLink to="/shows" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
              Shows
            </NavLink>

            {/* More dropdown */}
            <div className="navbar__dropdown" ref={dropdownRef}>
              <button
                className="navbar__link navbar__dropdown-trigger"
                onClick={() => setDropdownOpen((o) => !o)}
              >
                More ▾
              </button>
              {dropdownOpen && (
                <div className="navbar__dropdown-menu">
                  <Link
                    to="/venues"
                    className="navbar__dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Venues
                  </Link>
                  <Link
                    to="/photographers"
                    className="navbar__dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Photographers
                  </Link>
                  <Link
                    to="/artists"
                    className="navbar__dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Artists
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right side */}
        <div className="navbar__right">
          {currentUser ? (
            <>
              <NotificationBell />
              <div className="navbar__user-menu" ref={userMenuRef}>
                <button
                  className="navbar__user-trigger"
                  onClick={() => setUserMenuOpen((o) => !o)}
                >
                  <UserAvatar user={currentUser} size="sm" />
                  <span className="navbar__username">{currentUser.username}</span>
                </button>
                {userMenuOpen && (
                  <div className="navbar__user-dropdown">
                    <Link
                      to={`/profile/${currentUser.username}`}
                      className="navbar__dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="navbar__dropdown-item navbar__dropdown-item--danger"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="btn btn--secondary btn--sm">
                Log in
              </Link>
              <Link to="/signup" className="btn btn--sm">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
