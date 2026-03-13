import type { Config } from 'tailwindcss';

export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'edu-bg': '#FFFBF5',
                'edu-black': '#1a1a1a',
                'edu-red': '#E85D4D',
                'edu-light': '#F5E6D3',
                'edu-accent': '#2C3E50',
                'edu-success': '#27AE60',
                'edu-warning': '#F39C12',
                'edu-error': '#E74C3C',
            },
            fontFamily: {
                serif: ['Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            spacing: {
                'safe-top': 'env(safe-area-inset-top)',
                'safe-bottom': 'env(safe-area-inset-bottom)',
            },
            boxShadow: {
                'edu': '0 4px 6px rgba(232, 93, 77, 0.1)',
                'edu-lg': '0 20px 25px rgba(232, 93, 77, 0.15)',
            },
        },
    },
    plugins: [],
} satisfies Config;
