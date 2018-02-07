import React, { Component } from 'react';
import './Movie.scss';

var axios = require('axios');

import MovieItem from './MovieItem';
import Rating from './Rating';

import moment from 'moment';

import { Remote } from './Remote';

class Movie extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      movie: {},
	      loaded: false,
	      similar: [],
	      credits: { cast: [], crew: [] },
	      images: { backdrops : [] },
	      account_states : { rated : false }
	    };
	}

	getMovie(id) {
	    var th = this;
	    var sessionId = localStorage.getItem('session_id');
	    axios.get( Remote('movie/' + id) )
	      	.then(function(result) {
	        	th.setState({
	          		movie: result.data,
	          		loaded: true
	        	});
	        	document.title = result.data.title;
	      	});
	    this.getSimilar(id);
	    this.getCredits(id);
	    this.getImages(id);
	    if(sessionId !== null) {
	    	this.getAccountStates(id, sessionId);
	    }

	}

	componentDidMount() {
	    this.getMovie(this.props.id);
	    document.body.classList.add('single')
	}

	componentWillReceiveProps(nextProps) {
	    if( this.props.id !== nextProps.id)
	    {
	           this.getMovie(nextProps.id);
	    }
	}

	componentWillUnmount() {
	    document.body.classList.remove('single')
	}

	getSimilar(id) {
	  	var th = this;
	    axios.get( Remote('movie/' + id + '/similar') )
	      .then(function(result) {
	        th.setState({
	          similar: result.data.results.slice(0, 10)
	        });
	    })
	}

	getCredits(id) {
	  	var th = this;
	    axios.get( Remote('movie/' + id + '/credits') )
	      .then(function(result) {
	        th.setState({
	          credits: result.data
	        });
	    })
	}

	getImages(id) {
	  	var th = this;
	    axios.get( Remote('movie/' + id + '/images', { include_image_language : 'en,null' }) )
	      .then(function(result) {
	        th.setState({
	          images: result.data
	        });
	    })
	}

	getAccountStates(id, sessionId) {
	  	var th = this;
	    axios.get( Remote('movie/' + id + '/account_states', { session_id : sessionId }) )
	      .then(function(result) {
	      	console.log(result.data);
	        th.setState({
	          account_states: result.data
	        });
	    })
	}

	render() {

		const loaded = this.state.loaded;
		const movie = this.state.movie;
		const accountStates = this.state.account_states;

		var director = false;
		var rated = 0;

		if( this.state.credits.crew.length > 0 ) {
			director = this.state.credits.crew.find( function(element) { return element.job == 'Director' } )
		}

		if ( accountStates.rated.hasOwnProperty('value') ) {
			rated = accountStates.rated.value;
		}

		let movie_html = null;

		if(loaded) {
			movie_html =
				<div className="movie">
					<section className="movie__bg" style={ {backgroundImage: "url(https://image.tmdb.org/t/p/w1280" + movie.backdrop_path} }>
					</section>
					<header className="movie__header">
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
					    { director != false &&
					    	<div className="movie__sidebar__section">
							    <h3>Director</h3>
							    <p>{ director.name }</p>
						    </div>
					    }
					</header>
					<section className="movie__main single__main__content">
						<section className="section">
							<div className="row">
								<div className="medium-12 columns">
									<div>
										<h3>Rate this movie</h3>
										<Rating rating={rated} movie={movie.id} />
									</div>
									<ul className="stats">
										<li className="stats__item">
											<span className="stats__item__count">{ movie.vote_average }</span>
											<span className="stats__item__label">{ movie.vote_count } ratings</span>
										</li>
										<li className="stats__item">
											<span className="stats__item__count">{ movie.revenue.toLocaleString('en-EN', { style: 'currency', currency: 'USD', maximumSignificantDigits: 10} ) }</span>
											<span className="stats__item__label">revenue</span>
										</li>
									</ul>
									<h3>Sinopsis</h3>
									<p>{ movie.overview }</p>
								</div>
							</div>
						</section>
						<section className="section">
							<div className="row">
								<div className="medium-12 columns">
									<h3>Cast</h3>
									<div className="cast scroll">
										<ul className="cast__list scroll__list">
									        {this.state.credits.cast.map(function(cast) {
									          return (
									            <li key={ cast.cast_id.toString() } className="cast__list__item scroll__list__item">
																<span className="cast__list__item__image">
									            	{ cast.profile_path != null &&
									            		<img src={"https://image.tmdb.org/t/p/w185" + cast.profile_path } alt={ cast.name } className="cast__list__item__profile" />
									              	}
																</span>
																<span className="cast__list__item__name">
									              <h4>{ cast.name }</h4>
									              { cast.character }
																</span>
									            </li>
									          );
									        })}
									    </ul>
								   	</div>
						   		</div>
							</div>
					    </section>
						<section className="section">
							<div className="row">
								<div className="medium-12 columns">
									<h3>You may also like</h3>
									<div className="similar scroll">
										<ul className="scroll__list">
									        {this.state.similar.map(function(movie) {
									          return (
									            <li key={ movie.id.toString() } className="movie-list__item scroll__list__item">
									              <MovieItem movie={ movie } />
									            </li>
									          );
									        })}
									    </ul>
								    </div>
								</div>
							</div>
					     </section>
					</section>
					<aside className="movie__media">
						<ul className="media__list">
					        {this.state.images.backdrops.map(function(image) {
					          return (
					            <li key={ image.file_path.toString() } className="media__list__item">
					            	{ image.file_path != null &&
					            		<img src={"https://image.tmdb.org/t/p/w500" + image.file_path } alt={ movie.title } className="media__list__item__image" />
					              	}
					            </li>
					          );
					        })}
					    </ul>
				    </aside>
				</div>
			;
		}

	    return (
	    	<div className="container">
	      		{ movie_html }
	      	</div>
	    );
	}

}

export default Movie;
