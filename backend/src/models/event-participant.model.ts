import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface EventParticipantAttributes {
  id: number;
  eventId: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class EventParticipant extends Model<EventParticipantAttributes> implements EventParticipantAttributes {
  public id!: number;
  public eventId!: number;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EventParticipant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'EventParticipant',
    tableName: 'event_participants',
  }
);

export default EventParticipant; 