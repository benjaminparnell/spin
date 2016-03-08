import React, { PropTypes, Component } from 'react'
import { Donut, Divider, Container } from 'rebass'
import request from 'superagent'
import Icon from 'react-geomicons'

class Spin extends Component {

  constructor (props) {
    super(props)

    this.state = {
      stages: [],
      finished: false,
      paused: true,
      donutColor: 'primary',
      donutSeconds: 0
    }
  }

  tickDonut () {
    this.setState({
      donutSeconds: this.state.donutSeconds - 15
    })
  }

  tick () {
    this.setState({ seconds: this.state.seconds - 1 })
    if (this.state.seconds <= 0) {
      let stage = this.state.stages[this.state.stage + 1]

      if (stage) {
        this.setState({
          stage: this.state.stage + 1,
          currentSeconds: stage.seconds,
          seconds: stage.seconds,
          text: stage.text,
          donutSeconds: 1000 * stage.seconds
        })
        clearInterval(this.interval)
        clearInterval(this.donutInterval)
        this.interval = setInterval(this.tick.bind(this), 1000)
        this.donutInterval = setInterval(this.tickDonut.bind(this), 15)
      } else {
        this.setState({
          finished: true,
          text: 'Done',
          donutColor: 'success'
        })
        clearInterval(this.interval)
        clearInterval(this.donutInterval)
      }
    }
  }

  _handleSpacebar (event) {
    if (event.keyCode === 32 && this.state.paused && !this.state.finished) {
      event.preventDefault()
      this.interval = setInterval(this.tick.bind(this), 1000)
      this.donutInterval = setInterval(this.tickDonut.bind(this), 15)
      this.setState({
        paused: false
      })
    } else if (event.keyCode === 32 && !this.state.finished) {
      event.preventDefault()
      clearInterval(this.interval)
      clearInterval(this.donutInterval)
      this.setState({
        paused: true
      })
    }
  }

  componentDidMount () {
    request.get(`/api/spin/${this.props.params.id}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) return

        let stage = res.body.stages[0]

        this.setState({
          stages: res.body.stages,
          seconds: stage.seconds,
          currentSeconds: stage.seconds,
          text: stage.text,
          stage: 0,
          donutSeconds: 1000 * stage.seconds
        })

        document.addEventListener('keydown', this._handleSpacebar.bind(this))
      })
  }

  render () {
    return (
      <Container>
        <div className='text-center'>
          <Donut
            color={this.state.donutColor}
            size={512}
            strokeWidth={32}
            value={this.state.donutSeconds / (1000 * this.state.currentSeconds)}>
            {(() => {
              if (this.state.paused) {
                return <Icon name='pause' />
              } else if (this.state.finished) {
                return <Icon name='check' />
              } else {
                return this.state.seconds
              }
            })()}
          </Donut>

          <h2 className='exercise-text'>{this.state.text}</h2>

          <Divider />
          <div className='row up-next'>
            <h1>Up next</h1>
            <h2>{(this.state.stages[this.state.stage + 1] ? this.state.stages[this.state.stage + 1].text : 'Done!')}</h2>
          </div>
          <Divider />
        </div>
      </Container>
    )
  }
}

Spin.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string
  })
}

export default Spin
