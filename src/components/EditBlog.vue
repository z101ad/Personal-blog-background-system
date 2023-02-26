<template>
  <div v-loading="isLoading">
    <div class="item">
      <h4>文章标题</h4>
      <el-input v-model="form.title" placeholder="请输入标题"></el-input>
    </div>
    <div class="item">
      <h4>文章内容</h4>
      <Editor
        :initialValue="form.htmlContent"
        height="600px"
        ref="editor"
        :options="editOption"
      />
    </div>
    <div class="item">
      <h4>文章描述</h4>
      <el-input
        type="textarea"
        :rows="6"
        placeholder="请输入内容"
        v-model="form.description"
      >
      </el-input>
    </div>
    <div class="item">
      <Upload uploadTitle="用户头像" v-model="form.thumb" class="upload"/>
    </div>
    <div class="item">
      <h4>文章分类</h4>
      <el-select v-model="form.category.id" placeholder="请选择文章分类">
            <el-option
              v-for="item in data"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
    </div>
    <div class="item">
      <el-button type="primary" @click="addBlogHandle">{{mode==='add'?'发布文章':'确认修改'}}</el-button>
    </div>
  </div>
</template>

<script>
import { addBlog, editBlog, getBlog } from '@/api/blog'
import {getBlogTypes} from '@/api/blogType'
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
import "@toast-ui/editor/dist/i18n/zh-cn";
import Upload from '@/components/Upload'
export default {
  props:["mode"],
  components: {
    Editor,
    Upload
  },
  data () {
    return {
      //文章分类
      data:{},
      //绑定数据
      form: {
        id:'',
        description: '',
        title: '',
        thumb: '',
        htmlContent:'',
        category:{
            id:'',
            name:''
        }
      },
      //设置中文
      editOption: {
        language: 'zh-CN'
      },
      //加载标识
      isLoading:false
    }
  },
  methods:{
    //添加或修改文章
    async addBlogHandle(){
      let html = this.$refs.editor.invoke('getHTML')
      let markdown = this.$refs.editor.invoke('getMarkdown')
      let obj = {
        description:this.form.description,
        title:this.form.title,
        thumb:this.form.thumb,
        categoryId:this.form.category.id,
        createDate:new Date().getTime(),
        markdownContent:markdown,
        htmlContent:html,
        toc:[]
      }
      if(obj.description && obj.title && obj.categoryId && obj.htmlContent){
        if(this.mode==='add'){
          await addBlog(obj).catch(()=>{
          this.$message.error('添加失败')
        })
        }else {
          await editBlog({id:this.form.id,data:obj}).catch(()=>{
          this.$message.error('修改失败')
        })
        }
        this.$router.replace('/blog/blogList')
        this.mode==='add'? this.$message.success('添加成功'):this.$message.success('修改成功')
      }else {
        this.$message.error('请填写全部内容')
      }

    },
    // 获取指定文章数据
    async getData(){
      this.isLoading = true
      if(this.mode==='edit'){
        this.form.id = this.$route.params.id
        const {data} = await getBlog(this.form.id)
        this.form = data.data
        if(!this.form.category){
          this.form.category = {
            id:'',
            name:''
          }
        }
        this.$refs.editor.invoke('setHTML',this.form.htmlContent)
      }
      const {data} = await getBlogTypes()
      this.data = data.data
      this.isLoading = false
    }
  },
  created(){
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.item {
  margin-bottom: 30px;
  h4 {
    color:rgb(148, 147, 147);
    font-size:16px;
    font-weight: 400;
  }
  .upload {
    width: 200px;
  }
}
</style>