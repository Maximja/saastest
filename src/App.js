import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Calendar from "./components/Calendar";  // Компонент с календарем
import Header from "./components/Header";  // Хедер
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";  // Страница регистрации
import Page4 from "./components/Page4";  // Страница авторизации

function AppContent() {
    const location = useLocation(); // Получаем текущий путь

    // Условный рендеринг Header
    const showHeader = !["/", "/register"].includes(location.pathname);

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            {/* Условный рендеринг Header */}
            {showHeader && <Header />}
            <Routes>
                <Route path="/" element={<LoginPage />} />  {/* Страница авторизации */}
                <Route path="/calendar" element={<Calendar />} />  {/* Страница с календарем */}
                <Route path="/register" element={<RegisterPage />} />  {/* Страница регистрации */}
                <Route path="/page4" element={<Page4 />} /> {/* Новый маршрут */}
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;