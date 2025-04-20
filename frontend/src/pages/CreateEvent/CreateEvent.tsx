import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService, EventCategory } from '../../api/eventService';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { authService } from '../../api/authService';
import styles from './CreateEvent.module.scss';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'концерт' as EventCategory,
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id);
      } catch (err) {
        console.error('Ошибка при декодировании токена:', err);
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
      return;
    }

    try {
      await eventService.createEvent({
        ...formData,
        date: new Date(formData.date).toISOString(),
        createdBy: userId,
      });
      navigate('/');
    } catch (err: unknown) {
      console.error('Ошибка при создании события:', err);
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'error' in err.response.data
      ) {
        setError(err.response.data.error as string);
      } else {
        setError('Не удалось создать событие. Пожалуйста, попробуйте снова.');
      }
    }
  };

  return (
    <div className={styles.createContainer}>
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      <h1>Создание нового события</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Название</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="date">Дата</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">Категория</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="концерт">Концерт</option>
            <option value="лекция">Лекция</option>
            <option value="выставка">Выставка</option>
          </select>
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={() => navigate('/')} className={styles.cancelButton}>
            Отмена
          </button>
          <button type="submit" className={styles.submitButton}>
            Создать событие
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
