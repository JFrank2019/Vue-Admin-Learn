import request from '@/utils/request'

export default {
  // 获取列表数据
  getList() {
    return request({
      url: '/supplier/list',
      method: 'get'
    })
  },
  // 分页查询
  search(page, size, searchMap) {
    return request({
      url: `/supplier/list/search/${page}/${size}`,
      method: 'post',
      data: searchMap
    })
  },
  // 新增数据
  add(pojo) {
    return request({
      url: '/supplier',
      method: 'post',
      data: pojo
    })
  },
  // 获取单条数据
  getById(id) {
    return request({
      url: `/supplier/${id}`,
      method: 'get'
    })
  },

  // 更新数据
  update(pojo) {
    return request({
      url: `/supplier/${pojo.id}`,
      method: 'put',
      data: pojo
    })
  },
  // 删除接口
  deleteById(id) {
    return request({
      url: `/supplier/${id}`,
      method: 'delete'
    })
  }
}
