import { useRouter } from 'vue-router'
import permissionStore from '@/stores/permissions'
import type { LoginRole } from '@/types/permission'

const permission = permissionStore()
export function useLogin(entry?: LoginRole) {
  const router = useRouter()

  async function loginSuccess(token: string) {
    permission.Authorization = token
    // 登录成功，获取权限列表，跳转首页
    await permission.getAllPermissions()
    const path = permission.homePath(entry)
    router.replace(path)
  }

  return {
    loginSuccess,
  }
}
