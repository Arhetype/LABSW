import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/db';
import { User } from './User';

interface EventAttributes {
  id: number;
  title: string;
  description: string | null;
  date: Date;
  category: 'концерт' | 'лекция' | 'выставка';
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

class Event extends Model<EventAttributes> implements EventAttributes {
  public id!: number;
  public title!: string;
  public description!: string | null;
  public date!: Date;
  public category!: 'концерт' | 'лекция' | 'выставка';
  public createdBy!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Название мероприятия не может быть пустым.',
        },
        len: {
          args: [1, 255],
          msg: 'Название мероприятия должно содержать от 1 до 255 символов.',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Дата мероприятия должна быть в формате даты.',
          args: true,
        },
        isAfter: {
          args: new Date().toISOString(),
          msg: 'Дата мероприятия должна быть в будущем.',
        },
      },
    },
    category: {
      type: DataTypes.ENUM('концерт', 'лекция', 'выставка'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['концерт', 'лекция', 'выставка']],
          msg: 'Категория мероприятия должна быть одной из: концерт, лекция, выставка.',
        },
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
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
    tableName: 'events',
    timestamps: true,
    paranoid: true,
  },
);

User.hasMany(Event, { foreignKey: 'createdBy' });
Event.belongsTo(User, { foreignKey: 'createdBy' });

export const syncModel = async (): Promise<void> => {
  try {
    await Event.sync({ alter: true });
    console.log('Модель "Мероприятие" синхронизирована с базой данных.');
  } catch (error) {
    console.error('Ошибка при синхронизации модели "Мероприятие":', error);
  }
};

export { Event };
