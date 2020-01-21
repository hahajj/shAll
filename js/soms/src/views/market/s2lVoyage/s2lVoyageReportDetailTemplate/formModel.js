export function formModel(res, _this, type) { // res整体数据，_this 指向，type为修改和查看
  _this.rules = {}
  _this.group = {}
  var obj = { detail: [] }// 计量参数
  res.content.map(value => {
    if (value.detailGroupName === '计量') {
      value.name = value.detailGroupName + ',' + value.detailKey
      if (!_this.group['计量']) {
        _this.group['计量'] = []
      }
      obj.detail.push(JSON.parse(JSON.stringify(value)))
    } else { // 不存在计量 即非停止卸货装货
      value.sort = value.sortNum
      if (type) {
        _this.formData[value.detailGroupName + ',' + value.detailKey] = value.detailValue
      } else {
        _this.formData[value.detailGroupName + ',' + value.detailKey] = ''
      }
      if (_this.group[value.detailGroupName]) {
        value.name = value.detailGroupName + ',' + value.detailKey
        _this.group[value.detailGroupName].push(value)
      } else {
        _this.group[value.detailGroupName] = []
        value.name = value.detailGroupName + ',' + value.detailKey
        _this.group[value.detailGroupName].push(value)
      }
    }
    _this.rules[ value.name] = [{ required: true, message: '请输入' + value.detailName, trigger: 'blur' }]
  })

  if (_this.group['计量']) {
    if (type) {
      var arry1 = JSON.parse(JSON.stringify(obj))
      var arryNew = []
      arry1.detail.map((item, index) => {
        if (item.detailKey === 'goodsType') {
          item.name += ',' + (arryNew.length)
          arryNew.push([item])
        } else {
          item.name += ',' + (arryNew.length - 1)
          arryNew[arryNew.length - 1].push(item)
        }
        _this.formData[item.name] = item.detailValue
        _this.rules[ item.name] = [{ required: true, message: '请输入' + item.detailName, trigger: 'blur' }]
      })
      _this.group['计量'] = arryNew
    } else {
      _this.reportObj.cargo.map((item, index) => {
        var arry1 = JSON.parse(JSON.stringify(obj))
        _this.group['计量'].push(arry1.detail.map((items, indexs) => { // 重新生成计量
          items.name = items.name + ',' + index
          items.sortNum = Number(arry1.detail[arry1.detail.length - 1].sortNum) + index * arry1.detail.length + indexs + 1
          if (indexs === 0) {
            items.detailValue = item
            items.detailGroupValue = item
            _this.formData[items.name] = item
          } else {
            items.detailGroupValue = item
            _this.formData[items.name] = ''
          }
          _this.rules[ items.name] = [{ required: true, message: '请输入' + items.detailName, trigger: 'blur' }]
          return items
        }))
      })
    }
  }
  _this.group.buttons = {
    onSubmitText: '提交',
    onResetText: '重置'
  }
  _this.config = JSON.parse(JSON.stringify(_this.group))
  _this.dialog = true
  setTimeout(() => {
    _this.configFlag = true
  }, 200)
}
