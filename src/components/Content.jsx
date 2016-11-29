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
		this.activeSort = '';
		this.getProducts = this.getProducts.bind(this);
		this.sendProductsRequest = this.sendProductsRequest.bind(this);
		this.displayAllProducts = this.displayAllProducts.bind(this);
		this.toggleFilter = this.toggleFilter.bind(this);
		this.isPriced = this.isPriced.bind(this);
		this.sort = this.sort.bind(this);
		this.cleanUpName = this.cleanUpName.bind(this);
	}
	/**
	* @description Calls the API.
	* @param {string} url
	*/
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
					reject(Error('Network Error'));
				};
				req.send()
			})
		)
	}
	/**
	* @description Creates a list of products.
	* @param {object} products - API call result
	*/
	getProducts(products){
		return this.itemList = products.map(item=>(
			{image: item.mainImage,
			name: this.cleanUpName(item.name.toUpperCase()),
			price: item.msrpInCents / 100,
			date: item.createdAt}
		))
	}
	/**
	* @description Displays full products list.
	* @returns {function}
	*/
	displayAllProducts(){
		this.activeFilters = [];
		return this.setState({items:this.itemList})
	}
	/**
	* @description Checks for price match.
	* @param {object} obj - element to check
	* @returns {object}
	*/
	isPriced(obj){
		return obj.price < this.activeFilters[0]
	}
	/**
	* @description Toggles price filters. Displays products based on the result of filtering.
	* @param {object} e - event, price - filter rule chosen by user
	* @returns {function}
	*/
	toggleFilter(e,price){
		e.preventDefault()
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
	/**
	* @description Moves number-containing words from the beginning of the name to its end.
	* @param {object} elem - product's name
	* @returns {object}
	*/
	cleanUpName(elem){
		elem = elem.split(' ')
		if (parseFloat(elem[0],10)){
			let num = elem.shift()
			elem.push(num)
		}
		return elem.join(' ')
	}
	/**
	* @description Sorts and displays products based on the result of sorting.
	* @param {object} e - event, rule - sorting rule chosen by user
	* @returns {function}
	*/
	sort(e,rule){
		e.preventDefault()
		let items = this.state.items
		this.activeSort = rule
		if(typeof items[0][rule] !== 'number'){
			items = items.sort((a,b)=>a[rule]>b[rule])
		}else{
			items = items.sort((a,b)=>(parseFloat(a[rule],10)-parseFloat(b[rule],10)))
		}
		return this.setState({items})
	}
	/**
	* @description Initiates the API call and directs its response.
	*/
	componentWillMount(){
		let that = this
		this.sendProductsRequest('http://sneakpeeq-sites.s3.amazonaws.com/interviews/ce/feeds/store.js')
			.then(JSON.parse)
			.then(function(response){that.getProducts(response.products)})
			.then(()=>that.displayAllProducts())
			.catch(function(error) {console.log('Failed!', error)})
	}

	render() {
		return (
			<main>
				<FiltersList
					title='Filter by price: '
					subtitle='Under $'
					className='price'
					filters={this.props.filterPrices}
					applyFilter={this.toggleFilter}
					reset={this.displayAllProducts}
					active={this.activeFilters}/>
				<FiltersList
					title='Sort by: '
					className='sort'
					filters={this.props.sortCriteria}
					applyFilter={this.sort}
					active={this.activeSort}/>
				<ProductsList list={this.state.items}/>
			</main>
		)
	}
}

Content.propTypes = {
	filterPrices: React.PropTypes.array,
	sortCriteria: React.PropTypes.array
};

Content.defaultProps = {
	filterPrices: [10,25,35],
	sortCriteria: ['name','price','date']
}

