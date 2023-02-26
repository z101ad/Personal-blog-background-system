<template>
  <div class="app-container">
    <!-- 表格 -->
    <el-table :data="data" border stripe style="width: 100%" v-loading="isLoading">
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{
            scope.$index + 1 + getInfo.limit * (getInfo.page - 1)
          }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标题" width="160">
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            width="160"
            trigger="hover"
          >
              <el-image
                style="width: 160px"
                :src="scope.row.thumb"
                fit="cover"
                :preview-src-list="srcList"
              ></el-image>
            <span style="margin-left: 10px" slot="reference">{{
              scope.row.title
            }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="200">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="浏览量" width="100">
        <template slot-scope="scope">
          {{ scope.row.scanNumber }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="评论量" width="100">
        <template slot-scope="scope">
          {{ scope.row.commentNumber }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="日期" width="160">
        <template slot-scope="scope">
          {{ formatDate(scope.row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类" width="140">
        <template slot-scope="scope">
          {{ scope.row.category ?scope.row.category.name:'未分类' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="170">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-edit"
              circle
              @click="editBlog(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top"
            ><el-button
              type="danger"
              icon="el-icon-delete"
              size="medium"
              circle
              @click="delBlog(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
    v-if ="!isLoading"
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
  </div>
</template>

<script>
import { getBlogs, delBlog } from '@/api/blog'
import Upload from '@/components/Upload'
import formatDate from '@/utils/formatDate'
export default {
  components: {
    Upload
  },
  data () {
    return {
      // 获取的所有文章数据
      data: [],
      //获取文章参数
      getInfo: {
        page: 1,
        limit: 10,
        categoryId: -1,
        keyword: ''
      },
      //文章总数量
      total: 0,
      //选择器每页显示数量
      pageSizes: [5, 10, 20],
      // 加载标识
      isLoading:false
    }
  },
  computed: {
    //最大页数
    pageCount () {
      return Math.ceil(this.total / this.getInfo.limit)
    },
    //预览图数据
    srcList(){
      return this.data.map(item=>item.thumb)
    }
  },
  methods: {
    //获取所有文章数据
    async getData () {
      this.isLoading = true
      this.data = await getBlogs(this.getInfo)
      this.total = this.data.data.data.total
      this.data = this.data.data.data.rows
      this.isLoading = false
    },
    //每页显示数量改变
    sizeChangeHandle (val) {
      this.getInfo.limit = val
      if (this.getInfo.page > this.pageCount) {
        this.getInfo.page = this.pageCount
      }
      this.getData()
    },
    //当前页改变
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
    // 上一页
    prevClickHandle () {
      this.getInfo.page -= 1
    },
    // 下一页
    nextClickHandle () {
      this.getInfo.page += 1
    },
    // 修改文章
    editBlog (row) {
      this.$router.push(`/blog/editBlog/${row.id}`)
    },
    // 删除文章
    delBlog (row) {
      this.$confirm('此操作将永久删除该文章以及评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delBlog(row.id).catch(() => {
          this.$message.error('删除失败')
          return
        })
        this.getData(this.getInfo)
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
    // 格式化时间
    formatDate
  },
  created () {
    this.getData()
  }

}
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
