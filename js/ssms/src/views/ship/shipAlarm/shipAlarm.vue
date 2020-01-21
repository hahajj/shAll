<template>
  <div :style="{width:(!show?0:'')}" style="position: relative">
    <span :class="{'el-icon-caret-left':show,'el-icon-caret-right':!show}" style="position: absolute;right: 0;background: #d7d7d7;width: 16px;height: 42px;text-align: center;cursor: pointer;line-height: 42px" @click="show=!show"/>

    <transition name="breadcrumb">
      <div v-show="show" style="height: 330px;">
        <el-card id="shipAlarmCard" class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span style="font-weight: 700;    font-size: 15px;" @click="linkToNews()">告警信息</span>
            <el-button style="float: right; padding: 3px 0;    font-size: 15px;" type="text" @click="linkToNews()">更多>>
            </el-button>
          </div>
          <div style="height: 250px;overflow-y: auto">
            <div v-for="item in data" :key="item.id" class="text item" style="margin-bottom: 5px;font-size: 10px">
              <p>{{ parseTime(item.createdDate) }}</p>
              <p style="color:#ff6600"> 消息：{{ item.alarmMsg }}</p>
            </div>
          </div>
        </el-card>
      </div>
    </transition>
  </div>

</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { operateShipStatus } from '@/api/ship'
import { parseTime, parseTimeNoMin, formatJson } from '@/utils/index'

export default {
  mixins: [initData],
  data: function() {
    return {
      show: true,
      shipData: [],
      sort: 'shipAlarmId,desc' // 默认排序
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    parseTimeNoMin,
    formatJson,
    operateShipStatus,
    linkToNews() {
      this.$router.push({ path: '/system/shipAlarm' })
    },
    beforeInit() {
      const sort = this.sort
      this.url = 'api/shipAlarm'
      // status: 'UNPROCESSED'
      this.params = { page: this.page, size: this.size, sort: sort }
      return true
    }
  }
}
</script>

<style scoped>
  #shipDeit .el-button {
    margin: 0 !important;
  }

  .box-card {
    width: 100%;
  }

</style>
<style>
  #shipAlarmCard .el-card__body {
    padding: 0px 0px 0px 20px!important;
  }
</style>
