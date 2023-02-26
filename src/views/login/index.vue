<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">登 录</h3>
      </div>

      <el-form-item prop="loginId">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="loginId"
          v-model="loginForm.loginId"
          placeholder="账号"
          name="loginId"
          type="text"
          tabindex="1"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="loginPwd">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="loginPwd"
          v-model="loginForm.loginPwd"
          :type="passwordType"
          placeholder="密码"
          name="loginPwd"
          tabindex="2"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-form-item prop="captcha" style="width: 288px" class="captcha">
        <span class="svg-container">
          <i class="el-icon-picture-outline" />
        </span>
        <el-input
          ref="captcha"
          v-model="loginForm.captcha"
          placeholder="验证码"
          name="captcha"
          tabindex="3"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <span class="img" @click="handleCaptcha" v-html="captchaData"></span>
      <div class="checkbox">
        <el-checkbox v-model="loginForm.checked">7 天内免登录</el-checkbox>
      </div>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getCaptcha } from '@/api/captcha'
export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        loginId: '',
        loginPwd: '',
        captcha: '',
        checked: true
      },
      loginRules: {
        loginId: [{ required: true, trigger: 'blur', validator: validateUsername }],
        loginPwd: [
          { required: true, trigger: 'blur', message: '请输入密码' },
          { min: 6, max: 15, trigger: 'blur', message: '请输入6-15位字符' }
        ],
        captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      captchaData: {},
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.loginPwd.focus()
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginForm.checked) {
            this.loginForm.remember = 7
          }
          this.$store.dispatch('user/login', this.loginForm).then((res) => {
            if (res.data) {
              this.$message.success("登录成功")
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            } else {
              if (typeof res === 'string') {
                this.$message.error('验证码错误')
              } else if (typeof res === 'object') {
                this.$message.error('账号或密码错误')
              }
            }
            this.loading = false
            this.getCaptchaFunc()
          }).catch(() => {
            this.loading = false
            this.getCaptchaFunc()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取验证码
    getCaptchaFunc () {
      getCaptcha().then(res => {
        this.captchaData = res.data
      })
    },
    handleCaptcha () {
      this.getCaptchaFunc()
    }
  },
  created () {
    this.getCaptchaFunc()
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .img {
    display: inline-block;
    margin-left: 10px;
    vertical-align: -17px;
    cursor: pointer;
  }
  .el-icon-picture-outline {
    font-size: 16px;
  }
  .checkbox {
    margin: 10px 0;
    color: #fff;
    font-size: 14px;
  }
  .checkbox input {
    margin-right: 5px;
    vertical-align: -2px;
  }
  .captcha {
    display: inline-block;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
