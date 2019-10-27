import request from '@/utils/request'

// 获取会员列表数据
export function getList() {
  return request({
    url: '/member/list',
    method: 'get'
  })
}

/**
 * 分页搜索方法
 * @param {*} page 当前页码
 * @param {*} size 每页查询数量
 * @param {*} searchMap 条件查询的条件之
 */
export function search(page, size, searchMap) {
  return request({
    url: `/member/list/search/${page}/${size}`,
    method: 'post',
    data: searchMap
  })
}

/**
 * 添加会员方法
 * @param {Object} pojo 新增会员对象
 */
export function add(pojo) {
  return request({
    url: '/member',
    method: 'post',
    data: pojo
  })
}

/**
 * 获取会员数据
 * @param {number} id 会员id值
 */
export function getById(id) {
  return request({
    url: `/member/${id}`,
    method: 'get'
  })
}

/**
 * 更新会员数据
 * @param {Object} pojo 会员数据对象
 */
export function update(pojo) {
  return request({
    url: `/member/${pojo.id}`,
    method: 'put',
    data: pojo
  })
}

/**
 * 删除会员
 * @param {Number} id 会员ID
 */
export function deleteById(id) {
  return request({
    url: `/member/${id}`,
    method: 'delete'
  })
}
