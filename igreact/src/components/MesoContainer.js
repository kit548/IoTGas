import React from 'react';
//eslint-disable-next-line
import ReactDOM from 'react-dom';
//import {Table, Button} from 'reactstrap';
import {Table, Button, ButtonGroup,  Row, Col } from 'reactstrap';
//eslint-disable-next-line
import moment from 'moment';

import ReactServices from '../services/ReactServices';
import MesoLinechart from './MesoLinechart';
//import GasForm from './GasForm';


let defScatterShowInterval = 1000 * 60 * 60 * 6;  //6 hours
let defzoomaskel = defScatterShowInterval/10 ;
let defpiirtoloppu = 0; 
//let defpiirtoalku = 0;


export default class Container extends React.Component {
	constructor() {
		super();
		this.state={
			piirtonimi: '',
			kaasunimi: '',
			lamponimi: '',
			piirtoalku: 0, 
			piirtoloppu: 10, 
			defpiirtoalku:0,
			piirtohaedata: true,
			piirtozoom: '',
			gases: [],
		}
	}

	componentDidMount() { 
		this.hae_viimeisimmat_mittaukset();
		console.log('Container: componentDidUpdate');
		//this.zoomi = this.zoomi.bind(this); 
		this.mita_mitattu = this.mita_mitattu.bind(this); 
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
		console.log(kaasu);
		ReactServices.readGasFirst(kaasu) 
		.then(response => {
			this.setState({ piirtoalku: response.gagetime });
			this.setState({ defpiirtoalku: response.gagetime });
			console.log("Container kaasu 1st: "); 
			console.log(response);
		  })
		.catch(error => {
			console.log("ERROR in Container / kaasu 1st meso");
			console.log(error);
		});
		defpiirtoloppu = aika; 
		//this.setState({piirtoalku: aika - defScatterShowInterval}); 
		this.setState({piirtoloppu: aika});
		this.setState({kaasunimi: kaasu});
		this.setState({lamponimi: lampo});
		console.log("Container: mita_mitattu");
		console.log(this.state.kaasunimi);
		console.log(this.state.lamponimi);
	}	

	fetchDetails = (event) => {
		this.setState({piirtoalku: event.gagetime - defScatterShowInterval}); 
		this.setState({piirtoloppu: event.gagetime});
		this.setState({kaasunimi: event.kaasunimi});
		this.setState({lamponimi: this.state.lamponimi});
		this.setState({piirtohaedata: true});
		console.log('Container event: ' + this.state.kaasunimi); 
		console.log('Container loppu: ' + this.state.piirtoloppu); 
	}

	zoomi = (event) => {
		console.log("Zoom: " + event);
		//this.setState({piirtohaedata: false}); 
		let temploppu = defpiirtoloppu;
		let tempalku =  this.state.defpiirtoalku;
		let tempaskel = defzoomaskel; 
		if (event === "reset") {
			console.log("default: " + defpiirtoloppu + " " + defScatterShowInterval)
			this.setState({piirtoloppu: defpiirtoloppu});
			this.setState({piirtoalku: defpiirtoloppu - defScatterShowInterval});
		}
		else if (event === "<") {
			console.log("< " + defzoomaskel + " " )
			this.setState({piirtoloppu: this.state.piirtoloppu - defzoomaskel});
			this.setState({piirtoalku: this.state.piirtoalku - defzoomaskel});
		}
		else if (event === ">") {
			temploppu = this.state.piirtoloppu + defzoomaskel;
			if (temploppu > defpiirtoloppu) {
				tempaskel = temploppu - defpiirtoloppu ;
				temploppu = defpiirtoloppu ;
			}
			console.log("> " + temploppu + " " + tempaskel)
			this.setState({piirtoloppu: temploppu});
			this.setState({piirtoalku: this.state.piirtoalku + tempaskel});
		}
		else if (event === "zoomout-") {
			temploppu = this.state.piirtoloppu + defzoomaskel; 
			tempalku = this.state.piirtoalku - defzoomaskel; 
			if (temploppu >= defpiirtoloppu) {
				temploppu = defpiirtoloppu ;
			}			
			this.setState({piirtoalku: tempalku});
			this.setState({piirtoloppu: temploppu});
			console.log(event + " " + tempalku + "  " + temploppu)
		}
		else if (event === "zoomin+") {
			temploppu = this.state.piirtoloppu - defzoomaskel; 
			tempalku = this.state.piirtoalku + defzoomaskel; 
			const minimizoom = 10000 ; //ms
			if (tempalku + minimizoom > temploppu) {
				temploppu = (temploppu + tempalku)/2 ;
				tempalku = temploppu - minimizoom/2
				temploppu = temploppu + minimizoom/2 ;
			}			
			this.setState({piirtoalku: tempalku});
			this.setState({piirtoloppu: temploppu});
			console.log(event + " " + tempalku + "  " + temploppu + " " + (temploppu-tempalku));
		}
		else {
			console.log("Zoo...uusi...: " + event + " " + defzoomaskel + " " + defScatterShowInterval)
			//this.setState({piirtoalku: this.state.piirtoalku + Number(event) * defzoomaskel});
			//this.setState({piirtoloppu: this.state.piirtoloppu - Number(event) * defzoomaskel});
		}
		console.log(this.state.defpiirtoalku)
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
		console.log('Container render...');
		return(
			<div>
			<MesoLinechart className = 'Gas' 
				piirtonimi = {this.state.kaasunimi} 
				piirtoalku = {this.state.piirtoalku}
				piirtoloppu = {this.state.piirtoloppu} 
				piirtohaedata  = {this.state.piirtohaedata} 
				piirtozoom = {this.state.piirtozoom} 
				/>
			<ButtonGroup justified="jotain" size="sm">
				<Button outline color="primary" 
					onClick={() => this.zoomi('<')}> {"<"} </Button>
				<Button outline color="primary" 
					onClick={() => this.zoomi("zoomout-")}> - </Button>
				<Button outline color="primary"  
					onClick={() => this.zoomi("reset")}> Reset </Button>
				<Button outline color="primary"
					onClick={() => this.zoomi("zoomin+")}> + </Button>
				<Button outline color="primary"
					onClick={() => this.zoomi('>')}> {">"} </Button>					
			</ButtonGroup>
								
			<MesoLinechart className = 'Temp'
				piirtonimi = {this.state.lamponimi} 
				piirtoalku = {this.state.piirtoalku}
				piirtoloppu = {this.state.piirtoloppu}
				piirtohaedata  = {this.state.piirtohaedata}
				piirtozoom = {this.state.piirtozoom} 
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
