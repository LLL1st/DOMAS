<template>
  <nav ref="navbar"  :style="{ '--defaultTheme': defaultTheme}" :class="'jp-navbar  jp-navbar--' + navbarLayoutType ">
    <div class="jp-navbar__header">
      <h1 class="jp-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="jp-navbar__brand-lg" href="javascript:;"> <img :src="logo" height="40px" width="40px"/> {{productName}}</a>
        <a class="jp-navbar__brand-mini" href="javascript:;">
          <img :src="logo" height="40px" width="40px"/>
        </a>
      </h1>
    </div>
    <div class="jp-navbar__body clearfix" style="overflow:hidden">

      <el-menu
        class="jp-navbar__menu"
        mode="horizontal">
        <el-menu-item class="jp-navbar__switch"  @click="sidebarFold = !sidebarFold">
             <i  :class="sidebarFold ? 'fa fa-indent':'fa fa-outdent'"></i>
        </el-menu-item>
      </el-menu>

      <el-menu class="jp-navbar__menu " :default-active="topMenuActiveIndex" ref="topMenu"  mode="horizontal">
        <el-menu-item  class="el_menu_item" v-for="menu in topMenuList"
          :index="menu.id"
          :key="menu.id"
          @click="showLeftMenu(menu)"
          :ref="menu.id"
          :menu="menu">
           <i :class="`${menu.icon} jp-sidebar__menu-icon`" style="display: inline-block!important;"></i>
          {{$t2(menu.code) || menu.name}}
          </el-menu-item>

        <el-submenu index="2" v-if="topHideMenuList.length != 0">
          <template slot="title"><i class="fa fa-folder-open-o"></i></template>
          <el-menu-item  v-for="menu in topHideMenuList"
          :index="menu.id"
          :key="menu.id"
          :ref="menu.id"
          @click="showLeftMenu(menu)"
          :menu="menu">
           <i :class="`${menu.icon} jp-sidebar__menu-icon`" style="display: inline-block!important;"></i>
          {{$t2(menu.code) || menu.name}}
          </el-menu-item>
        </el-submenu>
        </el-menu>

      <el-menu
        class="jp-navbar__menu jp-navbar__menu--right"
        mode="horizontal">
        <el-menu-item class="jp-navbar__avatar">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
             <!-- <i class="fa fa-language" style="font-size:20px"></i> -->
             	<el-button style="width:32px"  size="mini" circle>
                 {{language}}
                <!-- <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path d="M478.33 433.6l-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362L368 281.65L401.17 362z" fill="currentColor"></path><path d="M267.84 342.92a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73c39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36c-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93c.92 1.19 1.83 2.35 2.74 3.51c-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59c22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z" fill="currentColor"></path></svg> -->
              </el-button>
             <!-- {{language}} -->
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changeLanguage('zh')">中文</el-dropdown-item>
              <el-dropdown-item @click.native="changeLanguage('en')">EngLish</el-dropdown-item>
              <el-dropdown-item @click.native="changeLanguage('vi')">ViệtName</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
        <!--<el-menu-item class="hide-sm">
          <template slot="title">
                <notice-icon
                    class="action notice"
                    :tabs="noticeTabs" >
              </notice-icon>
          </template>
        </el-menu-item>-->
        <el-menu-item class="jp-navbar__avatar">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img class="hide-sm" :src="photo === ''?'/static/img/avatar.png':photo">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
        <el-menu-item class="hide-sm"  @click="showRight">
          <template slot="title">
               <i class="el-icon-more rotate-90" @click="showRight"></i>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
  import UpdatePassword from './UpdatePassword'
  import {clearLoginInfo} from '@/utils'
  import NoticeIcon from '@/components/NoticeIcon'

  export default {
    data () {
      return {
        updatePassowrdVisible: false,
        activeIndex: '',
        topMenuList: [],
        topHideMenuList: [],
        allMenuList: [],
        screenWidth: document.body.clientWidth,
        noticeTabs: [
          {
            title: '通知',
            count: 0,
            list: [
            ],
            emptyText: '你已查看所有通知',
            emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg'
          }
        ]
      }
    },
    components: {
      UpdatePassword,
      NoticeIcon
    },
    computed: {
      navbarLayoutType () {
        return this.$store.state.common.navbarLayoutType
      },
      topMenuActiveIndex: {
        get () {
          return this.$store.state.common.topMenuActiveIndex
        },
        set (val) {
          this.$store.commit('common/updateTopMenuActiveIndex', val)
        }
      },
      sidebarFold: {
        get () {
          // 防止系统抖动
          window.v = 'IyBDb3Jkd29vZCBJSEVQQ0MgJiBOSEVQU0RDLCBDb21wdXRpbmcgQ2VudGVyLCBJbnN0aXR1dGUgb2YgSGlnaCBFbmVyZ3kgUGh5c2ljcywgQ0FTICYgTmF0aW9uYWwgSEVQIERhdGEgQ2VudGVyLiBDb3B5cmlnaHQgqTIwMjIuSUhFUENDICYgTkhFUFNEQy5BbGwgcmlnaHRzIHJlc2VydmVkLg=='
          return this.$store.state.common.sidebarFold
        },
        set (val) {
          this.$store.commit('common/updateSidebarFold', val)
        }
      },
      mainTabs: {
        get () {
          return this.$store.state.common.mainTabs
        },
        set (val) {
          this.$store.commit('common/updateMainTabs', val)
        }
      },
      userName: {
        get () {
          return this.$store.state.user.name
        }
      },
      photo: {
        get () {
          return this.$store.state.user.photo
        }
      },
      logo () {
        return this.$store.state.config.logo
      },
      defaultTheme () {
        return this.$store.state.config.defaultTheme
      },
      productName () {
        return this.$store.state.config.productName
      },
      defaultLayout () {
        return this.$store.state.config.defaultLayout
      },
      language () {
        var language = this.$store.state.common.language
        switch (language) {
          case 'zh':
            return '中'
          case 'en':
            return 'E'
          case 'vi':
            return 'V'
        }
      }
    },
    created () {
      this.allMenuList = JSON.parse(sessionStorage.getItem('allMenuList') || '[]')
      if (this.defaultLayout === 'top') {
        this.topMenuActiveIndex = this.allMenuList[0].id
        this.showLeftMenu(this.allMenuList[0])
      } else {
        this.$store.commit('common/updateLeftMenuList', this.allMenuList)
      }
      this.$http({
        url: '/notify/oaNotify/self/data?pageNo=1&pageSize=10&isSelf=true&readFlag=0',
        method: 'get'
      }).then(({data}) => {
        this.noticeTabs[0].count = data.page.count
        this.noticeTabs[0].url = '/notify/MyNotifyList'
        this.noticeTabs[0].list = data.page.list.map((item) => {
          return {
            id: item.id,
            avatar: item.createBy.photo,
            title: item.title,
            description: item.content,
            datetime: item.createDate,
            type: '通知'
          }
        })
      })
    },
    mounted () {
      if (this.defaultLayout === 'top' || this.defaultLayout === 'mix') {
        this.fixTopMenu()
      }
    },
    watch: {
      topMenuActiveIndex (val) {
        this.topMenuList.forEach((menu) => {
          if (menu.id === val) {
            this.showLeftMenu(menu)
          }
        })
        this.topHideMenuList.forEach((menu) => {
          if (menu.id === val) {
            this.showLeftMenu(menu)
          }
        })
      },
      defaultLayout (val) {
        if (this.defaultLayout === 'top' || this.defaultLayout === 'mix') {
          let needSetLeft = true
          this.allMenuList.forEach((item) => {
            if (item.id === this.topMenuActiveIndex) {
              this.showLeftMenu(item)
              needSetLeft = false
            }
          })
          if (needSetLeft) {
            this.topMenuActiveIndex = this.allMenuList[0].id
            this.showLeftMenu(this.allMenuList[0])
          }
          this.fixTopMenu()
        } else {
          this.topMenuList = []
          this.topHideMenuList = []
          this.$store.commit('common/updateLeftMenuCategory', '')
          this.$store.commit('common/updateLeftMenuList', this.allMenuList)
        }
      }
    },
    methods: {
      fixTopMenu () {
        let width = window.getComputedStyle(this.$refs.navbar).width
        let size = (parseInt(width) - 800) / 124
        this.topMenuList = []
        this.topHideMenuList = []
        this.allMenuList.forEach((item, index) => {
          if (this.defaultLayout === 'top' && index < size - 1) {
            this.topMenuList.push(item)
          } else {
            this.topHideMenuList.push(item)
          }
        })
      },
      showRight () {
        this.$emit('showRight', true)
      },
      showLeftMenu (menu) {
        this.$store.commit('common/updateLeftMenuList', menu.children)
        this.$store.commit('common/updateLeftMenuCategory', this.$t2(menu.code) || menu.name)
      },
      // 切换语言
      changeLanguage (language) {
        localStorage.setItem('language', language)
        this.$store.commit('common/updateLanguage', language)
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: '/sys/logout',
            method: 'get'
          }).then(({data}) => {
            if (data && data.success) {
              clearLoginInfo()
              if (process.env.VUE_APP_SSO_LOGIN === 'true') {
                let service = window.location.protocol + '//' + window.location.host + '/'
                window.location.href = `${process.env.VUE_APP_CAS_SERVER}/logout?service=${service}`
              } else {
                this.$router.replace({name: 'login'})
              }
            }
          })
        })
      }
    }
  }
</script>
