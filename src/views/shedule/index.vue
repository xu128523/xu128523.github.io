<template>
    <div class="shedule-container">
        <p class="calendar-text">{{timeText}}</p>
        <table class="calendar-wrapper">
            <thead>
                <tr class="calendar-head">
                    <th class="calendar-head__item">日</th>
                    <th class="calendar-head__item">一</th>
                    <th class="calendar-head__item">二</th>
                    <th class="calendar-head__item">三</th>
                    <th class="calendar-head__item">四</th>
                    <th class="calendar-head__item">五</th>
                    <th class="calendar-head__item">六</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in currCalendar" :key="index">
                    <td v-for="(subItem, subIndex) in item" :key="subIndex"
                        class="calendar-body__item"
                        :class="{
                            'calendar-prev': subItem.isPrevMonth,
                            'calendar-curr': subItem.isCurrMonth,
                            'calendar-next': subItem.isNextMonth,
                            'calendar-active': subItem.isCurrDay,
                        }"
                        @click="currentSelect(subItem, index, subIndex)">
                        <div class="calendar-area">
                            <span class="calendar-date">{{subItem.value}}</span>
                            <!-- <span class="calendar-lunarday">{{subItem.lunarDay}}</span> -->
                            <span class="calendar-lunarday"
                                :class="{
                                  morning: subItem.shedule === 1,
                                  afternoon: subItem.shedule === 2,
                                  evening: subItem.shedule === 3,
                                  overnight: subItem.shedule === 4,
                                  rest: subItem.shedule === 5
                                }">{{subItem.shedule | transText}}</span>
                        </div>
                      </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import CalendarMixin from './calendar-mixin'
import { formatDate } from '../../utils'
import StaticSheduleData from './static-shedule'

