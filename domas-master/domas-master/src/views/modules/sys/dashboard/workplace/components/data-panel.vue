<template>
  <el-row :cols="24" :gutter="16" class="panel">


    <el-col class="panel-col" :span="6">   
       <statistic :start="0" :end="10000" icon="el-icon-document" :title="$t2('workplace.onlineContent')" :duration="10"/>
    </el-col>
    <el-col class="panel-col" :span="6">   
       <statistic :start="0" :end="389" icon="el-icon-document-checked" :title="$t2('workplace.putIn')" :duration="10"/>
    </el-col>
    <el-col class="panel-col" :span="6">   
       <statistic :start="0" :end="7920" icon="el-icon-chat-dot-round" :title="$t2('workplace.newDay')" :duration="10"/>
    </el-col>
    <el-col class="panel-col" :span="6">   
       <statistic :start="0" :end="180" icon="el-icon-top-right" :title="$t2('workplace.newFromYesterday')" :duration="10"/>
    </el-col>
    <el-col :span="24">
      <el-divider class="panel-border" />
    </el-col>
  </el-row>
</template>

<script>
import statistic from '@/components/statistic'
export default {
  components: {
    statistic
  }
}
</script>


<style lang="less" scoped>
  .panel {
    margin-bottom: 0;
    padding: 16px 20px 0 20px;
  }
  .panel-col {
    padding-left: 43px;
    border-right: 1px solid rgb(var(--gray-2));
  }
  .col-avatar {
    margin-right: 12px;
    background-color: var(--color-fill-2);
  }
  .up-icon {
    color: rgb(var(--red-6));
  }
  .unit {
    margin-left: 8px;
    color: rgb(var(--gray-8));
    font-size: 12px;
  }
  :deep(.panel-border) {
    margin: 4px 0 0 0;
  }
</style>
