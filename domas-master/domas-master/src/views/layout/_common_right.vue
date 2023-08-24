<template>
<div>
    <el-drawer
      title="页面配置"
      :visible.sync="isRightVisible"
      size="450px"
      :modal="true"
      show-close
      :with-header="true"
       class="setting-drawer-container"
      :direction="direction">
      <div class="setting-container">
     <el-form>
       <el-form-item>
        <div class="setting-group-title">导航布局</div>

          <el-radio-group v-model="defaultLayout">
            <div class="setting-layout-drawer">
              <el-radio-button  label="mix"><img class="thumbnail-layout" src="~@/assets/img/mix.png" /></el-radio-button>
            </div>
             <div class="setting-layout-drawer">
              <el-radio-button label="left"><img class="thumbnail-layout" src="~@/assets/img/side.png" /></el-radio-button>
            </div>
             <div class="setting-layout-drawer">
              <el-radio-button label="top"><img class="thumbnail-layout"  src="~@/assets/img/top.png" /></el-radio-button>
            </div>
          </el-radio-group>
       <div class="setting-group-title">主题风格</div>

      <el-radio-group v-model="navbarLayoutType">
          <div>
              <div class="setting-layout-drawer">
                <el-radio-button label="1">
                  <img class="thumbnail-layout" src="~@/assets/img/1.svg"/>
                </el-radio-button>
              </div>
              <div class="setting-layout-drawer">
                <el-radio-button label="3">
                  <img class="thumbnail-layout" src="~@/assets/img/3.svg"/>
                </el-radio-button>
              </div>
            </div>
            <div>
              <div class="setting-layout-drawer">
                <el-radio-button label="7">
                  <img class="thumbnail-layout" src="~@/assets/img/7.svg"/>
                </el-radio-button>
              </div>
              <div class="setting-layout-drawer">
                <el-radio-button label="5">
                  <img class="thumbnail-layout" src="~@/assets/img/5.svg"/>
                </el-radio-button>
              </div>
          </div>
          <div>
              <div class="setting-layout-drawer">
                <el-radio-button label="4">
                  <img class="thumbnail-layout" src="~@/assets/img/4.svg"/>
                </el-radio-button>
              </div>
              <div class="setting-layout-drawer">
                <el-radio-button label="2">
                  <img class="thumbnail-layout" src="~@/assets/img/2.svg"/>
                </el-radio-button>
              </div>
           </div>
           <div>
              <div class="setting-layout-drawer">
                <el-radio-button label="9">
                  <img class="thumbnail-layout" src="~@/assets/img/9.svg"/>
                </el-radio-button>
            </div>
            <div class="setting-layout-drawer">
              <el-radio-button label="6">
                <img class="thumbnail-layout" src="~@/assets/img/6.svg"/>
              </el-radio-button>
            </div>
         </div>

      </el-radio-group>
    </el-form-item>
     <el-form-item>
        <div class="setting-group-title">主题色</div>
          <el-radio-group v-model="defaultTheme">
          <div
            v-for="(item, index) in colorList"
            :key="index"
            class="setting-layout-drawer">
            <el-radio-button :key="index" :text-color="item.color" :fill="item.color" :label="item.color" class="setting-layout-color-group">
              <div  class="color-container"  :style="`background:${item.color}`" ></div>
            </el-radio-button>
          </div>
          <div class="setting-layout-drawer">
            <color-picker></color-picker>
          </div>
        </el-radio-group>
    </el-form-item>
    <div class="setting-group-title">其他设置</div>
    <el-form-item label="多页签模式"  class="title-setting">
       <el-switch
          v-model="isTab">
        </el-switch>
    </el-form-item>
  </el-form>
      </div>
    </el-drawer>
</div>
</template>

