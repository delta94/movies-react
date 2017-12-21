import React, { Component } from 'react';

import axios from 'axios';

import { Remote } from './Remote';

class Login extends Component {

	constructor(props) {
	    super(props);
	    this.appUrl = process.env.APP_URL;
	}

	componentDidMount() {

		const action = this.props.action;

		if(action == 'approved') {
			this.createSession();
		} else if(action == 'logout') {
			this.destroySession();
		} else {
			this.requestToken();
		}

	    
	}

	destroySession() {
		localStorage.removeItem("session_id");
		localStorage.removeItem("request_token");
		localStorage.removeItem("account");
		window.location = this.appUrl;
	}

	createSession() {
		var th = this;
	    axios.get( Remote('authentication/session/new', { request_token : localStorage.getItem("request_token") }) )
	      .then(function(result) {   
	        var session_id = result.data.session_id;
	        localStorage.setItem("session_id", session_id);
	        th.getAccount(session_id);
	    })
	}

	requestToken() {
		var th = this;
	    axios.get( Remote('authentication/token/new') )
	      .then(function(result) {   
	        var request_token = result.data.request_token;
	        localStorage.setItem("request_token", request_token);
	        window.location = 'https://www.themoviedb.org/authenticate/' + request_token + '?redirect_to=' + th.appUrl + '/approved';

	    })
	}

	getAccount(session_id) {
		var th = this;
	    axios.get( Remote('account', { session_id : session_id }) )
	      .then(function(result) {   
	        var account = result.data;
	        console.log(account);
	        localStorage.setItem("account", JSON.stringify(account));
	        window.location = th.appUrl;
	    })
	}

	render() {

	    return (
	    	<div>
	    	</div>
	    );
	}

}

export default Login;