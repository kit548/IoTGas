import React from 'react';
//eslint-disable-next-line
import ReactDOM from 'react-dom';
//import {Table, Button} from 'reactstrap';
import {Table} from 'reactstrap';
//eslint-disable-next-line
import moment from 'moment';

import ReactServices from '../services/ReactServices';
import MesoLinechart from './MesoLinechart';
//import GasForm from './GasForm';

export default class Container extends React.Component {
	constructor() {
		super();
		this.state={
			piirtonimi: '',
			kaasunimi: '',
			lamponimi: '',
			gases: [],
		}
	}

	componentDidMount() { 
		this.hae_viimeisimmat_mittaukset();
		this.hae_viimeisimmat_mittaukset = this.hae_viimeisimmat_mittaukset.bind(this);
		console.log('Container: componentDidUpdate'); 
	}

	hae_viimeisimmat_mittaukset = () => {
		ReactServices.readLastvalues() 
		.then(response => {
			this.setState({ gases: response });
			console.log("Container gases: "); 
			console.log(this.state.gases);
			this.mita_mitattu(this.state.gases) 
			this.mita_mitattu = this.mita_mitattu.bind(this);
		  })
		.catch(error => {
			console.log("ERROR in Container / hae_viimeisimmat_mittaukset");
			console.log(error);
		}); 
	} 

	mita_mitattu = (gases) => {
		// kovakoodattu lampoanturi...jos laitetaan gassensor kanta ja kaasuid <- siistimpi 
		const lampomitattu = 'Lampotila'; 
		let x;
		let kaasu = ''; 
		let aika = 0; 
		for (x in gases) {
			if (gases[x].kaasunimi === lampomitattu) {
				this.setState({lamponimi: lampomitattu});
				console.log('Container mita_mitattu: Lampotila'); 	
			}
			else {
				// listan viimeisin mitattu kaasu (ei lampotila) 
				if (gases[x].gagetime > aika) {
					aika = gases[x].gagetime; 
					kaasu = gases[x].kaasunimi;
				}
			}
		}
		this.setState({kaasunimi: kaasu});
		console.log('Container mita_mitattu kaasu: ' + kaasu);
	}

	fetchDetails = (event) => {
		this.setState({kaasunimi: event});
		console.log('Container event: ' + this.state.kaasunimi); 
	}

	render() {
		let listItems = this.state.gases.map((item) => 
		<tr key={item.kaasunimi} onClick={() => this.fetchDetails(item.kaasunimi)}>
			<td>{item.kaasunimi}</td>
			<td>{item.arvo.toFixed(1)}</td>
			<td>{new Date(item.gagetime).toLocaleDateString()}</td>
		</tr>
		)
		console.log('Container render');
		return(
			<div>
			<MesoLinechart piirtonimi = {this.state.kaasunimi} />
			<MesoLinechart piirtonimi = {this.state.lamponimi} />			
			<Table hover size="sm">
				<thead>
					<tr>
						<th>Mitaukset</th>
						<th>viimeisin</th>
						<th>päivä</th>
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