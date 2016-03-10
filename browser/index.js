import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import Spin from './pages/spin'
import App from './pages/app'

require('./css/main.css')

render(
  <Router history={browserHistory}>
    <Route path='/' component={App}/>
    <Route path='/:id' component={Spin}/>
  </Router>,
  document.getElementById('root')
)
