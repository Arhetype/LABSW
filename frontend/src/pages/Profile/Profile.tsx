import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';
import { eventService, Event } from '../../api/eventService';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import styles from './Profile.module.scss';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('Decoded Payload:', payload);
          setUser({ name: payload.name, email: payload.email });

          // Получаем мероприятия пользователя
          const userEvents = await eventService.getUserEvents(payload.id);
          setEvents(userEvents);
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных пользователя:', err);
        setError('Не удалось загрузить данные пользователя');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'концерт':
        return 'Концерт';
      case 'лекция':
        return 'Лекция';
      case 'выставка':
        return 'Выставка';
      default:
        return category;
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <ErrorMessage message={error} onClose={() => setError(null)} />
        <button onClick={() => navigate('/')} className={styles.backButton}>
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.userInfo}>
        <h1>Профиль пользователя</h1>
        {user && (
          <div className={styles.userDetails}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Имя:</span>
              <span className={styles.value}>{user.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{user.email}</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.userEvents}>
        <h2>Мои мероприятия</h2>
        {events.length === 0 ? (
          <div className={styles.noEvents}>У вас пока нет созданных мероприятий</div>
        ) : (
          <div className={styles.eventsGrid}>
            {events.map(event => (
              <div
                key={event.id}
                className={styles.eventCard}
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <h3>{event.title}</h3>
                <div className={styles.eventDetails}>
                  <div className={styles.eventInfo}>
                    <span className={styles.label}>Дата:</span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className={styles.eventInfo}>
                    <span className={styles.label}>Категория:</span>
                    <span className={styles.category}>{getCategoryLabel(event.category)}</span>
                  </div>
                </div>
                {event.description && <p className={styles.description}>{event.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
