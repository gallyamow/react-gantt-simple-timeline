import React, { Component } from 'react'
import { Timeline } from 'react-gantt-timeline'
import { START_DATE, END_DATE, ROWS, COLS } from './data'

export default class App extends Component {
  renderElement = (element) => (
    <div className='your-element'>
      <h4>{element.title}</h4>
      <p><b>{element.start.toLocaleString()} - {element.end.toLocaleString()}</b></p>
      <p>{element.content}</p>
    </div>
  )

  renderColHeader = (col) => (
    <div className='your-col-head'>{col.title}</div>
  )

  renderRowHeader = (col) => (
    <div className='your-row-head'>{col.title}</div>
  )

  render () {
    return (
      <Timeline
        from={START_DATE}
        to={END_DATE}
        rows={ROWS}
        cols={COLS}
        renderElement={this.renderElement}
        renderColHeader={this.renderColHeader}
        renderRowHeader={this.renderRowHeader}
      />
    )
  }
}
