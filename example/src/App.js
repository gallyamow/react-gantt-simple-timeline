import React, { Component } from 'react'
import Timeline from 'react-gantt-simple-timeline'
import { COLS, CURRENT_DATE, ROWS } from './data'
import { formatTime } from './utils'

export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      rowsBodyScrollClass: undefined
    }
  }

  renderElement = (element) => {
    return (
      <div className={['element-wrapper', element.color].join(' ')}>
        <div className='time'>
          {formatTime(element.start)} - {formatTime(element.end)}
        </div>
        <h3>{element.title}</h3>
        <div className='description'>{element.content}</div>
      </div>
    )
  }

  renderColHeaderItem = (col) => (
    <div className='col-head'>{col.title}</div>
  )

  renderRowHeaderItem = (col) => (
    <div className='row-head'>
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

  handleScroll = (scrollX, event) => {
    let res
    switch (event) {
      case 'scroll-begin':
        res = 'scroll-begin'
        break
      case 'scroll-end':
        res = 'scroll-end'
        break
      default:
        res = undefined
        break
    }
    this.setState({
      rowsBodyScrollClass: res
    })
  }

  render () {
    const { rowsBodyScrollClass } = this.state

    return (
      <Timeline
        current={CURRENT_DATE}
        rows={ROWS}
        cols={COLS}
        scrollToCurrentTime={true}
        renderCurrentTimeLabel={this.renderCurrentTimeLabel}
        renderElement={this.renderElement}
        renderColHeaderItem={this.renderColHeaderItem}
        renderRowHeaderItem={this.renderRowHeaderItem}
        handleElementClick={this.handleElementClick}
        handleScroll={this.handleScroll}
        rowsBodyClass={['rows-body', rowsBodyScrollClass].join(' ')}
        currentTimeOverlapClass='current-time'
        rowsHeaderClass='row-header'
        elementClass='element'
        alignElementHeight={false}
      />
    )
  }
}
