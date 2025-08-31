
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#222831',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#393E46',
					foreground: '#FFFFFF'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'plane-float': {
					'0%, 100%': {
						transform: 'translateY(0) translateX(0)'
					},
					'50%': {
						transform: 'translateY(-15px) translateX(10px)'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'float-slow': {
					'0%': {
						transform: 'translateY(0) translateX(0) rotate(0)'
					},
					'10%': {
						transform: 'translateY(-10px) translateX(5px) rotate(1deg)'
					},
					'20%': {
						transform: 'translateY(-15px) translateX(15px) rotate(2deg)'
					},
					'30%': {
						transform: 'translateY(-10px) translateX(25px) rotate(1deg)'
					},
					'40%': {
						transform: 'translateY(0) translateX(30px) rotate(0)'
					},
					'50%': {
						transform: 'translateY(10px) translateX(25px) rotate(-1deg)'
					},
					'60%': {
						transform: 'translateY(15px) translateX(15px) rotate(-2deg)'
					},
					'70%': {
						transform: 'translateY(10px) translateX(5px) rotate(-1deg)'
					},
					'80%': {
						transform: 'translateY(0) translateX(0) rotate(0)'
					},
					'90%': {
						transform: 'translateY(-5px) translateX(-5px) rotate(0.5deg)'
					},
					'100%': {
						transform: 'translateY(0) translateX(0) rotate(0)'
					}
				},
				'float-medium': {
					'0%': {
						transform: 'translateY(0) translateX(0) rotate(0)'
					},
					'10%': {
						transform: 'translateY(-8px) translateX(-10px) rotate(-1deg)'
					},
					'20%': {
						transform: 'translateY(-15px) translateX(-15px) rotate(-2deg)'
					},
					'30%': {
						transform: 'translateY(-10px) translateX(-5px) rotate(-1deg)'
					},
					'40%': {
						transform: 'translateY(0) translateX(5px) rotate(0)'
					},
					'50%': {
						transform: 'translateY(10px) translateX(10px) rotate(1deg)'
					},
					'60%': {
						transform: 'translateY(15px) translateX(5px) rotate(2deg)'
					},
					'70%': {
						transform: 'translateY(10px) translateX(-5px) rotate(1deg)'
					},
					'80%': {
						transform: 'translateY(0) translateX(-10px) rotate(0)'
					},
					'90%': {
						transform: 'translateY(-5px) translateX(-5px) rotate(-0.5deg)'
					},
					'100%': {
						transform: 'translateY(0) translateX(0) rotate(0)'
					}
				},
				'float-fast': {
					'0%': {
						transform: 'translateY(0) translateX(0) rotate(0)'
					},
					'10%': {
						transform: 'translateY(-5px) translateX(10px) rotate(1deg)'
					},
					'20%': {
						transform: 'translateY(-10px) translateX(15px) rotate(2deg)'
					},
					'30%': {
						transform: 'translateY(-5px) translateX(10px) rotate(1deg)'
					},
					'40%': {
						transform: 'translateY(5px) translateX(0) rotate(0)'
					},
					'50%': {
						transform: 'translateY(10px) translateX(-10px) rotate(-1deg)'
					},
					'60%': {
						transform: 'translateY(5px) translateX(-15px) rotate(-2deg)'
					},
					'70%': {
						transform: 'translateY(-5px) translateX(-10px) rotate(-1deg)'
					},
					'80%': {
						transform: 'translateY(-10px) translateX(0) rotate(0)'
					},
					'90%': {
						transform: 'translateY(-5px) translateX(5px) rotate(1deg)'
					},
					'100%': {
						transform: 'translateY(0) translateX(0) rotate(0)'
					}
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '0.1'
					},
					'50%': {
						opacity: '0.2'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'plane-float': 'plane-float 6s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.8s ease-out',
				'float-slow': 'float-slow 12s linear infinite',
				'float-medium': 'float-medium 10s linear infinite',
				'float-fast': 'float-fast 8s linear infinite',
				'pulse-slow': 'pulse-slow 8s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
