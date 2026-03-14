import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette, Sparkles } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="group relative flex items-center gap-2 px-4 py-2 rounded-full 
                       bg-white/10 backdrop-blur-md border border-white/20 
                       hover:bg-white/20 transition-all duration-300 shadow-lg
                       overflow-hidden"
            title={`Passer au thème ${theme === 'original' ? 'Bleu Premium' : 'Rouge Classique'}`}
        >
            {/* Animated background glow */}
            <div className={`absolute inset-0 opacity-20 blur-xl transition-colors duration-500
                            ${theme === 'original' ? 'bg-edu-red' : 'bg-blue-500'}`} />
            
            <div className="relative flex items-center gap-2">
                <div className="relative">
                    {theme === 'original' ? (
                        <Palette className="w-4 h-4 text-edu-red animate-in fade-in zoom-in duration-300" />
                    ) : (
                        <Sparkles className="w-4 h-4 text-blue-500 animate-in fade-in zoom-in duration-300" />
                    )}
                </div>
                <span className="text-xs font-semibold tracking-wide uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                    {theme === 'original' ? 'Classique' : 'Bleu'}
                </span>
            </div>

            {/* Subtle border shine effect */}
            <div className="absolute inset-0 border border-white/10 rounded-full group-hover:border-white/30 transition-colors" />
        </button>
    );
};
