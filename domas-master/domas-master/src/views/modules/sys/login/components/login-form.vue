<template>
  <div class="login-form-wrapper">
    	<div class="login_config">
				<el-dropdown trigger="click" placement="bottom-end">
					<el-button circle>
						<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path d="M478.33 433.6l-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362L368 281.65L401.17 362z" fill="currentColor"></path><path d="M267.84 342.92a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73c39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36c-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93c.92 1.19 1.83 2.35 2.74 3.51c-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59c22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z" fill="currentColor"></path></svg>
					</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item @click.native="changeLanguage('zh')">中文</el-dropdown-item>
              <el-dropdown-item @click.native="changeLanguage('en')">EngLish</el-dropdown-item>
              <el-dropdown-item @click.native="changeLanguage('vi')">ViệtName</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
    <div class="login-form-title">{{ $t2('t_login') }}</div>
    <div class="login-form-sub-title">{{$t2('t_login_description')}}</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
       <el-form size="mini" ref="inputForm" :model="inputForm" :rules="rules" class="login-form"  @keyup.enter.native="login()" @submit.native.prevent>

              <el-form-item  prop="username">
                <el-input type="text" placeholder="请输入账号" clearable v-model="inputForm.username">
                   <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" placeholder="请输入密码" clearable v-model="inputForm.password">
                   <i slot="prefix" class="el-input__icon el-icon-female"></i>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="loading" class="login-submit" @click="login">{{$t2('t_login')}}</el-button>
              </el-form-item>
              <el-form-item>
              </el-form-item>
            </el-form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        errorMessage: '',
        time: '',
        logo: '',
        productName: '',
        loading: false,
        inputForm: {
          username: 'admin',
          password: 'admin',
          uuid: '',
          captcha: ''
        },
        rules: {
          username: [
            {required: true, message: '帐号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          captcha: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        },
        captchaPath: ''
      }
    },
    created () {
      this.getTime()
      setInterval(() => {
        this.getTime()
      }, 1000)
    },
    mounted () {
      this.$http.get('/sys/sysConfig/getConfig').then(({data}) => {
        // this.logo = data.config.logo
        this.productName = data.config.productName
      })
    },
    methods: {
      // 提交表单
      login () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: '/sys/login',
              method: 'post',
              params: {
                'userName': this.inputForm.username,
                'password': this.inputForm.password
              }

            }).then(({data}) => {
              if (data && data.success) {
                this.$cookie.set('token', data.token)
                this.$cookie.set('refreshToken', data.refreshToken)
                this.$router.push({name: 'home'})
              } else {
                this.loading = false
                // this.getCaptcha()
              }
            })
          }
        })
      },
      getTime () {
        this.time = this.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },
      // 获取验证码
      getCaptcha () {
        this.captchaPath = this.$http.BASE_URL + `/captcha.jpg`
      },
            // 切换语言
      changeLanguage (language) {
        localStorage.setItem('language', language)
        this.$store.commit('common/updateLanguage', language)
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_config {position: absolute;top:60px;right: 60px;}
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: #1d2129;
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: #86909c;
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: #86909c !important;
    }
    .login-submit{
      width: 100%;
      background: #155eff;
    }
  }
</style>
