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
		this.sort = this.sort.bind(this);
		this.cleanUpName = this.cleanUpName.bind(this);
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
		return this.itemList = products.map((item, index)=>(
			{image: item.mainImage,
			name: this.cleanUpName(item.name.toUpperCase()),
			price: item.msrpInCents / 100,
			date: item.createdAt}
		))
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

	cleanUpName(elem){
		elem = elem.split(' ')
		if (parseFloat(elem[0],10)){
			let num = elem.shift()
			elem.push(num)
		}
		return elem.join(' ')
	}

	sort(rule){
		let items = this.state.items
		if(typeof items[0][rule] !== 'number'){
			items = items.sort((a,b)=>a[rule]>b[rule])
		}else{
			items = items.sort((a,b)=>(parseFloat(a[rule],10)-parseFloat(b[rule],10)))
		}
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
				<FiltersList
					title='Filter by price: '
					subtitle='Under $'
					filters={this.props.filterPrices}
					applyFilter={this.toggleFilter}
					reset={this.displayAllProducts}/>
				<FiltersList
					title='Sort by: '
					filters={this.props.sortCriteria}
					applyFilter={this.sort}
					reset={this.displayAllProducts}/>
				<ProductsList list={this.state.items}/>
			</div>
		)
	}
}

Content.propTypes = {
	filterPrices: React.PropTypes.array,
	sortCriteria: React.PropTypes.array
};

Content.defaultProps = {
	filterPrices: [10,25,35],
	sortCriteria: ['name', 'price', 'date']
}

