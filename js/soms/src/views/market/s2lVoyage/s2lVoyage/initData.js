import { initData } from '@/api/data'

export default {
  data() {
    return {
      loading: true, data: [], page: 0, size: 10, total: 0, url: '', params: {}, query: {}, time: 170, isAdd: false
    }
  },
  methods: {
    init: async function() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        initData(this.url, this.params).then(res => {
          this.total = res.totalElements
          if (res.content) {
            this.$nextTick(() => {
              this.data = res.content.filter(item => {
                item.id = item.contractId
                item.amount = 0
                item.cargoName = []
                item.codes = ''
                item.contracts.filter((items, index) => {
                  if (index === 0) {
                    item.codes += items.code
                  } else {
                    item.codes += ',' + items.code
                  }
                  items.contractCargoInfos.filter((j, i) => {
                    item.amount += Number(j.amount)
                    // item.cargoName += i === 0 ? j.cargo.name : ',' + j.cargo.name
                    item.cargoName.push(j.cargo.name)
                  })
                  return true
                })
                item.cargoName = Array.from(new Set(item.cargoName))
                return true
              })
            })
          }
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(res)
        }).catch(err => {
          this.loading = false
          reject(err)
        })
      })
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      this.page = e - 1
      this.init()
    },
    sizeChange(e) {
      this.page = 0
      this.size = e
      this.init()
    },
    // 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
    dleChangePage(size) {
      if (size === undefined) {
        size = 1
      }
      if (this.data.length === size && this.page !== 0) {
        this.page = this.page - 1
      }
    },
    toQuery() {
      this.page = 0
      this.init()
    }
  }
}
