// uno.config.ts
import { defineConfig, presetAttributify, presetUno, presetWind } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetWind(),
    presetUno(),
    presetRemToPx() as any,
  ],
  shortcuts: {
    'cell-item': 'px-3 py-4 bg-white flex gap-2 justify-between items-center active:bg-gray-50',
  },
})
