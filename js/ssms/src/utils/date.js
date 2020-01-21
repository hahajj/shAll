export function getName(iden) {
  console.log(iden)
  // 自动生成生日性别年龄
  const val = iden.length
  let sex = null
  const myDate = new Date()
  const zodiac = ['子鼠', '丑牛', '寅虎', '卯兔', '辰龙', '巳蛇', '午马', '未羊', '申猴', '酉鸡', '戌狗', '亥猪']
  const month = myDate.getMonth() + 1
  const day = myDate.getDate()
  let birth = null
  let age = 0
  if (val === 18) {
    age = myDate.getFullYear() - iden.substring(6, 10) - 1
    sex = iden.substring(16, 17)
    birth = iden.substring(6, 10) + '-' + iden.substring(10, 12) + '-' + iden.substring(12, 14)
    if (iden.substring(10, 12) < month || iden.substring(10, 12) === month && iden.substring(12, 14) <= day) age++
  }
  if (val === 15) {
    age = myDate.getFullYear() - iden.substring(6, 8) - 1901
    sex = iden.substring(13, 14)
    birth = '19' + iden.substring(6, 8) + '-' + iden.substring(8, 10) + '-' + iden.substring(10, 12)
    if (iden.substring(8, 10) < month || iden.substring(8, 10) === month && iden.substring(10, 12) <= day) age++
  }
  if (sex % 2 === 0) { sex = 1 } else { sex = 0 }
  this.formInfo.sex = sex.toString()
  this.formInfo.age = age
  this.formInfo.birthday = birth
  this.formInfo.nativePlace = this.area[iden.substring(0, 2)]
  // 生日初想法
  // const happybirth = (+iden.substring(10,12))
  // if( happybirth - month < 0){ alert('生日已过')}
  // 计算生肖 得到年份设定从1804开始计算
  this.formInfo.animalZodiac = zodiac[(iden.substring(6, 10) - 1804) % 12]
  // this.getDataInfo()
}

