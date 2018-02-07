import React, { Component } from 'react';

import axios from 'axios';

import MovieItem from './MovieItem';

import { Remote } from './Remote';

import { connect } from 'react-redux';
/*
const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(Movies)
*/
import './Movies.scss';

class Movies extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	     	movies: []
	    };
	}



	componentDidMount() {
	    var th = this;
	    axios.get( Remote('movie/' + this.props.type) )
	      .then(function(result) {

	        th.setState({
	          movies: result.data.results
	        });

	    })
	}

	render() {
	    return (
	    <div className="movies">
	      <ul className="movie-list">
	        {this.state.movies.map(function(movie) {
	          return (
	            <li key={ movie.id.toString() } className="movie-list__item">
	              <MovieItem movie={ movie } />
	            </li>
	          );
	        })}
	      </ul>
	      </div>
	    );
	}

}

Movies.defaultProps = {
	type: 'popular'
};

export default Movies;
