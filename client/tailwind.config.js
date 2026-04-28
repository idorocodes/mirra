/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{js,jsx,ts,tsx}', './index.html'];
export const theme = {
    extend: {
        fontFamily: {
            fraunces: ['Fraunces', 'serif'],
            geist: ['Geist', 'sans-serif'],
        },
        colors: {
            ink: {
                DEFAULT: '#0A0A0A',
                2: '#2C2C2C',
                3: '#6A6A6A',
                4: '#ABABAB',
            },
            cream: {
                DEFAULT: '#F9F9F7',
                2: '#F2F1ED',
                3: '#E9E7E2',
            },
            edge: {
                DEFAULT: '#E3E1DB',
                2: '#CCCAC3',
            },
            blue: {
                DEFAULT: '#1D6AF8',
                dim: 'rgba(29,106,248,0.09)',
                glow: 'rgba(29,106,248,0.22)',
            },
            green: {
                DEFAULT: '#0F9E52',
                dim: 'rgba(15,158,82,0.09)',
            },
            red: {
                DEFAULT: '#D93030',
                dim: 'rgba(217,48,48,0.09)',
            },
            amber: {
                DEFAULT: '#C07A00',
                dim: 'rgba(192,122,0,0.09)',
            },
            purple: {
                DEFAULT: '#6B3FD4',
            },
        },
        boxShadow: {
            s1: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
            s2: '0 4px 16px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.04)',
            s3: '0 12px 40px rgba(0,0,0,0.09), 0 4px 14px rgba(0,0,0,0.05)',
            s4: '0 24px 80px rgba(0,0,0,0.11), 0 8px 24px rgba(0,0,0,0.06)',
        },
        animation: {
            'pulse-dot': 'pulseDot 2s infinite',
            'pulse-dot-fast': 'pulseDot 1.2s infinite',
            'scan-beam': 'scanBeam 2.8s ease-in-out infinite',
            'chip-in': 'chipIn 0.3s forwards',
            'row-in': 'rowIn 0.4s forwards',
            'spin-fast': 'spin 0.8s linear infinite',
        },
        keyframes: {
            pulseDot: {
                '0%, 100%': { opacity: '1' },
                '50%': { opacity: '0.3' },
            },
            scanBeam: {
                '0%': { top: '-5px', opacity: '0' },
                '8%': { opacity: '1' },
                '88%': { opacity: '1' },
                '100%': { top: '100%', opacity: '0' },
            },
            chipIn: {
                from: { opacity: '0', transform: 'translateX(-5px)' },
                to: { opacity: '1', transform: 'translateX(0)' },
            },
            rowIn: {
                from: { opacity: '0', transform: 'translateY(6px)' },
                to: { opacity: '1', transform: 'translateY(0)' },
            },
        },
        fontSize: {
            '2xs': ['10px', '1.4'],
            '3xs': ['9px', '1.3'],
        },
    },
};
export const plugins = [];