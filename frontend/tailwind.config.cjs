/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

    theme: {
        fontFamily: { sans: ['Poppins', 'sans-serif'] },
        extend: {}
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: '#4B6BFB',

                    secondary: '#7B92B2',

                    accent: '#67CBA0',

                    neutral: '#181A2A',

                    'base-100': '#FFFFFF',

                    info: '#3ABFF8',

                    success: '#36D399',

                    warning: '#FBBD23',

                    error: '#F87272'
                }
            }
        ]
    }
};
