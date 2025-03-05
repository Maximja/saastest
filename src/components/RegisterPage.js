import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Пароли не совпадают");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                navigate("/"); // Перенаправляем на страницу логина
            } else {
                const data = await response.json();
                alert(data.error || "Ошибка при регистрации");
            }
        } catch (error) {
            console.error(error);
            alert("Ошибка при регистрации");
        }
    };

    return (
        <div className="login-page">
            <div className="wrapper">
                <form onSubmit={handleRegister}>
                    <h2>Register</h2>
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
                    <div className="input-field">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <label>Confirm your password</label>
                    </div>
                    <button type="submit">Register</button>
                    <div className="register">
                        <p>Already have an account? <a href="/">Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;