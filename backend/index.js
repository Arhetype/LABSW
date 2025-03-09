import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import { sequelize } from './config/db.js';
import { syncModel as syncUserModel } from './models/User.js';
import { syncModel as syncEventModel } from './models/Event.js';
import { syncModel as syncBlacklistedTokenModel } from './models/BlacklistedToken.js';
import routes from './routes/index.js';
import setupSwagger from './swagger.js';
import morgan from 'morgan';
import './config/passport.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

const PORT = process.env.PORT || 3000;

setupSwagger(app);

app.use(morgan('[:method] :url :status - :response-time ms'));

sequelize.authenticate()
    .then(() => {
        console.log('Соединение с базой данных успешно установлено.');
    })
    .catch(err => {
        console.error('Не удалось подключиться к базе данных:', err);
    });

const syncModels = async () => {
    await syncUserModel();
    await syncEventModel();
    await syncBlacklistedTokenModel();
};

syncModels().then(() => {
    console.log('Все модели синхронизированы с базой данных.');
}).catch(err => {
    console.error('Ошибка при синхронизации моделей:', err);
});

app.use('/', routes);

app.get('/', (req, res) => {
    res.json({ message: 'Сервер работает!' });
});

app.listen(PORT, (err) => {
    if (err) {
        console.error('Ошибка при запуске сервера:', err);
    } else {
        console.log(`Сервер запущен на порту ${PORT}`);
    }
});