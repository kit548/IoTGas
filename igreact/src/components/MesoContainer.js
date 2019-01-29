import React from 'react';
//eslint-disable-next-line
import ReactDOM from 'react-dom';
//eslint-disable-next-line
import {Table, Button, ButtonGroup, Badge } from 'reactstrap';
//import os from 'react-native-os'; 
//eslint-disable-next-line
import moment from 'moment';

import ReactServices from '../services/ReactServices';
import MesoLinechart from './MesoLinechart';

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
			piirtohaedata: true,  // testing Linechart... remove all these? 
			gases: [],
		}
	}

	componentDidMount() { 
		this.hae_viimeisimmat_mittaukset();
		this.mita_mitattu = this.mita_mitattu.bind(this); 
		this.zoomi = this.zoomi.bind(this); 
		this.autoreFreshOn(); 
		console.log('Container: componentDidUpdate');
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	autoreFreshOn() {
		// auto refresh every 30 seconds 
		this.interval = setInterval(() => this.tick(), (30.0 * 1000.0)); 
	}

	tick() {
		console.log("container tick (auto refresh)");
		this.hae_kaasun_viimeinen_mittaus(this.state.kaasunimi); 
		this.updateLastMeasurements()
	}

	updateLastMeasurements() {
		ReactServices.readLastvalues() 
		.then(response => {
			this.setState({ gases: response });
		})
		.catch(error => {
			console.log("ERROR in Container / hae_viimeisimmat_mittaukset");
			console.log(error);
		});
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
		// kovakoodattu lampoanturi...jos laitetaan gassensor kanta ja kaasuid <- siistimpi 
		const lampomitattu = 'Lampotila'; 
		let x, aika = 0;
		let kaasu, lampo = ''; 
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
			this.setState({piirtohaedata: true}); 
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
			this.setState({piirtoloppu: response.gagetime});
			this.setState({piirtohaedata: true}); 
			defmaxpiirtoloppu = response.gagetime;
			console.log("Container kaasu 1st: "); 
			console.log(response);
		})
		.catch(error => {
			console.log("ERROR in Container / kaasu 1st meso");
			console.log(error);
		});
	}

	// osa (koko) zoom voisi toimia paremmin MesoLinechart:n puolella 
	zoomi = (event) => {
		this.buttomsEnabled();
		clearInterval(this.interval); 
		console.log("auto refresh off");
		//this.setState({piirtohaedata: false}); 
		let temploppu = Number(this.state.piirtoloppu);
		let tempalku = Number(this.state.piirtoalku);
		let tempaskel = Number((Number(temploppu) - Number(tempalku))/10.0).toFixed(0);
		console.log("Zoom: " + event);
		console.log("This.state:" + tempalku + '..' + temploppu + ' = ' + (temploppu - tempalku) + ' -> askel: ' + tempaskel);
		console.log("rajat min: " + this.state.minpiirtoalku + ' max:' + defmaxpiirtoloppu); 

		if (event === "reset") {
			temploppu = Number(defmaxpiirtoloppu); 
			tempalku = Number(defmaxpiirtoloppu) - Number(defScatterShowInterval); 
			this.setState({reset: true});
		}
		else if (event === "<") {
			temploppu -= Number(tempaskel);
			tempalku -= Number(tempaskel);
			if (tempalku < this.state.minpiirtoalku) {
				tempalku = Number(this.state.minpiirtoalku);
				temploppu = Number(tempalku) + Number(tempaskel); 
				this.setState({left1: true});
			}
		}
		else if (event === ">") {
			temploppu += Number(tempaskel);
			tempalku += Number(tempaskel);
			if (temploppu > defmaxpiirtoloppu) {
				temploppu = Number(defmaxpiirtoloppu) ;
				tempalku = Number(defmaxpiirtoloppu) - Number(tempaskel);
				this.setState({right1: true});
			}
		}
		else if (event === ">>") {
			this.hae_kaasun_viimeinen_mittaus(this.state.kaasunimi);
			this.updateLastMeasurements(); 
			console.log(event + " haetaan kannasta uusimmat"); 
			this.autoreFreshOn(); 
			console.log("auto refresh on");
		}
		else if (event === "<<") {
			tempalku = Number(this.state.minpiirtoalku) 
			temploppu = Number(tempalku) + Number(tempaskel);
			this.setState({left2: true});
		}
		else if (event === "all") {
			temploppu = Number(defmaxpiirtoloppu);			
			tempalku = Number(this.state.minpiirtoalku);
			this.setState({disabled_all: true});
		}
		else if (event === "zoomout") {
			temploppu += Number(tempaskel); 
			tempalku -= Number(tempaskel); 
			if (temploppu > defmaxpiirtoloppu) {
				temploppu = Number(defmaxpiirtoloppu) ;
				this.setState({zoomout: true});
			} 	
			if (tempalku < this.state.minpiirtoalku){
				tempalku = Number(this.state.minpiirtoalku);
				this.setState({zoomout: true});
			}		
		}
		else if (event === "zoomin") {
			temploppu -= Number(tempaskel); 
			tempalku += Number(tempaskel); 
			const minimizoom = 1000.0 * 60.0 * 10.0 ; 
			if ((temploppu - tempalku) < minimizoom) {
				const ka = Number((Number(temploppu) + Number(tempalku))/2.0).toFixed(0);
				tempalku = Number(ka) - Number(minimizoom/2.0);
				temploppu = Number(ka) + Number(minimizoom/2.0);
				this.setState({zoomin: true});
			}			
		}
		else {
			console.log("Zoom: " + event + " ; ei ole määritelty!");
		}
		console.log(event + " " + tempalku + ".." + temploppu + ' = ' + (temploppu-tempalku));
		this.setState({piirtoloppu: temploppu});
		this.setState({piirtoalku: tempalku});
	}

	buttomsEnabled() {
		this.setState({disabled_all: false});
		this.setState({reset: false});
		this.setState({zoomout: false});
		this.setState({zoomin: false});
		this.setState({left2: false});
		this.setState({left1: false});
		this.setState({right1: false});
	}

	sysInfo() {
		//console.log(os.EOL); 
	}

	fetchDetails = (event) => {
		this.hae_kaasun_ensimmainen_mittaus(event.kaasunimi);
		defmaxpiirtoloppu = event.gagetime
		this.setState({piirtoalku: defmaxpiirtoloppu - defScatterShowInterval}); 
		this.setState({piirtoloppu: defmaxpiirtoloppu});
		this.setState({kaasunimi: event.kaasunimi});
		//this.setState({lamponimi: xxx});
		this.setState({piirtohaedata: true});
		this.buttomsEnabled();
		console.log('Container event: ' + event.kaasunimi + " -> " + this.state.kaasunimi); 
	}

	measureTime(time) {
		let temptime = moment(time).format("D.M.YYYY"); 
		if (temptime === moment().format("D.M.YYYY")) {
			temptime = moment(time).format("hh:mm"); 
		}
		return temptime;
	}

	//<td>{new Date(item.gagetime).toLocaleDateString()}</td>
	render() {
		let listItems = this.state.gases.map((item) => 
		<tr key={item.kaasunimi} onClick={() => this.fetchDetails(item)}>
			<td>{item.kaasunimi}</td>
			<td>{item.arvo.toFixed(1)}</td>
			<td>{this.measureTime(item.gagetime)}</td>
		</tr>
		)
		console.log('Container render...');
		this.sysInfo();

		return(
			<div>
			<h5> 
				<strong> 
				<Badge color="primary"> 
					IoTGas 
				</Badge> 
				</strong> 
			</h5>	
			<div style={{textAlign: "center"}}>
				{this.state.kaasunimi}
			</div>
			<MesoLinechart className = 'Gas' 
				piirtonimi = {this.state.kaasunimi} 
				piirtoalku = {this.state.piirtoalku}
				piirtoloppu = {this.state.piirtoloppu} 
				piirtohaedata  = {this.state.piirtohaedata} 
				/>
			<div style={{textAlign: "center"}}>	
			<ButtonGroup size="sm">
				<Button outline color="primary" 
					disabled={this.state.left2}
					onClick={!this.state.left2 ? () => this.zoomi('<<') : null}> 
					{"<<"} 
					</Button>
				<Button outline color="primary" 
					disabled={this.state.left1}
					onClick={!this.state.left1 ? () => this.zoomi('<') : null}> 
					{"<"} 
					</Button>
				<Button outline color="primary" 
					disabled={this.state.zoomout}
					onClick={!this.state.zoomout ? () => this.zoomi("zoomout"): null}> 
					- 
					</Button>
				<Button outline color="primary"  
					disabled={this.state.disabled_all}
					onClick={!this.state.disabled_all ? () => this.zoomi("all"): null}> 
					All 
					</Button>
				<Button outline color="primary"  
					disabled={this.state.reset}
					onClick={!this.state.reset ? () => this.zoomi("reset") : null}> 
					Reset 
					</Button>
				<Button outline color="primary"
					disabled={this.state.zoomin}
					onClick={!this.state.zoomin ? () => this.zoomi("zoomin"): null}> 
					+ 
					</Button>
				<Button outline color="primary"
					disabled={this.state.right1}
					onClick={!this.state.right ? () => this.zoomi('>') : null}> 
					{">"} 
					</Button>
				<Button outline color="primary"
					onClick={() => this.zoomi('>>')}> 
					{">>"} 
					</Button>					
			</ButtonGroup>
			</div>
			<br></br>
			<div style={{textAlign: "center"}}>{this.state.lamponimi}</div>					
			<MesoLinechart className = 'Temp'
				piirtonimi = {this.state.lamponimi} 
				piirtoalku = {this.state.piirtoalku}
				piirtoloppu = {this.state.piirtoloppu}
				piirtohaedata  = {this.state.piirtohaedata}
			/>			
			<Table hover size="sm">
				<thead>
					<tr>
						<th>Mitaukset</th>
						<th>viimeisin</th>
						<th>aika</th>
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
