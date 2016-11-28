import React from 'react';
import Picture from './Picture';

export default class ProductsList extends React.Component {

	render() {
		let items = this.props.list.map((item,index)=>
			(<li key={index} className='products__list__item'>
				<Picture image={item.image} name={item.name}/>
				<div>
					<p className='product__name'>{item.name}</p>
					<p className='product__price'>${item.price}</p>
				</div>
			</li>)
		)

		return (<div className='products__container'>
					<ul className='products__list'>{items}</ul>
				</div>)
	}
}
