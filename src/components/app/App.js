import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import './App.css'
import pkg from '../../../package.json'

/*
  The .active class is being applied to '/' even when it isn't the current
  location.pathname because all other paths are its children. This method
  corrects for that.
*/
const onlyOneActiveMatch = (match, location) => {
  if (match) return location.pathname === match.path
}

const App = props => (
  <div className='App'>
    <nav>
      <Link to='/'>
        <h2 className='navbar-brand'>{pkg.name}</h2>
      </Link>
      <ul className='navbar'>
        <li className='navbar-item'>
          <NavLink to='/about' isActive={onlyOneActiveMatch}>About</NavLink>
        </li>
        <li className='navbar-item'>
          <NavLink to='/' isActive={onlyOneActiveMatch}>Home</NavLink>
        </li>
      </ul>
    </nav>
    { props.children && React.cloneElement(props.children, props) }
  </div>
)

export default App
