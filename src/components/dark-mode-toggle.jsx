
import { useEffect, useState } from "react";



export function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

    useEffect(() => {
        document.documentElement.setAttribute("data-bs-theme", darkMode ? "dark" : "light");
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    return (
        <label className="form-check form-switch text-body">
            <input
                type="checkbox"
                className="form-check-input"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
            />
            Dark Mode
        </label>
    );
}
