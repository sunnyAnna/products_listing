import React from 'react';
import ProductsList from './ProductsList';
import FiltersList from './FiltersList';

export default class Content extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			items:[]
		};
		this.itemList = [];
		this.activeFilters = [];
		this.getProducts = this.getProducts.bind(this);
		this.sendProductsRequest = this.sendProductsRequest.bind(this);
		this.displayAllProducts = this.displayAllProducts.bind(this);
		this.toggleFilter = this.toggleFilter.bind(this);
		this.isPriced = this.isPriced.bind(this);
	}

	sendProductsRequest(url){
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

	getProducts(products){
		return this.itemList = products.map((item, index)=>({image: item.mainImage, name: item.name, price: item.msrpInCents / 100}))
	}

	displayAllProducts(){
		this.activeFilters = [];
		return this.setState({items:this.itemList})
	}

	isPriced(obj){
		return obj.price < this.activeFilters[0]
	}

	toggleFilter(price){
		let filters = this.activeFilters,
			elem = filters.indexOf(price)
		if (elem===-1 && price < filters[0] || filters.length==0) {
			filters.unshift(price)
		} else if (elem!==-1) {
			filters.splice(elem,1)
		} else {
			return
		}

		let items = this.itemList
		items = filters.length>0 ? items.filter(this.isPriced) : items
		return this.setState({items})
	}

	componentWillMount(){
		let that = this
		this.sendProductsRequest('http://sneakpeeq-sites.s3.amazonaws.com/interviews/ce/feeds/store.js').then(JSON.parse).then(function(response){
			that.getProducts(response.products);
		}).then(function(response){
			that.displayAllProducts();
		}).catch(function(error) {
			console.log("Failed!", error);
		})
	}

	render() {

		return (
			<div>
				<FiltersList applyFilter={this.toggleFilter} reset={this.displayAllProducts}/>
				<ProductsList list={this.state.items}/>
			</div>
		)
	}
}

