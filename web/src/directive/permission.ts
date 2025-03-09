import type { Directive } from 'vue'
import permissionStores from '@/stores/permissions'

// 执行权限指令
const permission: Directive = {
  mounted(el, binding) {
    if (!permissionStores().hasPermission(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  },
  updated(el, binding) {
    if (!permissionStores().hasPermission(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  },
}

export default permission
