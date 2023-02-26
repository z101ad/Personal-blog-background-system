<template>
  <div>
    <div class="item">
      <h4>项目名称</h4>
      <el-input v-model="form.name" placeholder="请输入项目名称"></el-input>
    </div>
    <div class="item">
      <h4>项目地址</h4>
      <el-input v-model="form.url" placeholder="请输入项目地址"></el-input>
    </div>
    <div class="item">
      <h4>github地址</h4>
      <el-input v-model="form.github" placeholder="请输入github地址"></el-input>
    </div>
    <div class="item">
      <h4>项目描述</h4>
      <el-input
        type="textarea"
        :rows="6"
        placeholder="请输入内容"
        v-model="form.description[0]"
      >
      </el-input>
    </div>
    <div class="item">
      <Upload uploadTitle="项目图片" v-model="form.thumb" class="upload"/>
    </div>
    <div class="item">
      <h4>项目级别</h4>
      <el-select v-model="form.order" placeholder="请选择项目级别">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
    </div>
    <div class="item">
      <el-button type="primary" @click="addProjectHandle">{{mode==='add'?'发布项目':'确认修改'}}</el-button>
    </div>
  </div>
</template>

<script>
import { addProject,editProject } from '@/api/project'
import Upload from '@/components/Upload'
export default {
  props:["mode"],
  components: {
    Upload
  },
  data () {
    return {
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
      }
    }
  },
  methods:{
    async addProjectHandle(){
      if(this.form.description && this.form.name && this.form.order){
        if(this.mode==='add'){
          await addProject(this.form).catch(()=>{
          this.$message.error('添加失败')
        })
        }else {
          await editProject(this.form).catch(()=>{
          this.$message.error('修改失败')
        })
        }
        this.$router.replace('/project/proList')
        this.mode==='add'? this.$message.success('添加成功'):this.$message.success('修改成功')
      }else {
        this.$message.error('请填写全部内容')
      }

    },
  },
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