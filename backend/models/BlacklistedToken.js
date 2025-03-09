// models/BlacklistedToken.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const BlacklistedToken = sequelize.define('BlacklistedToken', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'blacklisted_tokens',
    timestamps: false,
});

export const syncModel = async () => {
    try {
        await BlacklistedToken.sync();
        console.log('Модель "BlacklistedToken" синхронизирована с базой данных.');
    } catch (error) {
        console.error('Ошибка при синхронизации модели "BlacklistedToken":', error);
    }
};