<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="发送" name="send">
      <div>
        <div class="app-container">
          <!--工具栏-->
          <div class="head-container">
            <!-- 搜索 -->
            <el-cascader
              v-model="query.circularType"
              clearable
              :show-all-levels="false"
              :options="this.circularTypes"
              placeholder="基本参数类型"
              class="filter-item"
              @change="toQuery"
            ></el-cascader>
            <el-select
              v-model="query.partyId"
              :remote-method="remoteMethod"
              filterable
              remote
              placeholder="发送人"
              clearable
              class="filter-item"
              style="width: 200px"
            >
            <el-option
                v-for="(item, index) in partys"
                :key="item.name + index"
                :label="item.name+'/' + item.code "
                :value="item.partyId"
              />
            </el-select>
            <treeselect
              v-model="query.organizationId"
              :options="landOrganizations"
              style="width: 200px;"
              class="filter-item"
              placeholder="请选择发送部门"
              @change="toQuery"
            />
            <el-input
              v-model="query.title"
              clearable
              placeholder="发布主题搜索"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="toQuery"
            />
            <el-button
              class="filter-item"
              size="mini"
              type="success"
              icon="el-icon-search"
              @click="toQuery"
            >搜索</el-button>
            <!-- 新增 -->
            <div style="display: inline-block;margin: 0px 2px;">
              <el-button
                v-permission="['ADMIN','CIRCULAR_ALL','CIRCULAR_CREATE']"
                class="filter-item"
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click="add"
              >新增</el-button>
            </div>
          </div>
          <!--表单组件-->
          <eForm ref="form" :is-add="isAdd" />
          <!--表格渲染-->
          <el-table
            @sort-change="sortChange"
            v-loading="loading"
            :data="data"
            size="small"
            style="width: 100%;"
          >
            <el-table-column type="index" min-width="16%" label="序号" />
            <el-table-column prop="circularType" label="基本参数类别" />
            <el-table-column prop="createdDate" label="操作时间" sortable="custom">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createdDate) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="senderParty.name" label="发送人" />
            <el-table-column prop="senderParty.organization.name" label="发送部门" />
            <el-table-column prop="title" label="主题" />
            <el-table-column label="详情" width="150px" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="viewDetail(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <el-pagination
            :total="total"
            style="margin-top: 8px;"
            :current-page="page + 1"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"
          />
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="接收" name="receive">
      <div class="partyEn"></div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getPartysByNameOrCode } from "@/api/party";
import { getOrganizationByCriteria } from "@/api/organization";
import checkPermission from "@/utils/permission";
import initData from "@/mixins/initData";
import { del } from "@/api/circular";
import { parseTime } from "@/utils/index";
import eForm from "./form";
import { getCircularType } from "@/api/circularType";
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      sort: "circularId,desc", //默认排序
      partys: [],
      shipOrganizations: {},
      landOrganizations: {},
      delLoading: false,
      circularTypes: {}
    };
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
    debugger;
    getCircularType().then(res => {
      this.circularTypes = res.content;
    });
    this.getOrganizations();
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = "api/circular";
      const sort = this.sort;
      this.params = { page: this.page, size: this.size, sort: sort };
      const query = this.query;
      const circularType = query.circularType;
      const partyId = query.partyId;
      const organizationId = query.organizationId;
      const title = query.title;
      if (title) {
        this.params["title"] = title;
      }
      if (partyId) {
        this.params["party.party_id"] = partyId;
      }
      if (organizationId) {
        this.params["party.organization.organization_id"] = organizationId;
      }
      return true;
    },
    // 部门数据点击事件
    getOrganizations() {
      // TODO 登陆员工所在部门类型
      debugger;
      getOrganizationByCriteria({ organizationType: "SHIP_DEPT" }).then(res => {
        this.shipOrganizations = res;
      });
      getOrganizationByCriteria({ organizationType: "LAND_DEPT" }).then(res => {
        this.landOrganizations = res;
      });
    },
    getPartys(para) {
      if (!para) {
        para = "";
      }
      getPartysByNameOrCode(para)
        .then(res => {
          this.partys = res;
        })
        .catch(err => {
          console.log(err.response.data.message);
        });
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.getPartys(query);
        }, 200);
      } else {
        this.partys = [];
      }
    },
    sortChange(column, prop, order) {
      if (column.prop == null || column.order == null) {
        this.queryData.prop = "";
        this.queryData.order = "";
      } else {
        if (column.order === "ascending") this.sort = column.prop + ",asc";
        else this.sort = column.prop + ",desc";
      }
      this.init();
    },
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
      this.$refs.form.circularTypes = this.circularTypes;
      this.$refs.form.shipOrganizations = this.shipOrganizations;
    },
    handleClick(event) {},
    viewDetail(data) {
      this.isAdd = false;
      const _this = this.$refs.form;
      _this.form = {
        circularId: data.circularId,
        circularType: data.circularType,
        status: data.status,
        createdDate: data.createdDate,
        createdBy: data.createdBy,
        lastModifiedDate: data.lastModifiedDate,
        lastModifiedBy: data.lastModifiedBy,
        senderPartyId: data.senderPartyId,
        title: data.title
      };
      _this.dialog = true;
    }
  }
};
</script>

<style scoped>
</style>
