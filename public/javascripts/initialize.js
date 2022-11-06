/* eslint-disable no-undef */
const middle = document.getElementById('middle')
if (middle) { middle.style.height = window.innerHeight + 'px' }

dayjs.locale('zh-tw')

dayjs.extend(window.dayjs_plugin_localizedFormat)
dayjs.extend(window.dayjs_plugin_relativeTime)
