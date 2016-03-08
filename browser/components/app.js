import React from 'react'
import { findDOMNode } from 'react-dom'
import { browserHistory } from 'react-router'
import { Button, Panel, Input, Space, Divider } from 'rebass'
import request from 'superagent'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      stages: [],
      seconds: null,
      time: null
    }

    this._handleAdd = this._handleAdd.bind(this)
    this._handleSave = this._handleSave.bind(this)
    this._onTimeChange = this._onTimeChange.bind(this)
    this._onTextChange = this._onTextChange.bind(this)
    this._handleDuplicate = this._handleDuplicate.bind(this)
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
    }

    this.setState({
      stages: this.state.stages.concat([{
        text: this.state.text,
        seconds: seconds,
        index: this.state.stages.length + 1
      }]),
      seconds: '',
      text: ''
    })
    document.querySelector('input[name="text"]').focus()
  }

  _handleDuplicate (e) {
    e.preventDefault()
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

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <h1 className='logo text-center'>Spin</h1>
        </div>

        <Panel theme="info">
          <form>
            <Input name='text' label='Text' hideLabel={true} type='text' placeholder='Text' onChange={this._onTextChange} value={this.state.text}/>
            <Input name='time' label='Time' hideLabel={true} type='text' placeholder='Time (seconds or minutes:seconds)' onChange={this._onTimeChange} value={this.state.seconds}/>

            <div>
              <Button onClick={this._handleAdd} theme="success">Add stage</Button>
              <Space auto={true} />
              {(() => {
                if (this.state.stages.length) {
                    return <Button onClick={this._handleDuplicate} theme="warning">Duplicate</Button>
                }
              })()}
              <Space auto={true} />
              {(() => {
                if (this.state.stages.length) {
                    return <Button onClick={this._handleSave} theme="success">Save</Button>
                }
              })()}
            </div>
          </form>
        </Panel>

        <Divider />

        {this.state.stages.map((stage) => {
          return <Panel theme="info" key={stage.index}>
            <p>{stage.seconds} seconds @ {stage.text}</p>
          </Panel>
        })}
      </div>
    )
  }
}

export default App
