import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService, Event } from '../../api/eventService';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import styles from './EventDetails.module.scss';

const EventDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setError('ID события не указан');
        setLoading(false);
        return;
      }

      try {
        const eventData = await eventService.getEventById(parseInt(id, 10));
        setEvent(eventData);

        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setIsOwner(payload.id === eventData.createdBy);
          } catch (err) {
            console.error('Ошибка при декодировании токена:', err);
          }
        }
      } catch (err: unknown) {
        console.error('Ошибка при загрузке события:', err);
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
          setError('Не удалось загрузить событие. Пожалуйста, попробуйте снова.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    if (!window.confirm('Вы уверены, что хотите удалить это событие?')) {
      return;
    }

    try {
      await eventService.deleteEvent(parseInt(id, 10));
      navigate('/');
    } catch (err: unknown) {
      console.error('Ошибка при удалении события:', err);
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
        setError('Не удалось удалить событие. Пожалуйста, попробуйте снова.');
      }
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
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <ErrorMessage message={error} onClose={() => setError(null)} />
        <button onClick={() => navigate('/')} className={styles.backButton}>
          Вернуться к списку событий
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={styles.notFound}>
        <h2>Событие не найдено</h2>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          Вернуться к списку событий
        </button>
      </div>
    );
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.header}>
        <h1>{event.title}</h1>
        <div className={styles.actions}>
          <button onClick={() => navigate('/')} className={styles.backButton}>
            Назад
          </button>
          {isOwner && (
            <>
              <button onClick={() => navigate(`/events/${id}/edit`)} className={styles.editButton}>
                Редактировать
              </button>
              <button onClick={handleDelete} className={styles.deleteButton}>
                Удалить
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Дата:</span>
            <span className={styles.value}>{formatDate(event.date)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Категория:</span>
            <span className={styles.value}>{event.category}</span>
          </div>
        </div>

        {event.description && (
          <div className={styles.description}>
            <h2>Описание</h2>
            <p>{event.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
