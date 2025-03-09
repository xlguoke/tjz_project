import { z } from 'zod'

// 用户状态
export const status = z.union([z.literal('ACTIVE'), z.literal('INACTIVE')])
export const statusOpt = {
  ACTIVE: '启用',
  INACTIVE: '禁用',
}

// 查询参数
const query = z.object({
  fuzzy: z.string().optional(),
  status: status.optional(),
  id: z.string().optional(), // 已选用户id
  username: z.string().optional(), // 用户账户
})

const baseItem = z.object({
  id: z.string(),
  name: z.string(),
})

const roleItem = z.object({
  description: z.string(),
}).and(baseItem)

const treeSelector = z.object({
  value: z.string(),
  label: z.string(),
})

// 资质
const certificates = z.object({
  name: z.string(), // 名称
  number: z.string(), // 编号
})

// 详情
const detailForm = z.object({
  id: z.string().optional(),
  name: z.string(), // 用户名称
  username: z.string(), // 账户
  roles: z.array(roleItem), // 角色
  roleIds: z.array(z.string()), // 角色id集合
  certificates: z.array(certificates), // 资质
  phone: z.string().optional(), // 手机号
  avatar: z.string().optional(), // 头像
  title: z.string().optional(), // 职位
  departments: z.array(baseItem).optional(), // 机构
  departmentIds: z.array(treeSelector).optional(), // 机构id
})

// 数据列表
const dataSource = z.object({
  id: z.string(),
  status,
}).and(detailForm.omit({ id: true, roleIds: true }))

const propsType = z.object({
  selectMode: z.boolean(), // 是否为选择模式
  selectedUsers: z.array(baseItem), // 已选用户，开启选择模式时必传
})

export type Query = z.infer<typeof query>
export type Status = z.infer<typeof status>
export type Certificates = z.infer<typeof certificates>
export type DetailForm = z.infer<typeof detailForm>
export type DataSource = z.infer<typeof dataSource>
export type PropsType = z.infer<typeof propsType>
export type RoleItem = z.infer<typeof roleItem>
