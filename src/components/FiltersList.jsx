import React from 'react';

export default class FiltersList extends React.Component {

	render() {
		let filters = this.props.filterPrices.map((price,index)=>
			(<li key={index}
				onClick={()=>this.props.applyFilter(price)}>
			Products under ${price}
			</li>)
		)

		return (<div>
					<p>Filter</p>
					<ul>{filters}</ul>
					<p onClick={this.props.reset}>Reset</p>
				</div>)
	}
}

FiltersList.propTypes = {
	filterPrices: React.PropTypes.array
};

FiltersList.defaultProps = {
	filterPrices: [10,25,35]
}
