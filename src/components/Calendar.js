import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import EventForm from "./EventForm"; // Форма вынесена в отдельный файл

dayjs.locale("ru");


export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showEventsList, setShowEventsList] = useState(false);

    // Добавление события
    const handleAddEvent = (newEvent) => {
        if (!newEvent) {
            setSelectedDate(null); // Просто закрываем форму, если отменили добавление
            return;
        }
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        setSelectedDate(null);
    };

    // Открытие формы при клике на день
    const handleDayClick = (date) => {
        setSelectedDate(date);
    };

    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const startOfWeek = startOfMonth.startOf("week");
    const endOfWeek = endOfMonth.endOf("week");

    const days = [];
    let day = startOfWeek;

    while (day.isBefore(endOfWeek, "day")) {
        days.push(day);
        day = day.add(1, "day");
    }

    return (
        <div className="flex h-screen w-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-2xl font-bold mb-4">Полный календарь</h2>
                <ul>
                    <li
                        className="py-2 hover:bg-gray-700 cursor-pointer"
                        onClick={() => setShowEventsList(!showEventsList)}
                    >
                        События
                    </li>
                    <li className="py-2 hover:bg-gray-700 cursor-pointer">Настройки</li>
                </ul>
                {/* Список событий */}
                {showEventsList && (
                    <div className="bg-gray-700 p-2 mt-4 rounded">
                        <h3 className="text-lg font-bold">Все события</h3>
                        {events.length > 0 ? (
                            events.map((event, index) => (
                                <div key={index} className="p-1 border-b border-gray-500">
                                    {event.date} - {event.title} ({event.time})
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">Нет событий</p>
                        )}
                    </div>
                )}
            </aside>

            {/* Calendar Section */}
            <div className="flex-1 p-4 bg-gray-100 overflow-hidden min-h-screen">

            <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
                            className="p-2 bg-gray-200 rounded"
                        >
                            ←
                        </button>
                        <h2 className="text-lg font-bold capitalize">{currentMonth.format("MMMM YYYY")}</h2>
                        <button
                            onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
                            className="p-2 bg-gray-200 rounded"
                        >
                            →
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center font-bold bg-gray-200 p-2 rounded-t">
                        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
                            <div key={day} className="py-2">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 border border-gray-300">
                        {days.map((dayItem) => (
                            <div
                                key={dayItem.format("YYYY-MM-DD")}
                                className={`p-4 border text-center h-24 relative flex items-start justify-start cursor-pointer ${
                                    dayItem.month() !== currentMonth.month() ? "text-gray-400 bg-gray-50" : "bg-white"
                                }`}
                                onClick={() => handleDayClick(dayItem.format("YYYY-MM-DD"))}
                            >
                                {dayItem.date()}
                                {/* Отображение событий внутри календарных дней */}
                                {events
                                    .filter(event => event.date === dayItem.format("YYYY-MM-DD"))
                                    .map((event, index) => (
                                        <div key={index} className="text-sm bg-blue-500 text-white px-1 rounded mt-1">
                                            {event.title} ({event.time})
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Форма добавления события */}
            {selectedDate && <EventForm onAddEvent={handleAddEvent} selectedDate={selectedDate} />}
        </div>
    );
}
