import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Button} from 'reactstrap';

import CatServices from '../services/CatServices';
import CatForm from './CatForm';

export default class Container extends React.Component {
	constructor() {
		super();
		this.state={
			catList:[]
		}
	}
	
	componentDidMount() {
		CatServices.readAll()
		.then(response => {
			this.setState({ catList: response });
		  })
		.catch(error => {
			console.log("ERROR in Container / componentDidMount");
			console.log(error);
		}) 
	}
	
	deleteCat = (event) => {
		let name = event.target.name;
		CatServices.destroyOne(event.target.name)
		.then( () => {
			let dummy = this.state.catList.filter(cat => cat.name !== name);
			this.setState(
				{ catList: dummy } 
			)
		})
		.catch( error => { console.log(error)});
	}

	updateCat = (event) => {
		CatServices.updateOne(event.target.name)
		.then( () => {
			this.componentDidMount();
		})
		.catch( error => { console.log(error)});
	}

	//<center> & </center>

	render() {
		let listItems = this.state.catList.map((item) => 
		<tr key={item.name}>
			<td>{item.name}</td>
			<td>{item.age}</td>
			<td><Button onClick={this.deleteCat}
						name={ item.name }>Remove
				</Button></td>
			<td><Button onClick={this.updateCat}
						name={ item.name }>Update...
				</Button></td>
		</tr>
		)
		return(
			<div>
			<CatForm handler = { this.componentDidMount.bind(this) } />
			<left>
			<Table striped bordered>
				<thead>
					<tr>
						<th>Name</th>
						<th>Age</th>
						<th>Remove</th>
						<th>Update...</th>
					</tr>
				</thead>
				<tbody>
					{ listItems }
				</tbody>
			</Table>
			</left>
			</div>
		)
	
	}
}