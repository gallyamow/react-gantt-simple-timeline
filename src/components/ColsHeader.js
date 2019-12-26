import React from 'react'

const ColsHeader = ({ children }) => {
  const style = { display: 'flex' }
  return (
    <div style={style}>
      {children}
    </div>
  )
}

export default ColsHeader
