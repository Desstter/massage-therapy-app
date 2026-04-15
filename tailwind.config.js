/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:  '#080c14',
          secondary:'#0f1520',
          tertiary: '#162030',
          elevated: '#1c2a3e',
          border:   '#253248',
        },
        clinical: {
          red:    '#ef4444',
          orange: '#f97316',
          green:  '#22c55e',
          blue:   '#3b82f6',
          purple: '#a855f7',
          teal:   '#14b8a6',
        },
      },
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono:    ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'amber-sm':  '0 1px 3px 0 rgba(245,158,11,0.15)',
        'amber-md':  '0 4px 12px 0 rgba(245,158,11,0.2)',
        'amber-glow':'0 0 20px rgba(245,158,11,0.25)',
        card:        '0 2px 8px 0 rgba(0,0,0,0.5)',
        panel:       '0 4px 24px 0 rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in':       'fadeIn 0.2s ease-in-out',
        'slide-in-right':'slideInRight 0.3s ease-out',
        'slide-in-up':   'slideInUp 0.25s ease-out',
        'muscle-pulse':  'musclePulse 2s ease-in-out infinite',
        'hand-effleurage':'handEffleurage 2s ease-in-out infinite',
        'hand-petrissage':'handPetrissage 1.5s ease-in-out infinite',
        'hand-friction':  'handFriction 0.8s linear infinite',
        'hand-tapotement':'handTapotement 0.4s ease-in-out infinite',
        'hand-vibration': 'handVibration 0.15s ease-in-out infinite',
        'hand-compression':'handCompression 2s ease-in-out infinite',
        'hand-stretching':'handStretching 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:       { '0%':{'opacity':'0'}, '100%':{'opacity':'1'} },
        slideInRight: { '0%':{'transform':'translateX(100%)','opacity':'0'}, '100%':{'transform':'translateX(0)','opacity':'1'} },
        slideInUp:    { '0%':{'transform':'translateY(16px)','opacity':'0'}, '100%':{'transform':'translateY(0)','opacity':'1'} },
        musclePulse:  { '0%':{'opacity':'0.7'}, '50%':{'opacity':'1'}, '100%':{'opacity':'0.7'} },
        handEffleurage:  { '0%':{'transform':'translateY(0)'}, '50%':{'transform':'translateY(60px)'}, '100%':{'transform':'translateY(0)'} },
        handPetrissage:  { '0%':{'transform':'rotate(0deg) scale(1)'}, '25%':{'transform':'rotate(15deg) scale(1.05)'}, '75%':{'transform':'rotate(-15deg) scale(1.05)'}, '100%':{'transform':'rotate(0deg) scale(1)'} },
        handFriction:    { '0%':{'transform':'rotate(0deg)'}, '100%':{'transform':'rotate(360deg)'} },
        handTapotement:  { '0%':{'transform':'translateY(0)'}, '50%':{'transform':'translateY(-12px)'}, '100%':{'transform':'translateY(0)'} },
        handVibration:   { '0%':{'transform':'translateX(0)'}, '25%':{'transform':'translateX(3px)'}, '75%':{'transform':'translateX(-3px)'}, '100%':{'transform':'translateX(0)'} },
        handCompression: { '0%':{'transform':'scaleY(1)'}, '50%':{'transform':'scaleY(0.85)'}, '100%':{'transform':'scaleY(1)'} },
        handStretching:  { '0%':{'transform':'translateY(0) rotate(0deg)'}, '50%':{'transform':'translateY(-20px) rotate(5deg)'}, '100%':{'transform':'translateY(0) rotate(0deg)'} },
      },
    },
  },
  plugins: [],
}
