import { z } from 'zod'
import type { status } from './users'

// 查询参数
const query = z.object({
  name: z.string().optional(),
})

const baseItem = z.object({
  id: z.string(),
  name: z.string(),
})

const appUser = baseItem.and(z.object({
  username: z.string(),
  status,
}))

// 详情
const detailForm = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(), // 子系统描述
  url: z.string(), // 子系统地址
  securityKey: z.string().optional(), // 密钥
  publicKey: z.string().optional(), // 公钥
  loginUrl: z.string().optional(), // 登录地址
  logo: z.string().optional(), // Base64 logo image
  logoUrl: z.string().optional(), // logo 地址：网络图片
  owners: z.array(appUser), // 系统用户
})

// 列表
const dataSource = detailForm.omit({ id: true }).and(z.object({
  id: z.string(),
}))

const emitData = z.object({
  appInfo: baseItem,
})

export type BaseItem = z.infer<typeof baseItem>
export type AppUser = z.infer<typeof appUser>
export type Query = z.infer<typeof query>
export type DetailForm = z.infer<typeof detailForm>
export type DataSource = z.infer<typeof dataSource>
export type EmitData = z.infer<typeof emitData>
