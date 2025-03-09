import { z } from 'zod'
import type { status } from './users'

// 查询参数
const query = z.object({
  id: z.string().optional(),
  description: z.string().optional(),
  name: z.string().optional(),
})

const baseItem = z.object({
  id: z.string(),
  name: z.string(),
})

// 用户列表
const roleUser = z.object({
  username: z.string(),
  status,
}).and(baseItem)

const rolePermission = z.object({
  name: z.string(), // 权限编码
  description: z.string(), // 权限名称
})

// 详情
const detailForm = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  permissions: z.array(rolePermission),
  users: z.array(roleUser),
})

// 列表
const dataSource = z.object({
  id: z.string(),
}).and(detailForm.omit({ id: true }))

const handleType = z.union([z.literal('users'), z.literal('permissions')])
const emitData = z.object({
  roleInfo: dataSource,
  type: handleType,
})

export type Query = z.infer<typeof query>
export type RoleUser = z.infer<typeof roleUser>
export type RolePermission = z.infer<typeof rolePermission>
export type DetailForm = z.infer<typeof detailForm>
export type DataSource = z.infer<typeof dataSource>
export type EmitData = z.infer<typeof emitData>
export type HandleType = z.infer<typeof handleType>
