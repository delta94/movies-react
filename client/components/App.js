import React from 'react';
import logo from './logo.svg';
import AppCss from './App.scss';
import Movies from './Movies';
import Movie from './Movie';
import Search from './Search';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'



const Child = ({ match }) => (
  <Movie id={match.params.id} />
)

const Home = () => (
  <div className="container">
    <div className="app">
      <div className="app__header">
        <h1>Welcome to React Movies</h1>
        <Search />
      </div>
    </div>
    <Movies />
  </div>
)

const App = () => (
  <Router>
    <div className="router-container">
      <ul>
        <li><Link to="/">Home</Link></li>
      </ul>
      <Route exact path="/" component={Home}/>
      <Route path="/:id" component={Child}/>
    </div>
  </Router>
)





export default App;
