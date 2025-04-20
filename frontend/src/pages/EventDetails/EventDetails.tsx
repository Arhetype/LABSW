import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService } from '../../api/eventService';
import { Event } from '../../types/event';
import { User } from '../../types/user';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import Modal from '../../components/Modal/Modal';
import { EventParticipant } from '../../types/eventParticipant';
import styles from './EventDetails.module.scss';

const EventDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);

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
            
            // Проверяем регистрацию пользователя
            const participants = await eventService.getEventParticipants(parseInt(id, 10));
            setIsRegistered(participants.some(p => p.userId === payload.id));
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

  const handleRegister = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);

    try {
      console.log('Начало регистрации...');
      await eventService.registerForEvent(parseInt(id, 10));
      console.log('Регистрация успешна, обновляем данные...');
      
      // Сохраняем текущее состояние события
      const currentEvent = event;
      
      // Обновляем все состояния
      const [updatedEvent, updatedParticipants] = await Promise.all([
        eventService.getEventById(parseInt(id, 10)),
        eventService.getEventParticipants(parseInt(id, 10))
      ]);
      
      console.log('Получены обновленные данные:', { updatedEvent, updatedParticipants });
      
      // Обновляем состояния
      setEvent(updatedEvent || currentEvent);
      // Обеспечиваем, что participants всегда массив
      setParticipants(Array.isArray(updatedParticipants) ? updatedParticipants : []);
      setIsRegistered(true);
      
      console.log('Состояния обновлены');
    } catch (err: unknown) {
      console.error('Ошибка при регистрации на событие:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        setError(err.response.data.message as string);
      } else {
        setError('Не удалось зарегистрироваться на событие. Пожалуйста, попробуйте снова.');
      }
    }
  };

  const handleShowParticipants = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!id) return;

    setShowParticipants(true);
    setParticipantsLoading(true);
    setError(null);

    try {
      const participantsList = await eventService.getEventParticipants(parseInt(id, 10));
      console.log('Полученные данные участников:', participantsList);
      setParticipants(participantsList);
    } catch (err: unknown) {
      console.error('Ошибка при загрузке участников:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        setError(err.response.data.message as string);
      } else {
        setError('Не удалось загрузить список участников');
      }
    } finally {
      setParticipantsLoading(false);
    }
  };

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
      {error && (
        <div className={styles.errorContainer}>
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </div>
      )}
      <div className={styles.header}>
        <h1>{event.title}</h1>
        <div className={styles.actions}>
          <button onClick={() => navigate('/')} className={styles.backButton}>
            Назад
          </button>
          {!isOwner && !isRegistered && (
            <button 
              type="button"
              onClick={handleRegister} 
              disabled={isRegistered}
              className={styles.registerButton}
            >
              {isRegistered ? 'Вы уже зарегистрированы' : 'Зарегистрироваться'}
            </button>
          )}
          {!isOwner && isRegistered && (
            <button className={styles.registeredButton} disabled>
              Вы зарегистрированы
            </button>
          )}
          {(isOwner || isRegistered) && (
            <button 
              type="button"
              onClick={handleShowParticipants}
              className={styles.participantsButton}
            >
              Показать участников
            </button>
          )}
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

      <Modal
        isOpen={showParticipants}
        onClose={() => setShowParticipants(false)}
        title="Участники мероприятия"
      >
        {participantsLoading ? (
          <div className={styles.loading}>Загрузка участников...</div>
        ) : (
          <div className={styles.participantsList}>
            {!participants || participants.length === 0 ? (
              <p>Нет зарегистрированных участников</p>
            ) : (
              participants.map((participant) => {
                console.log('Обработка участника:', participant);
                const user = participant.User || {};
                return (
                  <div key={participant.id} className={styles.participantItem}>
                    <div className={styles.participantInfo}>
                      <span className={styles.participantName}>{user.name || 'Неизвестный пользователь'}</span>
                      <span className={styles.participantEmail}>{user.email || ''}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EventDetails;
