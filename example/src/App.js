import React, { Component } from 'react'
import Timeline from 'react-gantt-simple-timeline'
import { CURRENT_DATE, ROWS, COLS } from './data'
import { getRandomVariant, formatTime } from './utils'

export default class App extends Component {
  renderElement = (element) => {
    const classNames = [
      'custom-element',
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
    <div className='custom-col-head'>{col.title}</div>
  )

  renderRowHeader = (col) => (
    <div className='custom-row-head'>
      <div className='wrapper'>
        <div className='content'>{col.title}</div>
      </div>
    </div>
  )

  renderCurrentTimeLabel = (date) => {
    return formatTime(date)
  }

  // noinspection JSUnusedLocalSymbols
  handleElementClick = (element, rowIndex, e) => {
    // eslint-disable-next-line no-undef
    alert(`clicked to element with key "${element.key}" at row with index "${rowIndex}"`)
  }

  render () {
    return (
      <Timeline
        current={CURRENT_DATE}
        rows={ROWS}
        cols={COLS}
        scrollToCurrentTime={true}
        renderCurrentTimeLabel={this.renderCurrentTimeLabel}
        renderElement={this.renderElement}
        renderColHeader={this.renderColHeader}
        renderRowHeader={this.renderRowHeader}
        handleElementClick={this.handleElementClick}
        rowsBodyClass='custom-rows-body'
        currentTimeOverlapClass='custom-current-time'
        alignElementHeight={false}
      />
    )
  }
}
