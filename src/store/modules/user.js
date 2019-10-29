import { getToken, setToken, setUser, getUser, removeToken } from '@/utils/auth'
import { login, getUserInfo, logout } from '@/api/login'

const user = {
  state: {
    token: getToken(), // 作为token初始值
    user: getUser() // 作为User的初始值
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      setToken(token)
    },
    SET_USER(state, user) {
      state.user = user
      setUser(user)
    }
  },
  actions: {
    Login({ commit }, form) {
      // resolve 触发成功后的处理, reject 触发异常处理
      return new Promise((resolve, reject) => {
        login(form.username.trim(), form.password)
          .then(res => {
            const resp = res.data
            commit('SET_TOKEN', resp.data.token)
            // 通知组件已经将token更新成功
            resolve(resp)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 通过token获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token)
          .then(response => {
            const respUser = response.data
            commit('SET_USER', respUser.data)
            resolve(respUser)
          })
          .catch(error => reject(error))
      })
    },
    // 退出
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(response => {
            const resp = response.data
            commit('SET_TOKEN', '')
            commit('SET_USER', '')
            removeToken()
            resolve(resp)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default user
