import React, { Component, PropTypes } from 'react'
import { Panel, PanelHeader, Stat } from 'rebass'
import Stage from './stage'

class Group extends Component {
  constructor (props) {
    super(props)

    this._handleUpdateRepeat = this._handleUpdateRepeat.bind(this)
  }

  _handleUpdateRepeat () {
    this.props.onUpdateRepeat(this)
  }

  render () {
    return (
      <Panel key={this.props.stage.id} theme='warning'>
        <PanelHeader inverted theme='warning'>
          Group
        </PanelHeader>
        {this.props.stage.stages.map((s) => {
          return <Stage
            key={s.id}
            id={s.id}
            seconds={s.seconds}
            text={s.text}
            state='info' />
        })}
        <div onClick={this._handleUpdateRepeat}>
          <Stat
            label='Repeat'
            unit='x'
            value={this.props.repeat}
            topLabel
          />
        </div>
      </Panel>
    )
  }
}

Group.propTypes = {
  stage: PropTypes.shape({
    stages: PropTypes.array,
    id: PropTypes.number
  }),
  onUpdateRepeat: PropTypes.func,
  repeat: PropTypes.number
}

export default Group
