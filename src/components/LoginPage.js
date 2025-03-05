import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token); // Сохраняем токен
                navigate("/calendar"); // Перенаправляем на страницу календаря
            } else {
                const data = await response.json();
                alert(data.error || "Ошибка при авторизации");
            }
        } catch (error) {
            console.error(error);
            alert("Ошибка при авторизации");
        }
    };

    return (
        <div className="login-page">
            <div className="wrapper">
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <div className="input-field">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label>Enter your email</label>
                    </div>
                    <div className="input-field">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label>Enter your password</label>
                    </div>
                    <button type="submit">Log In</button>
                    <div className="register">
                        <p>Don't have an account? <a href="/register">Register</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;