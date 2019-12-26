import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const TimelineContext = React.createContext()

class Timeline extends Component {
  constructor (props) {
    super(props)
    this.containerRef = React.createRef()

    this.state = {
      containerWidth: undefined,
      duration: undefined,
      scale: undefined
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    this.handleLayoutChange(() => this.scrollToNow())
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  calculateContainerWidth = () => this.containerRef.current.offsetWidth

  handleLayoutChange = () => {
    const { from, to } = this.props
    const { containerWidth } = this.state

    const nextContainerWidth = this.calculateContainerWidth()
    // получили значение ширины
    if (nextContainerWidth !== containerWidth) {
      const duration = Math.round((to.getTime() - from.getTime()) / 1000)
      const scale = duration / nextContainerWidth

      this.setState({
        containerWidth: nextContainerWidth,
        duration,
        scale
      })
    }
  }

  handleResize = () => this.handleLayoutChange()

  timeCoordinateTranslator = (date) => {
    return Math.round(this.state.scale * ((date.getTime() - this.props.from.getTime()) / 1000))
  }

  render () {
    const { children, maxWidth, fixedColWidth, fixedRowHeight } = this.props
    const style = {
      display: 'flex',
      maxWidth: maxWidth ? maxWidth + 'px' : null
    }

    return (
      // todo: передаем много данных, но смотри про повторные render value={{ doSomething: this.doSomething }}
      <TimelineContext.Provider
        value={{ fixedColWidth, fixedRowHeight, timeCoordinateTranslator: this.timeCoordinateTranslator }}
      >
        <div
          ref={this.containerRef}
          style={style}
        >
          {children}
        </div>
      </TimelineContext.Provider>
    )
  }
}

Timeline.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  from: PropTypes.instanceOf(Date).isRequired,
  to: PropTypes.instanceOf(Date).isRequired,
  maxWidth: PropTypes.number,
  fixedColWidth: PropTypes.number,
  fixedRowHeight: PropTypes.number,
}

export default Timeline
