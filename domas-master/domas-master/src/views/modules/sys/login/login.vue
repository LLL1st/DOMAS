<template>
  <div class="container">
    <div class="logo">
      <img
        alt="logo"
        :src="image"
        width="100px"
      />
    </div>
<!--    <LoginBanner />-->
    <div class="content">
      <div class="content-inner">
        <LoginForm />
      </div>
      <div class="footer">
        <Footer />
      </div>
    </div>
  </div>
</template>

<script>
import Footer from '@/components/footer/index.vue'
import LoginBanner from './components/banner.vue'
import LoginForm from './components/login-form.vue'
import bannerImage from '@/assets/img/DOMAS-logo.png'
export default {
  data () {
    return {
      image: bannerImage
    }
  },
  components: {
    Footer,
    LoginBanner,
    LoginForm,
    bannerImage
  }
}
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    height: 100vh;

    .banner {
      width: 550px;
      background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
    }

    .content {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding-bottom: 40px;
    }

    .footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
    }
  }

  .logo {
    position: fixed;
    top: 24px;
    left: 22px;
    z-index: 1;
    display: inline-flex;
    align-items: center;

    &-text {
      margin-right: 4px;
      margin-left: 4px;
      color: #f7f8fa;
      font-size: 20px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: 992px) {
    .container {
      .banner {
        width: 25%;
      }
    }
  }
</style>
