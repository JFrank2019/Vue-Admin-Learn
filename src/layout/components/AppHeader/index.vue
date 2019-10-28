<template>
  <div class="header">
    <router-link to="/">
      <img class="logo" height="25px" src="@/assets/logo.png" width="25px" />
      <span class="company">Vue会员管理系统</span>
    </router-link>
    <el-dropdown @command="handleCommand" trigger="click">
      <span class="el-dropdown-link">
        {{ this.user.name }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="changePassword" icon="el-icon-edit">修改密码</el-dropdown-item>
        <el-dropdown-item command="logout" icon="el-icon-coordinate">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 修改密码 -->
    <el-dialog :visible.sync="dialogFormVisible" title="修改密码" width="600px">
      <el-form :model="ruleForm" :rules="rules" label-width="100px" ref="ruleForm" status-icon>
        <el-form-item label="原密码" prop="oldPass">
          <el-input autocomplete="off" type="password" v-model="ruleForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input autocomplete="off" type="password" v-model="ruleForm.newPass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input autocomplete="off" type="password" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm('ruleForm')" type="primary">提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { logout } from '@/api/login'
import passwordApi from '@/api/password'
export default {
  name: 'AppHeader',
  data() {
    // 在return 上面进行申明自定校验
    const validateOldPass = (rule, value, callback) => {
      // console.log(this.user.id)
      passwordApi.checkPwd(this.user.id, value).then(response => {
        const resp = response.data
        if (resp.flag) {
          // 验证通过
          callback()
        } else {
          callback(new Error(resp.message))
        }
      })
    }

    // 校验确认密码是否一致
    const validatePass = (rule, value, callback) => {
      // value 代表 checkPass
      if (value !== this.ruleForm.newPass) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        // 相等,则通过
        callback()
      }
    }

    return {
      user: JSON.parse(window.localStorage.getItem('vue-admin-user')),
      dialogFormVisible: false,
      ruleForm: {
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
      rules: {
        oldPass: [{ required: true, message: '原密码不能为空', trigger: 'blur' }, { validator: validateOldPass, trigger: 'blur' }],
        newPass: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
        checkPass: [{ required: true, message: '确认密码不能为空', trigger: 'blur' }, { validator: validatePass, trigger: 'change' }]
      }
    }
  },
  methods: {
    // 处理点击事件
    handleCommand(command) {
      switch (command) {
        case 'changePassword':
          // 打开修改密码窗口
          this.handlePwd()
          break
        case 'logout':
          this.handleLogout()
          // 退出系统
          break
        default:
          break
      }
    },
    // 退出登录
    handleLogout() {
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
    },
    // 打开修改密码窗口
    handlePwd() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
    },
    // 修改密码
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('校验成功')
          passwordApi.updatePwd(this.user.id, this.ruleForm.checkPass).then(res => {
            const resp = res.data
            this.$message({
              message: resp.message,
              type: resp.flag ? 'success' : 'warning'
            })
            if (resp.flag) {
              // 更新成功，退出系统，回到登录也
              this.handleLogout()
              // 关闭窗口
              this.dialogFormVisible = false
            }
          })
        }
      })
    }
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
