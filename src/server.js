const express = require("express");
const cors = require("cors");
const { Client } = require("pg");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Подключение к PostgreSQL
const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "nazvanie",
    password: "123",
    port: 5432,
});

client.connect()
    .then(() => console.log("✅ Подключено к PostgreSQL"))
    .catch(err => console.error("❌ Ошибка подключения:", err));

// Маршрут для добавления события
app.post("/add-event", async (req, res) => {
    const { title, date, time } = req.body;

    if (!title || !date || !time) {
        return res.status(400).json({ error: "Заполните все поля" });
    }

    try {
        const query = "INSERT INTO events (event_data, event_name, event_time) VALUES ($1, $2, $3) RETURNING *";
        const values = [date, title, time];

        const result = await client.query(query, values);
        res.json({ success: true, event: result.rows[0] });
    } catch (err) {
        console.error("Ошибка при добавлении события:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.listen(port, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${port}`);
});
