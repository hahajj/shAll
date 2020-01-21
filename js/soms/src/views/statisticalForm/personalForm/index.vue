<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="人员信息统计" name="partyInfo">
        <div>
          <el-row :gutter="20">
            <!-- 部门数据 -->
            <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
              <div class="head-container">
                <el-input v-model="partyName" clearable placeholder="输入部门名称搜索" prefix-icon="el-icon-search" style="width: 100%;" class="filter-item" @input="getDeptDatas"/>
              </div>
              <el-tree :data="partys" :props="defaultProps" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick"/>
            </el-col>
            <!-- 用户数据 -->
            <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
              <!--工具栏-->
              <div class="head-container">
                <el-input v-model="query.jobName" clearable placeholder="输入岗位名称搜索" style="width: 200px;margin-left: 10px" class="filter-item" @keyup.enter.native="toQuery"/>
                <el-input v-model="query.name" clearable placeholder="输入人员姓名搜索" style="width: 200px;margin-left: 10px" class="filter-item" @keyup.enter.native="toQuery"/>
                <el-date-picker v-model="query.startEntryDate" type="date" style="width: 200px;margin-left: 10px" class="filter-item" placeholder="选择开始日期" @keyup.enter.native="toQuery"/>
                <el-date-picker v-model="query.endEntryDate" type="date" style="width: 200px;margin-left: 10px" class="filter-item" placeholder="选择结束日期" @keyup.enter.native="toQuery"/>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" style="margin-left: 10px" @click="toQuery" >搜索</el-button>
                <!-- 导出 -->
                <div style="display: inline-block;margin-left: 10px">
                  <el-button
                    v-permission="['ADMIN','PARTY_ALL','PARTY_SELECT']"
                    :loading="downloadLoading"
                    size="mini"
                    class="filter-item"
                    type="warning"
                    icon="el-icon-download"
                    @click="download">导出</el-button>
                </div>
              </div>
              <!--表单渲染-->
              <oForm ref="formDetails" :is-details="isDetails"/>
              <!--表格渲染-->
              <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @sort-change="sortChange">
                <el-table-column type="index" label="序号"/>
                <el-table-column prop="name" label="员工姓名"/>
                <el-table-column prop="code" label="编号"/>
                <el-table-column prop="organization.name" label="部门"/>
                <el-table-column prop="job.name" label="职务"/>
                <el-table-column prop="createdDate" label="入职时间" sortable="custom">
                  <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createdDate) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="当前状态"/>
                <el-table-column v-if="checkPermission(['ADMIN','PARTY_ALL','PARTY_EDIT','PARTY_DELETE'])" label="操作" width="250px" align="center">
                  <template slot-scope="scope">
                    <div style="display: inline-block;margin: 0px 2px;">
                      <el-button v-permission="['ADMIN','PARTY_ALL','PARTY_CREATE']" class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="details(scope.row)">详情</el-button>
                    </div>
                  </template>
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
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <!--人力资源分析-->
      <el-tab-pane label="人力资源分析" name="partyEntry">
        <div>
          <!--搜索栏-->
          <el-row :gutter="20">
            <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
              <el-select v-model="query.date" clearable placeholder="输入年度搜索" style="width: 200px;margin-left: 10px" class="filter-item" @change="getRateData">
                <el-option
                  v-for="item in year"
                  :key="item"
                  :label="item"
                  :value="item"/>
              </el-select>
              <el-select v-model="query.company" clearable placeholder="输入公司搜索" style="width: 250px;margin-left: 10px" class="filter-item" @change="getCompanyId">
                <el-option
                  v-for="item in departments"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"/>
              </el-select>
              <el-cascader :options="departments" :disabled="query.company? true : false" :props="props" :show-all-levels="false" clearable filterable placeholder="输入部门搜索" style="width: 200px;margin-left: 10px" @change="getDepartmentId"/>
              <!-- 导出 -->
              <div style="display: inline-block;margin-left: 10px">
                <el-button
                  v-permission="['ADMIN','PARTY_ALL','PARTY_SELECT']"
                  :loading="downloadLoading"
                  size="mini"
                  class="filter-item"
                  type="warning"
                  icon="el-icon-download"
                  @click="downloadRate">导出</el-button>
              </div>
            </el-col>
          </el-row>
          <!--柱状折线混合图-->
          <el-row :gutter="20">
            <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
              <BarLineChart v-loading="rateLoading" ref="barline" width="1400px"/>
            </el-col>
          </el-row>
          <!--表格渲染-->
          <div style="width: 900px;margin: 0 auto;text-align: center">{{ rateDate }}年人力资源流动分析表(含月度)</div>
          <el-table v-loading="rateLoading" :data="rateData" size="small" style="width: 100%;margin-top: 20px; margin-bottom: 100px;">
            <el-table-column prop="month" label="月份" align="center"/>
            <el-table-column prop="earlyNumber" label="月初人数" align="center"/>
            <el-table-column prop="addNumber" label="期间增长" align="center"/>
            <el-table-column label="期间减少" align="center">
              <el-table-column prop="resign" label="辞职" align="center"/>
              <el-table-column prop="discourage" label="劝退" align="center"/>
              <el-table-column prop="retire" label="退休" align="center"/>
              <el-table-column prop="orther" label="其他" align="center"/>
            </el-table-column>
            <el-table-column prop="lateNumber" label="月末人数" align="center"/>
            <el-table-column prop="changeNumber" label="实际增(减)人数" align="center"/>
            <el-table-column prop="growthRate" label="增长率" align="center"/>
            <el-table-column prop="employmentRate" label="新进率" align="center"/>
            <el-table-column prop="wastageRate" label="流失率" align="center"/>
            <el-table-column prop="resignRate" label="辞职率(主动)" align="center"/>
            <el-table-column prop="discourageRate" label="劝退率" align="center"/>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import { del } from '@/api/party'
