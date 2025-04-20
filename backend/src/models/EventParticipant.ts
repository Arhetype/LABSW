import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/db';
import { User } from './User';
import { Event } from './Event';

interface EventParticipantAttributes {
  id?: number;
  userId: number;
  eventId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class EventParticipant extends Model<EventParticipantAttributes> implements EventParticipantAttributes {
  public id!: number;
  public userId!: number;
  public eventId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

EventParticipant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'event_participants',
    timestamps: true,
  },
);

// Устанавливаем связи
EventParticipant.belongsTo(User, { foreignKey: 'userId' });
EventParticipant.belongsTo(Event, { foreignKey: 'eventId' });

User.belongsToMany(Event, { through: EventParticipant, foreignKey: 'userId' });
Event.belongsToMany(User, { through: EventParticipant, foreignKey: 'eventId' });

export const syncModel = async (): Promise<void> => {
  try {
    await EventParticipant.sync({ alter: true });
    console.log('Модель "Участники мероприятий" синхронизирована с базой данных.');
  } catch (error) {
    console.error('Ошибка при синхронизации модели "Участники мероприятий":', error);
  }
};

export { EventParticipant }; 