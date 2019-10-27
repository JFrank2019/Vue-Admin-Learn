<template>
  <div>
    <!-- 搜索组件 -->
    <el-form :inline="true" :model="searchMap" ref="searchForm" style="margin-top: 20px;">
      <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
      <el-form-item prop="cardNum">
        <el-input placeholder="会员卡号" v-model="searchMap.cardNum"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input placeholder="会员姓名" v-model="searchMap.name"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select placeholder="支付类型" v-model="searchMap.payType">
          <!-- 要把payTypeOptions绑定到data中 -->
          <el-option :key="option.type" :label="option.name" :value="option.type" v-for="option in payTypeOptions"></el-option>
        </el-select>
      </el-form-item>
      <!-- 日期组件 -->
      <el-form-item prop="birthday">
        <el-date-picker placeholder="出生日期" type="date" v-model="searchMap.birthday" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="fetchData" type="primary">查询</el-button>
        <el-button @click="handleAdd" type="primary">新增</el-button>

        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table :data="list" border height="600" stripe style="width: 100%">
      <el-table-column align="center" label="序号" type="index" width="60"></el-table-column>
      <el-table-column align="center" label="会员卡号" prop="cardNum"></el-table-column>
      <el-table-column align="center" label="会员姓名" prop="name" width="90"></el-table-column>
      <el-table-column align="center" label="会员生日" prop="birthday"></el-table-column>
      <el-table-column align="center" label="手机号码" prop="phone"></el-table-column>
      <el-table-column align="center" label="可用积分" prop="integral"></el-table-column>
      <el-table-column align="center" label="开卡金额" prop="money"></el-table-column>
      <el-table-column align="center" label="支付类型" prop="payType" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.payType | payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员地址" prop="address" width="300"></el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" size="mini">编辑</el-button>
          <el-button @click="handleDelete(scope.row.id)" size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 20, 50]"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px;"
    ></el-pagination>

    <!-- 弹出新增窗口 -->
    <el-dialog :visible.sync="dialogFormVisible" title="会员编辑" width="500px">
      <el-form :model="pojo" :rules="rules" label-position="right" label-width="100px" ref="pojoForm" style="width: 400px;">
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker placeholder="出生日期" type="date" v-model="pojo.birthday" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select placeholder="请点击选择" v-model="pojo.payType">
            <el-option :key="option.type" :label="option.name" :value="option.type" v-for="option in payTypeOptions"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input type="textarea" v-model="pojo.address"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="pojo.id === null ? addData('pojoForm') : updateData('pojoForm')" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { search, add, getById, update, deleteById } from '@/api/member'

const payTypeOptions = [{ type: '1', name: '现金' }, { type: '2', name: '微信' }, { type: '3', name: '支付宝' }, { type: '4', name: '银行卡' }]
export default {
  name: 'member',
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示10条数据
      // 条件查询绑定的条件值
      searchMap: {
        cardNum: '',
        name: '',
        payType: '',
        birthday: ''
      },
      payTypeOptions,
      dialogFormVisible: false, // 控制对框框显隐的属性
      pojo: {
        // 提交的数据
        id: null,
        cardNum: '',
        name: '',
        birthday: '',
        phone: '',
        money: '',
        integral: '',
        payType: '',
        address: ''
      },
      // 校验规则
      rules: {
        cardNum: [{ required: true, message: '卡号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        payType: [{ required: true, message: '支付类型不能为空', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 抓取数据
    fetchData() {
      // 调用分页查询数据
      search(this.currentPage, this.pageSize, this.searchMap).then(res => {
        const resp = res.data
        this.total = resp.data.total
        // console.log(resp)
        this.list = resp.data.rows
      })
    },

    // 当每页条数改变后触发， val是最新的每页显示条数
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    // 当页码改变后触发， val 是最新的页码
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    // 重置搜索框
    resetForm(formName) {
      console.log('重置', formName)
      // 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效
      this.$refs[formName].resetFields()
    },
    // 弹出新增窗口
    handleAdd() {
      // 重置pojo
      this.pojo = {
        // 提交的数据
        id: null,
        cardNum: '',
        name: '',
        birthday: '',
        phone: '',
        money: '',
        integral: '',
        payType: '',
        address: ''
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // this.$nextTick()是一个异步事件，当渲染结束之后，它的回调函数才会执行
        // 弹出窗口打开后，需要加载dom，需要花费事件，应等待dom加载完之后，再调用 resetFields 方法，重置表单和清除样式
        this.$refs['pojoForm'].resetFields()
      })
    },
    // 添加数据
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          add(this.pojo).then(res => {
            console.log('addData')
            const resp = res.data
            if (resp.flag) {
              // 新增成功 刷新列表数据
              this.fetchData()
              // 隐藏弹出框
              this.dialogFormVisible = false
              // 提示添加成功
              this.$message({
                message: resp.message,
                type: 'success'
              })
            } else {
              this.$message({
                message: resp.message,
                type: 'warning'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 编辑会员信息
    handleEdit(id) {
      getById(id).then(res => {
        const resp = res.data
        if (resp.flag) {
          this.pojo = resp.data
          console.log(this.pojo)
          this.dialogFormVisible = true
        }
      })
    },
    updateData(formName) {
      console.log('update data')
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 提交更新
          update(this.pojo).then(res => {
            const resp = res.data
            if (resp.flag) {
              // 刷新列表
              this.fetchData()
              this.dialogFormVisible = false
            } else {
              this.$message({
                message: resp.message,
                type: 'warning'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    handleDelete(id) {
      console.log('删除', id)
      this.$confirm('确认删除这条记录吗？', '提示', {
        confirmButtonText: '确认',
        cancleButton: '取消'
      })
        .then(() => {
          // 确认
          deleteById(id).then(res => {
            const resp = res.data
            this.$message({
              message: resp.message,
              type: resp.flag ? 'success' : 'error'
            })
            if (resp.flag) {
              // 删除成功，刷新列表数据
              this.fetchData()
            }
          })
        })
        .catch(() => {
          // 取消，不用理会
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  filters: {
    payTypeFilter(type) {
      const payObj = payTypeOptions.find(obj => obj.type === type)
      return payObj ? payObj.name : null
    }
  },
  created() {
    // 初始化获取列表数据
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped></style>
