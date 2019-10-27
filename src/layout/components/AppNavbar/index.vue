<template>
  <div class="navbar">
    <!-- 开启路由模式，开启后，index表示的就是路由地址 -->
    <el-menu :router="true" active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" default-active="/" text-color="#fff">
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/member/">
        <i class="el-icon-user-solid"></i>
        <span slot="title">会员管理</span>
      </el-menu-item>
      <el-menu-item index="/supplier/">
        <i class="el-icon-s-cooperation"></i>
        <span slot="title">供应商管理</span>
      </el-menu-item>
      <el-menu-item index="/goods/">
        <i class="el-icon-s-goods"></i>
        <span slot="title">商品管理</span>
      </el-menu-item>
      <el-menu-item index="/staff/">
        <i class="el-icon-user"></i>
        <span slot="title">员工管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.navbar {
  position: absolute;
  top: 50px;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  width: 230px;
  background: #545c64;
  .el-menu {
    border-right: none;
  }
}
</style>
