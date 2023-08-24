<template>

  <el-card>
    <div slot="header" class="clearfix">
      <span>{{$t2('workplace.quick.operation')}}</span>
      <el-button style="float: right; padding: 3px 0" type="text">{{ $t2('workplace.quickOperation.setup') }}</el-button>
    </div>
    <el-row :gutter="8">
      <el-col v-for="(link, index) in links" :key="index" :span="8" class="wrapper">
        <el-link :underline="false">
          <div class="icon">
            <i :class="link.icon"></i>
          </div>
          <p class="text">
            {{ $t2(link.text) }}
          </p>
        </el-link>
      </el-col>
    </el-row>
    <el-divider class="split-line" style="margin: 0" />
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      links: [
          { text: 'workplace.contentManagement', icon: 'el-icon-tickets' },
          { text: 'workplace.contentStatistical', icon: 'el-icon-notebook-2' },
          { text: 'workplace.advanced', icon: 'el-icon-setting' },
          { text: 'workplace.onlinePromotion', icon: 'el-icon-mobile' },
          { text: 'workplace.contentPutIn', icon: 'el-icon-position' }
      ]
    }
  }
}
</script>

<style scoped lang="less">
 .wrapper {
    margin-bottom: 18px;
    text-align: center;
    a {
      height: 60px;
    }
}
 .icon {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-bottom: 4px;
    color: rgb(var(23,23,26));
    line-height: 32px;
    font-size: 16px;
    text-align: center;
    background-color: rgb(247,248,250);
    border-radius: 4px;
}
a:focus, a:hover {
    text-decoration: none;
}
 .text {
    font-size: 12px;
    text-align: center;
    // color: rgb(78,89,105);
    display: block;
    margin-top: 0;
    margin-bottom: 1em;
}
</style>
