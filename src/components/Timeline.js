import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isArrayOfSizesEqual } from '../utils'
import styles from '../styles.css'

class Timeline extends Component {
  constructor (props) {
    super(props)
    this.colsHeaderRef = React.createRef()
    this.rowsRefs = this.props.rows.map(React.createRef)

    const { from, to } = this.props
    const duration = Math.round((to.getTime() - from.getTime()) / 1000)

    this.state = {
      colsHeaderSize: undefined,
      rowsSize: undefined,
      duration
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    this.handleLayoutChange()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  calculateColHeaderSize = () => ({
    width: this.colsHeaderRef.current.clientWidth,
    height: this.colsHeaderRef.current.clientHeight
  })

  calculateRowSize = (rowIndex) => {
    return ({
      width: this.rowsRefs[rowIndex].current.clientWidth,
      height: this.rowsRefs[rowIndex].current.clientHeight
    })
  }

  calculateScale = (duration, width) => {
    return width / duration
  }

  handleLayoutChange = () => {
    const { colsHeaderSize, rowsSize } = this.state

    const nextColHeaderSize = this.calculateColHeaderSize()

    // получили значение ширины
    if (colsHeaderSize === undefined || (nextColHeaderSize.width !== colsHeaderSize.width || nextColHeaderSize.height !== colsHeaderSize.height)) {
      const scale = this.calculateScale(this.state.duration, nextColHeaderSize.width)
      this.setState({
        colsHeaderSize: nextColHeaderSize,
        scale
      })
    }

    const nextRowsSize = this.props.rows.map((_, i) => this.calculateRowSize(i))
    console.log('nextRowsSize', nextRowsSize)

    if (rowsSize === undefined || !isArrayOfSizesEqual(rowsSize, nextRowsSize)) {
      this.setState({
        rowsSize: nextRowsSize
      })
    }
  }

  handleResize = () => this.handleLayoutChange()

  timeCoordinateTranslator = (date) => {
    const { from } = this.props
    return Math.round(this.state.scale * ((date.getTime() - from.getTime()) / 1000))
  }

  render () {
    const { rows, cols, maxWidth, renderColHeader, renderRowHeader, renderElement } = this.props
    const { colsHeaderSize, rowsSize } = this.state

    const style = {
      maxWidth: maxWidth ? maxWidth + 'px' : null
    }

    return (
      // todo: передаем много данных, но смотри про повторные render value={{ doSomething: this.doSomething }}
      <div
        className={styles.root}
        style={style}
      >
        {colsHeaderSize && rowsSize && (
          <div
            className={styles.rowsHeader}
            style={{ paddingTop: colsHeaderSize.height + 'px' }}
          >
            {rows.map((row, rowIndex) => {
              const style = { height: rowsSize[rowIndex].height + 'px' }

              return (
                <div
                  key={row.key}
                  style={style}
                >
                  {renderRowHeader(row)}
                </div>
              )
            })}
          </div>
        )}

        <div className={styles.rowsBody}>
          <div
            ref={this.colsHeaderRef}
            className={styles.colsHeader}
          >
            {cols.map(col => (
              <div
                key={col.key}
                className={styles.col}
              >
                {renderColHeader(col)}
              </div>
            ))}
          </div>

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
  fixedRowHeight: PropTypes.number,
  renderElement: PropTypes.func.isRequired,
  renderColHeader: PropTypes.func.isRequired,
  renderRowHeader: PropTypes.func.isRequired,
}

export default Timeline
