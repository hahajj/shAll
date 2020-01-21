<template>
  <div id="pdfDiv" style="width:720px;">
    <el-button-group>
      <el-button type="primary" icon="el-icon-arrow-left" @click="onPrevPage">上一页</el-button>
      <el-button type="primary" icon="el-icon-arrow-right" @click="onNextPage">下一页</el-button>
    </el-button-group>
    &nbsp; &nbsp;
    <span>当前页: <span id="page_num"/> / <span id="page_count"/></span>
    <canvas id="the-canvas" style="width: 100%;"/>
  </div>
</template>
<script>
import PDF from 'pdfjs-dist'
PDF.disableWorker = true
// PDF.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js'
PDF.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.js'
export default {
  name: 'Pdf',
  props: ['pdfUrl'],
  data() {
    return {
      width: 100,
      pages: 0,
      pdfDoc: '',
      pageNum: 1,
      pageRendering: null,
      pageNumPending: null,
      scale: 0.83,
      canvas: document.getElementById('the-canvas')
    }
  },
  created: function() {
    this.loadFile(this.pdfUrl)
  },
  methods: {
    /* 加载PDF文件*/
    loadFile: function(url) {
      const _this = this
      PDF.getDocument(url).then(function(pdf) {
        _this.pdfDoc = pdf
        _this.pages = _this.pdfDoc.numPages
        _this.pageNum = 1
        document.getElementById('page_count').textContent = _this.pages
        // Initial/first page rendering
        _this.renderPage(_this.pageNum)
        _this.$nextTick(() => {
          _this.renderPage(1)
        })
      })
    },
    /* 渲染PDF文件*
/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
    renderPage(num) {
      const _this = this.$data
      _this.pageRendering = true
      // Using promise to fetch the page
      _this.pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport({ scale: _this.scale })
        var canvas = document.getElementById('the-canvas')
        if (canvas) {
          document.getElementById('pdfDiv').removeChild(canvas)
        }
        canvas = document.createElement('canvas')
        canvas.setAttribute('id', 'the-canvas')
        canvas.setAttribute('style', '.pdfContent')
        document.getElementById('pdfDiv').appendChild(canvas)
        canvas.height = viewport.height
        canvas.width = viewport.width
        var ctx = canvas.getContext('2d')
        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: ctx,
          viewport: viewport
        }
        var renderTask = page.render(renderContext)

        // Wait for rendering to finish
        renderTask.promise.then(function() {
          _this.pageRendering = false
          if (_this.pageNumPending !== null) {
            // New page rendering is pending
            renderPage(_this.pageNumPending)
            _this.pageNumPending = null
          }
        })
      })
      // Update page counters
      document.getElementById('page_num').textContent = num
    },

    /**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
    queueRenderPage(num) {
      debugger
      if (this.$data.pageRendering) {
        this.$data.pageNumPending = num
      } else {
        this.renderPage(num)
      }
    },
    /**
     * Displays previous page.
     */
    onPrevPage() {
      if (this.$data.pageNum <= 1) {
        return
      }
      this.$data.pageNum--
      this.queueRenderPage(this.$data.pageNum)
    },
    /**
     * Displays next page.
     */
    onNextPage() {
      debugger
      if (this.$data.pageNum >= this.pdfDoc.numPages) {
        return
      }
      this.$data.pageNum++
      this.queueRenderPage(this.$data.pageNum)
    }
  }
}
</script>
<style>
 .pdfContent{
    width: 100%;
    height: 550px;
    position: absolute;
    top:0;left:0;bottom:4rem;right:0;
    overflow: scroll;
     z-index: -1;
  }
 .icon-add,.icon-jian{
    width: 1rem;
    height: 1rem;
    position: fixed;
    right: 0.3rem;
    bottom: 3.52rem;
    z-index: 999;
  }
  .icon-jian{
    bottom: 2.22rem;
  }
</style>
