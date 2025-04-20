import React, { useEffect, useState } from 'react';
import { EventParticipant } from '../../types/eventParticipant';
import { eventService } from '../../api/eventService';
import styles from './ParticipantsModal.module.scss';

interface ParticipantsModalProps {
  eventId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({ eventId, isOpen, onClose }) => {
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchParticipants = async () => {
        try {
          const data = await eventService.getEventParticipants(eventId);
          setParticipants(data);
        } catch (error) {
          console.error('Failed to fetch participants:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchParticipants();
    }
  }, [eventId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Участники мероприятия</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.participantsList}>
          {isLoading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : participants.length === 0 ? (
            <div className={styles.empty}>Нет участников</div>
          ) : (
            participants.map((participant) => (
              <div key={participant.id} className={styles.participant}>
                <div className={styles.participantName}>{participant.user.name}</div>
                <div className={styles.participantEmail}>{participant.user.email}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantsModal; 