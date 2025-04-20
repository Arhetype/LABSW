import React from 'react';
import styles from './ErrorNotification.module.scss';

interface ErrorNotificationProps {
  message: string;
  onClose?: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message, onClose }) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <p className={styles.errorMessage}>{message}</p>
        {onClose && (
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorNotification;
