<template>
  <div >
    <div class="block">{{uploadTitle}}</div>
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :headers="headers"
    >
      <img v-if="value" :src="value" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: ["uploadTitle", "value"],
  methods: {
    handleAvatarSuccess (res) {
      this.$emit('input',res.data)
    }
  },
  computed: {
    headers(){
        return {
            Authorization :'Bearer '+localStorage.getItem("token")
        }
    }
  }
}

</script>

<style lang="scss" scoped>
.block {
  color:rgb(148, 147, 147);
  font-size:16px;
  margin-bottom: 15px;
}
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader {
  text-align: center;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>