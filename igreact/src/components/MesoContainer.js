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

let defScatterShowInterval = 1000 * 60 * 60 * 6; // h
let defGasmaxPiirtoloppu = 0; 

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
		this.findLastMeasurements(true);
		this.whatMeasured = this.whatMeasured.bind(this); 
		this.findGas1stMeasurement = this.findGas1stMeasurement.bind(this);
		this.zoomi = this.zoomi.bind(this); 
		this.autoreFreshOn(); 
		console.log('Container: componentDidMount');
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	autoreFreshOn() {
		// auto refresh every 10 seconds 
		this.interval = setInterval(() => this.autoRefresh(), (10.0 * 1000.0)); 
	}

	autoRefresh() {
		console.log("Container autoRefresh" + this.state.kaasunimi);
		if (this.state.kaasunimi === '') {
			console.log("...all");
			this.findLastMeasurements(true);
		}
		else {
			console.log("...last");
			this.findGasLastMeasurement(this.state.kaasunimi); 
			//this.updateLastMeasurements();
			this.findLastMeasurements(false);
		}
	}

	findLastMeasurements = (find_what_measured_boolean) => {
		ReactServices.readLastvalues() 
		.then(response => {
			let kaasut = response; 
			kaasut.sort((a, b) => a.kaasunimi.localeCompare(b.kaasunimi));
			this.setState({ gases: kaasut });
			if (find_what_measured_boolean) {
				console.log("Container find LastMeasurements: "); 
				console.log(this.state.gases);
				this.whatMeasured(this.state.gases); 
				this.findGas1stMeasurement(this.state.kaasunimi);
			}
			else {
				console.log("Container update LastMeasurements: ");
			}
			
		  })
		.catch(error => {
			console.log("ERROR in Container / findLastMeasurements (or update)");
			console.log(error);
		}); 
	} 

	whatMeasured = (gases) => { 
		// undefined: no problem
		const kaasut = gases.filter(gas => gas.kaasuid !== "temp");
		const kaasu = kaasut.reduce((prev, current) => (prev.gagetime > current.gagetime) ? prev : current, []);
		const lammot = gases.filter(gas => gas.kaasuid === "temp");
		let lampo = lammot.reduce((prev, current) => (prev.gagetime > current.gagetime) ? prev : current, []);
		const dallas = lammot.find(gas => gas.gageid === "ds18b20");
		if 	((typeof dallas != "undefined") &&  
			(Math.abs(Number(dallas.gagetime)-Number(kaasu.gagetime)) < 1000.0 * 60.0 * 5.0 )) {
			lampo = dallas; 
		};
		console.log("Container: whatMeasured");
		console.log(kaasu.kaasunimi);
		console.log(lampo.kaasunimi);
		console.log(this.state.gases);
		defGasmaxPiirtoloppu = kaasu.gagetime; 
		this.setState({piirtoloppu: defGasmaxPiirtoloppu});
		this.setState({piirtoalku: defGasmaxPiirtoloppu - defScatterShowInterval});
		this.setState({kaasunimi: kaasu.kaasunimi});	
		this.setState({lamponimi: lampo.kaasunimi});	
	}	

	findGas1stMeasurement = (kaasu) => {
		ReactServices.readGasFirst(kaasu) 
		.then(response => {
			this.setState({minpiirtoalku: response.gagetime});
			this.setState({piirtohaedata: true}); 
			console.log("Container findGas1stMeasurement: "); 
			console.log(response);
		})
		.catch(error => {
			console.log("ERROR in Container / findGas1stMeasurement");
			console.log(error);
		});
	}

	findGasLastMeasurement = (kaasu) => {
		ReactServices.readGasLast(kaasu) 
		.then(response => {
			defGasmaxPiirtoloppu = response.gagetime;
			this.setState({piirtoloppu: response.gagetime});
			this.setState({piirtohaedata: true}); 
			console.log("Container findGasLastMeasurement: "); 
			console.log(response);
		})
		.catch(error => {
			console.log("ERROR in Container / findGasLastMeasurement");
			console.log(error);
		});
	}

	// osa (koko) zoom voisi toimia paremmin MesoLinechart:n puolella 
	// tai voisi käyttää parempaa piirto-ohjelmaa
	zoomi = (event) => {
		this.buttomsEnabled();
		clearInterval(this.interval); 
		console.log("auto refresh off");
		//this.setState({piirtohaedata: false}); 
		let temploppu = Number(this.state.piirtoloppu);
		let tempalku = Number(this.state.piirtoalku);
		let tempaskel = Number((Number(temploppu) - Number(tempalku))/2.0).toFixed(0);
		const minaskel = 1000.0 * 60 * 10;
		if (tempaskel < minaskel) {tempaskel = minaskel}
		console.log("Zoom: " + event);
		console.log("This.state:" + tempalku + '..' + temploppu + ' = ' + (temploppu - tempalku) + ' -> askel: ' + tempaskel);
		console.log("rajat min: " + this.state.minpiirtoalku + ' max:' + defGasmaxPiirtoloppu); 

		if (event === "reset") {
			temploppu = Number(defGasmaxPiirtoloppu); 
			tempalku = Number(defGasmaxPiirtoloppu) - Number(defScatterShowInterval); 
			this.setState({reset: true});
		}
		else if (event === "week") {
			temploppu = Number(defGasmaxPiirtoloppu); 
			tempalku = Number(defGasmaxPiirtoloppu) - Number(1000.0 * 60.0 * 60.0 *24.0 *7); 
			this.setState({reset: true});
			this.autoreFreshOn(); 
		}
		else if (event === "day") {
			temploppu = Number(defGasmaxPiirtoloppu); 
			tempalku = Number(defGasmaxPiirtoloppu) - Number(1000.0 * 60.0 * 60.0 *24.0); 
			this.setState({reset: true});
			this.autoreFreshOn(); 
		}
		else if (event === "t6h") {
			temploppu = Number(defGasmaxPiirtoloppu); 
			tempalku = Number(defGasmaxPiirtoloppu) - Number(1000.0 * 60.0 * 60.0 *6.0); 
			this.setState({reset: true});
			this.autoreFreshOn(); 
		}
		else if (event === "t2h") {
			temploppu = Number(defGasmaxPiirtoloppu); 
			tempalku = Number(defGasmaxPiirtoloppu) - Number(1000.0 * 60.0 * 60.0 *2.0); 
			this.setState({reset: true});
			this.autoreFreshOn(); 
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
			if (temploppu > defGasmaxPiirtoloppu) {
				temploppu = Number(defGasmaxPiirtoloppu) ;
				tempalku = Number(defGasmaxPiirtoloppu) - Number(tempaskel);
				this.setState({right1: true});
			}
		}
		else if (event === ">>") {
			this.findGasLastMeasurement(this.state.kaasunimi);
			//this.updateLastMeasurements(); 
			this.findLastMeasurements(false);
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
			temploppu = Number(defGasmaxPiirtoloppu);			
			tempalku = Number(this.state.minpiirtoalku);
			this.setState({show_all: true});
		}
		else {
			console.log("Zoom: " + event + " ; ei ole määritelty!");
		}
		console.log(event + " " + tempalku + ".." + temploppu + ' = ' + (temploppu-tempalku));
		this.setState({piirtoloppu: temploppu});
		this.setState({piirtoalku: tempalku});
	}

	buttomsEnabled() {
		this.setState({show_all: false});
		this.setState({reset: false});
		this.setState({left2: false});
		this.setState({left1: false});
		this.setState({right1: false});
		this.setState({week: false});
		this.setState({day: false});
		this.setState({t6h: false});
		this.setState({t2h: false});
	}

	sysInfo() {
		//console.log(os.EOL); 
	}

	fetchDetails = (event) => {

		if (event.kaasuid ==="temp") {
			if (event.kaasunimi === this.state.lamponimi) {
				this.setState({kaasunimi: event.kaasunimi});
			}
			else {
				this.setState({lamponimi: event.kaasunimi});
			}
		} 
		else {
			this.findGas1stMeasurement(event.kaasunimi);
			defGasmaxPiirtoloppu = event.gagetime
			const tempInterval = Number(this.state.piirtoloppu) - Number(this.state.piirtoalku);
			this.setState({piirtoalku: defGasmaxPiirtoloppu - tempInterval}); 
			this.setState({piirtoloppu: defGasmaxPiirtoloppu});
			this.setState({kaasunimi: event.kaasunimi});
		}
		this.setState({piirtohaedata: true});
		this.buttomsEnabled();
		console.log('Container event: ' + event.kaasunimi + " -> " + this.state.kaasunimi); 
	}

	timeFormat(time) {
		let tf = moment(time).format("D.M.YYYY"); 
		if (tf === moment().format("D.M.YYYY")) {
			tf = moment(time).format("hh:mm"); 
		}
		return tf;
	}

	temperatureRowColor(kaasuid) {
		if (kaasuid === "temp") {
			return "text-success"}
		else { 
			return "text-info"}
	}
	/*
	<Button outline color="primary"  
		disabled={this.state.reset}
		onClick={!this.state.reset ? () => this.zoomi("reset") : null}> 
		Reset 
	</Button>
	*/
	//<td>{new Date(item.gagetime).toLocaleDateString()}</td>
	render() {
		let listItems = this.state.gases.map((item) => 
		<tr className={this.temperatureRowColor(item.kaasuid)} 
			key={item.kaasunimi} onClick={() => this.fetchDetails(item)}>
			<td>{item.kaasunimi}</td>
			<td>{item.arvo.toFixed(1)}</td>
			<td>{this.timeFormat(item.gagetime)}</td>
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
			<div className="text-info" style={{textAlign: "center"}}>
				{"Kaasu: " + this.state.kaasunimi}
			</div>
			<MesoLinechart className = 'gas' 
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
					disabled={this.state.show_all}
					onClick={!this.state.show_all ? () => this.zoomi("all"): null}> 
					all 
				</Button>
				<Button outline color="primary"  
					disabled={this.state.week}
					onClick={!this.state.week ? () => this.zoomi("week") : null}> 
					w 
				</Button>
				<Button outline color="primary"  
					disabled={this.state.day}
					onClick={!this.state.day ? () => this.zoomi("day") : null}> 
					d 
				</Button>
				<Button outline color="primary"  
					disabled={this.state.t6h}
					onClick={!this.state.t6h ? () => this.zoomi("t6h") : null}> 
					6h 
				</Button>
				<Button outline color="primary"  
					disabled={this.state.t2h}
					onClick={!this.state.t2h ? () => this.zoomi("t2h") : null}> 
					2h 
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
			<div className="text-success" style={{textAlign: "center"}}>
				{'Lämpötila (C): ' + this.state.lamponimi}
			</div>					
			<MesoLinechart className = 'temp'
				piirtonimi = {this.state.lamponimi} 
				piirtoalku = {this.state.piirtoalku}
				piirtoloppu = {this.state.piirtoloppu}
				piirtohaedata  = {this.state.piirtohaedata}
			/>			
			<Table hover size="sm">
				<thead>
					<tr>
						<th>Mittaukset</th>
						<th>Viimeisin</th>
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
