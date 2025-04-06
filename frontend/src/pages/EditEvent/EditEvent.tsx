import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService, EventCategory } from '../../api/eventService';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { authService } from '../../api/authService';
import styles from './EditEvent.module.scss';

const EditEvent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'концерт' as EventCategory,
  });

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Загружаем данные события
    const fetchEvent = async () => {
      if (!id) {
        setError('ID события не указан');
        setLoading(false);
        return;
      }

      try {
        const event = await eventService.getEventById(parseInt(id, 10));
        
        // Форматируем дату для input datetime-local
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toISOString().slice(0, 16);
        
        setFormData({
          title: event.title,
          description: event.description || '',
          date: formattedDate,
          category: event.category,
        });
      } catch (err: any) {
        console.error('Ошибка при загрузке события:', err);
        if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError('Не удалось загрузить событие. Пожалуйста, попробуйте снова.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!id) {
      setError('ID события не указан');
      return;
    }

    try {
      await eventService.updateEvent(parseInt(id, 10), {
        ...formData,
        date: new Date(formData.date).toISOString()
      });
      navigate('/');
    } catch (err: any) {
      console.error('Ошибка при обновлении события:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Не удалось обновить событие. Пожалуйста, попробуйте снова.');
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.editContainer}>
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      <h1>Редактирование события</h1>
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
            Сохранить изменения
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent; 