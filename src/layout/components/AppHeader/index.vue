<template>
  <div class="header">
    <router-link to="/">
      <img class="logo" height="25px" src="@/assets/logo.png" width="25px" />
      <span class="company">Vue会员管理系统</span>
    </router-link>
    <el-dropdown @command="handleCommand" trigger="click">
      <span class="el-dropdown-link">
        {{ username }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="changePassword" icon="el-icon-edit">修改密码</el-dropdown-item>
        <el-dropdown-item command="logout" icon="el-icon-coordinate">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { logout } from '@/api/login'
export default {
  name: 'AppHeader',
  data() {
    return {
      username: ''
    }
  },
  methods: {
    // 处理点击事件
    handleCommand(command) {
      switch (command) {
        case 'changePassword':
          // 修改密码
          break
        case 'logout':
          logout(localStorage.getItem('vue-admin-token')).then(res => {
            const resp = res.data
            if (resp.flag) {
              // 退出成功
              // 清除本地数据
              localStorage.removeItem('vue-admin-token')
              localStorage.removeItem('vue-admin-user')
              // 回到登录页面
              this.$router.push('/login')
            } else {
              // 提示
              this.$message({
                message: resp.message,
                type: 'warning'
              })
            }
          })
          // 退出系统
          break
        default:
          break
      }
    },
    // 获取用户名
    getUserName() {
      const username = JSON.parse(window.localStorage.getItem('vue-admin-user')).name
      this.username = username
    }
  },
  created() {
    this.getUserName()
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  line-height: 50px;
  top: 0;
  left: 0;
  right: 0;
  background: #2d3a4b;
  padding: 0 20px;
  .logo {
    vertical-align: middle;
    margin-right: 10px;
  }
  .company {
    position: absolute;
    color: #efefef;
  }
  .el-dropdown {
    float: right;
    margin-right: 20px;
    .el-dropdown-link {
      color: #efefef;
      cursor: pointer;
    }
  }
}
</style>
