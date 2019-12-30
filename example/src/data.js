import faker from 'faker'

const ROWS_COUNT = 10
const START_DATE = new Date('2019-12-17T12:00:00')
const END_DATE = new Date('2019-12-17T15:08:00')
const COL_DURATION = 1000 * 60 * 5
const COLS_COUNT = Math.ceil((END_DATE.getTime() - START_DATE.getTime()) / COL_DURATION)

const getTitleForDate = (date) => {
  return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
}

const COLS = [...Array(COLS_COUNT).keys()].map(i => {
  const start = new Date(START_DATE.getTime() + i * COL_DURATION)
  const end = new Date(START_DATE.getTime() + (i + 1) * COL_DURATION)

  return {
    key: `col-${i}`,
    title: getTitleForDate(start),
    start,
    end
  }
})

const ROWS = [...Array(ROWS_COUNT).keys()].map(i => {
  const title = `row ${i}`

  const elements = [...Array(i + 1).keys()].map(i => {
    const offset = i * 2 + 2
    const duration = i * 10 + 15

    const start = new Date(START_DATE.getTime() + offset * 60000)
    const end = new Date(START_DATE.getTime() + (offset + duration) * 60000)

    return {
      key: `element-${i}`,
      title: `element ${i}`,
      content: faker.lorem.paragraph(),
      start,
      end
    }
  })
  return { title, key: `row-${i}`, elements }
})

export { START_DATE, END_DATE, COLS, ROWS }
