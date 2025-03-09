import { z } from 'zod'
import { status } from './users.d'
import { dataSource as notice } from './notices.d'

interface Obj {
  [key: string]: string
}
// 状态
export const STATUSOPT: Obj = {
  OPEN: '待处理',
  IN_PROGRESS: '进行中',
  DONE: '已完成',
  CLOSED: '关闭',
}

// 状态
export const QueryType: Obj = {
  WAITING_ME: '待我处理',
  DONE_WITH_ME: '我已处理',
  I_CREATED: '我创建的',
  I_URGED: '我催办的',
  // DEFAULT: '默认',
}

// 状态
export const NOTICE_STATUSOPT: Obj = {
  OPEN: '未读',
  DONE: '已读',
}

// 打开方式
export const OPENTYPE: obj = {
  _SELF: '当前窗口',
  _BLANK: '新窗口',
}

// 优先级
export const PRIORITY: Obj = {
  0: '较低',
  1: '普通',
  2: '紧急',
  3: '非常紧急',
}

// 公告板
export const NOTICE = 'NOTICE'
// 消息提醒
export const NEWS = 'NEWS'
// 待办
export const WAITDONE = 'TODO'

// 类别
const category = z.union([z.literal(NOTICE), z.literal(NEWS), z.literal(WAITDONE)])

// 打开方式
const openType = z.union([z.literal('_SELF'), z.literal('_BLANK')])

// 待办、消息提醒
const doneItem = z.object({
  id: z.string(),
  application: z.string(), // 系统名称
  category,
  username: z.string(), // 用户账号
  title: z.string(), // 标题
  details: z.string().optional(), // 详情
  detailUrl: z.string().optional(), // 详情页跳转地址
  status: z.string().optional(), // 状态
  urgeNotRead: z.boolean(),
  openType,
  priority: z.number().optional(), // 优先级
  noticeTerm: z.string().optional(), // 公告期限-仅公告中有该字段
  auditMeta: z.object({
    createdAt: z.string(), // 创建日期
  }).optional(),
})

// 公告、待办、消息提醒列表
const noticeList = z.object({
  notice: notice.optional(), //  公告独有
  owner: z.object({
    id: z.string(),
    username: z.string(),
    name: z.string(),
    status,
  }), // 用户账号 - 待办、消息提醒
}).and(doneItem.omit({ username: true }))

export type Category = z.infer<typeof category>
export type OpenType = z.infer<typeof openType>
export type Notice = z.infer<typeof doneItem>
export type NoticeList = z.infer<typeof noticeList>
