import faker from 'faker'

const START_DATE = new Date('2019-12-17T12:00:00')
const END_DATE = new Date('2019-12-17T15:00:00')
const DURATION = END_DATE.getTime() - START_DATE.getTime()
const COL_DURATION = 1000 * 60 * 5
const COLS_COUNT = Math.ceil(DURATION / COL_DURATION)

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

const ROWS = [
  {
    title: faker.name.jobType(),
    key: `row-1`,
    elements: [
      {
        key: 'element-1',
        title: faker.name.jobTitle(),
        content: faker.lorem.paragraph(),
        start: new Date('2019-12-17T12:03:00'),
        end: new Date('2019-12-17T13:25:00')
      },
      {
        key: 'element-2',
        title: faker.name.jobTitle(),
        content: faker.lorem.paragraph(),
        start: new Date('2019-12-17T13:30:00'),
        end: new Date('2019-12-17T14:59:00')
      }
    ]
  },
  {
    title: faker.name.jobType(),
    key: `row-2`,
    elements: [
      {
        key: 'element-1',
        title: faker.name.jobTitle(),
        content: faker.lorem.paragraph(),
        start: new Date('2019-12-17T12:15:00'),
        end: new Date('2019-12-17T12:30:00')
      },
      {
        key: 'element-2',
        title: faker.name.jobTitle(),
        content: faker.lorem.paragraph(),
        start: new Date('2019-12-17T12:42:00'),
        end: new Date('2019-12-17T13:00:00')
      },
      {
        key: 'element-3',
        title: faker.name.jobTitle(),
        content: faker.lorem.paragraph(),
        start: new Date('2019-12-17T13:03:00'),
        end: new Date('2019-12-17T13:40:00')
      }
    ]
  },
  {
    title: 'row 3',
    key: `row-3`,
    elements: [
      {
        key: 'element-1',
        title: faker.name.jobTitle(),
        content: faker.lorem.paragraph(),
        start: new Date('2019-12-17T12:00:00'),
        end: new Date('2019-12-17T12:45:00')
      },
      {
        key: 'element-2',
        title: faker.name.jobTitle(),
        content: faker.lorem.paragraph(),
        start: new Date('2019-12-17T12:52:00'),
        end: new Date('2019-12-17T13:05:00')
      },
      {
        key: 'element-3',
        title: faker.name.jobTitle(),
        content: faker.lorem.paragraph(),
        start: new Date('2019-12-17T13:09:00'),
        end: new Date('2019-12-17T13:45:00')
      },
      {
        key: 'element-4',
        title: faker.name.jobTitle(),
        content: faker.lorem.paragraph(),
        start: new Date('2019-12-17T13:50:00'),
        end: new Date('2019-12-17T15:00:00')
      }
    ]
  }
]

export { START_DATE, END_DATE, COLS, ROWS }
