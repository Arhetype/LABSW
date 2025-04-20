import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../api/authService';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import styles from './Login.module.scss';

interface LocationState {
  message?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as LocationState;
    if (state && state.message) {
      setSuccessMessage(state.message);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await authService.login(formData);
      localStorage.setItem('token', response.token);
      window.location.href = '/';
    } catch {
      setError('Неверный email или пароль. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formWrapper}>
        <h1>Вход в систему</h1>
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className={styles.registerButton}
            >
              Нет аккаунта? Зарегистрироваться
            </button>
            <button type="submit" className={styles.loginButton}>
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
