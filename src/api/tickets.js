import api from './index'
import { axios } from '@/utils/request'

/**
 * 获取工单数据
 * @param data 参数
 */
export function getTicketsList (data) {
  return axios({
    url: '/api/itsm/db/query',
    method: 'post',
    data: data
  })
}

/**
 * 获取我的待办
 * @param data 参数
 * @param param 参数
 */
export function getMytodoList (data, param) {
  return axios({
    url: '/api/itsm/db/mytodo',
    method: 'post',
    params: param,
    data: data
  })
}


/**
 * 获取工单详情
 * @param query 根据id获取详情
 */
export function getTicketsDetails (query) {
  return axios({
    url: '/api/itsm/getTicketByIdSg',
    method: 'get',
    params: query
  })
}

/**
 * 获取模型列表
 * @param apiKey 参数
 */
export function getModelList (apiKey) {
  return axios({
    url: '/api/itsm/available_models',
    method: 'post',
    params: { apikey: apiKey },
    data: {}
  })
}

/**
 * 根据modeIds 获取流程列表数据
 * @param data 模型数据
 * @param apiKey 参数
 */
export function getFlowListByModeId (data, apiKey) {
  return axios({
    url: '/api/itsm/getProcess',
    method: 'post',
    params: { apikey: apiKey },
    data
  })
}
/**
 * 获取用户组数据
 */
export function getUserGroup () {
  return axios({
    url: '/sys/role/getUserGroup',
    method: 'get'
  })
}

/**
 * 获取模型列表
 * @param apiKey 参数
 */
export function getFieldListByProcess (data, apiKey) {
  return axios({
    url: '/api/itsm/getFields',
    method: 'post',
    params: { apikey: apiKey },
    data
  })
}

/**
 * 获取模型详情
 * @param apiKey
 * @param id
 */
export function getModelDetails (apiKey, id) {
  return axios({
    url: '/api/itsm/getModelSg',
    method: 'get',
    params: { apikey: apiKey, id: id }
  })
}

/**
 * 获取我的待办工单统计数据
 * @param query 根据用户id，用户组id获取工单统计
 */
export function getTicketTodoCountByUser (query) {
  return axios({
    url: '/api/itsm/db/counttodo',
    method: 'post',
    data: query
  })
}
/**
 * 获取工单统计数据
 * @param query 根据用户id，用户组id以及所属部门获取工单统计
 */
export function getTicketAllCountByUser (query) {
  return axios({
    url: '/api/itsm/db/count',
    method: 'post',
    data: query
  })
}

/**
 * 报修工单
 * @param data 工单内容
 * @param apiKey 参数
 */
export function saveWorkOrder (data, apiKey) {
  return axios({
    url: '/api/itsm/create',
    method: 'POST',
    params: { apikey: apiKey },
    data: data
  })
}

/**
 * 处理工单
 * @param data 工单数据
 * @param apiKey 参数
 */
export function handleOrder (data, apiKey) {
  return axios({
    url: '/api/itsm/handle',
    method: 'POST',
    params: { apikey: apiKey },
    data
  })
}

/**
 * 修改工单数据
 * @param data 修改内容
 * @param apiKey 参数
 */
export function updateTickets (data, apiKey) {
  return axios({
    url: '/api/itsm/update',
    method: 'POST',
    params: { apikey: apiKey },
    data
  })
}
/**
 * 判断工单数据在线/离线
 * @param ip 地址
 */
export function judgmentTickets (ip) {
  return axios({
    url: '/api/itsm/ping',
    method: 'GET',
    params: { ip: ip }
  })
}

/**
 * @param data 图片内容 base64编码格式
 * @param apiKey 秘钥
 * @returns {*}
 */
export function uploadFileByTicketId (data, apiKey) {
  return axios({
    url: '/api/itsm/uploadAttachFile',
    method: 'POST',
    params: { apikey: apiKey },
    data
  })
}

/**
 * 获取工单流程
 * @param ticketId 根据ticketId获取流程
 */
export function getTicketsProcess (ticketId) {
  return axios({
    url: '/api/itsm/getProcessRecord',
    method: 'get',
    params: { ticketId: ticketId }
  })
}

/**
 * 同步工单字典值
 */
export function getInsertBatch () {
  return axios({
    url: '/sys/dictItem/insertBatch',
    method: 'post',
    data: '{}'
  })
}

/**
 * 下载文件 用于excel导出
 * @param data 参数
 * @returns {*}
 */
export function downTicketsFile(data){
  return axios({
    url: '/api/itsm/db/exportTicket',
    data: data,
    method:'POST' ,
    responseType: 'blob'
  })
}

/**
 * 改派工单
 * @param data 工单数据
 * @param apiKey 参数
 */
export function reassignOrder (data, apiKey) {
  return axios({
    url: '/api/itsm/reassign',
    method: 'POST',
    params: { apikey: apiKey },
    data
  })
}

/**
 * 判断工单数据在线后修改状态
 * @param ip 地址
 */
export function updataDzOnlineStatus (ip) {
  return axios({
    url: '/api/itsm/updataDzOnlineStatus',
    method: 'GET',
    params: { ip: ip }
  })
}