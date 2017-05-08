import React, { Component } from 'react';
import './Movie.scss';

var axios = require('axios');

import MovieItem from './MovieItem';

import { Remote } from './Remote';

class Movie extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      movie: {},
	      loaded : false,
	      similar : []
	    };
	  }

	  loadMovie(id) {
	    var th = this;
	    axios.get( Remote('movie/' + id) )
	      	.then(function(result) {  
	        	th.setState({
	          		movie: result.data,
	          		loaded: true
	        	});
	      	});
	    this.getSimilar(id);
	  }

	  componentDidMount() {
	  	/*var th = this;
	    axios.get( Remote('movie/' + this.props.id) )
	      	.then(function(result) {  
	        	th.setState({
	          		movie: result.data,
	          		loaded: true
	        	});
	      	});
	    this.getSimilar();*/
	    console.log(this.props.id);
	    this.loadMovie(this.props.id);
	  }

	componentWillReceiveProps(nextProps) {
		    if( this.props.id !== nextProps.id) 
		    {
		           this.loadMovie(nextProps.id);
		    }
		}

	  getSimilar(id) {
	  	var th = this;
	     axios.get( Remote('movie/' + id + '/similar') )
	      .then(function(result) {  
	        console.log(result);  
	        th.setState({
	          similar: result.data.results
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
					<section className="movie__header" style={ {backgroundImage: "url(https://image.tmdb.org/t/p/w1280" + movie.backdrop_path} }>
					</section>
					<section className="section">
						<div className="row">
							<div className="medium-3 columns">

								<img className="movie__poster" src={"https://image.tmdb.org/t/p/w500" + movie.poster_path } alt="{ movie.title }" />
								
							</div>
							<div className="medium-9 columns">
								<h2>{ movie.title }</h2>
								<p>{ movie.overview }</p>
								<div className="rating">
									{ movie.vote_average }
									{ movie.vote_count }
								</div>
							</div>
						</div>
					</section>
					<section className="section">
					<h3>You may also like</h3>
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