import treeTable from '@/components/TreeTable'
import checkPermission from '@/utils/permission'
import { getOrganization } from '@/api/organization'
import { downloadFile } from '@/api/employ'
import initData from '@/mixins/initData'
import { parseTime } from '@/utils/index'
import oForm from './formDetails'
import { getHr } from '@/api/statisticalForm'
import BarLineChart from './BarLineChart'
export default {
  components: { BarLineChart, oForm, treeTable },
  mixins: [initData],
  data() {
    return {
      activeName: 'partyInfo',
      sort: 'partyId,desc',
      height: document.documentElement.clientHeight - 180 + 'px;',
      dialog: false,
      delLoading: false,
      downloadLoading: false,
      rateLoading: false,
      partyName: '',
      partys: [],
      partyQueryCriteria: {
        'organizationId': '',
        'jobId': '',
        'name': ''
      },
      party: {},
      fileList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isDetails: false,
      jobs: {},
      organization: {},
      organizations: {},
      partyContents: {},
      organizationId: null,
      formLabelWidth: '120px',
      query: {
        date: '',
        company: '',
        department: '',
        departmentId: ''
      },
      rateDate: new Date().getFullYear(),
      rateData: [],
      barLineData: {
        employmentRate: [],
        wastageRate: [],
        resignRate: [],
        discourageRate: []
      },
      departments: [],
      props: {
        value: 'id',
        lable: 'lable',
        children: 'children'
      },
      year: []
    }
  },
  created() {
    this.getDeptDatas()
    this.$nextTick(() => {
      this.init()
    })
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/party'
      const sort = this.sort
      const query = this.query
      const jobId = query.jobId
      const name = query.name
      const jobName = query.jobName
      const organization = query.organization
      const organizationId = query.organizationId
      const startEntryDate = parseTime(query.startEntryDate)
      const endEntryDate = parseTime(query.endEntryDate)
      this.params = { page: this.page, size: this.size, sort: sort, organizationId: this.organizationId }
      if (organization) { this.params['organization'] = organization }
      if (organizationId) { this.params['organizationId'] = query.organizationId }
      if (jobId) { this.params['jobId'] = query.jobId }
      if (name) { this.params['name'] = name }
      if (jobName) { this.params['jobName'] = jobName }
      if (startEntryDate) {
        this.params['startEntryDateStr'] = startEntryDate
      }
      if (endEntryDate) {
        this.params['endEntryDateStr'] = endEntryDate
      }
      return true
    },
    sortChange(column, prop, order) {
      if (column.prop == null || column.order == null) {
        this.queryData.prop = ''
        this.queryData.order = ''
      } else {
        if (column.order === 'ascending') { this.sort = column.prop + ',asc' } else { this.sort = column.prop + ',desc' }
      }
      this.init()
    },
    changExpand() {
      this.expand = !this.expand
      this.init()
    },
    // 部门数据点击事件
    getDeptDatas() {
      const sort = 'organizationId,desc'
      this.params = { sort: sort, page: 0, size: 9999 }
      if (this.partyName) { this.params['name'] = this.partyName }
      getOrganization(this.params).then(res => {
        this.partys = res.content
      })
    },
    handleNodeClick(data) {
      if (data.id === 0) {
        this.organizationId = null
      } else {
        this.organizationId = data.id
      }
      this.init()
    },
    // 导出
    download() {
      let exceldata = []
      downloadFile(this.partyQueryCriteria).then(res => {
        exceldata = res
        this.downloadLoading = true
        import('@/utils/export2Excel').then(excel => {
          const tHeader = ['序号', '姓名', '编号', '部门', '职务', '人员级别', '状态', '身份证号', '性别', '年龄', '出生日期', '籍贯', '生肖', '民族', '曾用名', '政治面貌', '联系电话', '身高', '体重', '血型', '学历',
            '职业资格', '证书编号', '毕业院校', '毕业专业', '家庭住址', '实际居住地', '入职类型', '社保账号', '公积金账号', '银行类型', '银行卡号',
            '入职日期', '试用期月数', '转正日期', '离职日期', '合同到期时间', '合同到期时间提醒', '首份合同开始时间', '最近合同开始时间', '工龄信息', '生日提醒', '公司邮箱地址', '公司集团号码', '紧急联系人', '紧急联系人电话', '备注']
          const filterVal = ['index', 'name', 'code', 'organization', 'job', 'level', 'status', 'idNumber', 'sex', 'age', 'birthday', 'nativePlace', 'animalZodiac', 'nation', 'usedName', 'politicalStatus', 'contactMech', 'stature', 'weight', 'bloodType', 'education',
            'vocationalQualification', 'vocationalQualificationNo', 'school', 'major', 'homeAddress', 'residence', 'partyEntryType', 'socialSecurityAccount', 'providentFundAccount', 'bankType', 'bankAccount',
            'entryDate', 'probationMonth', 'ConversionDate', 'departureDate', 'contractExpirationDate', 'contractRemind', 'firstContractStartDate', 'contractStartDate', 'serviceLength', 'birthdayRemind', 'companyEmail', 'companyGroupPhone', 'emergencyContact', 'emergencyContactPhone', 'comments']
          const data = this.formatJson(filterVal, exceldata)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '岸基人员信息'
          })
          this.downloadLoading = false
        })
      })
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime' || j === 'lastPasswordResetTime') {
          return parseTime(v[j])
        } else if (j === 'enabled') {
          return parseTime(v[j]) ? '启用' : '禁用'
        } else {
          return v[j]
        }
      }))
    },
    // formInf数据绑定
    details(data) {
      const _this = this.$refs.formDetails
      downloadFile(this.partyQueryCriteria).then(res => {
        _this.formInfo = res.filter(v => {
          return v.code === data.code
        })[0]
        // console.log(_this.formInfo)
      })
      this.isDetails = true
      _this.dialog = true
      _this.party = data
      _this.parentData = data
    },
    // 人力资源分析
    handleClick(tab, event) {
      if (tab.label === '人力资源分析') {
        this.getRateData()
        this.getdepartment()
        for (let i = 2011; i <= 2020; i++) {
          this.year.push(i)
        }
      }
    },
    // 获取部门信息
    getdepartment() {
      const sort = 'organizationId,desc'
      this.params = { sort: sort, page: 0, size: 9999, name: '' }
      getOrganization(this.params).then(res => {
        this.departments = res.content
      })
    },
    // 获取公司id
    getCompanyId() {
      if (this.query.company) {
        this.query.departmentId = this.query.company
        this.getRateData()
      } else {
        this.query.departmentId = ''
        this.getRateData()
      }
    },
    // 获取部门id
    getDepartmentId(data) {
      if (data) {
        this.query.departmentId = data[data.length - 1]
        this.getRateData()
      } else {
        this.query.departmentId = ''
        this.getRateData()
      }
    },
    // 获取分析图表数据
    getRateData(data) {
      this.rateLoading = true
      if (this.query.date) {
        this.rateDate = this.query.date
      } else {
        this.rateDate = new Date().getFullYear()
      }
      getHr({ year: this.query.date, organizationId: this.query.departmentId }).then(res => {
        this.rateLoading = false
        // 深拷贝保留原请求值
        function deepClone(target) {
          let result
          if (target instanceof Object || target instanceof Array) {
            result = []
          } else {
            return target
          }
          for (const i in target) {
            const value = target[i]
            if (value instanceof Object || value instanceof Array) {
              result[i] = deepClone(value)
            } else {
              result[i] = value
            }
          }
          return result
        }
        const resData = deepClone(res.map(v => { return v }))
        // 将小数转换为百分比
        resData.map(item => {
          return Object.keys(item).forEach(i => {
            const reg = /Rate/ig
            if (i.search(reg) !== -1) {
              if (item[i] === 0) {
                item[i] = '0.00%'
              } else {
                item[i] = Math.floor(item[i] * 100 * 100) / 100 + '%'
              }
            }
          })
        })
        this.rateData = resData
        // 给图表赋值
        this.barLineData = {
          employmentRate: [],
          wastageRate: [],
          resignRate: [],
          discourageRate: []
        }
        for (const i of res) {
          const month = i.month.match(/\d/g).join('')
          if (month > 5 && month < 13) {
            this.barLineData.employmentRate.push(i['employmentRate'])
            this.barLineData.wastageRate.push(i['wastageRate'])
            this.barLineData.resignRate.push(i['resignRate'])
            this.barLineData.discourageRate.push(i['discourageRate'])
          }
        }
        const _this = this.$refs.barline
        _this.chart.setOption({
          series: [
            {
              name: '新进率',
              data: this.barLineData.employmentRate
            },
            {
              name: '流失率',
              data: this.barLineData.wastageRate
            },
            {
              name: '辞职率(主动)',
              data: this.barLineData.resignRate
            },
            {
              name: '劝退率',
              data: this.barLineData.discourageRate
            }
          ]
        })
      })
    },
    // 导出分析表格
    downloadRate() {
      let exceldata = []
      getHr({ year: this.query.date, organization: this.query.organization }).then(res => {
        exceldata = res
        this.downloadLoading = true
        import('@/utils/export2Excel').then(excel => {
          const tHeader = ['月份', '月初人数', '期间增长', '辞退', '劝退', '退休', '其他', '月末人数', '实际增(减)人数', '增长率', '新进率', '流失率', '辞职率(主动)', '劝退率']
          const filterVal = ['month', 'earlyNumber', 'addNumber', 'resign', 'discourage', 'retire', 'orther', 'lateNumber', 'changeNumber', 'growthRate', 'employmentRate', 'wastageRate', 'resignRate', 'discourageRate']
          const data = this.formatJson(filterVal, exceldata)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '人力资源情况分析表'
          })
          this.downloadLoading = false
        })
      })
    }
  }
}

</script>

<style scoped>

</style>
