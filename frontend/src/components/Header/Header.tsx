import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../api/authService';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      if (isAuth) {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserName(payload.name);
          } catch (error) {
            console.error('Error parsing token:', error);
          }
        }
      }
    };

    checkAuth();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    if (window.innerWidth > 768) {
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserName(null);
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Event Manager
        </Link>

        <button className={styles.menuButton} onClick={toggleMenu}>
          <span className={styles.menuIcon}></span>
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>
                Мероприятия
              </Link>
              <div className={styles.userInfo}>
                <Link
                  to="/profile"
                  className={`${styles.navLink} ${isActive('/profile') ? styles.active : ''}`}
                >
                  Профиль
                </Link>
                <span className={styles.userName}>{userName}</span>
              </div>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${styles.navLink} ${isActive('/login') ? styles.active : ''}`}
              >
                Войти
              </Link>
              <Link
                to="/register"
                className={`${styles.navLink} ${isActive('/register') ? styles.active : ''}`}
              >
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
