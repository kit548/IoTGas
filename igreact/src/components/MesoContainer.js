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
			mittausnimi: '',
			lamponimi: '',
			piirralampo: false, 
			gases: [],
		}
	}
		
	componentDidMount() { 
		ReactServices.readGasnames()  
		.then(response => {
			this.setState({ gases: response });
			console.log("Container Gases: "); 
			console.log(this.state.gases);
			this.mita_mitattu(this.state.gases) 
		  })
		.catch(error => {
			console.log("ERROR in Container / componentDidMount");
			console.log(error);
		}); 
		console.log('Container: componentDidUpdate'); 
		console.log(this.state.gases);
	}

	fetchDetails = (event) => {
		this.setState({mittausnimi: event});
		console.log('Container event: ' + this.state.mittausnimi); 
		//this.getLastMesosOfGases();
	}

	mita_mitattu = (gases) => {
		const lampomitattu = 'Lampotila'; 
		let x;
		for (x in gases) {
			if (gases[x] === lampomitattu) {
				this.setState({lamponimi: lampomitattu});
				this.piirralampo = true; 
				console.log('Container: Lampotila asetettu');
			}
			else {
				// viimeisin mitattu kaasu (ei lampotila)
				this.setState({mittausnimi: gases[x]});
				console.log('Container asetettu: ' + gases[x]);
			}
		} 
	}

// onUpdate={MesoLinechart.mittausnimi.bind(this)}
// <MesoLastMeso handler = { this.componentDidMount.bind(this) } />

	render() {
		//console.log(this.state.mesoList) ; 
		
		let listItems = this.state.gases.map((item) => 
		<tr key={item} onClick={() => this.fetchDetails(item)}>
			<td>{item}</td>
		</tr>
		)

		return(
			<div>
			<MesoLinechart mittausnimi = {this.state.mittausnimi} />
			<MesoLinechart mittausnimi = {this.state.lamponimi} />			
			<Table striped bordered>
				<thead>
					<tr>
						<th>Mitatut kaasut</th>
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