import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import EventForm from "./EventForm";

dayjs.locale("ru");


const globalStyles = `
    body, html {
        margin: 0;
        padding: 0;
        overflow: hidden;
    }
`;

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showEventsList, setShowEventsList] = useState(false);
    const [opacity, setOpacity] = useState(0.8); // Начальная прозрачность

    const handleAddEvent = (newEvent) => {
        if (!newEvent) {
            setSelectedDate(null);
            return;
        }
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        setSelectedDate(null);
    };

    const handleDayClick = (date) => {
        setSelectedDate(date);
    };

    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const startOfWeek = startOfMonth.startOf("week");
    const endOfWeek = endOfMonth.endOf("week");

    const days = [];
    let day = startOfWeek;

    while (day.isBefore(endOfWeek, "day") || day.isSame(endOfWeek, "day")) {
        days.push(day);
        day = day.add(1, "day");
    }

    return (
        <>
            {/* Глобальные стили */}
            <style>{globalStyles}</style>

            <div style={{ display: "flex", height: "100vh", width: "100vw", backgroundImage: "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')", backgroundSize: "cover", backgroundPosition: "center", overflow: "hidden" }}>
                {/* Sidebar */}
                <aside style={{ width: "256px", backgroundColor: "rgba(31, 41, 55, 0.8)", color: "white", padding: "16px", overflowY: "auto" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "16px" }}>Да, это тот самый Calendar</h2>
                    <ul>
                        <li
                            style={{ padding: "8px 0", cursor: "pointer", hover: { backgroundColor: "#374151" } }}
                            onClick={() => setShowEventsList(!showEventsList)}
                        >
                            События
                        </li>
                        <li style={{ padding: "8px 0", cursor: "pointer", hover: { backgroundColor: "#374151" } }}>Настройки</li>
                    </ul>
                    {showEventsList && (
                        <div style={{ backgroundColor: "#374151", padding: "8px", marginTop: "16px", borderRadius: "4px" }}>
                            <h3 style={{ fontSize: "1.125rem", fontWeight: "bold" }}>Все события</h3>
                            {events.length > 0 ? (
                                events.map((event, index) => (
                                    <div key={index} style={{ padding: "4px", borderBottom: "1px solid #4B5563" }}>
                                        {event.date} - {event.title} ({event.time})
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: "#9CA3AF" }}>Нет событий</p>
                            )}
                        </div>
                    )}
                    {/* Ползунок для настройки прозрачности */}
                    <div style={{ marginTop: "16px" }}>
                        <label htmlFor="opacity" style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem" }}>Прозрачность календаря:</label>
                        <input
                            type="range"
                            id="opacity"
                            min="0"
                            max="1"
                            step="0.1"
                            value={opacity}
                            onChange={(e) => setOpacity(parseFloat(e.target.value))}
                            style={{ width: "100%" }}
                        />
                    </div>
                </aside>

                {/* Calendar Section */}
                <div style={{ flex: 1, padding: "16px", overflow: "hidden", minHeight: "100vh" }}>
                    <div style={{ backgroundColor: `rgba(255, 255, 255, ${opacity})`, padding: "16px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <button
                                onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
                                style={{ padding: "8px 24px", backgroundColor: "#3B82F6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" }}
                            >
                                ←
                            </button>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1F2937", textTransform: "capitalize", margin: "0 16px" }}>
                                {currentMonth.format("MMMM YYYY")}
                            </h2>
                            <button
                                onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
                                style={{ padding: "8px 24px", backgroundColor: "#3B82F6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" }}
                            >
                                →
                            </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", textAlign: "center", fontWeight: "bold", backgroundColor: `rgba(229, 231, 235, ${opacity})`, padding: "8px", borderRadius: "4px" }}>
                            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
                                <div key={day} style={{ padding: "8px 0" }}>{day}</div>
                            ))}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", border: "1px solid #D1D5DB", overflow: "hidden" }}>
                            {days.map((dayItem) => {
                                const isWeekend = dayItem.day() === 6 || dayItem.day() === 0; // Суббота (6) или воскресенье (0)
                                return (
                                    <div
                                        key={dayItem.format("YYYY-MM-DD")}
                                        style={{
                                            padding: "16px",
                                            border: "1px solid #E5E7EB",
                                            textAlign: "center",
                                            height: "96px",
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "flex-start",
                                            cursor: "pointer",
                                            backgroundColor: isWeekend ? `rgba(254, 226, 226, ${opacity})` : (dayItem.month() !== currentMonth.month() ? `rgba(249, 250, 251, ${opacity})` : `rgba(255, 255, 255, ${opacity})`), // Фон для выходных
                                            color: isWeekend ? "#DC2626" : (dayItem.month() !== currentMonth.month() ? "#9CA3AF" : "inherit"), // Цвет текста для выходных
                                            borderRadius: "4px", // Скругление углов
                                        }}
                                        onClick={() => handleDayClick(dayItem.format("YYYY-MM-DD"))}
                                    >
                                        {dayItem.date()}
                                        {events
                                            .filter(event => event.date === dayItem.format("YYYY-MM-DD"))
                                            .map((event, index) => (
                                                <div key={index} style={{ fontSize: "0.875rem", backgroundColor: "#3B82F6", color: "white", padding: "2px 4px", borderRadius: "4px", marginTop: "4px" }}>
                                                    {event.title} ({event.time})
                                                </div>
                                            ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Форма добавления события */}
                {selectedDate && <EventForm onAddEvent={handleAddEvent} selectedDate={selectedDate} />}
            </div>
        </>
    );
}