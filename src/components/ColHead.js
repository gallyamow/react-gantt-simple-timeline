import React from 'react'
import { TimelineContext } from './Timeline'

const ColHead = ({ children }) => (
  <TimelineContext.Consumer>
    {({ fixedColWidth }) => {
      const style = {}
      if (fixedColWidth) {
        style.width = fixedColWidth + 'px'
      }

      return (
        <div style={style}>{children}</div>
      )
    }}
  </TimelineContext.Consumer>
)

export default ColHead
