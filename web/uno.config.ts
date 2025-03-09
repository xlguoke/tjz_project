// uno.config.ts
import { defineConfig, presetAttributify, presetUno, presetWind } from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetWind(),
    presetUno(),
  ],
})
