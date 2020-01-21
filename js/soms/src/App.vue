<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'App',
  mounted() {
    $('body').off('keyup').on('keyup', keyup9)

    function keyup9(event) {
      if (event.keyCode === 9 && $('#app').siblings('.el-dialog__wrapper').css('display') === 'block') {
        console.log($(document.activeElement))
        if ($(document.activeElement).parents('.el-dialog__wrapper').length === 0) {
          $('#app').siblings('.el-dialog__wrapper').find('input').eq(0).focus()
        }
      }
    }
  }
}
</script>
