import api from './index'
import { axios } from '@/utils/request'

/**
 * 获取工单数据
 * @param data 参数
 * @param params 参数
 */
export function getTicketsList (data) {
  return axios({
    url: '/api/itsm/queryTicketDB',
    method: 'post',
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
 * 获取工单统计数据
 * @param query 根据用户id获取工单统计
 */
export function getTicketCountByUser (userId) {
  return axios({
    url: '/api/itsm/getTicketCountByUser',
    method: 'get',
    params: {userId: userId}
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
 * 根据ticketId 上传附件图片
 * @param data 图片内容
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
 * 修改工单数据
 * @param data 反馈内容
 * @param apiKey 参数
 */
export function updateFeedback (data, apiKey) {
  return axios({
    url: '/api/itsm/update',
    method: 'POST',
    params: { apikey: apiKey },
    data
  })
}

/**
 * 获取工单流程
 * @param query 根据ticketId获取流程
 */
export function getTicketsProcess (ticketId) {
  return axios({
    url: '/api/itsm/getProcessRecord',
    method: 'get',
    params: { ticketId: ticketId }
  })
}