<template>
  <div class="app-container">
    <template>
      <!-- 表格展示 -->
      <el-table :data="data" border stripe style="width: 100%" v-loading="isLoading">
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="标题" width="170">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" width="250">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="中图预览" width="220">
          <template slot-scope="scope">
            <el-image
              style="width: 100px"
              :src="scope.row.midImg"
              fit="cover"
              :preview-src-list="srcMidList"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="大图预览" width="220">
          <template slot-scope="scope">
            <el-image
              style="width: 100px"
              :src="scope.row.bigImg"
              fit="cover"
              :preview-src-list="srcBigList"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top"
            >
              <el-button
                type="primary"
                size="medium"
                icon="el-icon-edit"
                circle
                @click="handleClick(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出框 -->
      <el-dialog title="修改首页标语" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="标题">
            <el-input v-model="form.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" :rows="2" v-model="form.description">
            </el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="中图">
                <Upload v-model="form.midImg" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="大图">
                <Upload v-model="form.bigImg" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editBanner">确 定</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import { getBanner, setBanner } from '@/api/banner'
import Upload from '@/components/Upload'
export default {
  components: {
    Upload
  },
  data () {
    return {
      //所有标语数据
      data: [],
      //表单绑定数据
      form: {
        title: '',
        description: '',
        midImg: '',
        bigImg: ''
      },
      // 弹出框标识
      dialogFormVisible: false,
      //加载标识
      isLoading:false
    }
  },
  methods: {
    // 打开弹出框
    handleClick (row) {
      this.dialogFormVisible = true
      console.log(row);
      this.form = { ...row }
      this.form.midImg = this.form.midImg
    },
    //修改标语
    async editBanner () {
      let arr = [...this.data]
      for (let i = 0; i < arr.length; i++) {
        if (this.form.id === arr[i].id) {
          arr[i] = this.form
        }
      }
      await setBanner(arr).catch(() => {
        this.dialogFormVisible = false
        this.$message.error("修改失败");
        return
      })
      this.dialogFormVisible = false
      this.$message.success("修改成功");
      this.getData()
    },
    //获取所有标语数据
    async getData () {
      this.isLoading = true
      this.data = await getBanner()
      this.data = this.data.data.data
      this.isLoading = false
    }
  },
  computed:{
    // 中图预览数据
    srcMidList(){
      return this.data.map(item=>item.midImg)
    },
    // 大图预览数据
    srcBigList(){
      return this.data.map(item=>item.bigImg)
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style scoped>
.imgs {
  display: flex;
}
.el-form-item {
  flex: 1;
}
</style>
