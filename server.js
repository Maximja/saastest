const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs"); // Для хеширования паролей
const jwt = require("jsonwebtoken"); // Для создания JWT

const app = express();
const port = 3000;

// CORS настройки
const corsOptions = {
    origin: "http://localhost:3001",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Подключение к PostgreSQL
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "123",
    port: 5432,
});

pool.connect()
    .then(() => console.log("✅ Подключено к PostgreSQL"))
    .catch((err) => {
        console.error("❌ Ошибка подключения к PostgreSQL:", err);
        process.exit(1);
    });

// Логирование запросов
app.use((req, res, next) => {
    console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 📌 Регистрация пользователя
app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Проверяем, существует ли пользователь с таким email
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length > 0) {
            return res.status(400).json({ error: "Пользователь с таким email уже существует" });
        }

        // Хешируем пароль
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Сохраняем пользователя в БД
        const result = await pool.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
            [email, passwordHash]
        );

        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        console.error("❌ Ошибка при регистрации:", err);
        res.status(500).json({ error: "Ошибка при регистрации" });
    }
});

// 📌 Авторизация пользователя
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Ищем пользователя по email
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(400).json({ error: "Пользователь не найден" });
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Неверный пароль" });
        }

        // Создаем JWT
        const token = jwt.sign({ id: user.id }, "ваш_секретный_ключ", { expiresIn: "1h" });

        res.json({ token });
    } catch (err) {
        console.error("❌ Ошибка при авторизации:", err);
        res.status(500).json({ error: "Ошибка при авторизации" });
    }
});

// 📌 Получить все события
app.get("/events", async (req, res) => {
    try {
        const events = await pool.query("SELECT * FROM events ORDER BY event_data");
        res.json(events.rows);
    } catch (err) {
        res.status(500).json({ error: "Ошибка получения событий" });
    }
});

// 📌 Получить одно событие по ID
app.get("/events/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const event = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
        if (event.rows.length === 0) return res.status(404).json({ error: "Событие не найдено" });
        res.json(event.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Ошибка получения события" });
    }
});

// 📌 Добавить новое событие
app.post("/events", async (req, res) => {
    const { title, date, time } = req.body;

    if (!title || !date || !time) {
        console.warn("⚠️ Ошибка: Заполните все поля", req.body);
        return res.status(400).json({ error: "Заполните все поля" });
    }

    try {
        const query = "INSERT INTO events (event_data, event_name, event_time) VALUES ($1, $2, $3) RETURNING *";
        const values = [date, title, time];

        const result = await pool.query(query, values);
        console.log("✅ Событие добавлено:", result.rows[0]);
        res.status(201).json({ success: true, event: result.rows[0] });
    } catch (err) {
        console.error("❌ Ошибка при добавлении события:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// 📌 Обновить событие
app.put("/events/:id", async (req, res) => {
    const { id } = req.params;
    const { title, date, time } = req.body;

    if (!title || !date || !time) return res.status(400).json({ error: "Заполните все поля" });

    try {
        const query = "UPDATE events SET event_data=$1, event_name=$2, event_time=$3 WHERE id=$4 RETURNING *";
        const values = [date, title, time, id];

        const updatedEvent = await pool.query(query, values);
        if (updatedEvent.rows.length === 0) return res.status(404).json({ error: "Событие не найдено" });

        res.json(updatedEvent.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Ошибка при обновлении события" });
    }
});

// 📌 Удалить событие
app.delete("/events/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await pool.query("DELETE FROM events WHERE id = $1 RETURNING *", [id]);
        if (deleted.rows.length === 0) return res.status(404).json({ error: "Событие не найдено" });

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Ошибка при удалении события" });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${port}`);
});