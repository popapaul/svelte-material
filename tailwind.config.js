/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,svelte}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: '#bd2026',
				secondary: '#4764af'
			}
		}
	},
	plugins: []
};
