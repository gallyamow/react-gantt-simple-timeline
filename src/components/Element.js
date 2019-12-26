import React from 'react'
import PropTypes from 'prop-types'
import { TimelineContext } from './Timeline'

const Element = ({ children, start, end }) => (
  <TimelineContext.Consumer>
    {({ timeCoordinateTranslator }) => {
      const x1 = timeCoordinateTranslator(start)
      const x2 = timeCoordinateTranslator(end)
      const style = { left: x1 + 'px', right: x2 + 'px' }

      return <div style={style}>{children}</div>
    }}
  </TimelineContext.Consumer>
)

Element.propTypes = {
  children: PropTypes.node,
  start: PropTypes.instanceOf(Date),
  end: PropTypes.instanceOf(Date)
}

export default Element
