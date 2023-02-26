<template>
  <div class="app-container">
    <el-table
      :data="data"
      border
      stripe
      style="width: 100%"
      highlight-current-row
      v-loading="isLoading"
    >
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="200" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank">
            <span style="margin-left: 10px; color: skyblue">{{
              scope.row.name
            }}</span>
          </a>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.description[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图片" width="200">
        <template slot-scope="scope">
          <el-image
            style="width: 178px"
            :src="scope.row.thumb"
            fit="cover"
            :preview-src-list="srcList"
            lazy
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="170">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="github"
            placement="top"
          >
            <el-button
              type="primary"
              size="medium"
              icon="iconfont icon-github-fill"
              class="github"
              circle
              @click="gotoGithub(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-edit"
              circle
              @click="openFrom(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top"
            ><el-button
              type="danger"
              icon="el-icon-delete"
              size="medium"
              circle
              @click="delProject(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出框 -->
    <el-dialog title="编辑项目信息" :visible.sync="dialogFormVisible" >
      <el-form :model="form">
        <el-form-item label="项目名称">
          <el-input v-model="form.name" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目地址">
          <el-input v-model="form.url" placeholder="请输入项目地址"></el-input>
        </el-form-item>
        <el-form-item label="github地址">
          <el-input
            v-model="form.github"
            placeholder="请输入github地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            v-model="form.description[0]"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="项目图片">
          <Upload v-model="form.thumb" class="upload" />
        </el-form-item>
        <el-form-item label="项目级别">
          <el-select v-model="form.order" placeholder="请选择项目级别">
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
        <el-button type="primary" @click="editProject"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getProjects, delProject,editProject } from '@/api/project'
import Upload from '@/components/Upload'
export default {
  components:{
    Upload
  },
  data () {
    return {
      //所有项目数据
      data: [],
      //弹出框标识
      dialogFormVisible:false,
      //项目级别
      options:[1,2,3,4,5],
      //绑定数据
      form: {
        description: [],
        url:'',
        name: '',
        thumb: '',
        order:1,
        github:''
      },
      //加载标识
      isLoading:false
    }
  },
  methods: {
    //获取所有项目数据
    async getData () {
      this.isLoading = true
      const { data } = await getProjects()
      this.data = data.data
      this.isLoading = false
    },
    //跳转地址
    gotoGithub (row) {
      window.open(row.github)
    },
    //打开弹出框
    async openFrom (row) {
      this.form = {...row}
      this.dialogFormVisible = true
    },
    //修改项目
    async editProject(){
      if(this.form.name && this.form.description[0] && this.form.order){
        await editProject(this.form).catch(()=>{
          this.dialogFormVisible = false
          this.$message.error('修改失败')
          return
        })
        this.dialogFormVisible = false
        this.getData()
        this.$message.success('修改成功')
      }
    },
    //删除项目
    delProject (row) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delProject(row.id).catch(() => {
          this.$message.error('删除失败')
          return
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
    }
  },
  computed: {
    //预览图数组
    srcList () {
      return this.data.map(item => item.thumb)
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped lang="scss">
.github {
  background-color: rgb(134, 133, 133);
  border: 0;
}
.upload .avatar-uploader {
  margin-top: 10px;
}
</style>
