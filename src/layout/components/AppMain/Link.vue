<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: $route.path }" class="line">{{ $route.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  height: 10px;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .line {
    border-left: 3px solid #31c17b;
    padding-left: 10px;
  }
}
</style>
