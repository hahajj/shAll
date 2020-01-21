<template>
  <vue-easy-print id="easyPrint" ref="easyPrint" style="padding: 0px 1px 1px 1px">
    <!--卷内目录-->
    <div v-for = "(row, i) in onePageRow" :key="i" style="padding: 0 0 0 40px;width: 100%; height: 100%; page-break-after:always;display: inline-block">
      <div style="position: relative; width: 100%; height: 100%;">
        <!--表头-->
        <div style="padding: 25px 0px 0px 0px;">
          <div style="font-size: 26px; line-height: 30px; height: 30px; text-align: center;">卷 内 目 录 </div>
          <div style="font-size: 16px; line-height: 40px; height: 40px; text-align: center;">档号: {{ documentData.code }} </div>
        </div>
        <!--打印内容-->
        <el-table :data="data.slice(5*i, 5*(i+1))" :row-style="{height:170+'px'}" border style="width:708px;padding: 0 0 1px 1px">
          <el-table-column prop="index" label="序号" width="53px" align="center"/>
          <el-table-column prop="" label="文号" width="53px" align="center"/>
          <el-table-column prop="document.docCreatedOrg" width="120px" label="责任者" align="center"/>
          <el-table-column prop="name" label="文件题名" width="176.5px" align="center"/>
          <el-table-column prop="fromDate" label="文件日期" width="102px" align="center">
            <template slot-scope="scope">
              <span>{{ parseTimeNoMin(scope.row.fromDate).split('-').join('/') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pageNo" label="页号" width="80px" align="center"/>
          <el-table-column prop="comments" label="备注" width="120px" align="center"/>
        </el-table>
        <p style="position: absolute; right: 50px; bottom: 10px;">第&nbsp;&nbsp; {{ i+1 }} &nbsp;&nbsp;页</p>
      </div>
    </div>
    <!--卷内备考表-->
    <div style="padding: 25px 60px 0px 60px; page-break-after:always">
      <div style="font-size: 26px; text-align: center;">卷 内 备 考 表 </div>
      <div style="font-size: 16px; line-height: 40px; height: 40px; text-align: center;">档号: {{ documentData.code }} </div>
      <div style="border: 1px solid black; padding: 40px 60px 0 60px">
        <p>说明：</p>
        <p style="text-align: center;"> 本 卷 共： &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ documentData.copies }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 份  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ documentData.pages }}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 页 </p>
        <p style="margin: 400px 0; font-size: 16px; line-height: 40px; height: 40px; text-align: center; border-bottom: 1px solid black;">立卷人： &nbsp;&nbsp;&nbsp;{{ documentData.docCreator }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;立卷时间： &nbsp;&nbsp;&nbsp;{{ parseTimeNoMin(documentData.docCreatedDate).split('-').join('/') }}</p>
      </div>
    </div>
  </vue-easy-print>
</template>

<script>
import vueEasyPrint from 'vue-easy-print'
import { parseTimeNoMin } from '@/utils/index'
import { get } from '@/api/documentDetail'
export default {
  components: { vueEasyPrint },
  data() {
    return {
      loading: false,
      data: [],
      onePageRow: [],
      documentData: ''
    }
  },
  methods: {
    parseTimeNoMin,
    setData(data) {
      get({ page: 0, size: 9999, documentId: data.documentId }).then(res => {
        this.onePageRow.length = Math.ceil(res.content.length / 5)
        this.onePageRow.fill(Math.ceil(res.content.length / 5))
        res.content.map((v, i) => {
          v.index = i + 1
          if (i === res.content.length - 1 && v.pageNo) {
            v.pageNo = v.pageNo + '/' + (v.pageNo + v.pages - 1)
          }
        })
        // 设置空白行
        const length = res.content.length
        if (this.onePageRow.length * 5 > length) {
          for (let i = 0; i < this.onePageRow.length * 5 - length; i++) {
            res.content.push({
              index: length + i + 1,
              document: {
                docCreatedOrg: ''
              },
              name: '',
              fromDate: '',
              pageNo: '',
              comments: '',
              id: ''
            })
          }
        }
        this.data = res.content
        this.documentData = data
      })
    }
  }
}
</script>`

<style scoped>
@page{
  size: auto A4 landscape;
  margin: 0mm;
}
.el-table >>> td, .el-table >>> th.is-leaf,.el-table--border, .el-table--group{
  border-color: black;
}
</style>
