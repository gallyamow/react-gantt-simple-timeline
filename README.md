# react-gantt-simple-timeline

> Horizontal gantt timeline

[![NPM](https://img.shields.io/npm/v/react-gantt-simple-timeline.svg)](https://www.npmjs.com/package/react-gantt-simple-timeline) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![image](https://raw.githubusercontent.com/gallyamow/react-gantt-simple-timeline/master/demo.png)

## Features

* custom headers content
* custom element content
* fixed and auto fit width

## Install

```bash
npm install --save react-gantt-simple-timeline
```

## Usage

See [Demo](https://gallyamow.github.io/react-gantt-simple-timeline/index.html)

```jsx
import React, { Component } from 'react'

import Timeline from 'react-gantt-simple-timeline'

class Example extends Component {
  renderElement = (element) => {
    return (
      <div className='your-element'>
        custom content  
      </div>
    )
  }

  renderColHeaderItem = (col) => (
    <div className='your-col-head'>custom title</div>
  )

  renderRowHeaderItem = (col) => (
    <div className='your-row-head'>custom header</div>
  )

  timeFormatFunction = (date) => {
    return formatTime(date)
  }

  handleElementClick = (element, rowIndex, e) => {
  }
  
  render () {
    return (
      <Timeline
        current={new Date()}
        rows={ROWS}
        cols={COLS}
        currentTimeOverlapClass='currentTimeOverlap'
        timeFormatFunction={this.timeFormatFunction}
        renderElement={this.renderElement}
        renderColHeader={this.renderColHeaderItem}
        renderRowHeader={this.renderRowHeaderItem}
        handleElementClick={this.handleElementClick}
        gridColor='#CCCCCC'
        currentTimeOverlapClass='customizeIfNeed'
        rowsHeaderClass='customizeIfNeed'
        colsHeaderClass='customizeIfNeed'
        gridLineClass='customizeIfNeed'
        rowsBodyClass='customizeIfNeed'
      />
    )
  }
}
```

## License

MIT © [Ramil Gallyamov](https://github.com/gallyamow)

## TODO

* declarative layout
* minScale or minColWidth for scrollable grid?
* isReady prop
* display: grid ? 
  https://webdesign.tutsplus.com/tutorials/solving-problems-with-css-grid-the-gantt-chart--cms-33837
  https://codepen.io/ph1p/pen/JBBjNy
