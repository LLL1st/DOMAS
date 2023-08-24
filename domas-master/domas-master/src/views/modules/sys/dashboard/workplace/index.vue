<template>
  <div class="container">
    <div class="left-side">
      <h1>欢迎使用DOMAS系统</h1>
      <h2>Data Organization Management Access Software</h2>
      <div class="panel">

<!--          <Banner />-->
<!--          <DataPanel />-->
<!--          <ContentChart />-->

      </div>
<!--      <el-row :gutter="16"  style="margin-top: 16px">-->
<!--        <el-col-->
<!--          :span="12"-->
<!--        >-->
<!--          <PopularContent />-->
<!--        </el-col>-->
<!--        <el-col-->
<!--          :span="12"-->
<!--        >-->
<!--          <CateforiesPercent />-->
<!--        </el-col>-->
<!--      </el-row>-->
    </div>
<!--    <div class="right-side">-->
<!--      <el-row :gutter="16">-->
<!--        <el-col class="panel" :span="24">-->
<!--          <Carousel />-->
<!--        </el-col>-->
<!--        <el-col class="panel" :span="24">-->
<!--          <Announcement />-->
<!--        </el-col>-->
<!--        <el-col :span="24">-->
<!--          <div class="panel moduler-wrap">-->
<!--            <RecentlyVisited />-->
<!--          </div>-->
<!--        </el-col>-->
<!--        <el-col :span="24">-->
<!--          <div class="panel moduler-wrap">-->
<!--            <QuickOperation />-->
<!--          </div>-->
<!--        </el-col>-->
<!--        <el-col class="panel" :span="24">-->
<!--          <Docs />-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </div>-->
  </div>

</template>

<script>
import Banner from './components/banner.vue'
import DataPanel from './components/data-panel.vue'
import ContentChart from './components/content-chart.vue'
import PopularContent from './components/popular-content.vue'
import CateforiesPercent from './components/categories-percent.vue'
import RecentlyVisited from './components/recently-visited.vue'
import QuickOperation from './components/quick-operation.vue'
import Announcement from './components/announcement.vue'
import Carousel from './components/carousel.vue'
import Docs from './components/docs.vue'
import Footer from '@/components/footer/index.vue'
export default {
  name: 'Dashboard', // If you want the include property of keep-alive to take effect, you must name the component
  components: {
    Banner,
    DataPanel,
    ContentChart,
    PopularContent,
    CateforiesPercent,
    RecentlyVisited,
    QuickOperation,
    Announcement,
    Carousel,
    Docs,
    Footer
  }
}
</script>

<style lang="less" scoped>
  .container {
    background-color: #f2f3f5;
    // padding: 16px 20px;
    padding: 1px 5px;
    padding-bottom: 0;
    display: flex;
  }

  .left-side {
    flex: 1;
    overflow: hidden;
    .panel{
       background-color: #fff;
    }

  }

  .right-side {
    width: 280px;
    margin-left: 16px;
  }

  .panel {
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  ::v-deep(.panel-border) {
    margin-bottom: 0;
    border-bottom: 1px solid rgb(242,243,245);
  }
  .moduler-wrap {
    border-radius: 4px;
    background-color: #fff;
    ::v-deep(.text) {
      font-size: 12px;
      text-align: center;
      color: rgb(78,89,105);
    }

    ::v-deep(.wrapper) {
      margin-bottom: 8px;
      text-align: center;
      cursor: pointer;

      &:last-child {
        .text {
          margin-bottom: 0;
        }
      }
      &:hover {
        .icon {
          color: rgb(22,93,255);
          background-color: #e8f3ff;
        }
        .text {
          color: rgb(22,93,255);
        }
      }
    }

    ::v-deep(.icon) {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-bottom: 4px;
      color: rgb(23,23,26);
      line-height: 32px;
      font-size: 16px;
      text-align: center;
      background-color: rgb(247,248,250);
      border-radius: 4px;
    }
  }
</style>

<style lang="less" scoped>
    .container {
      padding-bottom: 10px;
    }
  // responsive
  .mobile {
    .container {
      display: block;
      margin-bottom: 10px;
    }
    .right-side {
      // display: none;
      width: 100%;
      margin-left: 0;
      margin-top: 16px;
    }
  }
</style>
