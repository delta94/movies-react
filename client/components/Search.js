import React, { Component } from 'react';
import {  Link } from 'react-router-dom';

import moment from 'moment';

import './Search.scss';

var axios = require('axios');

import { Remote } from './Remote';

class Search extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      movies: [],
	      value : ''
	    };

	    this.searchItems = this.searchItems.bind(this);
	}

	/*componentDidMount() {

		var currentValue = encodeURI(this.state.value);
		
		var th = this;
	    axios.get( Remote('search/movie', { query : currentValue }) )
	      .then(function(result) {   
	        
	        th.setState({
	          movies: result.data.results
	        });

	    })
	}*/

	clearOption(event) {
		this.setState({value: ''})
	}

	searchItems(event) {

		var currentValue = event.target.value;

	    this.setState({value: currentValue});

	    console.log(this.state.value);

	    if( currentValue == '' ) {
	    	this.setState({movies: []});
	    } else {
	    	

	    	var th = this;
		    axios.get( Remote('search/movie', { query : encodeURI(currentValue) }) )
		      .then(function(result) {   
		        
		        th.setState({
		          movies: result.data.results
		        });

		    })
	    }
	    
	}

	render() {
	    return (
	    <div className="search">
	    	<input className="search__field" type="text" value={this.state.value} onChange={this.searchItems} placeholder="Search for a movie..." />
		    <ul className="search__list">
		        {this.state.movies.map(function(movie) {
		          return (
		            <li key={ movie.id.toString() } className="search__list__item">
		            	<Link to={"/movies/" + movie.id.toString() } className="search__list__item__link" onClick="clearOption()">
		            		<img src={"https://image.tmdb.org/t/p/w92" + movie.poster_path } alt="{ movie.title }" className="search__list__item__image" />
							<h4 className="search__list__item__title">{ movie.title }</h4>
							<p className="search__list__item__year">{ moment(movie.release_date).format('Y') }</p>
						</Link>
		            </li>
		          );
		        })}
		    </ul>
	      </div>
	    );
	}
}

export default Search;