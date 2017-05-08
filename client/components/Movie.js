import React, { Component } from 'react';
import './Movie.scss';

var axios = require('axios');

import MovieItem from './MovieItem';

import moment from 'moment';

import { Remote } from './Remote';

class Movie extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      movie: {},
	      loaded: false,
	      similar: [],
	      credits: { cast: [], crew: [] }
	    };
	}

	getMovie(id) {
	    var th = this;
	    axios.get( Remote('movie/' + id) )
	      	.then(function(result) {  
	        	th.setState({
	          		movie: result.data,
	          		loaded: true
	        	});
	      	});
	    this.getSimilar(id);
	    this.getCredits(id);
	}

	componentDidMount() {
	    this.getMovie(this.props.id);
	}

	componentWillReceiveProps(nextProps) {
	    if( this.props.id !== nextProps.id) 
	    {
	           this.getMovie(nextProps.id);
	    }
	}

	getSimilar(id) {
	  	var th = this;
	    axios.get( Remote('movie/' + id + '/similar') )
	      .then(function(result) {    
	        th.setState({
	          similar: result.data.results.slice(0, 5)
	        });
	    })
	}

	getCredits(id) {
	  	var th = this;
	    axios.get( Remote('movie/' + id + '/credits') )
	      .then(function(result) {  
	        console.log(result);  
	        th.setState({
	          credits: result.data
	        });
	    })
	}

	render() {

		const loaded = this.state.loaded;
		const movie = this.state.movie

		let movie_html = null;

		if(loaded) {
			movie_html = 
				<div className="movie">
					<section className="movie__bg" style={ {backgroundImage: "url(https://image.tmdb.org/t/p/w1280" + movie.backdrop_path} }>
					</section>
					<aside className="movie__sidebar">
						<img className="movie__poster" src={"https://image.tmdb.org/t/p/w500" + movie.poster_path } alt="{ movie.title }" />
						<h1>{ movie.title }</h1>
						<div className="movie__sidebar__section">
							<h3>Release date</h3>
							<p className="movie-list__item__year">{ moment(movie.release_date).format('MMMM Do YYYY') }</p>
					    </div>
						<div className="movie__sidebar__section">
							<h3>Genre</h3>
							<ul className="genre-list">
						        {movie.genres.map(function(genre) {
						          return (
						            <li key={ genre.id.toString() } className="genre-list__item">
						              { genre.name }
						            </li>
						          );
						        })}
						    </ul>
					    </div>
					    <div className="movie__sidebar__section">
						    <h3>Runtime</h3>
						    <p>{ moment.duration(movie.runtime, 'minutes').humanize() }</p>
					    </div>
					</aside>
					<section className="movie__main">
						<section className="section">
							<div className="row">
								<div className="medium-12 columns">
									<h3>Sinopsis</h3>
									<p>{ movie.overview }</p>
									<div className="rating">
										{ movie.vote_average }
										{ movie.vote_count }
									</div>
								</div>
							</div>
						</section>
						<section className="section">
							<div className="row">
								<div className="medium-12 columns">
									<h3>Cast</h3>
								</div>
							</div>
							<div className="cast">
								<ul className="cast__list">
							        {this.state.credits.cast.map(function(cast) {
							          return (
							            <li key={ cast.id.toString() } className="cast__list__item">
							            	<img src={"https://image.tmdb.org/t/p/w500" + cast.profile_path } alt={ cast.name } className="cast__list__item__profile" />
							              <h4>{ cast.name }</h4>
							              { cast.character }
							            </li>
							          );
							        })}
							    </ul>
						   	</div>
					    </section>
						<section className="section">
							<div className="row">
								<div className="medium-12 columns">
									<h3>You may also like</h3>
								</div>
							</div>
							<ul className="movie-list">
						        {this.state.similar.map(function(movie) {
						          return (
						            <li key={ movie.id.toString() } className="movie-list__item">
						              <MovieItem movie={ movie } />
						            </li>
						          );
						        })}
						    </ul>
					     </section>
					</section>
				</div>
			;
		}

	    return (
	    	<div>
	      		{ movie_html }
	      	</div>
	    );
	}

}

export default Movie;