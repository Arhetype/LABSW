import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Event } from '../../api/eventService';
import { selectEvent, fetchEventById } from '../../store/slices/eventsSlice';
import { eventService } from '../../api/eventService';
import styles from './EventCard.module.scss';
import { AppDispatch } from '../../store';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const dispatch: AppDispatch = useDispatch();
  const [creatorName, setCreatorName] = useState('');

  useEffect(() => {
    const fetchCreatorName = async () => {
      try {
        const user = await eventService.getUserById(event.createdBy);
        console.log('Fetched user:', user);
        setCreatorName(user.name);
      } catch (error) {
        console.error('Failed to fetch creator name:', error);
      }
    };

    fetchCreatorName();
  }, [event.createdBy]);

  const handleClick = () => {
    dispatch(selectEvent(event.id));
    dispatch(fetchEventById(event.id));
    onClick();
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

  return (
    <div className={styles.eventCard} onClick={handleClick}>
      <h2>{event.title}</h2>
      <div className={styles.eventDetails}>
        <div className={styles.eventInfo}>
          <span className={styles.label}>Дата:</span>
          <span>{formatDate(event.date)}</span>
        </div>
        <div className={styles.eventInfo}>
          <span className={styles.label}>Категория:</span>
          <span className={styles.category}>{event.category}</span>
        </div>
        <div className={styles.eventInfo}>
          <span className={styles.label}>Создатель:</span>
          <span>{creatorName}</span>
        </div>
      </div>
      {event.description && <p className={styles.description}>{event.description}</p>}
    </div>
  );
};

export default EventCard;
