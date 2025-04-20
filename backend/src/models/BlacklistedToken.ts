import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/db';

interface BlacklistedTokenAttributes {
  id?: number;
  token: string;
  expiresAt: Date;
}

class BlacklistedToken
  extends Model<BlacklistedTokenAttributes>
  implements BlacklistedTokenAttributes
{
  public id!: number;
  public token!: string;
  public expiresAt!: Date;
}

BlacklistedToken.init(
  {
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
  },
  {
    sequelize,
    tableName: 'blacklisted_tokens',
    timestamps: false,
  },
);

export const syncModel = async (): Promise<void> => {
  try {
    await BlacklistedToken.sync();
    console.log('Модель "BlacklistedToken" синхронизирована с базой данных.');
  } catch (error) {
    console.error('Ошибка при синхронизации модели "BlacklistedToken":', error);
  }
};

export { BlacklistedToken };
