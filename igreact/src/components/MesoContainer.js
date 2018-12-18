import React from 'react';
//eslint-disable-next-line
import ReactDOM from 'react-dom';
//import {Table, Button} from 'reactstrap';
import {Table} from 'reactstrap';
//eslint-disable-next-line
import moment from 'moment';

import ReactServices from '../services/ReactServices';
//eslint-disable-next-line
import MesoLastMeso from './MesoLastMeso';
import MesoLinechart from './MesoLinechart';
//import GasForm from './GasForm';


export default class Container extends React.Component {
	constructor() {
		super();
		this.state={
			mesoList:[],
			piirtokaasu: '',
			gases: [],
		}
	}
		
	//ReactServices.readAll()  ->  readLast100()
		//ReactServices.readLast100()
	componentDidMount() { 
		ReactServices.readGasnames()  
		.then(response => {
			this.setState({ gases: response });
			console.log("Gases:"); 
			console.log(this.state.gases);
		  })
		.catch(error => {
			console.log("ERROR in Container / componentDidMount");
			console.log(error);
		}); 
		console.log(this.state.gases);
	}

	fetchDetails = (event) => {
		this.setState({piirtokaasu: event});
		console.log('MesoContainer this: ' + this.state.piirtokaasu);
		//this.getLastMesosOfGases();

	}

// onUpdate={MesoLinechart.piirtokaasu.bind(this)}
// <center> <Table> </Table> </center>
	render() {
		//console.log('Map mesoList') ;
		//console.log(this.state.mesoList) ;

		let listItems = this.state.gases.map((item) => 
		<tr key={item} onClick={() => this.fetchDetails(item)}>
			<td>{item}</td>
			<td>{ }</td>
			<td>{ }</td>
		</tr>
		)
				
		
		return(
			<div>
			<MesoLastMeso handler = { this.componentDidMount.bind(this) } />
			<MesoLinechart piirtokaasu = {this.state.piirtokaasu} />

			<Table striped bordered>
				<thead>
					<tr>
						<th>Mitatut kaasut</th>
						<th>Arvo</th>
						<th>Aika</th>
					</tr>
				</thead>
				<tbody>
					{ listItems }
				</tbody>
			</Table>

			</div>						
		)
	}
}