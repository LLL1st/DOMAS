<template>
  <div class="banner">
    <div class="banner-inner">
      <el-carousel class="carousel" :interval="5000" arrow="always">
        <el-carousel-item v-for="item in carouselItem" :key="item.slogan">
           <div :key="item.slogan" class="carousel-item">
            <div class="carousel-title">{{ item.slogan }}</div>
            <div class="carousel-sub-title">{{ item.subSlogan }}</div>
             <img class="carousel-image" :src="item.image" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
import bannerImage from '@/assets/img/login-banner.png'

export default {
  computed: {
    carouselItem () {
      return [
        {
          slogan: '场景一：xx',
          subSlogan: '请介绍你的产品',
          image: bannerImage
        },
        {
          slogan: '场景二：xx',
          subSlogan: '请介绍你的产品',
          image: bannerImage
        },
        {
          slogan: '场景三: xx',
          subSlogan: '请介绍你的产品',
          image: bannerImage
        }
      ]
    }
  }
}
</script>

<style lang="less">
  .banner {
    display: flex;
    align-items: center;
    justify-content: center;

    &-inner {
      flex: 1;
      height: 100%;
    }
  }

  .carousel {
    height: 100% !important;

    .el-carousel__container {
        position: relative;
        height: 100% !important;
    }
    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    &-title {
      color: #f7f8fa;
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }

    &-sub-title {
      margin-top: 8px;
      color: #86909c;
      font-size: 14px;
      line-height: 22px;
    }


    &-image {
      width: 320px;
      margin-top: 30px;
    }
  }
</style>
