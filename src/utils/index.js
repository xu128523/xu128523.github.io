function toDate(obj) {
  if (!obj) {
    return null
  }
  if (typeof obj !== 'object') {
    if (('' + obj).length === 10) obj = parseInt(obj) * 1000
    if (typeof obj === 'string') obj = obj.replace(/\-/g, '/') // 苹果手机日期转换兼容
    obj = new Date(obj)
  }
  return obj
}

export { toDate }

// 日期格式化
export function formatDate(date0, fmt) {
  if (!date0) return ''
  if (typeof date0 === 'string') {
    date0 = date0.replace(/(:\d+)\.\d+$/, '$1'); // IE 不能转换2017-12-28 10:43:02.0
    date0 = date0.replace(/\-/g, '/') // 苹果手机日期转换兼容
  }
  let date = new Date(date0);
  if (isNaN(date.getDay())) return date0 || ''
  if (!fmt) fmt = 'yyyy-MM-dd HH:mm:ss';
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  o['H+'] = o['h+'];
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeft(str));
    }
  }
  return fmt;
}

export function padLeft(str, length = 2, pad = '0') {
  return (new Array(length).fill(pad).join('') + str).substr(str.length)
}

