import React from 'react';
import styles from './SuccessMessage.module.scss';

interface SuccessMessageProps {
  message: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return <div className={styles.successMessage}>{message}</div>;
};
