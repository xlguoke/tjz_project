import antfu from '@antfu/eslint-config'

export default antfu({
  vue: {
    overrides: {
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': ['error', { singleline: 5, multiline: 1 }],
      'vue/max-len': ['error', 120],
    },
  },
  formatters: {
    css: true,
  },
})
