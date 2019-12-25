import React, { Component } from 'react'
import faker from 'faker'
import { Timeline, TimelineRow, TimelineHead, TimelineBody, TimelineElement } from 'react-gantt-timeline'

const rows = [...Array(10).keys()].map(i => {
  const title = `row ${i}`
  const elements = [...Array(i).keys()].map(i => ({
    key: `element-${i}`,
    title: `element ${i}`,
    content: faker.lorem.paragraph()
  }))
  return { title, key: `row-${i}`, elements }
})

export default class App extends Component {
  render () {
    return (
      <Timeline>
        {rows.map(row => (
          <TimelineRow key={row.key}>
            <TimelineHead>{row.title}</TimelineHead>
            <TimelineBody>
              {row.elements.map(element => (
                <TimelineElement key={element.key}>
                  <h4>{element.title}</h4>
                  <p>{element.content}</p>
                </TimelineElement>
              ))}
            </TimelineBody>
          </TimelineRow>
        ))}
      </Timeline>
    )
  }
}
