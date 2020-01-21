/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time) {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    // 拼接
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  } else {
    return ''
  }
}

export function parseTimeNoMin(time) {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    // 拼接
    return year + '-' + month + '-' + day
  } else {
    return ''
  }
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 替换邮箱字符
export function regEmail(email) {
  if (String(email).indexOf('@') > 0) {
    const str = email.split('@')
    let _s = ''
    if (str[0].length > 3) {
      for (var i = 0; i < str[0].length - 3; i++) {
        _s += '*'
      }
    }
    var new_email = str[0].substr(0, 3) + _s + '@' + str[1]
  }
  return new_email
}

// 替换手机字符
export function regMobile(mobile) {
  if (mobile.length > 7) {
    var new_mobile = mobile.substr(0, 3) + '****' + mobile.substr(7)
  }
  return new_mobile
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export function downloadFiles(data, fileName) {
  console.log(fileName)
  const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 数据转换
export function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => {
    if (j === 'nextTimeDate') {
      const oldDate = new Date(parseTimeNoMin(v.lastCheckDate).replace(/\-/g, '/'))
      return parseTimeNoMin(oldDate.setMonth(parseInt(oldDate.getMonth()) + parseInt(v.checkPeriod)))
    }
    if (j.indexOf('Date') > -1 && (v[j] + '').length > 10) { // 13位为时间戳长度
      return parseTimeNoMin(v[j])
    } else {
      if (j.indexOf('equipmentPartSpecId') > -1) {
        const flag = j.replace(/equipmentPartSpecId./g, '')
        if (flag.indexOf('.') > -1) {
          if (!v['equipmentPartSpecId']) {
            return null
          } else {
            if (flag.indexOf('.') > -1) {
              if (flag.indexOf('equipmentPartInventory.') > -1) {
                const flag1 = flag.replace(/equipmentPartInventory./g, '')
                if (v['equipmentPartSpecId']['equipmentPartInventory'] === null || v['equipmentPartSpecId']['equipmentPartInventory'][flag1] === null) {
                  return null
                } else {
                  return v['equipmentPartSpecId']['equipmentPartInventory'][flag1]
                }
              }
              if (flag.indexOf('equipmentPartId.') > -1) {
                try {
                  const flag1 = flag.replace(/equipmentPartId./g, '')
                  if (flag1.indexOf('.') > -1) {
                    return v['equipmentPartSpecId']['equipmentPartId']['equipmentId']['name']
                  } else {
                    if (!v['equipmentPartSpecId']['equipmentPartId'] || !v['equipmentPartSpecId']['equipmentPartId'][flag1]) {
                      return null
                    } else {
                      return v['equipmentPartSpecId']['equipmentPartId'][flag1]
                    }
                  }
                } catch (e) {
                  console.log(v['equipmentPartSpecId'])
                }
                return null
              }
            } else {
              return null
            }
          }
        } else {
          if (v['equipmentPartSpecId']) {
            return v['equipmentPartSpecId']['unitName']
          } else {
            return null
          }
        }
      } else if (j.indexOf('equipmentPartPurchaseAudit') > -1) {
        if (!v['equipmentPartPurchaseAudit']) {
          return null
        } else {
          return v['equipmentPartPurchaseAudit']['auditStatus']
        }
      } else {
        return v[j]
      }
    }
  }))
}

// 数据转换 多层级兼容版 filterVal 匹配参数 jsonData整体数据
export function formatJsonNew(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => {
    if (j.includes('.')) {
      return formatJsonNewDiff(j, v)
    }
    if (j === 'nextTimeDate') {
      const oldDate = new Date(parseTimeNoMin(v.lastCheckDate).replace(/\-/g, '/'))
      return parseTimeNoMin(oldDate.setMonth(parseInt(oldDate.getMonth()) + parseInt(v.checkPeriod)))
    }
    if (j.includes('Date') && (v[j] + '').length > 10) { // 13位为时间戳长度
      return parseTimeNoMin(v[j])
    } else {
      return v[j]
    }
  }))
}

function formatJsonNewDiff(key, array) { // 处理对象及数组操作 数组完了！！！
  var str = key.split('.')[0]
  if (key.split('.').length > 1) {
    var newStr = key.replace(str + '.', '')
  }
  if (Array.isArray(array)) {
    return {
      children: array.map(i => {
        if (newStr) {
          return formatJsonNewDiff(newStr, i[str])
        } else {
          return i[str]
        }
      })
    }
  } else {
    if (newStr) {
      return formatJsonNewDiff(newStr, array[str])
    } else {
      if (array && array[str]) { // 判断是否存在父类 及有没有值
        if (!typeof array[str] === 'number' && (array[str].includes('Date') && (array[str] + '').length > 10)) { // 13位为时间戳长度
          return parseTimeNoMin(array[str])
        } else {
          return array[str]
        }
      } else {
        if (newArryNOparent[key]) { // 是否在配置项中
          return newArryNOparent[key].value(key)
        } else {
          return null
        }
      }
    }
  }
}

var newArryNOparent = {// 配置特殊项 返回默认值或者运行结果
  'auditStatus': {
    value: (key) => {
      return '待审批'
    }
  }, 'miniumAmount': {
    value: (key) => {
      return 0
    }
  }
}
