import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // 如果响应成功但没有数据，返回整个响应
    if (!res) {
      return response
    }

    // 如果响应中包含error字段，说明有错误
    if (res.error) {
      Message({
        message: res.error || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.error || 'Error'))
    }

    return res
  },
  error => {
    console.log('err' + error) // for debug
    const response = error.response
    const data = response ? response.data : {}
    
    Message({
      message: data.error || error.message || 'Error',
      type: 'error',
      duration: 5 * 1000
    })
    
    if (response && response.status === 401) {
      // to re-login
      MessageBox.confirm('您已登出，请重新登录', '确认登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
    return Promise.reject(error)
  }
)

export default service
