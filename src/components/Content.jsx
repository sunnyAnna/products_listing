import React from 'react';

export default class Content extends React.Component {

	constructor(){
		super();
		this.state = {items:[]};
		this.getProducts = this.getProducts.bind(this);
		this.displayProducts = this.displayProducts.bind(this);
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

	displayProducts(products){
		let items = products.map(function(item, index){
			// TODO: add sizes to img
			return (
				<li key={index}>
					<img src={item.mainImage.ref}/>
					<p>{item.name}</p>
					<p>{item.msrpInCents / 100}</p>
				</li>
			)
		})

		return this.setState({items: <ul>{items}</ul>})
	}

	componentWillMount(){
		let that = this
		this.getProducts('http://sneakpeeq-sites.s3.amazonaws.com/interviews/ce/feeds/store.js').then(function(response) {
			let data = JSON.parse(response)
			that.displayProducts(data.products);
		}).catch(function(error) {
			console.log("Failed!", error);
		})
	}

	render() {
		return (
			<div>
				{this.state.items}
			</div>
		)
	}
}
