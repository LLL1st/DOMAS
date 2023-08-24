<template>
  <el-card>
    <div slot="header"  :style="{ paddingBottom: '0' }">
      <span>{{$t2('workplace.announcement')}}</span>
      <el-button style="float: right; padding: 3px 0" type="text">{{ $t2('workplace.viewMore') }}</el-button>
    </div>
    <div>
      <div v-for="(item, idx) in list" :key="idx" class="item">
        <el-tag :type="item.type" size="mini">{{ item.label }}</el-tag>
        <span class="item-content">
          {{ item.content }}
        </span>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      list: [
        {
          type: 'warning',
          label: '活动',
          content: '内容最新优惠活动'
        },
        {
          type: 'success',
          label: '消息',
          content: '新增内容尚未通过审核，详情请点击查看。'
        },
        {
          type: 'primary',
          label: '通知',
          content: '当前产品试用期即将结束，如需续费请点击查看。'
        },
        {
          type: 'primary',
          label: '通知',
          content: '1月新系统升级计划通知'
        },
        {
          type: 'danger',
          label: '消息',
          content: '新增内容已经通过审核，详情请点击查看。'
        }
      ]
    }
  }
}
</script>

<style scoped lang="less">
  .item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 24px;
    margin-bottom: 4px;
    .item-content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 4px;
      color: var(--color-text-2);
      text-decoration: none;
      font-size: 13px;
      cursor: pointer;
    }
  }
</style>
