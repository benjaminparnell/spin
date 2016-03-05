import React from 'react'
import { findDOMNode } from 'react-dom'
import { browserHistory } from 'react-router'
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
    findDOMNode(this.refs.textInput).focus()
  }

  _onTimeChange (e) {
    this.setState({ seconds: e.target.value })
  }

  _onTextChange (e) {
    this.setState({ text: e.target.value })
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <h1 className='logo text-center'>Spin</h1>
        </div>

        <form className='row stage-form'>
          <input ref='textInput' type='text' className='full' placeholder='Text' onChange={this._onTextChange} value={this.state.text}/>
          <input ref='timeInput' type='text' className='full' placeholder='Time (seconds or minutes:seconds)' onChange={this._onTimeChange} value={this.state.seconds}/>
          <button onClick={this._handleAdd} className='full btn btn-add'>Add stage</button>
        </form>

        <div className='stage-list'>
          {this.state.stages.map((stage) => {
            return <div key={stage.index} className='stage-item text-center'>
              <p>{stage.seconds} seconds @ {stage.text}</p>
            </div>
          })}
        </div>

        <div className='row'>
          {(() => {
            if (this.state.stages.length) {
              return <button onClick={this._handleSave} className='full btn btn-add spin-save'>Save</button>
            }
          })()}
        </div>
      </div>
    )
  }
}

export default App
