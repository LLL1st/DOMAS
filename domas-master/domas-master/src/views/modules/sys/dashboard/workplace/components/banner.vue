<template>
  <el-row class="banner">
    <el-col :span="8">
      <h3 style="margin-top: 0">
        {{ $t2('workplace.welcome') }} {{ $store.state.user.name }}
      </h3>
    </el-col>
    <el-col :span="24">
      <el-divider class="panel-border" />
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
  .banner {
    width: 100%;
    display: block;
    padding: 20px 20px 0 20px;
    background-color: #fff;
    border-radius: 4px 4px 0 0;
  }

  .panel-border {
      margin-bottom: 0;
      border-bottom: 1px solid rgb(242,243,245);
  }
  :deep(.arco-icon-home) {
    margin-right: 6px;
  }
</style>
