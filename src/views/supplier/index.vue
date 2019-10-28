<template>
  <div>
    <!-- 搜索组件 -->
    <el-form :inline="true" :model="searchMap" ref="searchForm" style="margin-top: 20px;">
      <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
      <el-form-item prop="name">
        <el-input placeholder="供应商名称" v-model="searchMap.name"></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="!isDialog">
        <el-input placeholder="联系人" v-model="searchMap.linkman"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="!isDialog">
        <el-input placeholder="联系电话" v-model="searchMap.mobile"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="fetchData" type="primary">查询</el-button>
        <el-button @click="handleAdd" type="primary" v-if="!isDialog">新增</el-button>
        <el-button @click="resetFrom('searchForm')" v-if="!isDialog">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <!-- highlight-current-row: 激活单选行 -->
    <!-- 当点击某一行后，会触发@current-change这个事件，从而调用对应的函数handleCurrentChange,他会接收两个参数 :currentRow, oldCurrentRow -->
    <el-table :data="list" :highlight-current-row="isDialog" @current-change="handleCurrentRowChange" border height="600" stripe style="width: 100%">
      <el-table-column align="center" label="序号" type="index" width="60"></el-table-column>
      <el-table-column align="center" label="供应商名称" prop="name"></el-table-column>
      <el-table-column align="center" label="联系人" prop="linkman" width="90"></el-table-column>
      <el-table-column align="center" label="联系电话" prop="mobile" v-if="!isDialog"></el-table-column>
      <el-table-column align="center" label="备注" prop="remark" v-if="!isDialog"></el-table-column>
      <el-table-column align="center" label="操作" v-if="!isDialog" width="150">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" size="mini">编辑</el-button>
          <el-button @click="handleDelete(scope.row.id)" size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="currentPage"
      :layout="!isDialog ? 'total, sizes, prev, pager, next, jumper' : 'prev, pager, next'"
      :page-size="pageSize"
      :page-sizes="[10, 20, 50]"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      style="margin-top: 20px;"
    ></el-pagination>

    <!-- 弹出新增窗口 -->
    <el-dialog :visible.sync="dialogFormVisible" title="供应商编辑" width="500px">
      <el-form :model="pojo" :rules="rules" label-position="right" label-width="100px" ref="pojoForm" style="width: 400px;">
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="pojo.remark"></el-input>
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
import supplierApi from '@/api/supplier'
export default {
  name: 'supplier',
  props: {
    // 接收父组件传递过来的数据，通过isDialog来判断，是否为弹窗
    isDialog: Boolean
  },
  data() {
    return {
      list: [],
      pageSize: 10, // 每页显示条数
      currentPage: 1, // 当前页码
      total: 0, // 总记录数
      searchMap: {
        name: '',
        linkman: '',
        mobile: ''
      }, // 条件查询的绑定字段值
      pojo: {
        id: null,
        name: '',
        linkman: '',
        mobile: '',
        remark: ''
      },
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
        linkman: [{ required: true, message: '联系人不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    fetchData() {
      supplierApi.search(this.currentPage, this.pageSize, this.searchMap).then(res => {
        const data = res.data.data
        this.list = data.rows
        this.total = data.total
        console.log(this.list)
      })
    },
    // 改变页码时调用
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    // 改变每页显示的数据时调用
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    resetFrom(formName) {
      this.$refs[formName].resetFields()
    },
    // 打开新增窗口
    handleAdd() {
      // 重置pojo
      this.pojo = {
        name: '',
        linkman: '',
        mobile: '',
        remark: ''
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // this.$nextTick()是一个异步事件，当渲染结束之后，它的回调函数才会执行
        // 弹出窗口打开后，需要加载dom，需要花费事件，应等待dom加载完之后，再调用 resetFields 方法，重置表单和清除样式
        this.$refs['pojoForm'].resetFields()
      })
    },
    // 提交新增表单
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 提交表单
          supplierApi.add(this.pojo).then(res => {
            const resp = res.data
            if (resp.flag) {
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
    handleEdit(id) {
      console.log('编辑', id)
      // 清除表单数据和校验结果
      this.handleAdd()
      supplierApi.getById(id).then(res => {
        const resp = res.data
        if (resp.flag) {
          this.pojo = resp.data
        } else {
          // 提示获取数据失败
          this.$message({
            message: resp.message,
            type: 'warning'
          })
        }
      })
    },
    handleDelete(id) {
      // console.log('删除', id)
      this.$confirm('确认删除这条记录吗?', '提示', {
        confirmButtonText: '确认',
        cancleButtonText: '取消'
      })
        .then(() => {
          supplierApi.deleteById(id).then(res => {
            const resp = res.data
            this.$message({
              message: resp.message,
              type: resp.flag ? 'success' : 'error'
            })
            if (resp.flag) {
              // 删除成功，刷新数据

              this.fetchData()
            }
          })
        })
        .catch(() => {
          this.$message({
            message: '取消删除',
            type: 'info'
          })
        })
    },
    // 更新数据
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 页面校验通过才可进行更新
          supplierApi.update(this.pojo).then(res => {
            const resp = res.data
            if (resp.flag) {
              // 更新成功 刷新数据，关闭窗口
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
    // 当点击某一行时的处理函数
    handleCurrentRowChange(currentRow) {
      // console.log('当前行', currentRow)
      this.$emit('option-supplier', currentRow)
    }
  },
  created() {
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped></style>
