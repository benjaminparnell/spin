import React, { Component, PropTypes } from 'react'
import { Panel } from 'rebass'

class Stage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      state: this.props.state
    }

    this._handleClick = this._handleClick.bind(this)
  }

  _handleClick () {
    this.props.onClick(this)
  }

  render () {
    return (
      <div onClick={this._handleClick}>
        <Panel theme={this.state.state} key={this.props.key}>
          <p>{this.props.seconds} seconds @ {this.props.text}</p>
        </Panel>
      </div>
    )
  }
}

Stage.propTypes = {
  seconds: PropTypes.number,
  text: PropTypes.string,
  key: PropTypes.number,
  state: PropTypes.string,
  onClick: PropTypes.func,
  id: PropTypes.number
}

export default Stage
