import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'border-background': 'var(--border-background)',
        'secondary-background': 'var(--seconday-foreground)',
        'side-bar-background': 'var(--side-bar-background)',
        'side-bar-foreground': 'var(--side-bar-foreground)',
        'side-bar-secondary-background': 'var(--side-bar-secondary-background)',
        'card-background': 'var(--card-background)',
        'card-foreground': 'var(--card-foreground)',
        'button-background': 'var(--button-background)',
        'button-foreground': 'var(--button-foreground)',
      },
    },
  },
  plugins: [],
}
export default config
