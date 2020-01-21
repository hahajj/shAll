<template>
  <div class="app-container">
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="createdDate" label="消息时间" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="menuName" label="审批菜单" align="center"/>
      <el-table-column prop="status" label="status" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status=='待审批'">待审批</span>
          <span v-if="scope.row.status=='审批驳回'" style="color:#FF0000">审批驳回</span>
          <span v-if="scope.row.status=='审批完成'" style="color:#42b983">审批完成</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="priority" label="审批完成时间" align="center"/>-->
      <el-table-column prop="auditFinishDate" label="审批截止时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.auditFinishDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','AUDITMESSAGE_ALL','AUDITMESSAGE_EDIT'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.dealStatus==1">已处理</span>
        <el-button v-permission="['ADMIN','AUDITMESSAGE_ALL','AUDITMESSAGE_EDIT']" v-else size="mini" type="primary" @click="linkTo(scope.row.menuUrl,scope.row.auditMessageId)">未处理</el-button></template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/circularType'
import { parseTime } from '@/utils/index'
import { updateAuditMessageDealStatus } from '@/api/message'

export default {
  components: { },
  mixins: [initData],
  data() {
    return {
      // sort: 'dealStatus', // 默认排序
      delLoading: false
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
    linkTo(menuUrl, auditMessageId) {
      updateAuditMessageDealStatus(auditMessageId).then(res => {
        this.$router.push({
          path: '/crew/' + menuUrl
        })
      })
    },
    beforeInit() {
      this.url = 'api/auditMessage'
      const sort = this.sort
      // status: '待审批',
      this.params = { page: this.page, size: this.size, sort: sort, dealStatus: 0, receiver: this.$store.state.user.user.partyDTO.partyId }
      return true
    }
  }
}
</script>

<style scoped>

</style>
