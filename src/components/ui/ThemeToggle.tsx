import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            aria-label="Basculer thème"
            title="Basculer thème"
            onClick={toggleTheme}
            className="theme-toggle fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-colors"
        >
            {theme === 'blue' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
