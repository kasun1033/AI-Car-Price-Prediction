"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface SearchableSelectProps {
    id: string;
    name: string;
    label: string;
    placeholder: string;
    options: string[];
    value: string;
    disabled?: boolean;
    error?: string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => void;
}

export default function SearchableSelect({
    id,
    name,
    label,
    placeholder,
    options,
    value,
    disabled = false,
    error,
    onChange,
}: SearchableSelectProps) {
    const [query, setQuery] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
                if (query && !options.includes(query)) {
                    setQuery(value);
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [query, value, options]);

    const filtered = query
        ? options.filter((opt) =>
              opt.toLowerCase().includes(query.toLowerCase()),
          )
        : options;

    function fireChange(selected: string) {
        // Create a synthetic event so the parent onChange handler works
        const syntheticEvent = {
            target: { name, value: selected },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
    }

    function handleSelect(option: string) {
        setQuery(option);
        fireChange(option);
        setIsOpen(false);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setQuery(e.target.value);
        setIsOpen(true);
        // Clear the actual form value while the user is still typing
        if (e.target.value !== value) {
            fireChange("");
        }
    }

    function handleClear() {
        setQuery("");
        fireChange("");
        setIsOpen(false);
        inputRef.current?.focus();
    }

    return (
        <div ref={containerRef} className="relative">
            <label
                htmlFor={id}
                className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    id={id}
                    autoComplete="off"
                    placeholder={placeholder}
                    value={query}
                    disabled={disabled}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    className={`w-full px-3 py-2 pr-16 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-red-400 ring-1 ring-red-300" : "border-gray-300"}`}
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-0.5">
                    {value && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Clear"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen((prev) => !prev);
                            inputRef.current?.focus();
                        }}
                        className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Toggle options"
                    >
                        <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>
            </div>

            {isOpen && (
                <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg scrollbar-hide">
                    {filtered.length > 0 ? (
                        filtered.map((option) => (
                            <li
                                key={option}
                                onClick={() => handleSelect(option)}
                                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                                    option === value
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {/* Highlight the matched portion */}
                                {query ? highlightMatch(option, query) : option}
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-sm text-gray-400 italic">
                            No results found
                        </li>
                    )}
                </ul>
            )}

            {error && (
                <p className="text-[11px] text-red-500 font-medium mt-1">{error}</p>
            )}
        </div>
    );
}

/** Wraps the matched substring in a <mark> tag for visual highlighting. */
function highlightMatch(text: string, query: string) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + query.length);
    const after = text.slice(idx + query.length);
    return (
        <>
            {before}
            <mark className="bg-yellow-200 text-gray-900 rounded-sm px-0.5">
                {match}
            </mark>
            {after}
        </>
    );
}
