import React from 'react';

export default class FiltersList extends React.Component {

	render() {
		let filters = this.props.filters,
			subtitle = this.props.subtitle || ''

		filters = filters.map((val,index)=>
			(<li key={index}
				onClick={()=>this.props.applyFilter(val)}>
				<p className={this.props.active.indexOf(val) !== -1 ? 'active' : null}>{subtitle + val}</p>
			</li>)
		)

		return (<div>
					<p>{this.props.title}</p>
					<ul>{filters}</ul>
					<p onClick={this.props.reset}>Reset</p>
				</div>)
	}
}
