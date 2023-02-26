<template>
  <div v-if="!isLoading">
    <el-button
      
      type="primary"
      @click="dialogFormVisible = true"
      style="margin-bottom: 10px"
      >{{ mode === "comment" ? "添加评论" : "添加留言" }}</el-button
    >
    <el-table :data="data.rows" border stripe style="width: 100%" v-loading="isLoading">
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.$index + 1 + getInfo.limit * (getInfo.page - 1)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="150" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.avatar"
            fit="cover"
            lazy
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" width="110">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="日期">
        <template slot-scope="scope">
          {{ formatDate(scope.row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="文章标题"
        v-if="mode === 'comment'"
      >
        <template slot-scope="scope">
          {{ scope.row.blog.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="删除" placement="top"
            ><el-button
              type="danger"
              icon="el-icon-delete"
              size="medium"
              circle
              @click="delCommentHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      style="margin-top: 30px; margin-bottom: 20px"
      background
      :current-page="getInfo.page"
      :page-sizes="pageSizes"
      layout="prev, pager, next, total, ->, sizes, jumper"
      :total="total"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      @prev-click="prevClickHandle"
      @next-click="nextClickHandle"
    >
    </el-pagination>
    <!-- 弹出框 -->
    <el-dialog
      title="添加评论"
      :visible.sync="dialogFormVisible"
      @close="closeForm"
    >
      <el-form :model="form">
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" placeholder="请输入内容"></el-input>
        </el-form-item>

        <el-form-item label="评论文章" v-if="mode === 'comment'">
          <el-select v-model="form.blogId" placeholder="请选择评论文章">
            <el-option
              v-for="item in selectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCommentHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getComment, addComment, delComment } from '@/api/comment'
import { getMessage, postMessage, delMessage } from '@/api/message'
import { getBlogs } from '@/api/blog'
import formatDate from '@/utils/formatDate'
export default {
  props: ["mode"],
  data () {
    return {
      //获取所有评论
      data: [],
      //所有文章
      blogData: null,
      //添加评论表单
      form: {
        nickname: '',
        content: '',
        blogId: ''
      },
      //获取评论参数
      getInfo: {
        page: 1,
        limit: 10,
        blogid: -1,
        keyword: ''
      },
      //弹出框标识
      dialogFormVisible: false,
      //评论总数量
      total: 0,
      //选择显示页面数量
      pageSizes: [5, 10, 20],
      //加载标识
      isLoading:false
    }
  },
  computed: {
    //选择框数据
    selectList () {
      if (this.blogData) {
        return this.blogData.rows.map(item => { return { name: item.title, id: item.id } })
      }
    },
    //评论总页数
    pageCount () {
      return Math.ceil(this.total / this.getInfo.limit)
    },
  },
  methods: {
    //获取所有评论
    async getData () {
      this.isLoading = true
      if (this.mode === 'comment') {
        const { data } = await getComment(this.getInfo)
        this.data = data.data
        this.total = data.data.total
        this.blogData = await getBlogs({ limit: 20 })
        this.blogData = this.blogData.data.data
      } else {
        const { data } = await getMessage(this.getInfo)
        this.data = data.data
        this.total = data.data.total
      }
      this.isLoading = false
    },
    //添加评论
    async addCommentHandle () {
      if (!this.form.blogId) {
        this.form.blogId = true
      }
      if (this.form.nickname && this.form.content && this.form.blogId) {
        delete this.form.blogId
        let data = null
        if (this.mode === 'comment') {
          data = await addComment(this.form).catch(() => {
            this.$message.error('评论失败')
            this.dialogFormVisible = false
            return
          })
        } else {
          data = await postMessage(this.form).catch(() => {
            this.$message.error('留言失败')
            this.dialogFormVisible = false
            return
          })
        }
        console.log(data);
        data = data.data
        if (data.code === 0) {
          this.data.rows.unshift(data.data)
          this.dialogFormVisible = false
          this.mode === 'comment' ? this.$message.success('评论成功') : this.$message.success('留言成功')
        }
      } else {
        this.$message.error('请填写全部内容')
      }
    },
    //删除评论
    async delCommentHandle (row) {
      const msg = this.mode === 'comment' ? '评论' : '留言'
      this.$confirm(`此操作将永久删除该${msg}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (this.mode === 'comment') {
          await delComment(row.id).catch(() => {
            this.$message.error('删除失败')
            return
          })
        } else {
          await delMessage(row.id).catch(() => {
            this.$message.error('删除失败')
            return
          })
        }
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
    //关闭弹窗
    closeForm () {
      this.form.nickname = ''
      this.form.content = ''
      this.form.blogId = ''
    },
    //改变单页显示数量
    sizeChangeHandle (val) {
      this.getInfo.limit = val
      if (this.getInfo.page > this.pageCount) {
        this.getInfo.page = this.pageCount
      }
      this.getData()
    },
    //改变当前页
    currentChangeHandle (val) {
      this.getInfo.page = val

      if (this.getInfo.page > this.pageCount) {
        this.getInfo.page = this.pageCount
      }
      if (this.getInfo.page < 1) {
        this.getInfo.page = 1
      }
      this.getData()
    },
    //上一页
    prevClickHandle () {
      this.getInfo.page -= 1
    },
    //下一页
    nextClickHandle () {
      this.getInfo.page += 1
    },
    formatDate
  },
  created () {
    this.getData()
  }
}
</script>

<style>
</style>