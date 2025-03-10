import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { User } from './User.js';

export const Event = sequelize.define('Event', {
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
}, {
    tableName: 'events',
    timestamps: true,
    paranoid: true,
});

User.hasMany(Event, { foreignKey: 'createdBy' });
Event.belongsTo(User, { foreignKey: 'createdBy' });

export const syncModel = async () => {
    try {
        await Event.sync({ alter: true });
        console.log('Модель "Мероприятие" синхронизирована с базой данных.');
    } catch (error) {
        console.error('Ошибка при синхронизации модели "Мероприятие":', error);
    }
};