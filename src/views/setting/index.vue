<template>
  <div class="app-container">
    <div class="item" v-loading="isLoading">
      <h4>网站标题</h4>
      <el-input v-model="form.siteTitle" placeholder="请输入网站标题"></el-input>
    </div>
    <div class="item">
      <h4>网站图标</h4>
      <el-input v-model="form.favicon" placeholder="请输入网站图标"></el-input>
    </div>
    <div class="item">
      <h4>github名称</h4>
      <el-input v-model="form.githubName" placeholder="请输入github名称"></el-input>
    </div>
    <div class="item">
      <h4>github主页</h4>
      <el-input v-model="form.github" placeholder="请输入github地址"></el-input>
    </div>
    <div class="item">
      <h4>qq</h4>
      <el-input v-model="form.github" placeholder="请输入qq账号"></el-input>
    </div>
    <div class="item">
      <h4>qq二维码</h4>
      <el-input v-model="form.qqQrCode" placeholder="请输入图片地址"></el-input>
    </div>
    <div class="item">
      <h4>weixin</h4>
      <el-input v-model="form.weixin" placeholder="请输入weixin号"></el-input>
    </div>
    <div class="item">
      <h4>weixin二维码</h4>
      <el-input v-model="form.weixinQrCode" placeholder="请输入图片地址"></el-input>
    </div>
    <div class="item">
      <h4>邮箱</h4>
      <el-input v-model="form.mail" placeholder="请输入邮箱地址"></el-input>
    </div>
    <div class="item">
      <h4>备案号</h4>
      <el-input v-model="form.icp" placeholder="请输入备案号"></el-input>
    </div>
    <div class="item">
      <Upload uploadTitle="用户头像" v-model="form.avatar" class="upload"/>
    </div>
    <div class="item">
        <el-button type="primary" @click="saveSettingHandle">保存</el-button>
    </div>
  </div>
</template>

<script>
import {getSetting,setSetting} from '@/api/setting'
import Upload from '@/components/Upload'
export default {
    components:{
        Upload
    },
    data(){
        return {
            //设置数据
            form:{},
            //加载标识
            isLoading:false
        }
    },
    methods:{
        //获取设置数据
        async getData(){
          this.isLoading = true
            const {data} = await getSetting()
            this.form = data.data
            this.isLoading = false
        },
        //保存设置数据
        async saveSettingHandle(){
            const {data} =  await setSetting(this.form).catch(()=>{
                this.$message.error('设置失败')
                return
            })
            this.form = data.data
            this.$message.success('设置成功')
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