<template>
  <div id="newsList">
    <el-table
      :data="data"
      :show-header="false"
      style="width: 100%">
      <el-table-column prop="id" >
        <template slot-scope="scope">
          <el-card class="box-card" shadow="hover" style="margin-top: 10px">
            <div slot="header" class="clearfix" style="cursor: pointer" @click="linkToOut(scope.row.outLink,scope.row)">
              <span style="color: rgb(24, 144, 255)">{{ scope.row.title }}</span>
              <el-button style="float: right; padding: 3px 0;color: #333333" type="text">{{ parseTimeNoMin(scope.row.newsDate) }}</el-button>
            </div>
            <!--<span v-if="!scope.row.outLink" class="contSpan" style="display: inline-block;overflow: hidden;max-height: 20px" v-html="scope.row.content"/>-->
          </el-card>
        </template>
      </el-table-column>
    </el-table>
    <div style="width: 100%;height: 55px">
      <!--分页组件-->
      <el-pagination
        :total="total"
        :current-page="page + 1"
        style="margin-top: 8px;float: right"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>

    <div style="padding-bottom: 30px;text-align: center">
      <span style="line-height: 34px; color: #999999;font-size: 15px;">      转载自长江航道局，如有侵权，请联系删除</span>
    </div>
  </div>

</template>

<script>
import { shipOfficialAnnouncement } from '@/api/shipOfficial'
import { parseTime, parseTimeNoMin } from '@/utils/index'
export default {
  data() {
    return {
      data: [], page: 0, size: 10, total: 0, sort: 'newsDate,desc'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    parseTime,
    parseTimeNoMin,
    init() {
      shipOfficialAnnouncement({ page: this.page, size: this.size, announceType: this.$route.query.type, sort: this.sort }).then(res => {
        this.data = res.content
        this.total = res.totalElements
      })
    },
    linkToOut(line, data) {
      if (line) {
        this.$confirm('此链接非本网站内容，将为您访问其他网站, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.open(line)
        }).catch(() => {
        })
      } else {
        this.$router.push({ path: 'newsDetail', query: { id: data.id }})
      }
    },
    pageChange(e) {
      this.page = e - 1
      this.init()
    },
    sizeChange(e) {
      this.page = 0
      this.size = e
      this.init()
    }

  }

}
</script>
<style>
  .contSpan{
     color: #999999 !important;font-size: 15px !important;
  }
  #newsList .el-card__body {
    padding: 0 !important;
  }
</style>
