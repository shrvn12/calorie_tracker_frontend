// All dates are tracked by a stable "key" string: 'YYYY-MM-DD' (local time).
// Keeping a single string format avoids timezone bugs when comparing days.

const DAY_MS = 24 * 60 * 60 * 1000

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function pad(n) {
  return String(n).padStart(2, '0')
}

export function toKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayKey() {
  return toKey(new Date())
}

export function addDaysToKey(key, amount) {
  const date = fromKey(key)
  date.setDate(date.getDate() + amount)
  return toKey(date)
}

export function isFutureKey(key) {
  return key > todayKey()
}

export function isTodayKey(key) {
  return key === todayKey()
}

export function isSameMonth(key, year, month) {
  const d = fromKey(key)
  return d.getFullYear() === year && d.getMonth() === month
}

// Human label for the date navigator, e.g. "Today", "Yesterday", "Mon, 12 Jun"
export function displayLabel(key) {
  const today = todayKey()
  if (key === today) return 'Today'
  if (key === addDaysToKey(today, -1)) return 'Yesterday'
  if (key === addDaysToKey(today, 1)) return 'Tomorrow'
  const d = fromKey(key)
  return `${WEEKDAY_SHORT[d.getDay()]}, ${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`
}

export function shortDateLabel(key) {
  const d = fromKey(key)
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`
}

export function monthLabel(year, month) {
  return `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month]} ${year}`
}

// Returns a flat array of cells (length is a multiple of 7) for a calendar
// month grid. Cells outside the month are `null`.
export function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay() // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(toKey(new Date(year, month, d)))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function weekdayHeaders() {
  return WEEKDAY_SHORT
}

export function timeLabel(date = new Date()) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export { DAY_MS }
