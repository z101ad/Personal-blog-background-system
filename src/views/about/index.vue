<template>
  <div class="app-container">
    <div class="item">
      <h4>我的页面：</h4>
      <el-input v-model="data.url" placeholder="请输入内容" style="width:300px;margin-right:10px"></el-input>
      <el-button type="primary" @click="saveAboutHandle">保存</el-button>
    </div>
  </div>
</template>

<script>
import {getAbout,setAbout} from '@/api/about'
export default {
  data(){
    return {
      data:{
        url:''
      }
    }
  },
  methods:{
    async getData(){
      const {data} = await getAbout()
      this.data.url =data.data
    },
    async saveAboutHandle(){
      const {data} =  await setAbout(this.data).catch(()=>{
        this.$message.error('保存失败')
        return
      })
      this.data.url = data.data
      this.$message.success('保存成功')
    }
  },
  created(){
    this.getData()
  }
}
</script>

<style scoped lang="scss">
.item {
  h4 {
    font-size:14px;
    color:rgb(62, 180, 226)
  }
}
</style>
