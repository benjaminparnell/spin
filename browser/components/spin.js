import React, { PropTypes, Component } from 'react'
import request from 'superagent'

class Spin extends Component {

  constructor (props) {
    super(props)

    this.state = {
      stages: [],
      finished: false
    }
  }

  tick () {
    this.setState({ seconds: this.state.seconds - 1 })
    if (this.state.seconds <= 0) {
      let stage = this.state.stages[this.state.stage + 1]

      if (stage) {
        this.setState({
          stage: this.state.stage + 1,
          seconds: stage.seconds,
          text: stage.text
        })
        clearInterval(this.interval)
        this.interval = setInterval(this.tick.bind(this), 1000)
      } else {
        this.setState({
          finished: true,
          text: 'Done'
        })
        clearInterval(this.interval)
      }
    }
  }

  componentDidMount () {
    request.get(`/api/spin/${this.props.params.id}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) return

        this.setState({
          stages: res.body.stages
        })

        let stage = this.state.stages[0]
        this.setState({
          seconds: stage.seconds,
          text: stage.text,
          stage: 0
        })
        this.interval = setInterval(this.tick.bind(this), 1000)
      })
  }

  render () {
    return (
      <div className='container text-center'>
        <h1 className='timer-text'>
          {this.state.seconds}
        </h1>
        <h2 className='exercise-text'>{this.state.text}</h2>
        <div className='row up-next'>
          <h1>Up next</h1>
          <h2>{(this.state.stages[this.state.stage + 1] ? this.state.stages[this.state.stage + 1].text : 'Done!')}</h2>
        </div>
      </div>
    )
  }
}

Spin.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string
  })
}

export default Spin
