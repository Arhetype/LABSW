const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./config/db');
const { syncModel: syncUserModel } = require('./models/User');
const { syncModel: syncEventModel } = require('./models/Event');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const setupSwagger = require('./swagger');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 3000;

setupSwagger(app);

const morgan = require('morgan');

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
};

syncModels().then(() => {
    console.log('Все модели синхронизированы с базой данных.');
}).catch(err => {
    console.error('Ошибка при синхронизации моделей:', err);
});

app.use('/events', eventRoutes);
app.use('/users', userRoutes);

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

