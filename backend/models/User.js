const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Некорректный формат email'
            },
            notEmpty: {
                msg: 'Email не может быть пустым'
            }
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
}, {
    tableName: 'users',
    timestamps: false,
});

// Синхронизация модели с базой данных
const syncModel = async () => {
    try {
        await User.sync(); // Создает таблицу, если она не существует
        console.log('Модель "Пользователь" синхронизирована с базой данных.');
    } catch (error) {
        console.error('Ошибка при синхронизации модели "Пользователь":', error);
    }
};

module.exports = {
    User,
    syncModel,
};

