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
})
