<template>
  <div :class="className" :style="{height:height,width:width,margin:'50px'}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

// const animationDuration = 3000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['新进率', '流失率', '辞职率(主动)', '劝退率']
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['6月', '7月', '8月', '9月', '10月', '11月', '12月', '年度总计'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '百分比',
            min: -0.2,
            max: 1.2,
            interval: 0.05,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '新进率',
            type: 'bar',
            barWidth: '20%',
            data: []
            // animationDuration
          },
          {
            name: '流失率',
            type: 'bar',
            barWidth: '20%',
            data: []
            // animationDuration
          },
          {
            name: '辞职率(主动)',
            type: 'line',
            data: []
            // animationDuration
          },
          {
            name: '劝退率',
            type: 'line',
            data: []
            // animationDuration
          }
        ]
      })
    }
  }
}
</script>
