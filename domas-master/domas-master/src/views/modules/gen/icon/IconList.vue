<template>
<div class="el-scrollbar__wrap wrap-white pdding-20">
  <div class="el-scrollbar__view">
      <el-tabs value="first" type="card">
        <el-tab-pane label="Element图标" name="first">
              <ul class="icon-list">
                <li v-for="(item, index) in iconList"
                  :key="index">
                <el-button
                type="text"
                   v-clipboard:copy="item"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError"
                  :class="{ 'is-active': item === icon }">
                  <i :class="item"></i> {{item}}
                </el-button>
                </li>
              </ul>
        </el-tab-pane>
        <el-tab-pane label="Font Awesome图标" name="second">
              <ul class="icon-list">
                <li v-for="(item, index) in iconList2"
                  :key="index">
                <el-button
                type="text"
                   v-clipboard:copy="item"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError"
                  :class="{ 'is-active': item === icon }">
                  <i :class="item"></i> {{item}}
                </el-button>
                </li>
              </ul>
        </el-tab-pane>
      </el-tabs>
</div>
</div>
</template>

<script>
  import icons from './../../../../utils/icons'
  import icons2 from './../../../../utils/icons2'
  export default {
    name: 'iconList',
    data () {
      return {
        visible: false,
        iconList: icons,
        iconList2: icons2,
        icon: ''
      }
    },
    methods: {
    // 复制成功
      onCopy (e) {
        this.$message.success('复制成功!')
      },
    // 复制失败
      onError (e) {
        this.$message.success('复制失败!')
      }
    }
  }
</script>

<style scoped>
ul{
    margin: 10px 0;
    font-size: 14px;
    color: #5e6d82;
    line-height: 2em;
}

ul.icon-list {
    overflow: hidden;
    padding: 0 0 0 20px;
    list-style: none;
    border: 1px solid #eaeefb;
    border-radius: 4px;
}
.icon-list li {
    float: left;
    width: 25%;
    text-align: left;
    height:50px;
    line-height: 50px;
    color: #666;
    font-size: 13px;
    /* border-right: 1px solid #eee; */
    /* border-bottom: 1px solid #eee; */
    margin-right: -1px;
    margin-bottom: -1px;
}
</style>
