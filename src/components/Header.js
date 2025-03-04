import React from "react";
import { Link } from "react-router-dom"; // Импорт Link
import "bootstrap/dist/css/bootstrap.min.css";

export default function Header() {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container d-flex justify-content-between align-items-center w-100">
                {/* Логотип слева */}
                <a className="navbar-brand d-flex align-items-center" href="#">
                    <img src="https://avatars.mds.yandex.net/get-ydo/11374192/2a000001926627c6641b7834e547c19907fc/diploma"
                         alt="FullCalendar" height="80px" width="80px" className="me-2" />
                    Календарь событий
                </a>

                {/* Центрированное меню */}
                <div className="d-flex flex-grow-1 justify-content-center">
                    <ul className="nav">
                        <li className="nav-item">
                            <a className="nav-link text-warning" href="#">Хуйня1</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-light" href="#">Хуетень 2</a>
                        </li>
                        <li className="nav-item">
                            {/* Заменил <a> на <Link> */}
                            <Link className="nav-link text-light" to="/page4">Хуетень 4</Link>
                        </li>
                        <li className="nav-item">
                            <a className="btn btn-outline-primary" href="#">Последняя хуйня 4</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
