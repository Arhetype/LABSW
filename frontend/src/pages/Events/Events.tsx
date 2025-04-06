import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService, Event, EventCategory } from '../../api/eventService';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import styles from './Events.module.scss';

const Events: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);

  const fetchEvents = async (category?: EventCategory | null) => {
    try {
      setLoading(true);
      const data = await eventService.getEvents(category || undefined);
      setEvents(data);
      setError(null);
    } catch (err: unknown) {
      console.error('Ошибка при загрузке событий:', err);
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
        setError('Ошибка при загрузке событий. Пожалуйста, попробуйте снова.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (category: EventCategory | null) => {
    setSelectedCategory(category);
  };

  const getCategoryLabel = (category: EventCategory): string => {
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

  if (loading) {
    return <div className={styles.loading}>Загрузка событий...</div>;
  }

  return (
    <div className={styles.eventsContainer}>
      <div className={styles.header}>
        <h1>События</h1>
        <button className={styles.createButton} onClick={() => navigate('/events/create')}>
          Создать событие
        </button>
      </div>

      <div className={styles.categoryFilter}>
        <button
          className={`${styles.categoryButton} ${!selectedCategory ? styles.active : ''}`}
          onClick={() => handleCategoryChange(null)}
        >
          Все
        </button>
        <button
          className={`${styles.categoryButton} ${selectedCategory === 'концерт' ? styles.active : ''}`}
          onClick={() => handleCategoryChange('концерт')}
        >
          Концерты
        </button>
        <button
          className={`${styles.categoryButton} ${selectedCategory === 'лекция' ? styles.active : ''}`}
          onClick={() => handleCategoryChange('лекция')}
        >
          Лекции
        </button>
        <button
          className={`${styles.categoryButton} ${selectedCategory === 'выставка' ? styles.active : ''}`}
          onClick={() => handleCategoryChange('выставка')}
        >
          Выставки
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {events.length === 0 ? (
        <div className={styles.noEvents}>Нет доступных событий</div>
      ) : (
        <div className={styles.eventsGrid}>
          {events.map(event => (
            <div
              key={event.id}
              className={styles.eventCard}
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <h2>{event.title}</h2>
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
  );
};

export default Events;
