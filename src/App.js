import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calendar from "./components/Calendar";
import Header from "./components/Header";
import Page4 from "./components/Page4"; // вместо Page4.js


function App() {
    return (
        <Router>
            <div className="min-h-screen p-6 bg-gray-50">
                <Header />
                <Routes>
                    <Route path="/" element={<Calendar />} />
                    <Route path="/page4" element={<Page4 />} /> {/* Новый маршрут */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