<script>
  import ColorPicker from '@/components/colors/ColorPicker'
  import theme from '@/components/colors/mixins/theme'
  export default {
    mixins: [theme],
    data () {
      return {
        isRightVisible: false,
        direction: 'rtl',
        LAYOUT_OPTION: ['side', 'top', 'mix'],
        colorList: [
          {
            key: '拂晓蓝（默认）', color: '#155eff', label: '1'
          },
          {
            key: '薄暮', color: '#F5222D', label: '2'
          },
          {
            key: '火山', color: '#FA541C', label: '3'
          },
          {
            key: '日暮', color: '#FAAD14', label: '4'
          },
          {
            key: '明青', color: '#13C2C2', label: '5'
          },
          {
            key: '极光绿', color: '#52C41A', label: '6'
          },
          {
            key: '极客蓝', color: '#2F54EB', label: '7'
          },
          {
            key: '酱紫', color: '#722ED1', label: '8'
          },
          {
            key: '天空蓝', color: '#3e8df7', label: '9'
          }
          // {
          //   key: '咖啡色', color: '#9a7b71'
          // },
          // {
          //   key: '深湖蓝', color: '#07b2d3'
          // },
          // {
          //   key: '原谅绿', color: '#0cc26c'
          // },
          // {
          //   key: '古铜灰', color: '#757575'
          // },
          // {
          //   key: '珊瑚紫', color: '#6779fa'
          // },
          // {
          //   key: '橙黄', color: '#eb6607'
          // },
          // {
          //   key: '粉红', color: '#f74584'
          // },
          // {
          //   key: '青紫', color: '#9463f7'
          // },
          // {
          //   key: '橄榄绿', color: '#16b2a3'
          // }
        ]
      }
    },
    components: {
      ColorPicker
    },
    computed: {
      defaultLayout: {
        get () {
          return this.$store.state.config.defaultLayout
        },
        set (val) {
          localStorage.setItem('defaultLayout', val)
          this.$store.commit('config/updateDefaultLayout', val)
        }
      },
      navbarLayoutType: {
        get () {
          return this.$store.state.common.navbarLayoutType
        },
        set (val) {
          localStorage.setItem('navbarLayoutType', val)
          this.$store.commit('common/updateNavbarLayoutType', val)
          localStorage.setItem('sidebarLayoutSkin', val)
          this.$store.commit('common/updateSidebarLayoutSkin', val)
        }
      },
      isTab: {
        get () {
          return this.$store.state.common.isTab
        },
        set (val) {
          localStorage.setItem('isTab', val)
          this.$store.commit('common/updateIsTab', val)
        }
      },
      defaultTheme: {
        get () {
          return this.$store.state.config.defaultTheme
        },
        set (val) {
          localStorage.setItem('defaultTheme', val)
          this.$events.$emit('updateTheme', val)
          return this.$store.commit('config/updateDefaultTheme', val)
        }
      }
    },
    methods: {
      showRight () {
        this.isRightVisible = true
      }
    }
  }
</script>
<style lang="less">


.setting-layout-color-group {


  .el-radio-button__inner{
      display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 50% !important;
    padding: 3px !important;
    }
}


.setting-group-title {
  font-size: 14px;
  line-height: 22px;
  margin: 32px 0 24px 0;
  text-align: left;
  font-family: PingFang SC;
  font-style: normal;
  font-weight: 500;
  color: #000000e6;
}


.setting-drawer-container {

    .el-drawer__header {
        padding:  15px;
        border-bottom: 1px solid #e7e7e7;
        border-radius: 2px 2px 0 0;
        margin-bottom: 10px;
    }


    .setting-container {
      padding: 0px 16px 100px 16px ;
      overflow: auto;
      flex: 1;
    }

  .el-radio-group {
    display: inline-flex;
    align-items: center;
    width: fit-content;
  }

  .thumbnail-layout{
    // width: 88px;
    height: 48px;
}

.color-container {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: inline-block;
}
  .setting-layout-drawer {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 1px;
  }

.setting-layout-color-group {
    display: inline-flex;
    width: 36px;
    height: 36px;
    justify-content: center;
    align-items: center;
    border-radius: 50% !important;
    padding: 6px !important;
    border: 2px solid transparent !important;
}
  .el-radio-button__inner {
    padding: 6px;
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background-color: #ffffff;
  }
// .el-radio-button__inner {
//     border: 2px solid;
// }

  .el-radio-group.el-size-m {
    min-height: 32px;
    width: 100%;
    height: auto;
    justify-content: space-between;
    align-items: center;
  }

  .setting-layout-drawer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;

    .el-radio-button {
      display: inline-flex;
      // max-height: 78px;
      padding: 8px;
      // border-radius: @border-radius;
      // border: 2px solid @component-border;

      // &:last-child {
      //   border-right: 2px solid transparent;
      // }

      > .el-radio-button__label {
        display: inline-flex;
      }
    }

    .el-is-checked {
      border: 2px solid red !important;
    }

    .el-form__controls-content {
      justify-content: end;
    }
  }

}



</style>
