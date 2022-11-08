// Mantine の色を Tailwind 用に変換
//
// 公式の方法がないため、以下のカラーファイルを使用
// https://github.com/mantinedev/mantine/blob/master/src/mantine-styles/src/theme/default-colors.ts
const { DEFAULT_THEME } = require('@mantine/core')
const mantineColorsForTailwind = {}
for (const [name, colors] of Object.entries(DEFAULT_THEME.colors)) {
  mantineColorsForTailwind[name] = colors.reduce((acc, cur, i) => {
    return { ...acc, [i]: cur }
  }, {})
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'src/utilities/**/*.{js,ts,jsx,tsx}',
    'src/hooks/**/*.{js,ts,jsx,tsx}',
    'src/layouts/**/*.{js,ts,jsx,tsx}',
    'src/pages/**/*.{js,ts,jsx,tsx}',
    'src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    colors: mantineColorsForTailwind
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
