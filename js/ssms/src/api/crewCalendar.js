import request from '@/utils/request'

export function addCrewCalendar(data) {
  return request({
    url: 'api/crewCalendar',
    method: 'post',
    data
  })
}

// 获取所有的海历信息
export function getCrewCalendarByPartyId(partyId) {
  return request({
    url: 'api/crewCalendar/' + partyId,
    method: 'get'
  })
}

export function delCrewCalendar(id) {
  return request({
    url: 'api/crewCalendar/' + id,
    method: 'delete'
  })
}

export function editCrewCalendar(data) {
  return request({
    url: 'api/crewCalendar',
    method: 'put',
    data
  })
}
