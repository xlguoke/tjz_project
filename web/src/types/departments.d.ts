import { z } from 'zod'
import type { status } from './users'

// 查询参数
const query = z.object({
  searchPrefix: z.string().optional(), // 拼接在查询参数前的固定字符
  name: z.string().optional(),
})

const baseItem = z.object({
  id: z.string(),
  name: z.string(),
})

const departmentUser = baseItem.and(z.object({
  username: z.string(),
  status,
}))

// 详情
const detailForm = z.object({
  id: z.string().optional(),
  name: z.string(),
  superior: baseItem.optional(), // 父级
  superiorId: z.string().optional(), // 父级id集合
  principle: z.object(departmentUser).optional(), // 负责人
  principleId: z.string().optional(), // 负责人id
  code: z.string().optional(), // 组织编号
  alias: z.string().optional(), // 组织别名
  shortName: z.string().optional(), // 机构简称
  contact: z.string().optional(), // 联系方式
  link: z.string().optional(), // 网址
})

const dataItem = z.object({
  id: z.string(),
  subordinates: z.array(), // 下级组织
  users: z.array(departmentUser), // 负责人
}).and(detailForm.omit({ id: true, superior: true, superiorId: true, principleId: true }))

// 列表
const dataSource = z.object({
  subordinates: z.array(dataItem),
  children: z.array(dataItem).optional(), // 列表为展开行，需要添加children字段
}).and(dataItem)

const emitData = z.object({
  departmentInfo: baseItem,
})

export type BaseItem = z.infer<typeof baseItem>
export type DepartmentUser = z.infer<typeof departmentUser>
export type Query = z.infer<typeof query>
export type DetailForm = z.infer<typeof detailForm>
export type DataSource = z.infer<typeof dataSource>
export type EmitData = z.infer<typeof emitData>
