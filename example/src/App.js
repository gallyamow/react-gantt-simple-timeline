import React, { Component } from 'react'
import Timeline from 'react-gantt-timeline'
import { START_DATE, END_DATE, ROWS, COLS } from './data'

const getRandomVariant = (variants) => {
  return variants[Math.floor(Math.random() * variants.length)]
}

export default class App extends Component {
  renderElement = (element) => {
    const classNames = [
      'your-element',
      getRandomVariant(['your-element-red', 'your-element-green', 'your-element-blue'])
    ]
    return (
      <div className={classNames.join(' ')}>
        <h3>{element.title}</h3>
        <p><b>{element.start.toLocaleString()} - {element.end.toLocaleString()}</b></p>
        <p>{element.content}</p>
      </div>
    )
  }

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
        gridColor='#CCCCCC'
        renderElement={this.renderElement}
        renderColHeader={this.renderColHeader}
        renderRowHeader={this.renderRowHeader}
      />
    )
  }
}
