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


const defauldScatterShowInterval = 1000 * 60 * 60 * 4;

export default class Container extends React.Component {
	constructor() {
		super();
		this.state={
			piirtonimi: '',
			kaasunimi: '',
			lamponimi: '',
			piirtoalku: 0, 
			piirtoloppu: 10, 
			gases: [],
		}
	}

	componentDidMount() { 
		this.hae_viimeisimmat_mittaukset();
		console.log('Container: componentDidUpdate'); 
	}

	hae_viimeisimmat_mittaukset = () => {
		ReactServices.readLastvalues() 
		.then(response => {
			this.setState({ gases: response });
			console.log("Container gases: "); 
			console.log(this.state.gases);
			this.mita_mitattu(this.state.gases); 
		  })
		.catch(error => {
			console.log("ERROR in Container / hae_viimeisimmat_mittaukset");
			console.log(error);
		}); 
	} 

	mita_mitattu = (gases) => {
		// this.mita_mitattu = this.mita_mitattu.bind(this);
		// kovakoodattu lampoanturi...jos laitetaan gassensor kanta ja kaasuid <- siistimpi 
		const lampomitattu = 'Lampotila'; 
		let x;
		let kaasu = ''; 
		let lampo = ''; 
		let aika = 0; 
		for (x in gases) {
			if (gases[x].kaasunimi === lampomitattu) {
				lampo = lampomitattu; 
			}
			else {
				// listan viimeisin mitattu kaasu (ei lampotila) 
				if (gases[x].gagetime > aika) {
					aika = gases[x].gagetime; 
					kaasu = gases[x].kaasunimi;
				}
			}
		}
		this.setState({piirtoalku: aika - defauldScatterShowInterval}); 
		this.setState({piirtoloppu: aika});
		this.setState({kaasunimi: kaasu});
		this.setState({lamponimi: lampo});
		console.log("Container: mita_mitattu");
		console.log(this.state.kaasunimi);
		console.log(this.state.lamponimi);
	}	

	fetchDetails = (event) => {
		this.setState({piirtoalku: event.gagetime - defauldScatterShowInterval}); 
		this.setState({piirtoloppu: event.gagetime});
		this.setState({kaasunimi: event.kaasunimi});
		this.setState({lamponimi: this.state.lamponimi});
		console.log('Container event: ' + this.state.kaasunimi); 
		console.log('Container loppu: ' + this.state.piirtoloppu); 
	}

	//<td>{new Date(item.gagetime).toLocaleDateString()}</td>
	render() {
		let listItems = this.state.gases.map((item) => 
		<tr key={item.kaasunimi} onClick={() => this.fetchDetails(item)}>
			<td>{item.kaasunimi}</td>
			<td>{item.arvo.toFixed(1)}</td>
			<td>{new Date(item.gagetime).toLocaleDateString()}</td>
		</tr>
		)
		console.log('Container render');
		return(
			<div>
			<MesoLinechart className = 'Gas' 
				piirtonimi = {this.state.kaasunimi} 
				piirtoalku = {this.state.piirtoalku}
				piirtoloppu = {this.state.piirtoloppu} 
				/>
			<MesoLinechart className = 'Temp'
				piirtonimi = {this.state.lamponimi} 
				piirtoalku = {this.state.piirtoalku}
				piirtoloppu = {this.state.piirtoloppu}
			/>			
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
