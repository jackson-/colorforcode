import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Container from './App'
import Home from '../home/Home'
import About from '../about/About'
import store from '../../store'
import '../../index.css'

const App = () => (
  <Provider store={store}>
    <Router>
      <Container>
        <Switch>
          <Route exact path='/about' component={About} />
          <Route exact strict path='/' component={Home} />
        </Switch>
      </Container>
    </Router>
  </Provider>
)

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})
