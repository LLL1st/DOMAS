<template>
  <el-card
    :title="$t2('workplace.recently.visited')"
    :body-style="{ paddingTop: '26px' }"
  >
    <div slot="header" :style="{ paddingBottom: '0' }">
      <span>{{$t2('workplace.quick.operation')}}</span>
      <el-button style="float: right; padding: 3px 0" type="text">{{ $t2('workplace.quickOperation.setup') }}</el-button>
    </div>
    <div style="margin-bottom: -1rem">
      <el-row :gutter="8">
        <el-col v-for="link in links" :key="link.text" :span="8" class="wrapper">
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
    </div>
  </el-card>
</template>

<script>
 export default{
   data () {
     return {
       links: [
         {
           text: 'workplace.contentManagement',
           icon: 'el-icon-document'
         },
         {
           text: 'workplace.contentStatistical',
           icon: 'el-icon-s-order'
         },
         {
           text: 'workplace.advanced',
           icon: 'el-icon-setting'
         }
       ]
     }
   }
 }
</script>

<style lang="less" scoped>
 .wrapper {
    margin-bottom: 18px;
    text-align: center;
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
