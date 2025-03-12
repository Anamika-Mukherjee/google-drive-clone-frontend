import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			brand: {
  				DEFAULT: '#db098f',
				dark: "#be097c",
				light: "#f0d5e6"
  			},
  			gray: {
				"50": "#f2f2f5",
  				'100': '#d9d7df',
  				'300': '#c3c1c8',
  				'500': '#99979e',
				dark: "#555457",
  				DEFAULT: '#838287',
				light: "#ebe9ef"
  			},
  			violet: {
  				DEFAULT: '#9d53ea',
				light: "#dfd5ea",
  				dark: '#8f3ae8'
  			},
			peach: {
				DEFAULT: "#f8e6d9",
				dark: "#fbd8be"
			},
			orange: {
				DEFAULT: "#f93a18"
			},
			skyblue:{
				DEFAULT: "#07b9fc"
			},
			seagreen:{
				DEFAULT: "#05f7a6"
			},
			purple:{
				DEFAULT: "#e105f7"
			},

  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',

  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
			
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	},
  	plugins: []
  },
    plugins: [
		require("tailwindcss-animate"),
	   
	]
} satisfies Config;
