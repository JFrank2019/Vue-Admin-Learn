<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss"></style>

<script>
import testApi from '@/api/test'
export default {
  created() {
    // 初始化数据
    this.fetchData()
  },
  methods: {
    fetchData() {
      testApi.getList().then(res => {
        console.log('get', res.data)
      })
    }
  }
}
</script>
