<template>
  <div class="dashboard-container">
    <!--表单组件-->
    <eForm ref="form"/>
    <div class="dashboard-editor-container">
      <!--<panel-group/>-->

      <!--<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
      <!--<line-chart/>-->
      <!--</el-row>-->
      <!--<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;height: 150px">-->
        <!--<div style="margin-bottom: 5px"><span>我的通知中心</span></div>-->
        <!--<div style="width: 100%;height: 180px">-->
          <!--<router-link to="system/message" style="margin-bottom: 5px; margin-top: 15px; width: 10%;border: 0;border-radius: 3px;" class="el-button el-button&#45;&#45;success">待处理审批消息  {{ messageCount }}条 </router-link>-->
        <!--</div>-->
      <!--</el-row>-->

      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;height: 150px">
        <div style="margin-bottom: 5px"><span>我的快捷入口</span> <el-button type="primary" size="mini" @click="showForm">编辑</el-button></div>
        <div style="width: 100%;height: 180px">
          <el-button v-for="(item,itemIndex) in menus" v-if="item.pid !==0 " :key="itemIndex" round type="primary" style="margin-bottom: 5px;margin-top: 15px;width: 10%" @click="toUrl(item)">{{ item.name }}</el-button>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import { count } from '@/api/visits'
import { getCurrentUser } from '@/api/user'
import { getById } from '@/api/menu'
// import { auditMessageCount } from '@/api/message'
import eForm from './form'

require('echarts/theme/macarons') // echarts theme

/**
   * 记录访问，只有页面刷新或者第一次加载才会记录
   */
count().then(res => {
})

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    eForm
  },
  data() {
    return {
      messageCount: 0,
      chart: null,
      height: '',
      width: '',
      menus: [],
      currentId: '0'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    // auditMessageCount({ status: '待审批', dealStatus: 0 }).then(res => {
    //   this.messageCount = res
    // })
    this.getCurrentUser()
  },
  mounted() {
  },
  methods: {
    showForm() {
      const _this = this.$refs.form
      const menus = this.menus
      _this.dialog = true
      const menuIds = []
      menus.forEach(function(data, index) {
        let add = true
        for (let i = 0; i < menus.length; i++) {
          if (data.id === menus[i].pid) {
            add = false
            break
          }
        }
        if (add) {
          menuIds.push(data.id)
        }
      })
      _this.menuIds = menuIds
      _this.currentId = this.currentId
    },
    getCurrentUser() {
      getCurrentUser().then(res => {
        this.menus = res.menus
        this.currentId = res.id
      })
    },
    toUrl(url) {
      getById(url.pid).then(res => {
        if (res && res.path) {
          this.$router.push('/' + res.path + '/' + url.path)
        } else {
          this.$router.push('/' + url.path)
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 18px 22px 22px 22px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  .panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shopping {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>
