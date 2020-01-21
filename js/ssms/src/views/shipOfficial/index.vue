<template>
  <div class="app-container">
    <div class="head-container" style="padding-bottom: 0"/>
    <el-row>
      <el-col :span="12" style="height: 360px">
        <div class="grid-content bg-purple-dark"/>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span @click="linkToNews('news')">航道新闻</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="linkToNews('news')">更多>></el-button>
          </div>
          <div v-for="item in news" :key="item.id" class="text item">
            <router-link :to="'./newsDetail?id='+item.id">{{ item.title }}</router-link>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" style="height: 360px">
        <div class="grid-content bg-purple-dark"/>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span @click="linkToNews('dynamic')">航道维护</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="linkToNews('dynamic')">更多>></el-button>
          </div>
          <div v-for="item in dynamic" :key="item.id" class="text item">
            <router-link :to="'./newsDetail?id='+item.id">{{ item.title }}</router-link>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" style="height: 360px;margin: 10px 0 0 0;">
        <div class="grid-content bg-purple-dark"/>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span @click="linkToNews('hdjs')">航道建设</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="linkToNews('hdjs')">更多>></el-button>
          </div>
          <div v-for="item in hdjs" :key="item.id" class="text item">
            <router-link :to="'./newsDetail?id='+item.id">{{ item.title }}</router-link>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" style="height: 360px;margin: 10px 0 0 0;">
        <div class="grid-content bg-purple-dark"/>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span @click="linkToNews('hangye_news')">行业动态</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="linkToNews('hangye_news')">更多>>
            </el-button>
          </div>
          <div v-for="item in hangyeNews" :key="item.id" class="text item">
            <router-link :to="'./newsDetail?id='+item.id">{{ item.title }}</router-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { shipOfficialAnnouncement } from '@/api/shipOfficial'

export default {
  name: 'Map',
  components: {},
  data() {
    return {
      news: [],
      dynamic: [],
      hdjs: [],
      hangyeNews: [],
      sort: 'newsDate,desc'

    }
  },
  created() {
  },
  mounted() {
    shipOfficialAnnouncement({ page: 0, size: 7, announceType: 'news', sort: this.sort }).then(res => {
      this.news = res.content
    })
    shipOfficialAnnouncement({ page: 0, size: 7, announceType: 'dynamic', sort: this.sort }).then(res => {
      this.dynamic = res.content
    })
    shipOfficialAnnouncement({ page: 0, size: 7, announceType: 'hdjs', sort: this.sort }).then(res => {
      this.hdjs = res.content
    })
    shipOfficialAnnouncement({ page: 0, size: 7, announceType: 'hangye_news', sort: this.sort }).then(res => {
      this.hangyeNews = res.content
    })
  },
  methods: {
    linkToNews(type) {
      this.$router.push({ path: 'news', query: { type: type }})
    }

  }

}
</script>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .clearfix span {
    cursor: pointer;
  }

  .box-card {
    width: 80%;
  }

  .newsSpan {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    display: inline-block;
  }
</style>
