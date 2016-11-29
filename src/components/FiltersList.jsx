import React from 'react';

export default class FiltersList extends React.Component {

	render() {
		let filters = this.props.filters,
			subtitle = this.props.subtitle || '',
			resetFunc = this.props.reset
		/**
		 * @description Switches filter class depending on filter's activity status.
		 */
		filters = filters.map((val,index)=>
			(<li key={index}
				className='filters__list__item'>
				<a href='#'
					className={this.props.active.indexOf(val) !== -1 ? 'active' : 'passive'}
					onClick={(e)=>this.props.applyFilter(e,val)}>
					{subtitle + val}
				</a>
			</li>)
		)

		return (<div className='filters__container'>
					{resetFunc ? <button
						className='button--reset'
						onClick={resetFunc}>
						Reset
					</button> : null}
					<p className='filters__list__title'>{this.props.title}</p>
					<ul className={['filters__list--', this.props.className].join('')}>{filters}</ul>
				</div>)
	}
}
