import React from 'react';

export default class Main extends React.Component {

	constructor(){
		super();
		this.getProducts = this.getProducts.bind(this);
	}

	getProducts(url){
		return (
			new Promise(function(resolve, reject) {
				var req = new XMLHttpRequest();
				req.open('GET', url);
				req.onload = function() {
					if (req.status == 200) {
						resolve(req.response);
					} else {
						reject(Error(req.statusText));
					}};
				req.onerror = function() {
					reject(Error("Network Error"));
				};
				req.send()
			})
		)
	}

	componentWillMount(){
		this.getProducts('http://sneakpeeq-sites.s3.amazonaws.com/interviews/ce/feeds/store.js').then(function(response) {
			console.log("Success!", response);
		}).catch(function(error) {
			console.log("Failed!", error);
		})
	}

	render() {
		return (
			<div>
			</div>
		)
	}
}
