import React from 'react';
//eslint-disable-next-line
import ReactDOM from 'react-dom';
//eslint-disable-next-line
import {Table, Button, ButtonGroup,  Row, Col } from 'reactstrap';
//eslint-disable-next-line
import moment from 'moment';

import ReactServices from '../services/ReactServices';
import MesoLinechart from './MesoLinechart';
//import GasForm from './GasForm';


let defScatterShowInterval = 1000 * 60 * 60 ; // 1h
let defmaxpiirtoloppu = 0; 

export default class Container extends React.Component {
	constructor() {
		super();
		this.state={
			piirtonimi: '',
			kaasunimi: '',
			lamponimi: '',
			piirtoalku: 0, 
			piirtoloppu: 10, 
			minpiirtoalku: 0,
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
			this.hae_kaasun_ensimmainen_mittaus(this.state.kaasunimi);
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
		defmaxpiirtoloppu = aika; 
		this.setState({piirtoloppu: defmaxpiirtoloppu});
		this.setState({piirtoalku: defmaxpiirtoloppu - defScatterShowInterval});
		this.setState({kaasunimi: kaasu});
		this.setState({lamponimi: lampo});
		console.log("Container: mita_mitattu");
		console.log(this.state.kaasunimi);
		console.log(this.state.lamponimi);
	}	

	hae_kaasun_ensimmainen_mittaus = (kaasu) => {
		ReactServices.readGasFirst(kaasu) 
		.then(response => {
			this.setState({ minpiirtoalku: response.gagetime });
			console.log("Container kaasu 1st: "); 
			console.log(response);
		})
		.catch(error => {
			console.log("ERROR in Container / kaasu 1st meso");
			console.log(error);
		});
	}

	hae_kaasun_viimeinen_mittaus = (kaasu) => {
		ReactServices.readGasLast(kaasu) 
		.then(response => {
			this.setState({ piirtoloppu: response.gagetime });
			defmaxpiirtoloppu = response.gagetime;
			console.log("Container kaasu 1st: "); 
			console.log(response);
		})
		.catch(error => {
			console.log("ERROR in Container / kaasu 1st meso");
			console.log(error);
		});
	}

	fetchDetails = (event) => {
		this.hae_kaasun_ensimmainen_mittaus(event.kaasunimi);
		defmaxpiirtoloppu = event.gagetime
		this.setState({piirtoalku: defmaxpiirtoloppu - defScatterShowInterval}); 
		this.setState({piirtoloppu: defmaxpiirtoloppu});
		this.setState({kaasunimi: event.kaasunimi});
		//this.setState({lamponimi: this.state.lamponimi});
		this.setState({piirtohaedata: true});
		console.log('Container event: ' + this.state.kaasunimi); 
		console.log('Container loppu: ' + defmaxpiirtoloppu + "=" + this.state.piirtoloppu); 
	}

	// osa (koko) zoomista voisi toimia paremmin MesoLinechart:n puolella 
	zoomi = (event) => {
		console.log("Zoom: " + event);
		//this.setState({piirtohaedata: false}); 
		let temploppu = this.state.piirtoloppu;
		let tempalku = this.state.piirtoalku;
		let tempaskel = ((Number(temploppu) - Number(tempalku))/10).toFixed(0);
		console.log(tempalku + '..' + temploppu + '=' + (temploppu - tempalku) + ' askel: ' + tempaskel);
		console.log("rajat min: " + this.state.minpiirtoalku + ' max:' + defmaxpiirtoloppu);
		if (event === "reset") {
			console.log("reset default: " + defmaxpiirtoloppu + " " + defScatterShowInterval);
			this.setState({piirtoloppu: defmaxpiirtoloppu});
			this.setState({piirtoalku: defmaxpiirtoloppu - defScatterShowInterval});
		}
		else if (event === "<") {
			temploppu = this.state.piirtoloppu - Number(tempaskel*3);
			tempalku = this.state.piirtoalku - Number(tempaskel*3);
			if (tempalku < this.state.minpiirtoalku) {
				tempaskel = Number((temploppu - tempalku)/10).toFixed(0);
				tempaskel = tempaskel*3 - Number(this.state.minpiirtoalku - Number(tempalku));
				temploppu = Number(this.state.piirtoloppu) - Number(tempaskel);
				tempalku = this.state.minpiirtoalku;
			}
			console.log(event + " " + + temploppu + " " + tempaskel);
			this.setState({piirtoloppu: temploppu});
			this.setState({piirtoalku: this.state.piirtoalku + Number(tempaskel)});
		}
		else if (event === ">") {
			temploppu = this.state.piirtoloppu + Number(tempaskel*3);
			tempalku = this.state.piirtoalku + Number(tempaskel*3);
			if (temploppu > defmaxpiirtoloppu) {
				tempaskel = tempaskel*3 - Number(Number(temploppu) - defmaxpiirtoloppu);
				temploppu = defmaxpiirtoloppu ;
				tempalku = this.state.piirtoalku + Number(tempaskel);
			}
			console.log(event + " " + temploppu + " " + tempaskel);
			this.setState({piirtoloppu: temploppu});
			this.setState({piirtoalku: this.state.piirtoalku + tempaskel});
		}
		else if (event === ">>") {
			this.hae_kaasun_viimeinen_mittaus(this.state.kaasunimi);
			console.log(event + " haetaan kannasta uusimmat");

		}
		else if (event === "<<") {
			console.log(event + " näytä kaikki " + this.state.minpiirtoalku + ' ' + defmaxpiirtoloppu);
			this.setState({piirtoloppu: defmaxpiirtoloppu});
			this.setState({piirtoalku: this.state.minpiirtoalku});
		}
		else if (event === "zoomout-") {
			temploppu = Number(temploppu) + Number(tempaskel); 
			tempalku = Number(tempalku) - Number(tempaskel); 
			if (temploppu >= defmaxpiirtoloppu) {
				temploppu = defmaxpiirtoloppu ;
			} 	
			if (tempalku <= this.state.minpiirtoalku){
				tempalku = this.state.minpiirtoalku;
			}		
			this.setState({piirtoalku: tempalku});
			this.setState({piirtoloppu: temploppu});
			console.log(event + " " + tempalku + "  " + temploppu);
		}
		else if (event === "zoomin+") {
			temploppu = Number(temploppu) - Number(tempaskel); 
			tempalku = Number(tempalku) + Number(tempaskel); 
			console.log("+:" + tempalku);
			const minimizoom = 1000 * 60 * 5 ; 
			if ((Number(temploppu) - Number(tempalku)) < Number(minimizoom)) {
				const ka = Number((Number(temploppu) + Number(tempalku))/2).toFixed(0);
				tempalku = Number(ka) - Number(minimizoom/2);
				temploppu = Number(ka) + Number(minimizoom/2);
			}			
			this.setState({piirtoalku: tempalku});
			this.setState({piirtoloppu: temploppu});
			console.log(event + " " + tempalku + "..." + temploppu + "->" + (temploppu-tempalku));
		}
		else {
			console.log("Zoom: " + event + " uusi, ei ole määritelty!");
			//this.setState({piirtoalku: this.state.piirtoalku + Number(event) * defzoomaskel});
			//this.setState({piirtoloppu: this.state.piirtoloppu - Number(event) * defzoomaskel});
		}
		console.log(this.state.minpiirtoalku)
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
					onClick={() => this.zoomi('<<')}> {"<< (all)"} </Button>
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
				<Button outline color="primary"
					onClick={() => this.zoomi('>>')}> {">>"} </Button>					
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
