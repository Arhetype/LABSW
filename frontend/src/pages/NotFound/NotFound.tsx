import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.scss';

const NotFound: React.FC = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Страница не найдена</h2>
        <p className={styles.description}>
          К сожалению, страница, которую вы ищете, не существует или была удалена.
        </p>
        <div className={styles.imageContainer}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className={styles.image}>
            <style>
              {`
                .st0{fill:#4a90e2;}
                .st1{fill:#333;}
                .st2{fill:#f5f5f5;}
              `}
            </style>
            <circle className="st0" cx="250" cy="250" r="240" />
            <path
              className="st1"
              d="M250 120c-71.8 0-130 58.2-130 130s58.2 130 130 130 130-58.2 130-130-58.2-130-130-130zm0 240c-60.7 0-110-49.3-110-110s49.3-110 110-110 110 49.3 110 110-49.3 110-110 110z"
            />
            <path
              className="st1"
              d="M250 180c-38.6 0-70 31.4-70 70s31.4 70 70 70 70-31.4 70-70-31.4-70-70-70zm0 120c-27.6 0-50-22.4-50-50s22.4-50 50-50 50 22.4 50 50-22.4 50-50 50z"
            />
            <circle className="st2" cx="250" cy="250" r="30" />
            <path
              className="st1"
              d="M250 100c-82.8 0-150 67.2-150 150s67.2 150 150 150 150-67.2 150-150-67.2-150-150-150zm0 280c-71.8 0-130-58.2-130-130s58.2-130 130-130 130 58.2 130 130-58.2 130-130 130z"
            />
          </svg>
        </div>
        <Link to="/" className={styles.homeButton}>
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
