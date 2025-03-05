import React from "react";
import { Link } from "react-router-dom"; // Импорт Link
import "bootstrap/dist/css/bootstrap.min.css";

export default function Header() {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container d-flex justify-content-between align-items-center w-100">
                {/* Логотип слева */}
                <a className="navbar-brand d-flex align-items-center" href="#">
                    <img src="https://avatars.mds.yandex.net/get-altay/5534836/2a000001833bd8d2cae0c2e6c5230339d110/diploma"
                         alt="FullCalendar" height="80px" width="80px" className="me-2" />
                    Календарь событий
                </a>

                {/* Центрированное меню */}
                <div className="d-flex flex-grow-1 justify-content-center">
                    <ul className="nav">
                        <li className="nav-item">
                            <a className="nav-link text-warning" href="#">кнопочка 1</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-light" href="#">кнопочка 2</a>
                        </li>
                        <li className="nav-item">
                            {/* Заменил <a> на <Link> */}
                            <Link className="nav-link text-light" to="/#">кнопочка 3</Link>
                        </li>
                        <li className="nav-item">
                            <a className="btn btn-outline-primary" href="#">кнопочка 4</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
