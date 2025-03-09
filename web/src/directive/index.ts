import type { App, Directive } from 'vue'
import permission from './permission'

interface DirectiveOptions {
  [key: string]: Directive
}

const directives: DirectiveOptions = {
  permission,
}

export default {
  install(app: App) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    })
  },
}
