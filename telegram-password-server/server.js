const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Разрешаем запросы с других доменов

// "База данных" в памяти (для демонстрации)
const userPasswords = {};

// Сохранение пароля
app.post("/save-password", async (req, res) => {
  const { userId, password } = req.body;

  // Проверка входных данных
  if (!userId || !password) {
    return res.status(400).json({ error: "Укажите userId и пароль" });
  }

  try {
    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10); // 10 - количество раундов хэширования
    userPasswords[userId] = hashedPassword; // Сохраняем хэшированный пароль
    res.json({ success: true, message: "Пароль успешно сохранен" });
  } catch (error) {
    console.error("Ошибка при хэшировании пароля:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Проверка пароля
app.post("/check-password", async (req, res) => {
  const { userId, password } = req.body;

  // Проверка входных данных
  if (!userId || !password) {
    return res.status(400).json({ error: "Укажите userId и пароль" });
  }

  try {
    const hashedPassword = userPasswords[userId];

    // Если пароль для данного пользователя не найден
    if (!hashedPassword) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Сравниваем введенный пароль с хэшированным
    const match = await bcrypt.compare(password, hashedPassword);

    if (match) {
      res.json({ success: true, message: "Пароль верный" });
    } else {
      res.status(401).json({ error: "Неверный пароль" });
    }
  } catch (error) {
    console.error("Ошибка при проверке пароля:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});