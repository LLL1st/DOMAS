<template>
  <transition v-bind:css="false" name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {
    created () {
     // 读取多语言文字
      this.getLanguageMap()
    },
    methods: {
      // 读取多语言文字
      getLanguageMap () {
        this.$http({
          url: '/sys/language/getLanguageMap'
        }).then(({data}) => {
          this.$store.commit('common/updateLanguageMap', data.languageMap)
        })
      }
    }
  }
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

</style>