import React from 'react';
import Content from './Content';

export default class App extends React.Component {

	render() {
		return (
			<div>
				<header>
					<h1>Fiji water</h1>
					<p>accessories</p>
				</header>
				<Content/>
				<footer></footer>
			</div>
		)
	}
}
