import React from 'react';
import ReactServices from '../services/ReactServices'; 

	//import {Label} from 'reactstrap';
	//<Label htmlFor="LastMeso"> </Label>

export default class GasForm extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
			gasList: '', 
		};
	}

	readLastMeso = () => {	
		ReactServices.readLast() 
		.then(response => {
			this.setState({ gasList: response });
			console.log('readLast');
			console.log(this.state.gasList);	
		})
		.catch(error => {console.log(error)}); 
	}

	LastMeso = () => {
		//console.log('Lastmeso');
		if(this.state.gasList != null) {
			if (this.state.gasList.length === 0) {
				this.readLastMeso()
			}
			
		};
	}

	componentDidUpdate(prevProps) {
		console.log('MesoLastMeso: componentDidUpdate');
		if (this.props.gasList !== prevProps.gasList) {
			this.readLastMeso() 
		};
	}

	render() {  
		let mittausarvo = "";
		let viimeisinmitattu = ""; 
		//if (!isNaN(this.state.gasList.arvo))  <- gasList: [], 
		console.log('this.state.gasList:');
		console.log(this.state.gasList); 
		
		if (typeof this.state.gasList === 'object')
			if(this.state.gasList != null) {
				mittausarvo = this.state.gasList.arvo.toFixed(1);
				viimeisinmitattu = this.state.gasList.kaasunimi;
			//console.log(this.state.gasList.arvo)
			};
		return(
			<form lastmeso='lastmeso'>	
				<div className="lastmitta"> 
				{this.LastMeso()}
				{viimeisinmitattu}: {mittausarvo}  V
				</div>
			</form>
		)
	}
	
}

