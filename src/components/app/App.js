import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import './App.css'
import navLogo from '../../img/hireblack-logo.svg'

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
        <span className='navbar-brand'>
          <img src={navLogo} alt='HireBlack logo' height='60px' width='60px'/>
        </span>
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
