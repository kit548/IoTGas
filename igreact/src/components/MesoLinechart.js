import React from 'react';
import ReactServices from '../services/ReactServices'; 

import {Scatter} from 'react-chartjs-2'; 
import moment from 'moment';

//import {Label} from 'reactstrap';

let data = { 
	labels: ['Scatter'],  
	datasets: [{
		label:'kaasu',
		fill: false,
		showLine: true, 
		backgroundColor: 'rgba(75,192,192,0.4)', 
		pointBorderColor: 'rgba(75,192,192,1)',
		pointBackgroundColor: '#fff', 
		pointBorderWidth: 2,
		pointHoverRadius: 5, 
		pointHoverBackgroundColor: 'rgba(75,192,192,1)',
		pointHoverBorderColor: 'rgba(220,220,220,1)',
		pointHoverBorderWidth: 2, 
		pointRadius: 1, 
		pointHitRadius: 10, 
		data: [],
	}], 
};

let chartoptions = { 
	legend: {
        display: false
    },
	animation: { 
		duration: 100
	},
	scales: { 
		xAxes: [{ 
			display: true,
			ticks: {
				//min: xAxelmin,
				userCallback: function(label, index, labels) {
                    return moment(label).format("hh:mm");
				},
				autoSkipPadding: 20, 
			 },
			 tooltips: {
				 //not work jet...
				callbacks: {
					label: function(tooltipItem, data) {
						var label = data.datasets[tooltipItem.datasetIndex].label || '';
						if (label) {
							label += ': ';
						}
						//label += Math.round(tooltipItem.yLabel * 100) / 100;
						return data;
						//return data + ': ' + label;
					}
				}
			},
			scaleLabel: { 
				display: false, 
				labelString: "aika", 
				fontColor: "blue" 
			},
			//type: 'time', 
			time: { 	
				unit: 'millisecond',
				//displayFormats: { millisecond: 'h:mm:ss.SSS a', }, 
			}     	
		}], 
		yAxes: [
			{
			  display: true,
			  position: 'left',
			  id: 'y-axis-1',
			  gridLines: {
				display: true
			  },
			  labels: {
				show: true
			  },
			  ticks: {
				//min: 0, //max: 25, //stepSize: 0.5,
			  },
			},
		]
	} 
};

export default class GasForm extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
			scatterList:[], 
			key: 0 ,
		};
	}

	haepiirtodata = (nimi, alku, loppu)	=> { 
		// alku = loppu - 1000*60*60*24*30*12;  // one year ... key 
		ReactServices.gasvaluesinterval(nimi, alku, loppu)
		.then(response => {
			this.setState({ scatterList: response }); 
			console.log('Linechart haepiirtodata: ' + nimi + ' ' + alku + '/' + loppu); 
	 	 })
		.catch(error => {
		console.log(error);
		console.log(nimi, alku, loppu);
		}); 
	};

	componentDidUpdate(prevProps) {
		if (this.props.piirtonimi !== prevProps.piirtonimi) {
			console.log('Linechart: componentDidUpdate (piirtonimi)'); 
			console.log(this.props); 
			if (this.props.piirtohaedata) {
				this.haepiirtodata(this.props.piirtonimi, this.props.piirtoalku, this.props.piirtoloppu);
			}
		}

		if ((this.props.piirtoalku !== prevProps.piirtoalku || 
			this.props.piirtoloppu !== prevProps.piirtoloppu) && 
			this.props.piirtonimi !== '') {
			console.log('Linechart: componentDidUpdate (alku/loppu)'); 
			console.log(this.props);
			if (this.props.piirtohaedata) {
				this.haepiirtodata(this.props.piirtonimi, this.props.piirtoalku, this.props.piirtoloppu);
			}
			else {  
				this.setState({ key: Math.random() });
				console.log("Linechart render")
			}
		}
	}
	
	data2scatter(mitat, nimi) {
		let piirtomax = 0; 
		let piirtomin = 0; 
		const xtasaus = 1000.0 * 60.0 * 5.0; 
		mitat = JSON.parse(JSON.stringify(mitat).split('"gagetime":').join('"x":')); 
		mitat = JSON.parse(JSON.stringify(mitat).split('"arvo":').join('"y":')); 
		console.log('Linechart: data2scatter ') ;
		console.log(this.props); console.log(mitat); 
		data.datasets[0].data = mitat;  
		data.datasets[0].label = nimi;
		data.labels = nimi; 
		piirtomin = this.props.piirtoalku; 
		piirtomax = this.props.piirtoloppu; 
		piirtomin = Number(piirtomin/(xtasaus)).toFixed(0) * xtasaus; 
		piirtomax = Number((Number(piirtomax) + Number(xtasaus))/(xtasaus)).toFixed(0) * xtasaus;
		chartoptions.scales.xAxes[0].ticks.min = piirtomin; 
		chartoptions.scales.xAxes[0].ticks.max = piirtomax; 
	} 

	render(	) {
		this.data2scatter(this.state.scatterList, this.props.piirtonimi);
		return (
			<form scatterform='scatterform'>	
				<div key={this.state.key} className="scatterdraw">
				<Scatter options={chartoptions} data={data} />
				</div>
			</form>
		);
	}
}

