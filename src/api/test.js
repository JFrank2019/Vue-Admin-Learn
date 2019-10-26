import request from '@/utils/request'

export default {
  getList() {
    const req = request({
      url: '/nameList',
      method: 'get'
    })
    return req
  }
}
