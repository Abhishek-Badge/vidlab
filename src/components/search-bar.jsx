import { useState, useEffect, useRef, useCallback } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./search-bar.css";
import axios from "axios";

// ✅ Debounce hook
function useDebounce(callback, delay) {
    const timeoutRef = useRef(null);

    return useCallback(
        (...args) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );
}

export default function SearchBar({ onResults }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [allSuggestions, setAllSuggestions] = useState([]);

    // ✅ Load all unique suggestions (title, channel, category)
    useEffect(() => {
        async function loadSuggestions() {
            try {
                const [videosRes, catsRes] = await Promise.all([
                    axios.get("http://127.0.0.1:5050/get-videos"),
                    axios.get("http://127.0.0.1:5050/get-categories")
                ]);

                const videos = videosRes.data || [];
                const cats = catsRes.data || [];

                const uniq = Array.from(
                    new Set(
                        [
                            ...videos.flatMap(v => [v?.Title, v?.ChannelName, v?.CategoryName]),
                            ...cats.map(c => c?.CategoryName)
                        ].filter(Boolean)
                    )
                );

                setAllSuggestions(uniq);
            } catch (err) {
                console.error("failed to load suggestions", err);
            }
        }
        loadSuggestions();
    }, []);

    // ✅ Call backend search
    const doSearch = async (term) => {
        if (!term) {
            setSuggestions([]);
            if (onResults) onResults([]);
            return;
        }
        try {
            const res = await axios.get(
                `http://127.0.0.1:5050/search-videos/${encodeURIComponent(term)}`
            );
            if (onResults) onResults(res.data || []);
        } catch (err) {
            console.error("search error", err);
        }
    };

    // ✅ Debounced backend search
    const debouncedSearch = useDebounce(doSearch, 300);

    // Handle input typing
    const handleSearch = (e) => {
        const raw = e?.target?.value ?? "";
        setSearchTerm(raw);

        if (!raw.trim()) {
            if (onResults) onResults([]);
            setSuggestions([]);
            return;
        }

        // Filter auto-suggestions
        setSuggestions(
            allSuggestions
                .filter(s => s.toLowerCase().includes(raw.toLowerCase()))
                .slice(0, 6)
        );

        // Debounced backend search
        debouncedSearch(raw.trim());
    };

    // Apply clicked suggestion immediately
    const applySuggestion = (text) => {
        setSearchTerm(text);
        setSuggestions([]);
        doSearch(text);
    };

    // Handle Enter key
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setSuggestions([]);
            doSearch(searchTerm.trim());
        }
        if (e.key === "Escape") {
            e.preventDefault();
            clearSearch(); // ✅ ESC clears input
        }

    };

    // ✅ Clear search
    const clearSearch = () => {
        setSearchTerm("");
        setSuggestions([]);
        if (onResults) onResults([]); // reset results
    };



    return (
        <div className="search-bar">
            <input
                type="text"
                className="form-control search-input"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
            />
            {searchTerm && (
                <span className="clear-btn" onClick={clearSearch}>
                    <i className="bi bi-x-circle-fill"></i>
                </span>
            )}
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((s, i) => (
                        <li key={i} onClick={() => applySuggestion(s)}>
                            <i className="bi bi-search me-2"></i> {s}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
