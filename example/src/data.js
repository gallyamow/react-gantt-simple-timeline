import faker from 'faker'

const START_DATE = new Date('2019-12-17T12:00:00')
const END_DATE = new Date('2019-12-17T18:00:00')

const COLS = [...Array(23).keys()].map(hour => {
  const start = new Date(START_DATE.getTime() + hour * 60 * 60000)
  const end = new Date(START_DATE.getTime() + (hour + 1) * 60 * 60000)

  return {
    key: `col-${hour}`,
    title: `${start.getHours()}:00`,
    start,
    end
  }
})

const ROWS = [...Array(10).keys()].map(i => {
  const title = `row ${i}`

  const elements = [...Array(i + 1).keys()].map(i => {
    const offset = i * 2 + 5
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
