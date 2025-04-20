import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../api/authService';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
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
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          События
        </Link>

        <button
          className={`${styles.burgerButton} ${isMenuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label="Открыть меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Все события
              </Link>
              <Link
                to="/events/create"
                className={`${styles.navLink} ${isActive('/events/create') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Создать событие
              </Link>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${styles.navLink} ${isActive('/login') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Войти
              </Link>
              <Link
                to="/register"
                className={`${styles.navLink} ${isActive('/register') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
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
