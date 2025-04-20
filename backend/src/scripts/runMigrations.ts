import { sequelize } from '../config/db';
import { up } from '../migrations/20240420_create_event_participants';

const runMigrations = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных успешно установлено.');

    await up(sequelize.getQueryInterface());
    console.log('Миграции успешно выполнены.');

    await sequelize.close();
  } catch (error) {
    console.error('Ошибка при выполнении миграций:', error);
    process.exit(1);
  }
};

runMigrations(); 