import React from 'react';
import Picture from './Picture';

export default class ProductsList extends React.Component {

	render() {
		let items = this.props.list.map((item,index)=>
			(<li key={index}>
				<Picture image={item.image} name={item.name}/>
				<p>{item.name}</p>
				<p>{item.price}</p>
			</li>)
		)

		return <ul>{items}</ul>
	}
}
