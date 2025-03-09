import { z } from 'zod'

// 查询参数
const query = z.object({
  fuzzy: z.string().optional(),
  status: z.string().optional(),
})

// 授权类型
export const AUTH_TYPE = {
  ALL: '全员',
  DEPART: '机构',
  ROLE: '角色',
  USER: '用户',
}

// 详情
const detailForm = z.object({
  id: z.string().optional(),
  title: z.string(), // 标题
  details: z.string().optional(), // 详情
  type: z.union([z.literal('ALL'), z.literal('DEPART'), z.literal('ROLE'), z.literal('USER')]), // 授权类型 DEPART机构, ROLE角色, USER用户
  idList: z.array(z.string()), // 授权对象ID列表
  mustRead: z.boolean(), // 是否必读
  mustReadTerm: z.string().optional(), // 必读期限，期限范围内未读时，自动打开弹窗阅读
  minTime: z.number().optional(), // 最小阅读时长
  noticeTerm: z.string().optional(), // 阅读期限
  releaseTerm: z.string().optional(), // 发布时间
  auditMeta: z.object({
    createdAt: z.string(), // 创建日期
  }).optional(), // 额外信息
})

// 数据列表
export const dataSource = z.object({
  id: z.string(),
}).and(detailForm.omit({ id: true }))

export type Query = z.infer<typeof query>
export type DetailForm = z.infer<typeof detailForm>
export type DataSource = z.infer<typeof dataSource>
