import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isArrayOfSizesEqual, isSizeEqual } from '../utils'
import styles from '../styles.css'

// todo: functional + hooks
class Timeline extends Component {
  constructor (props) {
    super(props)

    const { cols, rows } = this.props

    this.colsHeaderRef = React.createRef()
    this.rowsRefs = rows.map(React.createRef)
    this.elementsRefs = rows.reduce((acc, row, rowIndex) => {
      acc[rowIndex] = row.elements.map(React.createRef)
      return acc
    }, {})
    this.currentTimeLabelRef = React.createRef()
    this.rowsBodyRef = React.createRef()

    const from = new Date(Math.min(...rows.map(row => Math.min(...row.elements.map(el => el.start)))))
    const to = new Date(Math.max(...rows.map(row => Math.max(...row.elements.map(el => el.end)))))
    const duration = Math.floor(to.getTime() / 1000) - Math.floor(from.getTime() / 1000)

    this.state = {
      from,
      to,
      colsHeaderSize: undefined,
      currentTimeLabelSize: undefined,
      horizontalOffset: undefined,
      rowSizes: undefined,
      colWidth: undefined,
      // rows summary height
      summaryRowsHeight: undefined,
      colsCount: cols.length,
      rowsCount: rows.length,
      duration,
      verticalGridLineElevation: 5,
      scrollX: 0,
      scrollSize: undefined
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    window.requestAnimationFrame(() => {
      this.handleLayoutChange()

      if (this.props.scrollToCurrentTime) {
        this.scrollToCurrentTime()
      }

      this.rowsBodyRef.current.addEventListener('scroll', this.handleScroll)
    })
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
    this.rowsBodyRef.current.removeEventListener('scroll', this.handleScroll)
  }

  calculateSize = (ref) => ({
    width: ref.current.offsetWidth,
    height: ref.current.offsetHeight
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

  handleLayoutChange = () => {
    const { fixedColWidth, current } = this.props
    const { colsHeaderSize, currentTimeLabelSize, scrollSize, rowSizes, colsCount } = this.state

    const nextColHeaderSize = this.calculateSize(this.colsHeaderRef)

    // получили значение ширины
    if (colsHeaderSize === undefined || !isSizeEqual(nextColHeaderSize, colsHeaderSize)) {
      // we use fixed width or calculate it base on current cols header width
      let colWidth = fixedColWidth === undefined
        ? Math.round(nextColHeaderSize.width / colsCount)
        : fixedColWidth

      // // we need even number for division to 2
      // if (colWidth % 2 !== 0) {
      //   colWidth += 1
      // }

      const horizontalOffset = Math.floor(colWidth / 2)

      this.setState({
        colsHeaderSize: nextColHeaderSize,
        horizontalOffset,
        colWidth
      })
    }

    const nextRowsSize = this.props.rows.map((_, i) => this.calculateRowSize(i))
    if (rowSizes === undefined || !isArrayOfSizesEqual(rowSizes, nextRowsSize)) {
      this.setState({
        rowSizes: nextRowsSize,
        summaryRowsHeight: nextRowsSize.reduce((acc, v) => acc + v.height, 0)
      })
    }

    const rowsBodySize = this.calculateSize(this.rowsBodyRef)
    if (rowsBodySize !== undefined && rowsBodySize.width !== scrollSize) {
      this.setState({
        scrollSize: this.rowsBodyRef.current.scrollWidth - rowsBodySize.width
      })
    }

    if (current) {
      const nextCurrentTimeLabelSize = this.calculateSize(this.currentTimeLabelRef)
      if (currentTimeLabelSize === undefined || !isSizeEqual(nextCurrentTimeLabelSize, currentTimeLabelSize)) {
        this.setState({
          currentTimeLabelSize: nextCurrentTimeLabelSize
        })
      }
    }
  }

  handleResize = () => this.handleLayoutChange()

  handleScroll = () => {
    const { scrollSize, colWidth } = this.state
    const scrollPosition = this.rowsBodyRef.current.scrollLeft
    this.setState({ scrollX: scrollPosition })

    if (!this.props.handleScroll) {
      return
    }

    let event = 'scrolled'
    if (Math.abs(scrollPosition - 0) < colWidth) {
      event = 'scroll-begin'
    } else if (Math.abs(scrollPosition - scrollSize) < colWidth) {
      event = 'scroll-end'
    }

    this.props.handleScroll(scrollPosition, event)
  }

  handleElementClick = (element, rowIndex) => e => {
    if (!this.props.handleElementClick) {
      return
    }
    this.props.handleElementClick(element, rowIndex, e)
  }

  scrollToCurrentTime = () => {
    this.currentTimeLabelRef.current.scrollIntoView({
      inline: 'center'
    })
  }

  timeToOffset = date => {
    const { from, colsHeaderSize, duration, horizontalOffset } = this.state
    const offset = Math.floor(date.getTime() / 1000) - Math.floor(from.getTime() / 1000)

    return Math.floor(colsHeaderSize.width * offset / duration) + horizontalOffset
  }

  renderRowsHeader = () => {
    const { rows, rowsHeaderClass, renderRowHeaderItem } = this.props
    const { colsHeaderSize, rowSizes } = this.state

    return <div
      className={[styles.rowsHeader, rowsHeaderClass].join(' ')}
      style={{ paddingTop: colsHeaderSize.height + 'px' }}
    >
      {rows.map((row, rowIndex) => {
        const style = {
          height: rowSizes[rowIndex].height + 'px'
        }

        return (
          <div
            key={row.key}
            className={[styles.rowsHeaderItem, 'item'].join(' ')}
            style={style}
          >
            {renderRowHeaderItem(row)}
          </div>
        )
      })}
    </div>
  }

  renderColsHeader = () => {
    const { cols, colsHeaderClass, renderColHeaderItem } = this.props
    const { colWidth } = this.state
    const colStyle = {
      width: colWidth ? colWidth + 'px' : null
    }

    return <div
      ref={this.colsHeaderRef}
      className={[styles.colsHeader, colsHeaderClass].join(' ')}
    >
      {cols.map(col => (
        <div
          key={col.key}
          className={[styles.colsHeaderItem, 'item'].join(' ')}
          style={colStyle}
        >
          {renderColHeaderItem(col)}
        </div>
      ))}
    </div>
  }

  renderHorizontalLine = (x, y, width, color) => (
    <div
      key={`h_${x}-${y}`}
      className={[styles.gridLine, this.props.gridLineClass].join(' ')}
      style={{
        background: color,
        width: width + 'px',
        height: '1px',
        left: x + 'px',
        top: y + 'px'
      }}
    />)

  renderVerticalLine = (x, y, height, color) => (
    <div
      key={`v_${x}-${y}`}
      className={[styles.gridLine, this.props.gridLineClass].join(' ')}
      style={{
        background: color,
        width: '1px',
        height: height + 'px',
        left: x + 'px',
        top: y + 'px'
      }}
    />)

  // todo: allow customize
  renderGrid = () => {
    const { horizontalGridLineVisible, verticalGridLineVisible } = this.props
    const { colsHeaderSize, colsCount, colWidth, rowSizes, summaryRowsHeight, horizontalOffset, verticalGridLineElevation } = this.state

    const res = []

    if (horizontalGridLineVisible) {
      let y = 0
      y += colsHeaderSize.height

      for (let rowSize of rowSizes) {
        res.push(this.renderHorizontalLine(0, y, colsHeaderSize.width))
        y += rowSize.height
      }

      // last line
      res.push(this.renderHorizontalLine(0, y, colsHeaderSize.width))
    }

    if (verticalGridLineVisible) {
      let x = horizontalOffset

      for (let j = 0; j < colsCount; j++) {
        res.push(this.renderVerticalLine(x, colsHeaderSize.height - verticalGridLineElevation, summaryRowsHeight + verticalGridLineElevation))
        x += colWidth
      }

      // last line
      res.push(this.renderVerticalLine(x, colsHeaderSize.height - verticalGridLineElevation, summaryRowsHeight + verticalGridLineElevation))
    }

    return res
  }

  renderCurrentTimeLine = () => {
    const { current, currentTimeOverlapClass, renderCurrentTimeLabel } = this.props
    const { summaryRowsHeight, colsHeaderSize, verticalGridLineElevation } = this.state
    const x = this.timeToOffset(current)

    return <div
      key={x}
      style={{
        position: 'absolute',
        top: colsHeaderSize.height + 'px',
        left: 0,
        width: x + 'px'
      }}
      className={currentTimeOverlapClass}
    >
      <div
        style={{
          height: summaryRowsHeight + 'px'
        }}
        className='overlap'
      />
      <div
        ref={this.currentTimeLabelRef}
        style={{
          position: 'absolute',
          bottom: -(verticalGridLineElevation) + 'px',
          right: 0,
          transform: 'translate(50%, 100%)'
        }}
        className='label'
      >
        {renderCurrentTimeLabel(current)}
      </div>
    </div>
  }

  render () {
    const { rows, rowsBodyClass, rowClass, elementClass, maxWidth, current, renderElement, alignElementHeight } = this.props
    const { colsHeaderSize, rowSizes, colWidth, summaryRowsHeight } = this.state

    const style = {
      maxWidth: maxWidth ? maxWidth + 'px' : null
    }

    const rowsBodyClasses = [styles.rowsBody, rowsBodyClass]

    return (
      <div
        className={styles.root}
        style={style}
      >
        {colsHeaderSize && rowSizes && this.renderRowsHeader()}

        <div
          ref={this.rowsBodyRef}
          className={rowsBodyClasses.join(' ')}
        >
          {colWidth && summaryRowsHeight && this.renderGrid()}
          {colWidth && summaryRowsHeight && current && this.renderCurrentTimeLine()}
          {this.renderColsHeader()}

          {colsHeaderSize && rows.map((row, rowIndex) => {
            const rowStyle = {}

            if (rowSizes) {
              rowStyle.width = rowSizes[rowIndex].width + 'px'
              rowStyle.height = rowSizes[rowIndex].height + 'px'
            }

            return (
              <div
                key={row.key}
                ref={this.rowsRefs[rowIndex]}
                className={[styles.row, rowClass].join(' ')}
                style={rowStyle}
              >
                {row.elements.map((element, elementIndex) => {
                  const x1 = this.timeToOffset(element.start)
                  const x2 = this.timeToOffset(element.end)

                  const elementStyle = { left: x1 + 'px', width: (x2 - x1) + 'px' }

                  if (alignElementHeight && rowStyle.height) {
                    elementStyle.height = rowStyle.height
                  }

                  return (
                    <div
                      key={element.key}
                      ref={this.elementsRefs[rowIndex][elementIndex]}
                      onClick={this.handleElementClick(element, rowIndex)}
                      className={[styles.element, elementClass].join(' ')}
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
  renderElement: PropTypes.func.isRequired,
  renderColHeaderItem: PropTypes.func.isRequired,
  renderRowHeaderItem: PropTypes.func.isRequired,
  renderCurrentTimeLabel: PropTypes.func,
  handleElementClick: PropTypes.func,
  handleScroll: PropTypes.func,
  scrollToCurrentTime: PropTypes.bool,
  // todo: validate with requiredIf or make yours validator
  currentTimeOverlapClass: PropTypes.string,
  rowsHeaderClass: PropTypes.string,
  colsHeaderClass: PropTypes.string,
  elementClass: PropTypes.string,
  gridLineClass: PropTypes.string,
  rowsBodyClass: PropTypes.string,
  rowClass: PropTypes.string,
  verticalGridLineVisible: PropTypes.bool,
  horizontalGridLineVisible: PropTypes.bool,
  alignElementHeight: PropTypes.bool
}

Timeline.defaultProps = {
  verticalGridLineVisible: true,
  horizontalGridLineVisible: true,
  alignElementHeight: false
}

export default Timeline
