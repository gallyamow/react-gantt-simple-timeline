# react-gantt-timeline

> Horizontal gantt timeline

[![NPM](https://img.shields.io/npm/v/react-gantt-timeline.svg)](https://www.npmjs.com/package/react-gantt-timeline) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Features

* custom headers content
* custom element content
* fixed and auto fit width

## Install

```bash
npm install --save react-gantt-timeline
```

## Usage

```jsx
import React, { Component } from 'react'

import Timeline from 'react-gantt-timeline'

class Example extends Component {
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
```

## License

MIT © [Ramil Gallyamov](https://github.com/gallyamow)

## TODO

* make layout based
* minScale or minColWidth for scrollable grid?
* isReady prop
* display: grid ? 
  https://webdesign.tutsplus.com/tutorials/solving-problems-with-css-grid-the-gantt-chart--cms-33837
  https://codepen.io/ph1p/pen/JBBjNy
