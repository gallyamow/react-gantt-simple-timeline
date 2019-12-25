import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Timeline extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element)
      .isRequired,
    maxWidth: PropTypes.number
  }

  render () {
    const { children, maxWidth } = this.props
    const styles = {
      maxWidth
    }
    return (
      <div
        className='root'
        style={styles}
      >
        {children}
      </div>
    )
  }
}
