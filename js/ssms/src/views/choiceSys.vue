<template>
  <div style="background-image: url(/static/img/bg.28bbceb.jpeg);background-size: cover; height: 100%;">
    <span style="position: absolute; right: 0;font-size: 20px;color: #fff;">欢迎您,{{ $store.state.user.user.username }}<navbar style="display: inline;" /></span>
    <div class="wscn-http404-container">
      <div class="wscn-http404">
        <span style="font-weight: 600;font-size: 25px"> 南京盛航海运股份有限公司   综合信息管理系统v1.0</span>
        <div style="display: flex; margin-top: 20px;height: 450px;flex-wrap: wrap;background: #fff;opacity: 0.8; padding: 50px 10px 0 10px;">
          <transition name="el-zoom-in-center">
            <a v-show="show" class="transition-box" href="/">soms系统
            </a>
          </transition>
          <transition name="el-zoom-in-center">
            <a v-show="show" class="transition-box" href="/spms">spms系统</a>
          </transition>
          <transition name="el-zoom-in-center">
            <div tabindex="0" class="el-upload el-upload--text"><i class="el-icon-plus avatar-uploader-icon"/></div>
          </transition>

          <img class="pic-404__child left" src="@/assets/404_images/404_cloud.png" alt="404">
          <img class="pic-404__child mid" src="@/assets/404_images/404_cloud.png" alt="404">
          <img class="pic-404__child right" src="@/assets/404_images/404_cloud.png" alt="404">
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { Navbar } from '../layout/components'

export default {
  name: 'Sys',
  components: {
    Navbar
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    message() {
      return '网管说这个页面你不能进......'
    }
  },
  mounted() {
    this.show = true
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .avatar-uploader-icon {
    cursor: pointer;
    font-size: 28px;
    color: rgb(140, 147, 157);
    width: 78px;
    height: 78px;
    line-height: 78px;
    text-align: center;
    font-family: element-icons !important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    line-height: 78px;
  }

  .el-upload {
    width: 78px;
    height: 78px;
    border: 1px solid #72aeec;
    position: relative;
    border-radius: 8px;
    margin-top: 10px;
    margin-left: 125px;
  }

  .el-upload:focus {
    border-color: #409eff;
    border-top-color: rgb(64, 158, 255);
    border-right-color: rgb(64, 158, 255);
    border-bottom-color: rgb(64, 158, 255);
    border-left-color: rgb(64, 158, 255);
    color: #409eff;
    border: 1px dashed;

  }

  .wscn-http404-container {
    transform: translate(-50%, -50%);
    position: absolute;
    top: 35%;
    left: 50%;
  }

  .wscn-http404 {
    position: relative;
    width: 1200px;
    height: 400px;
    padding: 0 50px;
    overflow: hidden;
    text-align: center;
    .pic-404 {
      position: relative;
      float: left;
      width: 600px;
      overflow: hidden;
      padding-top: 50px;
      &__parent {
        width: 100%;
      }
      &__child {
        position: absolute;
        &.left {
          width: 80px;
          top: 17px;
          left: 220px;
          opacity: 0;
          animation-name: cloudLeft;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }
        &.mid {
          width: 46px;
          top: 10px;
          left: 420px;
          opacity: 0;
          animation-name: cloudMid;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1.2s;
        }
        &.right {
          width: 62px;
          top: 100px;
          left: 500px;
          opacity: 0;
          animation-name: cloudRight;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }
      }
    }
  }

  .transition-box {
    margin-bottom: 10px;
    min-width: 200px;
    min-height: 100px;
    max-height: 100px;
    border-radius: 4px;
    background-color: #72aeec;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-right: 35px;
    cursor: pointer;
    flex: 1;
    width: 30%;
    min-width: 30%;
    max-width: 30%;
  }

  .transition-box:active {
    color: #72aeec;
    border-radius: 5px;
    background: #000000;
    opacity: 0.5;

  }
</style>
