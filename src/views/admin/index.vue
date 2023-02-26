<template>
  <div class="app-container">
    <div class="item">
      <h4>名字</h4>
      <el-input v-model="form.name" placeholder="请输入名字"></el-input>
    </div>
    <div class="item">
      <h4>账号</h4>
      <el-input v-model="form.loginId" placeholder="请输入账号"></el-input>
    </div>
    <div class="item">
      <h4>旧密码</h4>
      <el-input v-model="form.oldLoginPwd" placeholder="请输入旧密码"></el-input>
    </div>
    <div class="item">
      <h4>新密码</h4>
      <el-input v-model="form.loginPwd" placeholder="请输入新密码"></el-input>
    </div>
    <div class="item">
        <el-button type="primary" @click="setInfoHandle">保存</el-button>
    </div>
  </div>
</template>

<script>
import {setInfo} from '@/api/user'
export default {
    data(){
        return {
            //用户数据
            form:{
                name:'',
                loginId:'',
                loginPwd:'',
                oldLoginPwd:''
            }
        }
    },
    methods:{
        //设置用户数据
        async setInfoHandle(){
            await setInfo(this.form).catch(()=>{
                this.$message.error('设置失败')
                this.form.name = this.loginId = this.loginPwd = this.oldLoginPwd = ""
                return
            })
            this.form.name = this.form.loginId = this.form.loginPwd = this.form.oldLoginPwd = ""
            this.$message.success('设置成功,请重新登录')
            this.$store.dispatch('user/logout')
            this.$router.replace('/login')
        }
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