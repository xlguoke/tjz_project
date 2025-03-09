import { z } from 'zod'
import type { DataSource as UserData } from './users.d'

// 登录角色
const loginRole = z.union([z.literal('USER'), z.literal('ADMIN')])

// 权限信息
const permission = z.object({
  name: z.string(),
  description: z.string(),
})

// 权限树
const permissionTree = z.object({
  permissions: z.array(permission),
}).and(permission)

// 登录用户信息
const loginUserInfo = z.object({
  id: z.string(),
  permissions: z.array(z.string()),
})

export type UserInfo = Omit<UserData, 'status'>
export type LoginRole = z.infer<typeof loginRole>
export type PermissionItem = z.infer<typeof permission>
export type PermissionTree = z.infer<typeof permissionTree>
export type LoginUserInfo = z.infer<typeof loginUserInfo> & { userInfo: UserInfo }
