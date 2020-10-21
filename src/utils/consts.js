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
    'label': '移杆类',
    'value': 'ygl'
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

// 公司环境
/* const ACTIVITY = {
  ks: '40a358d5447b42ca9f2f7f77cbb38407', // 开始
  js: '6b5c87b89d624422a44d1c1e9adbd23f', // 结束
  sh: '361876dfea2a4300a623bd5cbe7f813e', // 管理员审核
  nc: 'df6c26bedae34a7dae2396ec1dac14f5', // 内场
  wc: '4ee67d3f2b2a4f65a73775e5525e3867' // 外场
} */

// 现场环境
const ACTIVITY = {
  ks: '40a358d5447b42ca9f2f7f77cbb38407', // 开始
  js: '6b5c87b89d624422a44d1c1e9adbd23f', // 结束
  sh: '7243282c435646038fd42eb505a8afba', // 管理员审核
  nc: '8cba08cbb2514352ae75f5f324c91cb0', // 内场
  wc: 'aecd9044de5448a3bccbc0cdaad36041' // 外场
}

// 公司环境
// const ROUTER = {
//   wcbb: '93dbe9df4a484c41ae3962583c8b79d2', // 外场设备报备
//   ncbb: 'bd5667bdfe384d978094e2c304fee4d2', // 内场设备报备
//   wxwc: '1e91970928454a0aaf70dfab60821e14', // 维修完成
//   gdht: 'e015bd378b0c449eafbf07ad71ec867e', // 工单回退
//   htwc: 'a1a5eb72e88a44ddb710c784a3e54994', // 回退外场
//   shtg: '0bd853dbe934403ba7d8d2efa41822e6' // 审核通过
// }

// 现场环境
const ROUTER = {
  wcbb: '755dbdc2fbeb4d36807bc38ff0dbe019', // 外场设备报备
  ncbb: '0fa29993092d4908bdb8b12551b224bc', // 内场设备报备
  wxwc: '1bdaabd3e65e44e1b756fbc5bfcb708e', // 维修完成
  gdht: '2d389949940d458ba3c97c55ae4f87b2', // 工单回退
  htwc: 'a4ed84c27c544fea8d0967ad0de79d01', // 回退外场
  shtg: '83f70b3ec1e64e5ea3d6950b3eea61ab' // 审核通过
}

export default {
  WORKLEVEL,
  ORDERSTATELIST,
  ORDERTYPELIST,
  OVERDUE,
  ROUTER,
  ACTIVITY
}
