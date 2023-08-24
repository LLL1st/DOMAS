<template>
  <el-card  :body-style="{ paddingTop: '0px', }"> 
    <div slot="header"  :style="{ paddingBottom: '0' }">
      <span>{{$t2('workplace.contentData')}}</span>
      <el-button style="float: right; padding: 3px 0" type="text">{{ $t2('workplace.viewMore') }}</el-button>
    </div>
      <ve-line
        :data="chartData"
        :legend="activeOption.legend"
        :grid="activeOption.grid" 
        :extend="activeOption.extend"
        :tooltip="activeOption.tooltip"
        :colors="activeOption.colors"
        :title="activeOption.title"
        height="365px"
        >
    </ve-line>
  </el-card>
</template>

<script>
    export default {
      data () {
        return {
          chartData: {
            'columns': ['name', 'num'],
            'rows': [
            {'name': '报纸', 'num': 191},
            {'name': '杂志', 'num': 231},
            {'name': '电台', 'num': 411},
            {'name': '网络', 'num': 232}]
          },
          activeOption: {
            title: {
              show: false,
              text: '',
              left: 'auto',
              textStyle: {
                color: '#333',
                fontSize: 18
              },
              subtext: '',
              subtextStyle: {
                color: '#aaa',
                fontSize: 12
              }
            },
            tooltip: {
              textStyle: {
                color: '#fff',
                fontSize: 14
              }
            },
            grid: {
              left: 10,
              top: 60,
              right: 10,
              bottom: 60
            },
            legend: {
              show: false,
              orient: 'horizontal',
              textStyle: {
                fontSize: 11,
                color: '#333'
              }
            },
            extend: {
              series: {
                label: {
                  normal: {
                    show: false,
                    position: 'insideRight',
                    fontSize: 12,
                    color: '#333',
                    fontWeight: 'normal'
                  }
                },
                barMaxWidth: 0,
                barMinHeight: 0
              }
            },
            colors: ['#259EFF', '#313CA9', '#1B94DE', '#e96d5b']
          }
        }
      }
    }
</script>


<style scoped lang="less"></style>
