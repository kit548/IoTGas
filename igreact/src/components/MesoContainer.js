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
			//mesoList:[],
			piirtonimi: '',
			kaasunimi: '',
			lamponimi: '',
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
		this.mita_mitattu = this.mita_mitattu.bind(this);
	}

	fetchDetails = (event) => {
		this.setState({kaasunimi: event});
		console.log('Container event: ' + this.state.kaasunimi); 
		//this.getLastMesosOfGases();
	}

	mita_mitattu = (gases) => {
		const lampomitattu = 'Lampotila'; 
		let x;
		let kaasu; 
		for (x in gases) {
			if (gases[x] === lampomitattu) {
				this.setState({lamponimi: lampomitattu});
				console.log('Container mita_mitattu: Lampotila'); 	
			}
			else {
				// viimeisin mitattu kaasu (ei lampotila)
				kaasu = gases[x];
				console.log('Container mita_mitattu : ' + gases[x]);
			}
		}
		this.setState({kaasunimi: kaasu});
	}

// onUpdate={MesoLinechart.piirtonimi.bind(this)}
	render() {
	
		let listItems = this.state.gases.map((item) => 
		<tr key={item} onClick={() => this.fetchDetails(item)}>
			<td>{item}</td>
		</tr>
		)

		console.log('Container render this.state.piirtonimi : ' + this.state.piirtonimi);

		return(
			<div>
			<MesoLinechart piirtonimi = {this.state.kaasunimi} />
			<MesoLinechart piirtonimi = {this.state.lamponimi} />			
			<Table striped bordered >
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