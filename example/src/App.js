import React, { Component } from 'react'
import {
  Timeline,
  TimelineRowsHeader,
  TimelineRowHead,
  TimelineBody,
  TimelineColsHeader,
  TimelineColHead,
  TimelineRow,
  TimelineElement
} from 'react-gantt-timeline'
import { START_DATE, END_DATE, ROWS, COLS } from './data'

export default class App extends Component {
  render () {
    return (
      <Timeline
        from={START_DATE}
        to={END_DATE}
      >
        <TimelineRowsHeader>
          {ROWS.map(row => (
            <TimelineRowHead key={row.key}>
              <div className='your-row-head'>{row.title}</div>
            </TimelineRowHead>
          ))}
        </TimelineRowsHeader>

        <TimelineBody>
          <TimelineColsHeader>
            {COLS.map(col => (
              <TimelineColHead key={col.key}>
                <div className='your-col-head'>
                  {col.title}
                </div>
              </TimelineColHead>
            ))}
          </TimelineColsHeader>

          {ROWS.map(row => (
            <TimelineRow key={row.key}>
              {row.elements.map(element => (
                <TimelineElement
                  key={element.key}
                  start={element.start}
                  end={element.end}
                >
                  <div className='your-element'>
                    <h4>{element.title}</h4>
                    <p>{element.content}</p>
                  </div>
                </TimelineElement>
              ))}
            </TimelineRow>
          ))}
        </TimelineBody>
      </Timeline>
    )
  }
}
