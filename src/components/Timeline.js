import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isArrayOfSizesEqual } from '../utils'
import styles from '../styles.css'

// todo: functional + hooks
class Timeline extends Component {
  constructor (props) {
    super(props)
    const { from, to, cols, rows } = this.props

    this.colsHeaderRef = React.createRef()
    this.rowsRefs = rows.map(React.createRef)
    this.elementsRefs = rows.reduce((acc, row, rowIndex) => {
      acc[rowIndex] = row.elements.map(React.createRef)
      return acc
    }, {})

    const duration = Math.round((to.getTime() - from.getTime()) / 1000)

    this.state = {
      colsHeaderSize: undefined,
      rowSizes: undefined,
      colWidth: undefined,
      // rows summary height
      summaryRowsHeight: undefined,
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

  calculateRowSize = rowIndex => {
    // we find max value of width and height because children are absolute positioned
    const width = Math.max(...this.elementsRefs[rowIndex]
      .map(ref => ref.current.offsetWidth + ref.current.offsetLeft)
    )
    const height = Math.max(...this.elementsRefs[rowIndex]
      .map(ref => ref.current.offsetHeight)
    )

    return ({
      width: width, // this.rowsRefs[rowIndex].current.offsetWidth,
      height: height // this.rowsRefs[rowIndex].current.offsetHeight
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
        summaryRowsHeight: nextRowsSize.reduce((acc, v) => acc + v.height, 0)
      })
    }
  }

  handleResize = () => this.handleLayoutChange()

  handleElementClick = (element, rowIndex) => e => {
    if (!this.props.handleElementClick) {
      return
    }
    this.props.handleElementClick(element, rowIndex, e)
  }

  timeCoordinateTranslator = date => {
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

  renderGridRowLine = (offset, width, color) => (<div
    key={offset}
    style={{
      position: 'absolute',
      borderBottom: `1px solid ${color}`,
      width: width + 'px',
      top: offset + 'px'
    }}
  />)

  renderGridColLine = (offset, height, color) => (<div
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
    const { colsHeaderSize, colsCount, colWidth, rowSizes, summaryRowsHeight } = this.state

    const res = []

    // rows
    let offset = 0
    offset += colsHeaderSize.height
    for (let rowSize of rowSizes) {
      res.push(this.renderGridRowLine(offset, colsHeaderSize.width, gridColor))
      offset += rowSize.height
    }

    // last line
    res.push(this.renderGridRowLine(offset, colsHeaderSize.width, gridColor))

    // cols
    offset = 0
    const height = summaryRowsHeight + colsHeaderSize.height
    for (let j = 0; j < colsCount; j++) {
      res.push(this.renderGridColLine(offset, height, gridColor))
      offset += colWidth
    }

    // last line
    res.push(this.renderGridColLine(offset, height, gridColor))

    return res
  }

  renderCurrentTimeLine = () => {
    const { current, currentTimeOverlapClass, timeFormatFunction } = this.props
    const { summaryRowsHeight, colsHeaderSize } = this.state
    const offset = this.timeCoordinateTranslator(current)

    return <div
      key={offset}
      style={{
        position: 'absolute',
        top: colsHeaderSize.height + 'px',
        left: 0,
        right: offset + 'px'
      }}
      className={currentTimeOverlapClass}
    >
      <div
        className='overlap'
        style={{
          height: summaryRowsHeight + 'px'
        }}
      />
      <div className='label'>
        {timeFormatFunction(current)}
      </div>
    </div>
  }

  render () {
    const { rows, maxWidth, current, renderElement } = this.props
    const { colsHeaderSize, rowSizes, colWidth, summaryRowsHeight } = this.state

    const style = {
      maxWidth: maxWidth ? maxWidth + 'px' : null
    }

    return (
      <div
        className={styles.root}
        style={style}
      >
        {colsHeaderSize && rowSizes && this.renderRowsHeader()}

        <div
          className={styles.rowsBody}
        >
          {colWidth && summaryRowsHeight && this.renderGrid()}
          {colWidth && summaryRowsHeight && current && this.renderCurrentTimeLine()}
          {this.renderColsHeader()}

          {rows.map((row, rowIndex) => {
            const rowStyle = {}
            if (rowSizes) {
              rowStyle.width = rowSizes[rowIndex].width + 'px'
              rowStyle.height = rowSizes[rowIndex].height + 'px'
            }

            return (
              <div
                key={row.key}
                ref={this.rowsRefs[rowIndex]}
                className={styles.row}
                style={rowStyle}
              >
                {row.elements.map((element, elementIndex) => {
                  const x1 = this.timeCoordinateTranslator(element.start)
                  const x2 = this.timeCoordinateTranslator(element.end)
                  const elementStyle = { left: x1 + 'px', width: (x2 - x1) + 'px' }

                  return (
                    <div
                      key={element.key}
                      ref={this.elementsRefs[rowIndex][elementIndex]}
                      onClick={this.handleElementClick(element, rowIndex)}
                      className={styles.element}
                      style={elementStyle}
                    >
                      {renderElement(element)}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

Timeline.propTypes = {
  from: PropTypes.instanceOf(Date).isRequired,
  to: PropTypes.instanceOf(Date).isRequired,
  current: PropTypes.instanceOf(Date),
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      elements: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          start: PropTypes.instanceOf(Date).isRequired,
          end: PropTypes.instanceOf(Date).isRequired
        })
      ).isRequired
    })
  ).isRequired,
  cols: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      start: PropTypes.instanceOf(Date).isRequired,
      end: PropTypes.instanceOf(Date).isRequired
    })
  ).isRequired,
  maxWidth: PropTypes.number,
  fixedColWidth: PropTypes.number,
  gridColor: PropTypes.string,
  // todo: validate with requiredIf or make yours validator
  currentTimeOverlapClass: PropTypes.string,
  renderElement: PropTypes.func.isRequired,
  renderColHeader: PropTypes.func.isRequired,
  renderRowHeader: PropTypes.func.isRequired,
  handleElementClick: PropTypes.func,
  timeFormatFunction: PropTypes.func
}

export default Timeline
