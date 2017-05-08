import React, { Component } from 'react';
import {  Link } from 'react-router-dom'


class MovieItem extends Component {

	render() {

		const movie = this.props.movie;

	    return (
	    	<Link to={"/" + movie.id.toString() } className="movie-list__item__link">
	            <img src={"https://image.tmdb.org/t/p/w500" + movie.poster_path } alt="{ movie.title }" />
	            { movie.title }
	        </Link>
	    );
	}

}

export default MovieItem;