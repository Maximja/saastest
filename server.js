const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 5000;

const corsOptions = {
    origin: "http://localhost:3000", // Разрешаем запросы только с твоего фронта
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

// Подключение к PostgreSQL через пул соединений
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "123",
    port: 5432,
});

pool.connect()
    .then(() => console.log("✅ Подключено к PostgreSQL"))
    .catch(err => {
        console.error("❌ Ошибка подключения к PostgreSQL:", err);
        process.exit(1); // Завершаем процесс при ошибке подключения
    });

// Логирование запросов
app.use((req, res, next) => {
    console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Маршрут для добавления события
app.post("/add-event", async (req, res) => {
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
        res.json({ success: true, event: result.rows[0] });
    } catch (err) {
        console.error("❌ Ошибка при добавлении события:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${port}`);
});
