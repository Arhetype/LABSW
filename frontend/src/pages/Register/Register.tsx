import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import styles from './Register.module.scss';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

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
      await authService.register(formData);
      navigate('/login', {
        state: { message: 'Регистрация успешна! Пожалуйста, войдите в систему.' },
      });
    } catch {
      setError('Ошибка регистрации. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.formWrapper}>
        <h1>Регистрация</h1>
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Имя</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
            <button type="button" onClick={() => navigate('/login')} className={styles.loginButton}>
              Уже есть аккаунт? Войти
            </button>
            <button type="submit" className={styles.registerButton}>
              Зарегистрироваться
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
