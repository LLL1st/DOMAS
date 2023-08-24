<template>
<div class="el-scrollbar__wrap wrap-white padding-20">
  <div class="el-scrollbar__view">
  <el-tabs v-model="activeName" >
    <el-tab-pane label="单一登陆配置" name="first">
      <el-card class="box-card">
        <el-form size="mini" ref="loginFormSetting" :model="loginFormSetting">
          <el-form-item>
             <el-checkbox true-label="1" false-label="0" v-model="loginFormSetting.multiAccountLogin">单一登录</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="loginFormSetting.singleLoginType">
              <el-radio :disabled="loginFormSetting.multiAccountLogin ==='0'" label="1">后登陆踢出先登录</el-radio>
              <el-radio :disabled="loginFormSetting.multiAccountLogin ==='0'" label="2">已登陆禁止再登陆</el-radio>
            </el-radio-group>
          </el-form-item>
           <el-form-item>
            <el-button size="mini" type="primary" @click="doSubmit(loginFormSetting)">保存</el-button>
          </el-form-item>
        </el-form>


      </el-card>
    </el-tab-pane>
    <el-tab-pane label="外观配置" name="second">
      <el-card class="box-card">
        <el-form size="mini" label-width="150px" :model="themeFormSetting">
          <el-form-item label="产品标题">
            <el-input v-model="themeFormSetting.productName"></el-input>
          </el-form-item>
          <el-form-item label="产品logo">
            <el-upload
              class="avatar-uploader"
              :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=logo`"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
               :show-file-list="false">
              <img v-if="themeFormSetting.logo" :src="themeFormSetting.logo" class="avatar" style="width:50px">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="默认布局">
              <el-select v-model="themeFormSetting.defaultLayout" placeholder="请选择"  style="width: 100%;">
                <el-option
                  v-for="item in layouts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="默认主题">
            <div class="tag-group" style="margin-top:7px">
              <el-tooltip effect="dark" :content="item.key" placement="top-start" v-for="(item, index) in colorList" :key="index">
                <el-tag :color="item.color" class="themeColorTag" @click="themeFormSetting.defaultTheme = item.color">
                  <i class="el-icon-check themeColorFont" v-if="item.color === themeFormSetting.defaultTheme"></i>
                </el-tag>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item label="首页地址">
              <el-input v-model="themeFormSetting.homeUrl"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="doSubmit(themeFormSetting)">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-tab-pane>
  </el-tabs>
  </div>
</div>
</template>
<script>
  export default {
    data () {
      return {
        activeName: 'first',
        loginFormSetting: {
          multiAccountLogin: '0',
          singleLoginType: '1'
        },
        themeFormSetting: {
          defaultTheme: '#145fff',
          productName: '',
          logo: '',
          defaultLayout: '',
          homeUrl: ''
        },
        smsFormSetting: {
          accessKeyId: '',
          accessKeySecret: '',
          signature: '',
          templateCode: ''
        },
        emailFormSetting: {
          smtp: '',
          port: '',
          mailName: '',
          mailPassword: ''
        },
        colorList: [
          {
            key: '深蓝', color: '#162441'
          },
          {
            key: '深蓝', color: '#073AB1'
          },
          {
            key: '蓝紫', color: '#2E59A7'
          },
          {
            key: '浅蓝', color: '#006DCD'
          },
          {
            key: '极客蓝', color: '#2F54EB'
          },
          {
            key: '拂晓蓝（默认）', color: '#155eff'
          },
          {
            key: '天空蓝', color: '#3e8df7'
          },
          {
            key: '珊瑚紫', color: '#6779fa'
          },
          {
            key: '深湖蓝', color: '#07b2d3'
          },
          {
            key: '明青', color: '#13C2C2'
          },
          {
            key: '橄榄绿', color: '#16b2a3'
          },
          {
            key: '原谅绿', color: '#0cc26c'
          },
          {
            key: '日暮', color: '#FAAD14'
          },
          {
            key: '姜黄', color: '#D6C560'
          },
          {
            key: '黄封', color: '#CAB272'
          },
          {
            key: '米色', color: '#C7C6B6'
          },
          {
            key: '青古', color: '#B3BDA9'
          },
          {
            key: '青圭', color: '#92905D'
          },
          {
            key: '咖啡色', color: '#9a7b71'
          },
          {
            key: '古铜灰', color: '#757575'
          },
          {
            key: '龕嚴', color: '#5F766A'
          },
          {
            key: '薄暮', color: '#822327', label: '1'
          },
          {
            key: '橙红', color: '#B04552'
          },
          {
            key: '火山', color: '#A35F65', label: '2'
          }
        ],
        layouts: [
          {label: '功能菜单', value: 'mix'},
          {label: '横向菜单', value: 'top'},
          {label: '左侧菜单', value: 'left'}
        ]
      }
    },
    activated () {
      this.$http.get('/sys/sysConfig/queryById').then(({data}) => {
        this.loginFormSetting = this.recover(this.loginFormSetting, data.config)
        this.themeFormSetting = this.recover(this.themeFormSetting, data.config)
        this.smsFormSetting = this.recover(this.smsFormSetting, data.config)
        this.emailFormSetting = this.recover(this.emailFormSetting, data.config)
      })
    },
    methods: {
      handleAvatarSuccess (res, file) {
        this.themeFormSetting.logo = res.url
      },

      beforeAvatarUpload (file) {
        const isJPG = file.type.indexOf('image/') >= 0
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传LOGO只能是图片格式!')
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传LOGO大小不能超过 2MB!')
          return false
        }
        return true
      },
      doSubmit (form) {
        this.$http.post('/sys/sysConfig/save', form).then(({data}) => {
          if (data.success) {
            this.$message.success(data.msg)
            localStorage.setItem('defaultLayout', data.config.defaultLayout)
            localStorage.setItem('defaultTheme', data.config.defaultTheme)
            this.$events.$emit('updateTheme', data.config.defaultTheme)
            this.$store.commit('config/updateConfig', data.config)
          }
        })
      }
    }
  }
</script>
<style>
.themeColorTag{
  width:25px !important;
  height:25px !important;
}
 .themeColorTag.el-tag + .el-tag {
    margin-left: 5px;
    margin-bottom: 0px;
}
.themeColorFont{
  position: absolute;
  color: #fff;
  margin-top: 3px;
  margin-left: -6px;
  font-weight: bold;
  font-size: 16px;
}
</style>
