<!--suppress ALL -->
<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import {debounce} from '@/utils'
  import {getChartData} from '@/api/visits'
  import {parseTime} from '@/utils/index'
  import {getCrewWork, getCrewWorkGroupByParty} from '@/api/crewWork'

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
        default: '1200px'
      },
      autoResize: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        chart: null,
        sidebarElm: null,
        chartData: {
          visitsData: [],
          ipData: []
        },
        days: [],
        crews: [],
        data: [],
        querydate: '',
        startTime: null,
        organizationId: null,
        crewWorks: [],
        crewWorkGroupByParty: [],
        organization: {name: ''}
      }
    },
    computed: {},
    created() {
      // this.getCrewWorkGroupByParty()
      this.getDays()
      // this.getCrewWork()
    },
    mounted() {
      if (this.autoResize) {
        this.__resizeHandler = debounce(() => {
          if (this.chart) {
            this.chart.resize()
          }
        }, 100)
        window.addEventListener('resize', this.__resizeHandler)
      }

      // 监听侧边栏的变化
      this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      if (this.autoResize) {
        window.removeEventListener('resize', this.__resizeHandler)
      }

      this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

      this.chart.dispose()
      this.chart = null
    },
    methods: {
      getCrewWork() {  //startCreatedDate
        let endCreatedDate = null
        let _startTime = JSON.parse(JSON.stringify(this.startTime));
        if (this.startTime) {
          endCreatedDate = parseTime(new Date(this.startTime).setMonth(new Date(this.startTime).getMonth() + 1))
        } else {
          _startTime = '1999-10-01 00:00:00'
          endCreatedDate = new Date()
        }
        getCrewWork({
          startCreatedDate: _startTime,
          endCreatedDate: endCreatedDate,
          organizationId: this.organizationId,
          size: 9999
        }).then(res => {
          this.crewWorks = res.content
          this.data = []
          if (this.crewWorks && this.crewWorks.length != 0) {
            for (var i = 0; i < this.crewWorks.length; i++) {
              let x = new Date(this.crewWorks[i].createdDate).getDate() - 1
              let y = this.crews.indexOf(this.crewWorks[i].partyId.name)
              this.data.push([x, y, 10])
            }
            for (var i = 0; i < this.crews.length; i++) {
              let name = this.crewWorks[i].partyId.name
              let times = this.crewWorkGroupByParty[i].times
              this.crews.splice(this.crews.indexOf(this.crews[i]), 1, this.crewWorkGroupByParty[i].partyId.name + '(天数' + this.crewWorkGroupByParty[i].times + ')')
            }
          }
          this.initChart()
        })
      },
      getCrewWorkGroupByParty() {
        let endCreatedDate = null
        let _startTime = JSON.parse(JSON.stringify(this.startTime));
        if (this.startTime) {
          endCreatedDate = parseTime(new Date(this.startTime).setMonth(new Date(this.startTime).getMonth() + 1))
        } else {
          _startTime = '1999-10-01 00:00:00'
          endCreatedDate = new Date()
        }
        this.getDays(this.startTime);
        getCrewWorkGroupByParty({
          startCreatedDate: _startTime,
          endCreatedDate: endCreatedDate,
          organizationId: this.organizationId,
          size: 9999
        }).then(res => {
          if (res) {
            this.crewWorkGroupByParty = res
            this.crews = []
            for (var i = 0; i < res.length; i++) {
              this.crews.push(res[i].partyId.name)
            }
            // console.log(this.crews)
            this.getCrewWork()
          }
        })
      },
      getDays(date) {
        this.days = []
        if (date) {
          var month = new Date(date).getMonth() + 1;
          var d = new Date(new Date().getFullYear(), month, 0);
          for (var i = 0; i < d.getDate(); i++) {
            // this.days.push(month + '/' + (i+1))
            this.days.push(i + 1)
          }
        } else {
          var month = new Date().getMonth();
          var d = new Date(new Date().getFullYear(), month, 0);
          for (var i = 0; i < d.getDate(); i++) {
            // this.days.push(month + '/' + (i+1))
            this.days.push(i + 1)
          }
        }

      },
      sidebarResizeHandler(e) {
        if (e.propertyName === 'width') {
          this.__resizeHandler()
        }
      },
      setOptions({visitsData, ipData} = {}) {
        this.chart.setOption({
          title: {
            top: 0,
            left: 'center',
            text: this.organization.name + this.querydate + '考勤图表'
          },
          //设置鼠标悬浮展示数据格式与内容
          // tooltip: {
          //   position: 'top',
          // },
          animation: false,
          grid: {
            height: '50%',
            y: '10%'
          },
          xAxis: {
            axisLabel: {
              interval: 0
            },
            type: 'category',
            data: this.days,
            splitArea: {
              show: true
            }
          },
          yAxis: {
            type: 'category',
            data: this.crews,
            splitArea: {
              show: true
            }
          },
          // visualMap: {
          //   min: 0,
          //   max: 10,
          //   calculable: true,
          //   orient: 'horizontal',
          //   left: 'center',
          //   bottom: '15%'
          // },
          series: [{
            name: '考勤',
            type: 'heatmap',
            data: this.data,
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      }
    }
  }
</script>
