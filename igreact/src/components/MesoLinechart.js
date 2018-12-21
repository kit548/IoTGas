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
		pointRadius: 2, 
		pointHitRadius: 10, 
	}], 
};

const chartoptions = { 
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
		}] 
	} 
};

export default class GasForm extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
			scatterList:[], 
			piirtokaasu: '',
		};
	}

	haepiirtodata = ()	=> {
		ReactServices.readGasvaluesX(this.props.piirtokaasu, 1000)
		.then(response => {
			this.setState({ scatterList: response });
			console.log('Read x gases response:'); console.log(response); 
	 	 })
		.catch(error => {
		console.log(error);
		}); 
	};

	componentDidUpdate(prevProps) {
		if (this.props.piirtokaasu !== prevProps.piirtokaasu) {
			this.haepiirtodata();
			console.log('Scatter: componentDidUpdate'); 
		};
	}

	render(	) {
		let mitat = []
		mitat =  this.state.scatterList; 
		mitat = JSON.parse(JSON.stringify(mitat).split('"gagetime":').join('"x":')); 
		mitat = JSON.parse(JSON.stringify(mitat).split('"arvo":').join('"y":')); 
		console.log('Scatter this: ' + this.props.piirtokaasu);
		console.log('Mitat'); console.log(mitat); 
		data.datasets[0].data = mitat  
		data.datasets[0].label = this.props.piirtokaasu
		
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

