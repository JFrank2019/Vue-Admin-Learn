<template>
  <div class="page-login">
    <el-form :model="form" :rules="rules" class="login-form" label-width="80px" ref="login">
      <div class="title-container">
        <h2 class="title">Vue会员管理系统</h2>
      </div>
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleLogin('login')" type="primary">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { login, getUserInfo } from '@/api/login'
export default {
  name: 'login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      // 登录验证规则
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 登录
    handleLogin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 提交表单给后台进行校验
          // login(this.form.username, this.form.password).then(res => {
          //   // 抽取数据
          //   const resp = res.data
          //   console.log(resp.data, resp.data.token)
          //   // 登录成功
          //   if (resp.flag) {
          //     // 验证成功，通过token去获取用户信息
          //     getUserInfo(resp.data.token).then(res => {
          //       const respUser = res.data
          //       if (respUser.flag) {
          //         // 获取到了用户信息
          //         // 1. 保存token 用户信息
          //         localStorage.setItem('vue-admin-user', JSON.stringify(respUser.data))
          //         localStorage.setItem('vue-admin-token', resp.data.token)
          //         // 前往首页
          //         // 提示登录成功
          //         this.$message({
          //           message: resp.message,
          //           type: 'success'
          //         })
          //         // 导航到首页
          //         this.$router.push('/')
          //       } else {
          //         // 没有获取到用户信息
          //         this.$message({
          //           message: respUser.message,
          //           type: 'error'
          //         })
          //       }
          //     })
          //   } else {
          //     // 登录失败
          //     // 提示登录失败
          //     this.$message.error(resp.message)
          //   }
          // })
          this.$store
            .dispatch('Login', this.form)
            .then(response => {
              // response是响应回来的那个对象
              if (response.flag) {
                this.$router.push('/')
              } else {
                this.$message({
                  message: response.message,
                  type: 'warning'
                })
              }
            })
            .catch()
        } else {
          // 提示账号或密码错我
          this.$message({
            message: '用户名或密码错误',
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #005aa7, #fffde4);

  .login-form {
    width: 350px;
    padding: 40px 70px;
    border-radius: 10px;
    border: 1px solid #ccc;
    background: #efefef;
    .title-container {
      .title {
        text-align: center;
        color: #303133;
      }
    }
  }
}
</style>
