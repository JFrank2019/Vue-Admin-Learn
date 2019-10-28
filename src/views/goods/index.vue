<template>
  <div>
    <!-- 搜索组件 -->
    <el-form :inline="true" :model="searchMap" ref="searchForm" style="margin-top: 20px;">
      <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
      <el-form-item prop="name">
        <el-input placeholder="商品名称" v-model="searchMap.name"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input placeholder="商品编码" v-model="searchMap.code"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input @click.native="dialogSupplierVisible = true" placeholder="选择供应商" readonly v-model="searchMap.supplierName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="fetchData" type="primary">查询</el-button>
        <el-button @click="handleAdd" type="primary">新增</el-button>
        <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table :data="list" border height="600" stripe style="width: 100%">
      <el-table-column align="center" label="编号" type="index" width="60"></el-table-column>
      <el-table-column align="center" label="商品名称" prop="name"></el-table-column>
      <el-table-column align="center" label="商品编码" prop="code"></el-table-column>
      <el-table-column align="center" label="商品规格" prop="spec" width="90"></el-table-column>
      <el-table-column align="center" label="零售价" prop="retailPrice"></el-table-column>
      <el-table-column align="center" label="进货价" prop="purchasePrice"></el-table-column>
      <el-table-column align="center" label="库存数量" prop="storageNum"></el-table-column>
      <el-table-column align="center" label="供应商" prop="supplierName"></el-table-column>
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

    <!-- 选择供应商对话框 -->
    <el-dialog :visible.sync="dialogSupplierVisible" title="选择供应商" width="600px">
      <supplier :isDialog="true" @option-supplier="optionSupplier"></supplier>
    </el-dialog>

    <!-- 编辑商品对话框 -->
    <el-dialog :visible.sync="dialogFormVisible" title="选择供应商" width="600px">
      <el-form :model="pojo" :rules="rules" label-position="right" label-width="100px" ref="pojoForm" style="width: 400px;">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input @click.native="editOptionSupplier" placeholder="选择供应商" readonly v-model="pojo.supplierName"></el-input>
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
import Supplier from '@/views/supplier'
import goodsApi from '@/api/goods'
export default {
  name: 'goods',
  components: {
    Supplier
  },
  data() {
    return {
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      searchMap: {
        name: '',
        code: '',
        supplierName: ''
      },
      // 弹出选择供应商对话框,
      dialogSupplierVisible: false,
      // 弹出编辑供应商对话框
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '商品编号不能为空', trigger: 'blur' }],
        retailPrice: [{ required: true, message: '零售价不能为空', trigger: 'blur' }]
      },
      pojo: {
        supplierId: null,
        name: '',
        code: '',
        spec: '',
        retailPrice: '',
        purchasePrice: '',
        storageNum: '',
        supplierName: ''
      },
      isEdit: false // 是否为编辑窗口
    }
  },
  methods: {
    fetchData() {
      goodsApi.search(this.currentPage, this.pageSize, this.searchMap).then(res => {
        const data = res.data.data
        this.total = data.total
        this.list = data.rows
        console.log(this.list)
      })
    },
    handleEdit(id) {
      this.handleAdd()
      goodsApi.getById(id).then(res => {
        const resp = res.data
        if (resp.flag) {
          this.pojo = resp.data
        }
      })
    },
    handleDelete(id) {
      this.$confirm('确认删除这条记录吗?', '提示', {
        confirmButtonText: '确认',
        cancleButtonText: '取消'
      }).then(() => {
        goodsApi.deleteById(id).then(res => {
          const resp = res.data
          this.$message({
            message: resp.message,
            type: resp.flag ? 'success' : 'warning'
          })
          if (resp.flag) {
            // 删除成功，刷新列表
            return this.fetchData()
          }
        })
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    optionSupplier(currentRow) {
      console.log('parent', currentRow)
      if (this.isEdit) {
        // 是通过编辑窗口打开的选择供应商
        this.pojo.supplierName = currentRow.name
        this.pojo.supplierId = currentRow.id
      } else {
        // 是通过搜索区域打开的选择供应商
        this.searchMap.supplierName = currentRow.name
        this.searchMap.supplierId = currentRow.id
      }
      this.isEdit = false // 注意重新赋值false
      this.dialogSupplierVisible = false
    },
    handleAdd() {
      // 重置pojo
      this.pojo = {
        name: '',
        code: '',
        spec: '',
        retailPrice: '',
        purchasePrice: '',
        storageNum: '',
        supplierName: ''
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // this.$nextTick()是一个异步事件，当渲染结束之后，它的回调函数才会执行
        // 弹出窗口打开后，需要加载dom，需要花费事件，应等待dom加载完之后，再调用 resetFields 方法，重置表单和清除样式
        this.$refs['pojoForm'].resetFields()
      })
    },
    // 提交新增数据
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 提交表单
          goodsApi.add(this.pojo).then(res => {
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
    // 提交更新的数据
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 校验通过
          goodsApi.update(this.pojo).then(res => {
            const resp = res.data
            if (resp.flag) {
              // 修改成功，更新数据，关闭窗口
              this.fetchData()
              this.dialogFormVisible = false
            }
          })
        } else {
          // 页面上没有校验通过
          return false
        }
      })
    },
    editOptionSupplier() {
      // 当前时通过编辑窗口中的选择供应商打开的窗口
      this.isEdit = true
      this.dialogSupplierVisible = true
    }
  },
  created() {
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped></style>
