const ORDERSTATELIST = [
  {
    value: 'wcl',
    label: '未处理',
    color: 'rgb(73,171,222)'
  },
  {
    label: '未签收',
    value: 'wjs',
    color: 'rgb(98,112,193)'
  },
  {
    value: 'wfk',
    label: '未反馈',
    color: 'rgb(239,139,32)'
  },
  {
    value: 'yfk',
    label: '已反馈',
    color: 'rgb(5,209,227)'
  },
  {
    value: 'js',
    label: '结束',
    color: 'rgb(163,162,162)'
  },
  {
    value: 'ywc',
    label: '已完成',
    color: 'rgb(69, 195, 88)'
  },
  {
    value: 'bb',
    label: '报备',
    color: 'rgb(245,50,145)'
  }
]

const OVERDUE = [
  {
    value: 'yq',
    label: '已逾期',
    color: 'rgb(246,46,46)'
  },
  {
    value: 'zc',
    label: '正常',
    color: 'rgb(69, 195, 88)'
  }
]
const WORKLEVEL = [
  { label: '0', value: 'lingji' },
  { label: '1', value: 'yiji' },
  { label: '2', value: 'erji' },
  { label: '3', value: 'sanji' }
]

const ORDERTYPELIST= [
  {
    'label': '摄像机类',
    'value': 'sxjl'
  },
  {
    'label': '服务器类',
    'value': 'fwql'
  },
  {
    'label': '网络类',
    'value': 'wll'
  },
  {
    'label': '动环类',
    'value': 'dhl'
  },
  {
    'label': '其他类',
    'value': 'qtl'
  }
]

export default {
  WORKLEVEL,
  ORDERSTATELIST,
  ORDERTYPELIST,
  OVERDUE
}
