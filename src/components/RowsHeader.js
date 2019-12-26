import React from 'react'

const RowsHeader = ({ children }) => {
  const style = { display: 'flex', flexDirection: 'column' }
  return (
    <div style={style}>
      {children}
    </div>
  )
}

export default RowsHeader
