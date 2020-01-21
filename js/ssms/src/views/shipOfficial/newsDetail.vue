<template>
  <div>
    <div class="app-container">
      <div class="head-container" style="padding-bottom: 0;text-align: center;line-height: 35px;">
        <span style="display: inline-block;font-size: 24px;color: #183181;">{{ data.title }}</span>
        <p style="line-height: 34px; color: #999999;ont-size: 15px;"> <span style="display: inline-block" >来源：&nbsp;&nbsp;&nbsp;长江南京航道局</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;            <span style="display: inline-block">时间：&nbsp;&nbsp;&nbsp;{{ parseTimeNoMin(data.newsDate) }}</span>     </p>
      </div>

      <el-row>
        <el-col :span="20" style="padding-left: 16%;line-height: 36px;margin-top: 20px">
          <span class="TRS_Editor" v-html="data.content"/>
        </el-col>
      </el-row>
      <div style="padding-bottom: 20px;text-align: center">
        <span style="line-height: 34px; color: #999999;font-size: 15px;">      转载自长江航道局，如有侵权，请联系删除</span>
      </div>


    </div>
  </div>

</template>

<script>
import { shipOfficialAnnouncement } from '@/api/shipOfficial'
import { parseTime, parseTimeNoMin } from '@/utils/index'
export default {
  data() {
    return {
      data: {}
    }
  },
  mounted() {
    shipOfficialAnnouncement({ page: 0, size: 10, id: this.$route.query.id }).then(res => {
      this.data = res.content[0]
      console.log(this.data)
    })
  },
  methods: {
    parseTime,
    parseTimeNoMin

  }

}
</script>
<style>
  .TRS_Editor P {
    font-family: "微软雅黑"!important;
    font-size: 16px!important;
    margin-top: 1em!important;
    margin-bottom: 0em!important;
    line-height: 1.8!important;
  }
</style>
