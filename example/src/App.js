import React, { Component } from 'react'
import Timeline from 'react-gantt-timeline'
import { START_DATE, END_DATE, ROWS, COLS } from './data'
import { getRandomVariant, formatTime } from './utils'

export default class App extends Component {
  renderElement = (element) => {
    const classNames = [
      'your-element',
      getRandomVariant(['red', 'grey', 'blue'])
    ]
    return (
      <div className={classNames.join(' ')}>
        <div className='time'>
          {formatTime(element.start)} - {formatTime(element.end)}
        </div>
        <h3>{element.title}</h3>
        <div className='description'>{element.content}</div>
      </div>
    )
  }

  renderColHeader = (col) => (
    <div className='your-col-head'>{col.title}</div>
  )

  renderRowHeader = (col) => (
    <div className='your-row-head'>{col.title}</div>
  )

  // noinspection JSUnusedLocalSymbols
  handleElementClick = (element, rowIndex, e) => {
    // eslint-disable-next-line no-undef
    alert(`clicked to element with key "${element.key}" at row with index "${rowIndex}"`)
  }

  render () {
    return (
      <Timeline
        from={START_DATE}
        to={END_DATE}
        rows={ROWS}
        cols={COLS}
        gridColor='#CCCCCC'
        renderElement={this.renderElement}
        renderColHeader={this.renderColHeader}
        renderRowHeader={this.renderRowHeader}
        handleElementClick={this.handleElementClick}
      />
    )
  }
}
