import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isArrayOfSizesEqual } from '../utils'
import styles from '../styles.css'

// todo: functional + hooks
class Timeline extends Component {
  constructor (props) {
    super(props)
    this.colsHeaderRef = React.createRef()
    this.rowsRefs = this.props.rows.map(React.createRef)

    // todo: validation
    const { from, to, cols, rows } = this.props
    const duration = Math.round((to.getTime() - from.getTime()) / 1000)

    this.state = {
      colsHeaderSize: undefined,
      rowSizes: undefined,
      colWidth: undefined,
      // rows summary height
      rowsHeight: undefined,
      colsCount: cols.length,
      rowsCount: rows.length,
      duration
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    window.requestAnimationFrame(() => {
      this.handleLayoutChange()
    })
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  calculateColHeaderSize = () => ({
    width: this.colsHeaderRef.current.offsetWidth,
    height: this.colsHeaderRef.current.offsetHeight
  })

  calculateRowSize = (rowIndex) => {
    return ({
      width: this.rowsRefs[rowIndex].current.offsetWidth,
      height: this.rowsRefs[rowIndex].current.offsetHeight
    })
  }

  calculateScale = (width, duration) => {
    return width / duration
  }

  // this value is maximal width of any col, we use overflow: hidden to prevent to expand them
  calculateColWidth (width, count) {
    return Math.ceil(width / count)
  }

  handleLayoutChange = () => {
    const { fixedColWidth } = this.props
    const { colsHeaderSize, rowSizes, duration, colsCount } = this.state

    const nextColHeaderSize = this.calculateColHeaderSize()

    // получили значение ширины
    if (colsHeaderSize === undefined || (nextColHeaderSize.width !== colsHeaderSize.width || nextColHeaderSize.height !== colsHeaderSize.height)) {
      const scale = this.calculateScale(nextColHeaderSize.width, duration)

      // we use fixed width or calculate it base on current cols header width
      const colWidth = fixedColWidth === undefined
        ? this.calculateColWidth(nextColHeaderSize.width, colsCount)
        : fixedColWidth

      this.setState({
        colsHeaderSize: nextColHeaderSize,
        colWidth,
        scale
      })
    }

    const nextRowsSize = this.props.rows.map((_, i) => this.calculateRowSize(i))
    if (rowSizes === undefined || !isArrayOfSizesEqual(rowSizes, nextRowsSize)) {
      this.setState({
        rowSizes: nextRowsSize,
        rowsHeight: nextRowsSize.reduce((acc, v) => acc + v.height, 0)
      })
    }
  }

  handleResize = () => this.handleLayoutChange()

  timeCoordinateTranslator = (date) => {
    const { from } = this.props
    return Math.round(this.state.scale * ((date.getTime() - from.getTime()) / 1000))
  }

  renderRowsHeader = () => {
    const { rows, renderRowHeader, gridColor } = this.props
    const { colsHeaderSize, rowSizes } = this.state

    return <div
      className={styles.rowsHeader}
      style={{ paddingTop: colsHeaderSize.height + 'px' }}
    >
      {rows.map((row, rowIndex) => {
        const style = {
          height: rowSizes[rowIndex].height + 'px',
          borderTop: `1px solid ${gridColor}`
        }

        return (
          <div
            key={row.key}
            className={styles.rowsHeaderItem}
            style={style}
          >
            {renderRowHeader(row)}
          </div>
        )
      })}
    </div>
  }

  renderColsHeader = () => {
    const { cols, renderColHeader } = this.props
    const { colWidth } = this.state
    const colStyle = {
      width: colWidth ? colWidth + 'px' : null
    }

    return <div
      ref={this.colsHeaderRef}
      className={styles.colsHeader}
    >
      {cols.map(col => (
        <div
          key={col.key}
          className={styles.col}
          style={colStyle}
        >
          {renderColHeader(col)}
        </div>
      ))}
    </div>
  }

  renderRowLine = (offset, width, color) => (<div
    key={offset}
    style={{
      position: 'absolute',
      borderBottom: `1px solid ${color}`,
      width: width + 'px',
      top: offset + 'px'
    }}
  />)

  renderColLine = (offset, height, color) => (<div
    key={offset}
    style={{
      position: 'absolute',
      borderLeft: `1px solid ${color}`,
      height: height + 'px',
      left: offset + 'px'
    }}
  />)

  // todo: allow customize
  renderGrid = () => {
    const { gridColor } = this.props
    const { colsHeaderSize, colsCount, colWidth, rowSizes, rowsHeight } = this.state

    const res = []

    // rows
    let offset = 0
    offset += colsHeaderSize.height
    for (let rowSize of rowSizes) {
      res.push(this.renderRowLine(offset, colsHeaderSize.width, gridColor))
      offset += rowSize.height
    }

    // last line
    res.push(this.renderRowLine(offset, colsHeaderSize.width, gridColor))

    // cols
    offset = 0
    const height = rowsHeight + colsHeaderSize.height
    for (let j = 0; j < colsCount; j++) {
      res.push(this.renderColLine(offset, height, gridColor))
      offset += colWidth
    }

    // last line
    res.push(this.renderColLine(offset, height, gridColor))

    return res
  }

  render () {
    const { rows, maxWidth, renderElement } = this.props
    const { colsHeaderSize, rowSizes, colWidth, rowsHeight } = this.state

    const style = {
      maxWidth: maxWidth ? maxWidth + 'px' : null
    }

    return (
      // todo: передаем много данных, но смотри про повторные render value={{ doSomething: this.doSomething }}
      <div
        className={styles.root}
        style={style}
      >
        {colsHeaderSize && rowSizes && this.renderRowsHeader()}

        <div className={styles.rowsBody}>
          {colWidth && rowsHeight && this.renderGrid()}
          {this.renderColsHeader()}

          {rows.map((row, rowIndex) => (
            <div
              key={row.key}
              ref={this.rowsRefs[rowIndex]}
              className={styles.row}
            >
              {row.elements.map(element => {
                const x1 = this.timeCoordinateTranslator(element.start)
                const x2 = this.timeCoordinateTranslator(element.end)
                const style = { left: x1 + 'px', width: (x2 - x1) + 'px' }

                return (
                  <div
                    key={element.key}
                    className={styles.element}
                    style={style}
                  >
                    {renderElement(element)}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

Timeline.propTypes = {
  from: PropTypes.instanceOf(Date).isRequired,
  to: PropTypes.instanceOf(Date).isRequired,
  // todo: item prop
  rows: PropTypes.array,
  cols: PropTypes.array,
  maxWidth: PropTypes.number,
  fixedColWidth: PropTypes.number,
  gridColor: PropTypes.string,
  renderElement: PropTypes.func.isRequired,
  renderColHeader: PropTypes.func.isRequired,
  renderRowHeader: PropTypes.func.isRequired,
}

export default Timeline
