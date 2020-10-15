import Vue from 'vue'
import { USER_INFO,USER_ROLES,USER_DEPARTS,USER_DEPARTROLE,USER_GROUP, ENHANCE_PRE } from "@/store/mutation-types"
const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  rolesA: state => {state.user.rolesA = Vue.ls.get(USER_ROLES); return state.user.rolesA},
  departs: state => {state.user.departs = Vue.ls.get(USER_DEPARTS); return state.user.departs},
  departRole: state => {state.user.departRole = Vue.ls.get(USER_DEPARTROLE); return state.user.departRole},
  reassignGroup: state => {state.user.reassignGroup = Vue.ls.get(USER_GROUP); return state.user.reassignGroup},
  avatar: state => {state.user.avatar = Vue.ls.get(USER_INFO).avatar; return state.user.avatar},
  username: state => state.user.username,
  nickname: state => {state.user.realname = Vue.ls.get(USER_INFO).realname; return state.user.realname},
  welcome: state => state.user.welcome,
  permissionList: state => state.user.permissionList,
  userInfo: state => {state.user.info = Vue.ls.get(USER_INFO); return state.user.info},
  addRouters: state => state.permission.addRouters,
  enhanceJs:(state) => (code) => {
    state.enhance.enhanceJs[code] = Vue.ls.get(ENHANCE_PRE+code);
    return state.enhance.enhanceJs[code]
  }

}

export default getters