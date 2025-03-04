import { useState } from "react";

export default function EventForm({ onAddEvent, selectedDate }) {
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !time) return;

        // Отправляем данные на сервер
        try {
            const response = await fetch("http://localhost:5000/add-event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, date: selectedDate, time }),
            });

            const data = await response.json();

            if (data.success) {
                console.log("✅ Событие добавлено:", data.event);
                onAddEvent(data.event);
            } else {
                console.error("❌ Ошибка:", data.error);
            }
        } catch (error) {
            console.error("❌ Ошибка запроса:", error);
        }

        setTitle("");
        setTime("");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-2">Добавить событие</h2>
                <p className="text-gray-600 mb-4">Дата: {selectedDate}</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Название события"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                    />
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                    />
                    <div className="flex justify-between">
                        <button
                            type="button"
                            className="p-2 bg-gray-300 rounded"
                            onClick={() => onAddEvent(null)}
                        >
                            Отмена
                        </button>

                        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                            Добавить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
