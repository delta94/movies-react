import React, { Component } from 'react';
import AppCss from './App.scss';
import Movies from './Movies';
import Movie from './Movie';
import Search from './Search';

import Login from './Login';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'



const Child = ({ match }) => (
  <Movie id={match.params.id} />
)

const Popular = () => (
  <div className="container">
    <div className="app">
      <div className="app__header">
        <h1>Popular Movies</h1>
      </div>
    </div>
    <Movies />
  </div>
)

const TopRated = () => (
  <div className="container">
    <div className="app">
      <div className="app__header">
        <h1>Top Rated Movies</h1>
      </div>
    </div>
    <Movies type="top_rated" />
  </div>
)

const NowPlaying = () => (
  <div className="container">
    <div className="app">
      <div className="app__header">
        <h1>Now playing</h1>
      </div>
    </div>
    <Movies type="now_playing" />
  </div>
)

const LoginPage = () => (
  <div className="container">
    <Login action="login" />
  </div>
)

const ApprovedPage = () => (
  <div className="container">
    <Login action="approved" />
  </div>
)

const LogoutPage = () => (
  <div className="container">
    <Login action="logout" />
  </div>
)

class App extends Component {
  
  tryParseJSON (jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
  };

  render() {

      var account = null;
      var account = this.tryParseJSON(localStorage.getItem('account'));

      console.log(account);

      return (
        <Router>
          <div className="router-container">
            <nav className="top-bar">
              <ul className="top-bar__menu">
                <li><Link className="top-bar__menu__brand" to="/">React Movies</Link></li>
                <li><Link to="/">Popular</Link></li>
                <li><Link to="/top-rated">Top rated</Link></li>
                <li><Link to="/now-playing">Now playing</Link></li>
              </ul>
              <Search />
              <ul className="top-bar__menu">
                { account ? (
                    <li>  
                      <Link to="/account" className="top-bar__item--account">
                        <img src={ "https://www.gravatar.com/avatar/" + account.avatar.gravatar.hash } />
                        { account.username }
                      </Link>
                      <ul className="submenu">
                        <li>  
                          <Link to="/account">Account</Link>
                        </li>
                        <li>  
                          <Link to="/logout">Logout</Link>
                        </li>
                      </ul>
                    </li>
                    ) : (
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                    )}
               
              </ul>
            </nav>
            <Route exact path="/" component={Popular}/>
            <Route path="/top-rated" component={TopRated}/>
            <Route path="/now-playing" component={NowPlaying}/>
            <Route path="/login" component={LoginPage}/>
            <Route path="/logout" component={LogoutPage}/>
            <Route path="/approved" component={ApprovedPage}/>
            <Route path="/movies/:id" component={Child}/>
          </div>
        </Router>
      );
  }
}





export default App;
