const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Хранение пользователей (в реальном приложении используйте базу данных)
let users = {};

app.post('/register', async (req, res) => {
    const { telegramId, password } = req.body;

    if (!telegramId || !password) {
        return res.status(400).json({ error: 'Telegram ID and password are required' });
    }

    // Проверка, существует ли пользователь с таким Telegram ID
    if (users[telegramId]) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Сохраняем пользователя
    users[telegramId] = { password };

    // Отправляем сообщение в Telegram
    try {
        await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: telegramId,
            text: 'Вы успешно зарегистрированы!'
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        res.status(500).json({ error: 'Failed to send Telegram message' });
    }
});

app.post('/login', (req, res) => {
    const { telegramId, password } = req.body;

    if (!telegramId || !password) {
        return res.status(400).json({ error: 'Telegram ID and password are required' });
    }

    // Проверка пароля
    if (users[telegramId] && users[telegramId].password === password) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid Telegram ID or password' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});