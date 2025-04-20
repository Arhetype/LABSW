import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import styles from './Home.module.scss';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <h1>Event Manager</h1>
        </div>
        <div className={styles.description}>
          <p>Добро пожаловать в Event Manager - ваше приложение для управления мероприятиями.</p>
          <p>Создавайте, просматривайте и управляйте событиями в одном месте.</p>
        </div>
        {!isAuthenticated ? (
          <div className={styles.buttons}>
            <button onClick={() => navigate('/login')} className={styles.button}>
              Войти
            </button>
            <button onClick={() => navigate('/register')} className={styles.button}>
              Зарегистрироваться
            </button>
          </div>
        ) : (
          <div className={styles.buttons}>
            <button onClick={() => navigate('/events')} className={styles.button}>
              К мероприятиям
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
