<template>
    <el-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{
        padding: '20px',
      }"
    >
      <template #title>
        {{ $t2('workplace.categoriesPercent') }}
      </template>
    <ve-ring
      :data="chartData"
      :legend="activeOption.legend"
      :grid="activeOption.grid" 
      :extend="activeOption.extend"
      :tooltip="activeOption.tooltip"
      :colors="activeOption.colors"
      :title="activeOption.title"
      height="390px"
      >
    </ve-ring>
  </el-card>
</template>

<script>
    export default {
      data () {
        return {
          chartData: {
            'columns': ['name', 'num'],
            'rows': [
            {'name': '汉族', 'num': 91},
            {'name': '回族', 'num': 431},
            {'name': '满族', 'num': 111},
            {'name': '其他', 'num': 132}]
          },
          activeOption: {
            title: {
              show: true,
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
              show: true,
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
                    show: true,
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
            colors: ['#21CCFF', '#259EFF', '#313CA9', '#1B94DE', '#e96d5b']
          }
        }
      }
    }
</script>

<style scoped lang="less"></style>
