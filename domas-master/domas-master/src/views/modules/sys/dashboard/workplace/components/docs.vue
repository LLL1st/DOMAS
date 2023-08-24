<template>
  <el-card > 
    <div slot="header"  :style="{ paddingBottom: '0' }">
      <span>{{$t2('workplace.docs')}}</span>
      <el-button style="float: right; padding: 3px 0" type="text">{{ $t2('workplace.viewMore') }}</el-button>
    </div>
    <el-row class="gz">
      <el-col :span="12">
        <el-link :underline="false">
          {{ $t2('workplace.docs.productOverview') }}
        </el-link>
      </el-col>
      <el-col :span="12">
        <el-link :underline="false">
          {{ $t2('workplace.docs.userGuide') }}
        </el-link>
      </el-col>
      <el-col :span="12">
        <el-link :underline="false">
          {{ $t2('workplace.docs.workflow') }}
        </el-link>
      </el-col>
      <el-col :span="12">
        <el-link :underline="false">
          {{ $t2('workplace.docs.interfaceDocs') }}
        </el-link>
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="less" scoped>
  .gz{
    .el-link {
      height: 30px;
      margin: 10px 0;
      color: rgb(78,89,105);
      display: inline-block;
      padding: 1px 4px;
      // color: rgb(22,93,255);
      font-size: 14px;
      line-height: 1.5715;
      text-decoration: none;
      background-color: transparent;
      border-radius: 2px;
      cursor: pointer;
      transition: all .1s cubic-bezier(0, 0, 1, 1);
   }
   .el-link:hover{
     background-color: #e5e6eb;
   }
  }
</style>
