export default {
  namespaced: true,
  state: {
    smtp: '', // 邮箱服务器地址
    port: '', // 邮箱服务器端口
    mailName: '', // 系统邮箱地址
    mailPassword: '', // 系统邮箱密码

   /*
      外观配置
    */
    defaultTheme: localStorage.getItem('defaultTheme') || '#145fff', // 默认主题
    defaultLayout: localStorage.getItem('defaultLayout'),
    productName: '', // 产品名称
    logo: '' // 产品logo: '',

  },
  mutations: {
    updateDefaultTheme (state, val) {
      state.defaultTheme = val
    },
    updateDefaultLayout (state, val) {
      state.defaultLayout = val
    },
    updateProductName (state, val) {
      state.productName = val
    },
    updateLogo (state, val) {
      state.logo = val
    },
    updateConfig (state, config) {
      state.smtp = config.smtp
      state.port = config.port
      state.mailName = config.mailName
      state.mailPassword = config.mailPassword
      state.accessKeyId = config.accessKeyId
      state.accessKeySecret = config.accessKeySecret
      state.signature = config.signature
      state.templateCode = config.templateCode
      state.defaultTheme = config.defaultTheme
      state.defaultLayout = config.defaultLayout
      state.productName = config.productName
      state.logo = config.logo
    }
  }
}
