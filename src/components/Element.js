import React from 'react'
import PropTypes from 'prop-types'

const Element = ({ start, end, timeCoordinateTranslator }) => {
  const x1 = timeCoordinateTranslator(start)
  const x2 = timeCoordinateTranslator(end)
  const style = { left: x1 + 'px', right: x2 + 'px' }

  return <div style={style}>{children}</div>
}

Element.propTypes = {
  timeCoordinateTranslator: PropTypes.func,
  start: PropTypes.instanceOf(Date),
  end: PropTypes.instanceOf(Date)
}

export default Element
