import React from 'react'
import { browserHistory } from 'react-router'
import { Button, Panel, Input, Space, Divider, Message, Close } from 'rebass'
import Stage from '../components/stage'
import Group from '../components/group'
import request from 'superagent'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      stages: [],
      seconds: null,
      time: null,
      duplicates: [],
      totalStages: 0,
      groupMessageShowing: true
    }

    this._handleAdd = this._handleAdd.bind(this)
    this._handleSave = this._handleSave.bind(this)
    this._onTimeChange = this._onTimeChange.bind(this)
    this._onTextChange = this._onTextChange.bind(this)
    this._handleDuplicate = this._handleDuplicate.bind(this)
    this._changeStageState = this._changeStageState.bind(this)
    this._groupRepeatUpdated = this._groupRepeatUpdated.bind(this)
    this._closeGroupMessage = this._closeGroupMessage.bind(this)
  }

  _groupRepeatUpdated (group) {
    let stages = this.state.stages.map((s) => {
      if (s.id === group.props.stage.id) {
        s.repeat = s.repeat + 1
      }
      return s
    })

    this.setState({
      stages: stages
    })
  }

  _changeStageState (stage) {
    if (stage.state.state === 'info') {
      stage.setState({ state: 'warning' })

      this.setState({ duplicates: this.state.duplicates.concat([stage]) })
    } else {
      stage.setState({ state: 'info' })

      this.setState({
        duplicates: this.state.duplicates.filter((d) => d.props.id !== stage.props.id)
      })
    }
  }

  _handleSave (e) {
    e.preventDefault()

    request.post('/api/spin')
      .send({ stages: this.state.stages })
      .type('application/json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) return
        browserHistory.push(`/${res.body._id}`)
      })
  }

  _handleAdd (e) {
    e.preventDefault()

    let seconds = this.state.seconds

    if (seconds.indexOf(':') > -1) {
      let minutes = parseInt(seconds.split(':')[0])
      seconds = parseInt(seconds.split(':')[1])
      seconds = (minutes * 60) + seconds
    } else {
      seconds = parseInt(seconds)
    }

    this.setState({
      stages: this.state.stages.concat([{
        text: this.state.text,
        seconds: seconds,
        id: this.state.totalStages + 1,
        state: 'info',
        type: 'single'
      }]),
      totalStages: this.state.totalStages + 1,
      seconds: '',
      text: ''
    })
    document.querySelector('input[name="text"]').focus()
  }

  _handleDuplicate (e) {
    e.preventDefault()

    let stages = this.state.stages
    let groupStages = this.state.duplicates.map((d) => {
      let stage = { text: d.props.text, seconds: d.props.seconds }
      stages = stages.filter((s) => s.id !== d.props.id)
      return stage
    })

    stages = stages.concat([{
      stages: groupStages,
      type: 'group',
      repeat: 2
    }])

    let index = 0
    stages = stages.map((s) => {
      if (s.type === 'group') {
        s.id = index
        index++
        s.stages = s.stages.map((s) => {
          s.id = index
          index++
          return s
        })
      } else {
        s.id = index
        index++
      }
      return s
    })

    this.setState({
      stages: stages,
      duplicates: [],
      totalStages: index
    })
  }

  _onTimeChange (e) {
    this.setState({ seconds: e.target.value })
  }

  _onTextChange (e) {
    this.setState({ text: e.target.value })
  }

  componentDidMount () {
    document.querySelector('input[name="text"]').focus()
  }

  _closeGroupMessage () {
    this.setState({
      groupMessageShowing: false
    })
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <h1 className='logo text-center'>Spin</h1>
        </div>

        <Panel theme='info'>
          <form>
            <Input name='text' label='Text' hideLabel type='text' placeholder='Text' onChange={this._onTextChange} value={this.state.text}/>
            <Input name='time' label='Time' hideLabel type='text' placeholder='Time (seconds or minutes:seconds)' onChange={this._onTimeChange} value={this.state.seconds}/>

            <div>
              <Button onClick={this._handleAdd} theme='success'>Add stage</Button>
              <Space auto />
              {(() => {
                if (this.state.duplicates.length > 1) {
                  return <Button onClick={this._handleDuplicate} theme='warning'>Group ({this.state.duplicates.length})</Button>
                }
              })()}
              <Space auto />
              {(() => {
                if (this.state.stages.length) {
                  return <Button onClick={this._handleSave} theme='success'>Save</Button>
                }
              })()}
            </div>
          </form>
        </Panel>

        <Divider />

        {(() => {
          if (this.state.stages.length > 1 && this.state.groupMessageShowing) {
            return <Message inverted rounded theme='warning'>
              You can select multiple stages to group them.
              <Space auto x={1} />
              <Close onClick={this._closeGroupMessage} />
            </Message>
          }
        })()}

        {this.state.stages.map((stage) => {
          if (stage.type === 'single') {
            return <Stage
              key={stage.id}
              id={stage.id}
              seconds={stage.seconds}
              text={stage.text}
              state={stage.state}
              onClick={this._changeStageState} />
          } else if (stage.type === 'group') {
            return <Group
              stage={stage}
              onUpdateRepeat={this._groupRepeatUpdated}
              repeat={stage.repeat} />
          }
        })}
      </div>
    )
  }
}

export default App
