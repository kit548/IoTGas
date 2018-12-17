import React from 'react';
import {Label} from 'reactstrap';
import CatServices from '../services/CatServices';

export default class CatForm extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
			name:"",
			age:""
		}
	}

	change = (event) => {
		if (event.target.name === "name") {
			this.setState({
				name:event.target.value
			})
		}
		if (event.target.name === "age") {
			this.setState({
				age:event.target.value
			})
		}
	}
	
	
	submit = (event) => {
		event.preventDefault();
		let newCat= {
			"name":this.state.name,
			"age":this.state.age
		}
		CatServices.createOne(newCat)
		.then(newCat => {
			this.setState({ 
				"name": '',
				"age" : ''
			 });
			 this.props.handler();
		})
		.catch( error => { console.log(error)});
	}

	render() {
		return(
			<form onSubmit={this.submit}>
				<Label htmlFor="name">Name: </Label>
				<input type="text"
					   name="name"
					   onChange={this.change}
					   value={this.state.name}/>
				<br/>
				<Label htmlFor="age">Age:   </Label>
				<input type="number"
					   name="age"
					   onChange={this.change}
					   value={this.state.age}/>
				<br/>
				<input type="submit" value="Add new"/>
			</form>
				)
	}

}