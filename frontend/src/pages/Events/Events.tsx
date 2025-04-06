import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService, Event, EventCategory } from '../../api/eventService';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import styles from './Events.module.scss';

const Events: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);

  const fetchEvents = async (category?: EventCategory | null) => {
    try {
      setLoading(true);
      const data = await eventService.getEvents(category || undefined);
      setEvents(data);
    } catch (err) {
      setError('Ошибка при загрузке событий. Пожалуйста, попробуйте снова.');
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
        return 'Концерты';
      case 'лекция':
        return 'Лекции';
      case 'выставка':
        return 'Выставки';
      default:
        return category;
    }
  };

  return (
    <div className={styles.eventsContainer}>
      <div className={styles.header}>
        <h1>События</h1>
        <button onClick={() => navigate('/events/create')} className={styles.createButton}>
          Создать событие
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <div className={styles.categoryFilter}>
        <button
          className={`${styles.categoryButton} ${selectedCategory === null ? styles.active : ''}`}
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

      {loading ? (
        <div className={styles.loading}>Загрузка событий...</div>
      ) : events.length === 0 ? (
        <div className={styles.noEvents}>Нет доступных событий</div>
      ) : (
        <div className={styles.eventsGrid}>
          {events.map((event) => (
            <div
              key={event.id}
              className={styles.eventCard}
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <h2>{event.title}</h2>
              <p className={styles.description}>{event.description}</p>
              <div className={styles.eventDetails}>
                <span>Дата: {new Date(event.date).toLocaleDateString()}</span>
                <span>Категория: {getCategoryLabel(event.category)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events; 