import React from 'react'
import { TimelineContext } from './Timeline'

const RowHead = ({ children }) => (
  <TimelineContext.Consumer>
    {({ fixedRowHeight }) => {
      const style = {}
      if (fixedRowHeight) {
        style.height = fixedRowHeight + 'px'
      }

      return (
        <div style={style}>{children}</div>
      )
    }}
  </TimelineContext.Consumer>
)

export default RowHead
