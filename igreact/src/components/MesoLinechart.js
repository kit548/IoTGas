import React from 'react';
import ReactServices from '../services/ReactServices'; 

//import {ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {Scatter} from 'react-chartjs-2'; 
import moment from 'moment';

//import {Label} from 'reactstrap';

let data = { 
	labels: ['Scatter'],  
	datasets: [{
		label: 'kaasu', 
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
	scales: { 
		xAxes: [{ 
			display: true,
			ticks: {
                userCallback: function(label, index, labels) {
                    return moment(label).format("hh:mm");
                }
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
				//min: 0,
				//max: 25,
				//stepSize: 0.5,
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
			piirtonimi: '',
			lamponimi: '',
		};
	}

	haepiirtodata = (nimi)	=> {
		ReactServices.readGasvaluesX(nimi, 1000)
		.then(response => {
			this.setState({ scatterList: response });
			console.log('Linechart - haepiirtodata: ' + nimi); console.log(response); 
	 	 })
		.catch(error => {
		console.log(error);
		}); 
	};

	componentDidUpdate(prevProps) {
		if (this.props.piirtonimi !== prevProps.piirtonimi) {
			this.haepiirtodata(this.props.piirtonimi);
			console.log('Linechart: componentDidUpdate'); 
		}
	}

	render(	) {
		let mitat = []
		mitat =  this.state.scatterList; 
		mitat = JSON.parse(JSON.stringify(mitat).split('"gagetime":').join('"x":')); 
		mitat = JSON.parse(JSON.stringify(mitat).split('"arvo":').join('"y":')); 
		console.log('Linechart render this.props.piirtonimi : ' + this.props.piirtonimi);
		console.log('Linechart render mitat'); console.log(mitat); 
		data.datasets[0].data = mitat  
		data.datasets[0].label = this.props.piirtonimi 

		return (
			<form scatterform='scatterform'>	
				<div className="scatterdraw">
				<Scatter data={data} options={chartoptions}/>
				</div>
			</form>
		);
	}
	//});
}

