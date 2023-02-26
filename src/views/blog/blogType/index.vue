<template>
  <div class="app-container">
    <!-- 添加分类栏 -->
    <div style="margin-top: 15px; margin-bottom: 20px" v-if="!isLoading">
      <el-input
        style="width: 400px; margin-right: 10px"
        placeholder="请输入分类名称"
        v-model="addTypeInfo.name"
        class="input-with-select"
      >
        <el-select
          style="width: 60px"
          v-model="addTypeInfo.order"
          slot="prepend"
          placeholder="请选择"
        >
          <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-input>
      <el-button type="primary" @click="addBlogTypeHandle">添加</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="data" border stripe style="width: 100%" v-loading="isLoading">
      <el-table-column label="序号" width="190" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="300">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章数量" align="center" width="300">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.articleCount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-edit"
              circle
              @click="openForm(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              type="danger"
              size="medium"
              icon="el-icon-delete"
              circle
              @click="delBlogTypeHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出框 -->
    <el-dialog title="编辑文章分类" :visible.sync="dialogFormVisible">
      <el-form :model="addTypeInfo">
        <el-form-item label="分类名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类级别">
          <el-select v-model="form.order" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBlogTypeHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBlogTypes, addBlogType, editBlogType, delBlogType } from '@/api/blogType'
export default {
  data () {
    return {

      //所有分类数据
      data: [],
      addTypeInfo: {
        //分类名称
        name: '',
        // 分类级别，默认为1
        order: '1'
      },
      // 弹出框标识
      dialogFormVisible: false,
      //弹出框数据
      form: {},
      //分类级别数据
      options:[1,2,3,4,5],
      // 加载标识
      isLoading:false
    }
  },
  methods: {
    //获取所有文章分类
    async getData () {
      const { data } = await getBlogTypes()
      this.data = data.data
    },
    //添加文章分类
    async addBlogTypeHandle () {
      if (!this.addTypeInfo.name) {
        this.$message.error('分类名称不能为空')
        return
      }
      await addBlogType(this.addTypeInfo).catch(() => {
        this.$message.error("添加失败")
      })
      this.addTypeInfo.name = ''
      this.addTypeInfo.order = 1
      this.getData()
      this.$message.success("添加成功")
    },
    // 打开弹窗
    openForm (row) {
      this.form = { ...row }
      this.dialogFormVisible = true
    },
    //编辑文章分类
    async editBlogTypeHandle () {
      if(!this.form.name){
        this.$message.error('分类名称不能为空')
        return
      }
      const {data} =  await editBlogType(this.form).catch(()=>{
        this.dialogFormVisible = false
        this.$message.error('修改失败')
        return
      })
      if(data.data.name){
        this.getData()
        this.dialogFormVisible = false
        this.$message.success('修改成功')
      }
      
    },
    //删除文章分类
    delBlogTypeHandle (row) {
      this.$confirm('此操作将永久删除该文章分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delBlogType(row.id).catch(() => {
          this.$message.error('删除失败')
        })
        this.getData()
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
  },
  created () {
    this.getData()
  }
}
</script>

<style>
</style>
