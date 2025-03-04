import React, { useEffect } from "react";

export default function Page4() {
    useEffect(() => {
        console.log("Hello World111"); // Вывод в консоль при открытии страницы
    }, []);

    return <h1>Хуетень 4</h1>;
}
