import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import { sequelize } from '@config/db';
import { syncModel as syncUserModel } from './models/User';
import { syncModel as syncEventModel } from './models/Event';
import { syncModel as syncBlacklistedTokenModel } from './models/BlacklistedToken';
import routes from './routes';
import setupSwagger from './docs/swagger';
import morgan from 'morgan';
import './config/passport';

dotenv.config();

const app = express();

//const unusedVariable = 'This variable is not used';

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

const PORT = process.env.PORT || 3000;

setupSwagger(app);

app.use(morgan('[:method] :url :status - :response-time ms'));

sequelize
  .authenticate()
  .then(() => {
    console.log('Соединение с базой данных успешно установлено.');
  })
  .catch((err: Error) => {
    console.error('Не удалось подключиться к базе данных:', err);
  });

const syncModels = async (): Promise<void> => {
  await syncUserModel();
  await syncEventModel();
  await syncBlacklistedTokenModel();
};
syncModels()
  .then(() => {
    console.log('Все модели синхронизированы с базой данных.');
  })
  .catch((err: Error) => {
    console.error('Ошибка при синхронизации моделей:', err);
  });

app.use('/', routes);

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'Сервер работает!' });
});

app.listen(PORT, (err?: Error) => {
  if (err) {
    console.error('Ошибка при запуске сервера:', err);
  } else {
    console.log(`Сервер запущен на порту ${PORT}`);
  }
});
