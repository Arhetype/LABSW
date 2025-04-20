import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@config/db';
import bcrypt from 'bcrypt';

interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public createdAt!: Date;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
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
          msg: 'Некорректный формат email',
        },
        notEmpty: {
          msg: 'Email не может быть пустым',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Пароль не может быть пустым',
        },
        len: {
          args: [6, 255],
          msg: 'Пароль должен содержать от 6 до 255 символов',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  },
);

export const syncModel = async (): Promise<void> => {
  try {
    await User.sync();
    console.log('Модель "Пользователь" синхронизирована с базой данных.');
  } catch (error) {
    console.error('Ошибка при синхронизации модели "Пользователь":', error);
  }
};

export { User };
