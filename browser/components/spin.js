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
      donutColor: 'primary'
    }
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
          text: stage.text
        })
        clearInterval(this.interval)
        this.interval = setInterval(this.tick.bind(this), 1000)
      } else {
        this.setState({
          finished: true,
          text: 'Done',
          donutColor: 'success'
        })
        clearInterval(this.interval)
      }
    }
  }

  _handleSpacebar (event) {
    if (event.keyCode === 32 && this.state.paused) {
      event.preventDefault()
      this.interval = setInterval(this.tick.bind(this), 1000)
      this.setState({
        paused: false
      })
    } else if (event.keyCode === 32) {
      event.preventDefault()
      clearInterval(this.interval)
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

        this.setState({
          stages: res.body.stages
        })

        let stage = this.state.stages[0]
        this.setState({
          seconds: stage.seconds,
          currentSeconds: stage.seconds,
          text: stage.text,
          stage: 0
        })

        document.addEventListener('keydown', this._handleSpacebar.bind(this))
      })
  }

  render () {
    return (
      <Container>
        <div className="text-center">
          <Donut
            color={this.state.donutColor}
            size={512}
            strokeWidth={32}
            value={this.state.seconds / this.state.currentSeconds}>
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