export default {
  mixins: [CalendarMixin],
  data () {
    return {
      curYear: '',
      curMonth: '',
      curDay: '',
      firstDay: '',
      monthDay: '',
      currCalendar: [],
      timeText: '',
    }
  },
  mounted() {
    let today = new Date()
    this.curYear = today.getFullYear()
    this.curMonth = today.getMonth() + 1
    this.curDay = today.getDate()

    this.timeText = formatDate(today, 'yyyy年MM月dd日')
    this.getCalendar()
  },
  methods: {
    // 判断某年某月的1号是星期几
    getFirstDay(_year, _month) {
      let allDay = 0
      let y = _year - 1
      allDay = y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + 1
      for (let i = 1; i < _month; i++) {
        switch (i) {
          case 1: allDay += 31; break;
          case 2:
            if (this.runNian(_year)) {
              allDay += 29
            } else {
              allDay += 28
            }
            break;
          case 3: allDay += 31; break;
          case 4: allDay += 30; break;
          case 5: allDay += 31; break;
          case 6: allDay += 30; break;
          case 7: allDay += 31; break;
          case 8: allDay += 31; break;
          case 9: allDay += 30; break;
          case 10: allDay += 31; break;
          case 11: allDay += 30; break;
          case 12: allDay += 31; break;
          default:
            break;
        }
      }
      return allDay % 7
    },
    // 判断闰年
    runNian(_year) {
      if (_year % 400 === 0 || (_year % 4 === 0 && _year % 400 === 0)) {
        return true
      } else {
        return false
      }
    },
    // 获取月份天数
    getMonth(_month) {
      let monthDay = 0
      switch (_month) {
        case 1: monthDay = 31; break;
        case 2:
          if (this.runNian(this.curYear)) {
            monthDay = 29
          } else {
            monthDay = 28
          }
          break;
        case 3: monthDay = 31; break;
        case 4: monthDay = 30; break;
        case 5: monthDay = 31; break;
        case 6: monthDay = 30; break;
        case 7: monthDay = 31; break;
        case 8: monthDay = 31; break;
        case 9: monthDay = 30; break;
        case 10: monthDay = 31; break;
        case 11: monthDay = 30; break;
        case 12: monthDay = 31; break;
        // 获取上一月时，月份减 1，为0处理
        case 0: monthDay = 31; break;
      }

      return monthDay
    },
    // 当前日期日历数组
    getCalendar() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.firstDay = this.getFirstDay(this.curYear, this.curMonth)
        let currentPrevMonth = StaticSheduleData[this.curYear][this.curMonth - 1]
        let currentMonth = StaticSheduleData[this.curYear][this.curMonth]
        let currentNextMonth = StaticSheduleData[this.curYear][this.curMonth + 1]
        let arr = []
        this.monthDay = this.getMonth(this.curMonth)
        // 当月第一天前的日期
        let prevMonth = this.getMonth(this.curMonth - 1)
        for (let i = 0; i < this.firstDay; i++) {
          let item = {}
          item.isPrevMonth = true
          item.isCurrMonth = false
          item.isNextMonth = false
          item.value = prevMonth - i
          // item.lunarDay = this.getLunarDay(this.curYear, this.curMonth - 1, prevMonth - i)
          item.shedule = (currentPrevMonth && currentPrevMonth[i] && currentPrevMonth[i].status) || 0
          arr.unshift(item)
        }
        // 当月天数
        for (let n = 1; n <= this.monthDay; n++) {
          let item = {}
          item.isPrevMonth = false
          item.isCurrMonth = true
          item.isNextMonth = false
          item.value = n
          this.curDay === n ? item.isCurrDay = true : item.isCurrDay = false
          // item.lunarDay = this.getLunarDay(this.curYear, this.curMonth, n)
          item.shedule = (currentMonth && currentMonth[n - 1] && currentMonth[n - 1].status) || 0
          arr.push(item)
        }

        let row = Math.ceil(arr.length / 7)
        // 补齐下月日期
        for (let m = 1, next = 1; m <= 7; m++) {
          if (!arr[(row - 1) * 7 + m]) {
            let item = {}
            item.isPrevMonth = false
            item.isCurrMonth = false
            item.isNextMonth = true
            item.value = next
            // item.lunarDay = this.getLunarDay(this.curYear, this.curMonth + 1, next)
            item.shedule = (currentNextMonth && currentNextMonth[m - 1] && currentNextMonth[m - 1].status) || 0
            arr.push(item)
            next += 1
          }
        }

        // 循环数组
        let tempArr = []
        this.currCalendar = []
        for (let p = 1; p <= arr.length; p++) {
          tempArr.push(arr[p - 1])
          if (p % 7 === 0) {
            let item = tempArr
            this.currCalendar.push(item)
            tempArr = []
          }
        }
      }, 300)
    },
    // 选择日期
    currentSelect(item) {
      if (item.isCurrMonth) {
        for (let index1 in this.currCalendar) {
          for (let index2 in this.currCalendar[index1]) {
            if (this.currCalendar[index1][index2].value === item.value && this.currCalendar[index1][index2].isCurrMonth) {
              this.$set(this.currCalendar[index1][index2], 'isCurrDay', true)
              this.curDay = item.value
            } else {
              this.$set(this.currCalendar[index1][index2], 'isCurrDay', false)
            }
          }
        }
      } else if (item.isPrevMonth) {
        if (this.curMonth - 1 === 0) {
          this.curYear -= 1
          this.curMonth = 12
        } else {
          this.curMonth -= 1
        }
        this.curDay = item.value
        this.timeText = formatDate(`${this.curYear}-${this.curMonth}-${this.curDay}`, 'yyyy年MM月dd日')
        this.getCalendar()
      } else if (item.isNextMonth) {
        if (this.curMonth + 1 > 12) {
          this.curYear += 1
          this.curMonth = 1
        } else {
          this.curMonth += 1
        }
        this.curDay = item.value
        this.timeText = formatDate(`${this.curYear}-${this.curMonth}-${this.curDay}`, 'yyyy年MM月dd日')
        this.getCalendar()
      }
    }
  },
  filters: {
    transText(v) {
      let name = ''
      switch (v) {
        case 1: name = '早'; break;
        case 2: name = '中'; break;
        case 3: name = '晚'; break;
        case 4: name = '夜'; break;
        case 5: name = '休'; break;
        default: name = '-'; break;
      }

      return name;
    }
  }
}
</script>
<style lang="scss" scoped>
  .shedule-container {
      background-color: #f4f5f6;
  }
  .calendar-text {
      text-align: center;
      padding-top: 15px;
  }
  .calendar-wrapper {
      width: 100%;
  }
  .calendar-head__item {
      font-size: 13px;
      color: #333;
  }
  .calendar-head__item,
  .calendar-body__item {
      height: 52px;
      padding: 0;
      text-align: center;
  }
  .calendar-curr {
      cursor: pointer;
  }
  .calendar-active {
      color: #fff;
      background-color: #ed4040;
      border-radius: 30px;
  }
  .current-day {
      padding: 18px 15px;
      margin: 10px -15px 0;
      overflow: hidden;
      background-color: #fff;
  }
  .current-date {
      font-size: 16px;
      color: #333;
      float: left;
  }
  .calendar-date {
      font-size: 15px;
      color: #333;
      display: block;
      line-height: 25px;
  }
  .calendar-lunarday {
      display: block;
      font-size: 12px;
      color: #959698;
      margin-top: -5px;
      transform: scale(0.8);
  }
  .calendar-active .calendar-date,
  .calendar-active .calendar-lunarday {
      color: #fff;
  }
  .calendar-prev .calendar-date,
  .calendar-next .calendar-date,
  .calendar-prev .calendar-lunarday,
  .calendar-next .calendar-lunarday {
      color: #ddd;
  }
  // .calendar-area {
  //     height: 52px;
  // }
  .morning { color: #24cdef; }
  .afternoon { color: #025df7; }
  .evening { color: #51d023; }
  .overnight { color: #f16eba; }
  .rest { color: #ff0000; }
</style>
